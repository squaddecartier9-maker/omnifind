const router = require('express').Router();
const { query } = require('../db/client');
const { requireAuth } = require('../middleware/auth');

router.get('/store/:storeId', requireAuth, async (req, res) => {
  try {
    const store = await query('SELECT id FROM stores WHERE id = $1 AND user_id = $2', [req.params.storeId, req.user.id]);
    if (!store.rows[0]) return res.status(403).json({ error: 'Not your store' });
    const sid = req.params.storeId;

    const [revenue, orders, topProducts, dailyRevenue] = await Promise.all([
      query(`SELECT COALESCE(SUM(total), 0) as total, COUNT(*) as count FROM orders WHERE store_id = $1 AND status != 'cancelled'`, [sid]),
      query(`SELECT status, COUNT(*) as count FROM orders WHERE store_id = $1 GROUP BY status`, [sid]),
      query(`SELECT p.name, p.sales_count, p.views, p.price FROM products p WHERE p.store_id = $1 ORDER BY p.sales_count DESC LIMIT 5`, [sid]),
      query(`
        SELECT DATE(created_at) as date, SUM(total) as revenue, COUNT(*) as orders
        FROM orders WHERE store_id = $1 AND created_at > NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at) ORDER BY date ASC
      `, [sid]),
    ]);

    res.json({
      totalRevenue: parseInt(revenue.rows[0].total),
      totalOrders: parseInt(revenue.rows[0].count),
      ordersByStatus: orders.rows,
      topProducts: topProducts.rows,
      dailyRevenue: dailyRevenue.rows,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
