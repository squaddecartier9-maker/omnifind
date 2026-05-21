const { createClient } = require('redis');
let client;
async function connectRedis() {
  client = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
  client.on('error', err => console.error('Redis error:', err));
  await client.connect();
  console.log('Redis connected');
}
function getRedis() { if (!client) throw new Error('Redis not initialized'); return client; }
async function cache(key, ttl, fn) {
  const r = getRedis();
  const hit = await r.get(key);
  if (hit) return JSON.parse(hit);
  const result = await fn();
  await r.setEx(key, ttl, JSON.stringify(result));
  return result;
}
async function invalidate(pattern) {
  const r = getRedis(); const keys = await r.keys(pattern);
  if (keys.length) await r.del(keys);
}
module.exports = { connectRedis, getRedis, cache, invalidate };
