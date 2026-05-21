require('dotenv').config();
const { connectDB, query } = require('./client');

async function seed() {
  await connectDB();
  console.log('Seeding database...');
  await query(`
    INSERT INTO plans (name, price_monthly, max_stores, max_products, features) VALUES
    ('Starter', 0, 1, 100, '["Universal search listing","Public store URL","0% transaction fees","Basic analytics"]'),
    ('Growth', 1900, 5, NULL, '["Everything in Starter","5 stores","Unlimited products","Advanced analytics","Referral system","Priority support"]'),
    ('Enterprise', 5900, NULL, NULL, '["Everything in Growth","Unlimited stores","API access","White-label option","Dedicated manager","Custom integrations"]')
    ON CONFLICT DO NOTHING
  `);
  console.log('Done.');
  process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
