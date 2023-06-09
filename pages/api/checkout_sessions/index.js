import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method == 'POST') {
    try {
      //currently the only payment method we are accepting is card. stripe has docs on other methods found here:
      //https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-payment_method_types
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: req?.body?.items ?? [],
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cart`,
      });

      res.status(200).json(session);
    }
    catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  else {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ message: 'Mehtod not allowed' });
  }
}