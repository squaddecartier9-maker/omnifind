const router = require('express').Router();
const { query } = require('../db/client');
const { requireAuth, requireSeller, optionalAuth } = require('../middleware/auth');
const { cache, invalidate } = require('../services/redis');

// Public: list all active stores
router.get('/', async (req, res) => {
  try {
    const { category, limit = 20, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    let sql = 'SELECT * FROM stores WHERE is_active = true';
    const params = [];
    if (category) { params.push(category); sql += ` AND category = $${params.length}`; }
    sql += ` ORDER BY total_sales DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Public: get store by slug
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const result = await cache(`store:${req.params.slug}`, 60, async () => {
      const s = await query('SELECT * FROM stores WHERE slug = $1 AND is_active = true', [req.params.slug]);
      return s.rows[0] || null;
    });
    if (!result) return res.status(404).json({ error: 'Store not found' });
    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Public: get products for a store
router.get('/:slug/products', async (req, res) => {
  try {
    const store = await query('SELECT id FROM stores WHERE slug = $1', [req.params.slug]);
    if (!store.rows[0]) return res.status(404).json({ error: 'Store not found' });
    const products = await query(
      'SELECT * FROM products WHERE store_id = $1 AND is_active = true ORDER BY created_at DESC',
      [store.rows[0].id]
    );
    res.json(products.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Auth: create store
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, slug, description, category, currency } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'name and slug required' });
    const clean = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const result = await query(`
      INSERT INTO stores (user_id, name, slug, description, category, currency)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, [req.user.id, name, clean, description, category, currency || 'EUR']);
    if (req.user.role === 'buyer') {
      await query("UPDATE users SET role = 'seller' WHERE id = $1", [req.user.id]);
    }
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Slug already taken' });
    res.status(500).json({ error: err.message });
  }
});

// Auth: update store
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { name, description, category, is_active } = req.body;
    const store = await query('SELECT * FROM stores WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (!store.rows[0]) return res.status(404).json({ error: 'Store not found or not yours' });
    const result = await query(`
      UPDATE stores SET name = COALESCE($1, name), description = COALESCE($2, description),
      category = COALESCE($3, category), is_active = COALESCE($4, is_active), updated_at = NOW()
      WHERE id = $5 RETURNING *
    `, [name, description, category, is_active, req.params.id]);
    await invalidate(`store:*`);
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Auth: seller's own stores
router.get('/my/stores', requireAuth, async (req, res) => {
  try {
    const result = await query('SELECT * FROM stores WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
