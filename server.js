require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3004;

// Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// render views
app.set("view engine", "ejs");

// parses incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// it used for serving HTML, CSS, and JavaScript files
app.use(express.static(path.join(__dirname, "views")));

// Handle events by webhook
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = "whsec_.....";

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log("failed", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  console.log("received event", event);

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

// parses incoming data
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, name, email } = req.body;
    console.log("body", req.body);

    stripe.customers
      .create({
        name: name,
        email: email,
      })
      .then(async (customer) => {
        console.log("Customer ID:", customer.id);

        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100,
          currency: "inr",
          payment_method_types: ["card"],
          receipt_email: email,
          description: `Payment for ${name} (${email})`,
          customer: customer.id,
        });
        return res.send({ clientSecret: paymentIntent.client_secret });
      })
      .catch((error) => {
        console.error("Error creating customer:", error);
        return res.status(400).json({
          status: "Bad Request",
          error: error.message,
        });
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log("Server is running...", PORT));
