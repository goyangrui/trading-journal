// set-up stripe API
import stripe from "../utils/stripe.js";

// -- PRODUCTS AND PRICES --
// get products controller
const getProducts = async (req, res) => {
  // get array of prices objects from stripe API
  const prices = await stripe.prices.list({
    apiKey: process.env.STRIPE_SECRET_KEY,
  });
  // get array of products objects from stripe API
  const products = await stripe.products.list({
    apiKey: process.env.STRIPE_SECRET_KEY,
  });

  // create array of custom objects with relevant data from prices and products objects for each product
  const pricesAndProducts = prices.data.reduce(
    (previousValue, currentValue, index) => {
      // current correlating product and price objects
      const product = products.data[index];
      const price = currentValue;

      // create custom item for each product
      const item = {
        productId: product.id,
        priceId: price.id,
        name: product.name,
        price: price.unit_amount,
      };

      // unshift custom item into array
      previousValue.unshift(item);

      return previousValue;
    },
    []
  );

  // respond to client with array of products
  res.json(pricesAndProducts);
};

// -- SESSIONS --
// create session controller
const createSession = async (req, res) => {
  // get the priceId from the request body
  const { priceId } = req.body;

  // get the user's stripe customerId from req.user
  const { customerId } = req.user;

  // retrieve this customer's subscriptions
  const subscriptions = await stripe.subscriptions.list(
    {
      customer: customerId,
      status: "all",
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY,
    }
  );

  // filter to only retrieve active or trialing subscriptions
  const filtered_subscriptions = subscriptions.data.filter((sub) => {
    return sub.status === "active" || sub.status === "trialing";
  });

  // if the user already has a subscription (length of filtered_subscriptions is greater than 0)
  if (filtered_subscriptions.length) {
    return res.json({
      msg: "You already have a subscription",
      subscribed: true,
    });
  }

  // create a stripe session
  const session = await stripe.checkout.sessions.create(
    {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "http://localhost:3000/app/dashboard",
      cancel_url: "http://localhost:3000/app/sub",
      customer: customerId,
    },
    { apiKey: process.env.STRIPE_SECRET_KEY }
  );

  // respond to client with session details
  res.json({ session, subscribed: false });
};

// -- SUBSCRIPTIONS --
// get subscriptions controller
const getSubscription = async (req, res) => {
  // get the customer id from the user object
  const { customerId } = req.user;

  // retrieve all of this customer's subscriptions
  const subscriptions = await stripe.subscriptions.list(
    {
      customer: customerId,
      status: "all",
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY,
    }
  );

  // filter to only retrieve active or trialing subscriptions
  const filtered_subscriptions = subscriptions.data.filter((sub) => {
    return sub.status === "active" || sub.status === "trialing";
  });

  // if the user has no active or trialing subscriptions, return an empty object
  if (!filtered_subscriptions.length) {
    return res.json([]);
  }

  // otherwise, respond to the user with the filtered subscriptions
  res.json(filtered_subscriptions);
};

// create subscriptions controller
const createSubscription = async (req, res) => {
  console.log(req.body);
  // get the customer id and price id from the request body
  const { priceId, customerId } = req.body;

  // create a stripe subscription with trial period of 7 days for authorized customer
  const subscription = await stripe.subscriptions.create(
    {
      customer: customerId,
      items: [{ price: priceId }],
      trial_period_days: 7,
      cancel_at_period_end: true,
    },
    { apiKey: process.env.STRIPE_SECRET_KEY }
  );
  res.json(subscription);
};

export { getProducts, createSession, getSubscription, createSubscription };
