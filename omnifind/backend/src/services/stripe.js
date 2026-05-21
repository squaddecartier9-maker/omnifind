const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession({ items, buyerId, storeId, successUrl, cancelUrl }) {
  const lineItems = items.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: { name: item.name, images: item.images || [] },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { buyerId, storeId },
  });

  return session;
}

async function createSellerSubscription({ customerId, priceId }) {
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });
}

async function createCustomer({ email, name }) {
  return stripe.customers.create({ email, name });
}

function constructWebhookEvent(payload, sig) {
  return stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
}

module.exports = { createCheckoutSession, createSellerSubscription, createCustomer, constructWebhookEvent };
