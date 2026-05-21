const router = require('express').Router();
const { query } = require('../db/client');
const { requireAuth } = require('../middleware/auth');
const { indexProduct, removeProduct } = require('../services/search');
const { invalidate } = require('../services/redis');

// Public: get single product
router.get('/:id', async (req, res) => {
  try {
    const result = await query(`
      SELECT p.*, s.name as store_name, s.slug as store_slug, s.logo_url as store_logo
      FROM products p JOIN stores s ON s.id = p.store_id
      WHERE p.id = $1 AND p.is_active = true
    `, [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' });
    await query('UPDATE products SET views = views + 1 WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Auth: create product
router.post('/', requireAuth, async (req, res) => {
  try {
    const { store_id, name, description, price, compare_at_price, stock, images, category, tags, attributes } = req.body;
    if (!store_id || !name || !price) return res.status(400).json({ error: 'store_id, name, price required' });
    const store = await query('SELECT * FROM stores WHERE id = $1 AND user_id = $2', [store_id, req.user.id]);
    if (!store.rows[0]) return res.status(403).json({ error: 'Not your store' });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const result = await query(`
      INSERT INTO products (store_id, name, slug, description, price, compare_at_price, stock, images, category, tags, attributes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
    `, [store_id, name, slug, description, Math.round(price * 100), compare_at_price ? Math.round(compare_at_price * 100) : null,
        stock || 0, JSON.stringify(images || []), category, tags || [], JSON.stringify(attributes || {})]);
    const product = result.rows[0];
    await indexProduct({ ...product, store_name: store.rows[0].name, store_slug: store.rows[0].slug });
    res.status(201).json(product);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Product slug already exists in this store' });
    res.status(500).json({ error: err.message });
  }
});

// Auth: update product
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const existing = await query(`
      SELECT p.*, s.name as store_name, s.slug as store_slug FROM products p
      JOIN stores s ON s.id = p.store_id WHERE p.id = $1 AND s.user_id = $2
    `, [req.params.id, req.user.id]);
    if (!existing.rows[0]) return res.status(404).json({ error: 'Not found or not yours' });
    const { name, description, price, stock, images, category, tags, is_active } = req.body;
    const result = await query(`
      UPDATE products SET
        name = COALESCE($1, name), description = COALESCE($2, description),
        price = COALESCE($3, price), stock = COALESCE($4, stock),
        images = COALESCE($5, images), category = COALESCE($6, category),
        tags = COALESCE($7, tags), is_active = COALESCE($8, is_active), updated_at = NOW()
      WHERE id = $9 RETURNING *
    `, [name, description, price ? Math.round(price * 100) : null, stock,
        images ? JSON.stringify(images) : null, category, tags, is_active, req.params.id]);
    const product = result.rows[0];
    await indexProduct({ ...product, store_name: existing.rows[0].store_name, store_slug: existing.rows[0].store_slug });
    res.json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Auth: delete product
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const existing = await query(`
      SELECT p.id FROM products p JOIN stores s ON s.id = p.store_id
      WHERE p.id = $1 AND s.user_id = $2
    `, [req.params.id, req.user.id]);
    if (!existing.rows[0]) return res.status(404).json({ error: 'Not found' });
    await query('UPDATE products SET is_active = false WHERE id = $1', [req.params.id]);
    await removeProduct(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Auth: list seller's products
router.get('/my/products', requireAuth, async (req, res) => {
  try {
    const { store_id } = req.query;
    let sql = `SELECT p.* FROM products p JOIN stores s ON s.id = p.store_id WHERE s.user_id = $1`;
    const params = [req.user.id];
    if (store_id) { params.push(store_id); sql += ` AND p.store_id = $${params.length}`; }
    sql += ' ORDER BY p.created_at DESC';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
