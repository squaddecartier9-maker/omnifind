const router = require('express').Router();
const { query } = require('../db/client');
const { requireAuth } = require('../middleware/auth');
const { createCheckoutSession } = require('../services/stripe');

// Create checkout session (buyer)
router.post('/checkout', requireAuth, async (req, res) => {
  try {
    const { items } = req.body;
    if (!items?.length) return res.status(400).json({ error: 'No items' });
    const storeId = items[0].store_id;
    const session = await createCheckoutSession({
      items,
      buyerId: req.user.id,
      storeId,
      successUrl: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.FRONTEND_URL}/cart`,
    });
    res.json({ url: session.url, sessionId: session.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Buyer: list own orders
router.get('/my', requireAuth, async (req, res) => {
  try {
    const result = await query(`
      SELECT o.*, s.name as store_name, s.slug as store_slug,
        json_agg(json_build_object('product_name', oi.product_name, 'price', oi.price,
          'quantity', oi.quantity, 'product_image', oi.product_image)) as items
      FROM orders o
      JOIN stores s ON s.id = o.store_id
      JOIN order_items oi ON oi.order_id = o.id
      WHERE o.buyer_id = $1
      GROUP BY o.id, s.name, s.slug
      ORDER BY o.created_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Seller: list store orders
router.get('/store/:storeId', requireAuth, async (req, res) => {
  try {
    const store = await query('SELECT id FROM stores WHERE id = $1 AND user_id = $2', [req.params.storeId, req.user.id]);
    if (!store.rows[0]) return res.status(403).json({ error: 'Not your store' });
    const result = await query(`
      SELECT o.*, u.name as buyer_name, u.email as buyer_email,
        json_agg(json_build_object('product_name', oi.product_name, 'price', oi.price, 'quantity', oi.quantity)) as items
      FROM orders o
      JOIN users u ON u.id = o.buyer_id
      JOIN order_items oi ON oi.order_id = o.id
      WHERE o.store_id = $1
      GROUP BY o.id, u.name, u.email
      ORDER BY o.created_at DESC
    `, [req.params.storeId]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Seller: update order status
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const order = await query(`
      SELECT o.id FROM orders o JOIN stores s ON s.id = o.store_id
      WHERE o.id = $1 AND s.user_id = $2
    `, [req.params.id, req.user.id]);
    if (!order.rows[0]) return res.status(404).json({ error: 'Not found' });
    const result = await query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
