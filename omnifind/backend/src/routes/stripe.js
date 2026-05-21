const router = require('express').Router();
const { query } = require('../db/client');
const { constructWebhookEvent } = require('../services/stripe');

// Webhook — receives events from Stripe
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = constructWebhookEvent(req.body, sig);
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { buyerId, storeId } = session.metadata;
        const order = await query(`
          INSERT INTO orders (buyer_id, store_id, status, stripe_checkout_session_id, subtotal, total, currency)
          VALUES ($1, $2, 'confirmed', $3, $4, $4, 'EUR') RETURNING *
        `, [buyerId, storeId, session.id, session.amount_total]);
        console.log('Order created:', order.rows[0].id);
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await query(`
          UPDATE subscriptions SET status = $1, updated_at = NOW()
          WHERE stripe_subscription_id = $2
        `, [sub.status, sub.id]);
        break;
      }
    }
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
