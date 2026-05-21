require('dotenv').config();
const { connectDB, query } = require('./client');

const migrations = [
  // Users
  `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'buyer',  -- buyer | seller | admin
    stripe_customer_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Subscription plans
  `CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    price_monthly INTEGER NOT NULL,  -- in cents (0 = free)
    max_stores INTEGER NOT NULL,
    max_products INTEGER,            -- NULL = unlimited
    stripe_price_id VARCHAR(255),
    features JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // User subscriptions
  `CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES plans(id),
    stripe_subscription_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',  -- active | cancelled | past_due
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Stores
  `CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    category VARCHAR(100),
    currency VARCHAR(10) DEFAULT 'EUR',
    country VARCHAR(10) DEFAULT 'RO',
    is_active BOOLEAN DEFAULT true,
    total_sales INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Products
  `CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,          -- in cents
    compare_at_price INTEGER,        -- original price for "was X" display
    currency VARCHAR(10) DEFAULT 'EUR',
    stock INTEGER DEFAULT 0,
    images JSONB DEFAULT '[]',
    category VARCHAR(100),
    tags TEXT[],
    attributes JSONB DEFAULT '{}',   -- size, color, material, etc.
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(store_id, slug)
  )`,

  // Product search index sync tracking
  `CREATE TABLE IF NOT EXISTS search_sync (
    product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    last_synced_at TIMESTAMPTZ,
    needs_sync BOOLEAN DEFAULT true
  )`,

  // Orders
  `CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES users(id),
    store_id UUID REFERENCES stores(id),
    status VARCHAR(50) DEFAULT 'pending',
    -- pending | confirmed | shipped | delivered | cancelled | refunded
    stripe_payment_intent_id VARCHAR(255),
    stripe_checkout_session_id VARCHAR(255),
    subtotal INTEGER NOT NULL,       -- in cents
    shipping_cost INTEGER DEFAULT 0,
    total INTEGER NOT NULL,
    currency VARCHAR(10) DEFAULT 'EUR',
    shipping_address JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Order line items
  `CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(500) NOT NULL,   -- snapshot at time of purchase
    product_image TEXT,
    price INTEGER NOT NULL,               -- in cents, at time of purchase
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Cart (persisted per user)
  `CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
  )`,

  // Wishlists
  `CREATE TABLE IF NOT EXISTS wishlist_items (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, product_id)
  )`,

  // Reviews
  `CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    order_id UUID REFERENCES orders(id),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    body TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Referral system
  `CREATE TABLE IF NOT EXISTS referral_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    code VARCHAR(20) UNIQUE NOT NULL,
    uses INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS referral_uses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_id UUID REFERENCES referral_codes(id),
    referred_user_id UUID REFERENCES users(id),
    discount_applied INTEGER DEFAULT 0,  -- in cents
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Indexes for performance
  `CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id)`,
  `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`,
  `CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active)`,
  `CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id)`,
  `CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders(store_id)`,
  `CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(slug)`,
  `CREATE INDEX IF NOT EXISTS idx_stores_category ON stores(category)`,
  `CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)`,
];

async function migrate() {
  await connectDB();
  console.log('🔄 Running migrations...');
  for (const sql of migrations) {
    await query(sql);
  }
  console.log('✅ All migrations complete');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
