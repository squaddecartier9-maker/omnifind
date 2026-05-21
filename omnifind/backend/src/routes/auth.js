const router = require('express').Router();
const { query } = require('../db/client');
const { createCustomer } = require('../services/stripe');
const { v4: uuid } = require('uuid');

// Called by frontend after Clerk sign-up to create/sync DB user
router.post('/sync', async (req, res) => {
  try {
    const { clerkId, email, name, avatarUrl } = req.body;
    if (!clerkId || !email) return res.status(400).json({ error: 'clerkId and email required' });

    const existing = await query('SELECT * FROM users WHERE clerk_id = $1', [clerkId]);
    if (existing.rows[0]) return res.json(existing.rows[0]);

    const stripeCustomer = await createCustomer({ email, name });
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const result = await query(`
      INSERT INTO users (clerk_id, email, name, avatar_url, stripe_customer_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [clerkId, email, name, avatarUrl, stripeCustomer.id]);

    const user = result.rows[0];
    await query('INSERT INTO referral_codes (user_id, code) VALUES ($1, $2)', [user.id, code]);

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token' });
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const result = await query(`
      SELECT u.*, rc.code as referral_code
      FROM users u LEFT JOIN referral_codes rc ON rc.user_id = u.id
      WHERE u.clerk_id = $1
    `, [payload.sub]);
    if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
