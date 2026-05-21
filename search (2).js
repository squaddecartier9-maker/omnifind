const { Pool } = require('pg');

let pool;

function connectDB() {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected DB client error', err);
  });

  return pool.query('SELECT NOW()').then(() => {
    console.log('✅ PostgreSQL connected');
  });
}

function getDB() {
  if (!pool) throw new Error('DB not initialized. Call connectDB() first.');
  return pool;
}

async function query(text, params) {
  const db = getDB();
  const start = Date.now();
  const result = await db.query(text, params);
  const duration = Date.now() - start;
  if (duration > 1000) {
    console.warn('Slow query detected:', { text, duration });
  }
  return result;
}

module.exports = { connectDB, getDB, query };
