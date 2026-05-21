const { query } = require('../db/client');

// Clerk JWT verification middleware
async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });

    // In production, verify with Clerk SDK:
    // const { verifyToken } = require('@clerk/backend');
    // const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
    // req.clerkId = payload.sub;

    // For development, decode the JWT manually or use Clerk's middleware
    const base64 = token.split('.')[1];
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
    req.clerkId = payload.sub;

    const result = await query('SELECT * FROM users WHERE clerk_id = $1', [req.clerkId]);
    if (!result.rows[0]) return res.status(401).json({ error: 'User not found' });
    req.user = result.rows[0];
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

async function requireSeller(req, res, next) {
  await requireAuth(req, res, async () => {
    if (req.user.role !== 'seller' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Seller account required' });
    }
    next();
  });
}

async function requireAdmin(req, res, next) {
  await requireAuth(req, res, async () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
}

// Optional auth — attaches user if token present, continues either way
async function optionalAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return next();
    const base64 = token.split('.')[1];
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
    const result = await query('SELECT * FROM users WHERE clerk_id = $1', [payload.sub]);
    req.user = result.rows[0] || null;
  } catch {}
  next();
}

module.exports = { requireAuth, requireSeller, requireAdmin, optionalAuth };
