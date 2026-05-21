const router = require('express').Router();
const { search } = require('../services/search');
const { cache } = require('../services/redis');

router.get('/', async (req, res) => {
  try {
    const { q = '', category, store_id, sort, page = 1, limit = 20 } = req.query;
    const cacheKey = `search:${q}:${category}:${store_id}:${sort}:${page}:${limit}`;
    const results = await cache(cacheKey, 30, () =>
      search(q, { category, storeId: store_id, sortBy: sort, page: parseInt(page), limit: parseInt(limit) })
    );
    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
