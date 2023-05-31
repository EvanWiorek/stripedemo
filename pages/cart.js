import getStripe from "../get-stripe.js"

const { default: axios } = require("axios");

const redirectToCheckout = async () => {
  const {
    data: { id },
  } = await axios.post('/api/checkout_sessions', {
    items: Object.entries(cartDetails).map(([_, { id, quantity }]) => ({
      price: id,
      quantity,
    })),
  });
  const stripe = await getStripe();
  await stripe.redirectToCheckout({ sessionId: id });
};
