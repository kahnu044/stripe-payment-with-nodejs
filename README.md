# Stripe Payment Integration with Node.js and Express

This project demonstrates a simple payment flow using Stripe, integrated with Node.js and Express. It allows users to enter an amount and proceed to payment using Stripe’s payment gateway. The app also renders a thank you page with the status of the payment once completed.

## Features

- Payment flow using Stripe API
- User input for payment amount
- Create a customer and a payment intent via the Stripe API
- Thank you page displaying payment status
- EJS as the view engine for rendering dynamic pages

## Prerequisites

Before running the application, make sure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v14 or higher)
- [Stripe Account](https://stripe.com) to generate your **Test API keys**

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file:**

   Add the following environment variables to the `.env` file at the root of your project:

   ```bash
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   PORT=3004
   ```

   Replace `your_stripe_secret_key` and `your_stripe_publishable_key` with your Stripe secret and publishable keys.

4. **Run the application:**

   Start the server with the following command:

   ```bash
   npm start
   ```

5. **Open the app:**

   Once the server is running, open your browser and go to `http://localhost:3004` to access the payment form.

## Project Structure

```bash
.
├── views
│   ├── index.ejs
│   └── thank-you.ejs
├── public
│   ├── card.js
│   └── style.css
├── .env
├── app.js
├── package.json
└── README.md
```

### `app.js`
This is the main Express server that handles payment intent creation and serves the HTML pages.

- `GET /`: Serves the index page for inputting the payment amount.
- `POST /create-payment-intent`: Creates a Stripe customer and a payment intent for the specified amount, returning the `clientSecret` to the front-end.

### `views/index.ejs`
This page contains a form where the user can input the payment amount and proceed to the Stripe payment process.

### `views/thank-you.ejs`
This page displays the result of the payment process using the `clientSecret` received from the URL parameters. The status of the payment (successful, processing, or failed) is retrieved from Stripe.

### `public/card.js`
This JavaScript file handles the client-side logic for Stripe's Payment Elements and is responsible for creating the payment intent and rendering the payment form.

You need to set the `serverUrl` and `Stripe publishable key` in `card.js`:

```javascript
const stripe = Stripe("your_stripe_publishable_key"); // Set the publishable key
const serverUrl = "http://localhost:3004"; // Set your server URL
```

## Usage

1. **Enter the payment amount:**
   On the home page, input the payment amount and click "Proceed to Payment". This will initiate the payment process using Stripe.

2. **Complete the payment:**
   After entering payment details, you will be redirected to a thank-you page that displays the status of your payment (success, processing, or failure).

## Stripe Integration Details

1. **Customer Creation:**
   A Stripe customer is created for each payment using the name and email provided.

2. **Payment Intent:**
   A payment intent is created for the specified amount, and the payment is processed through Stripe's API.

3. **Payment Status:**
   The payment status (succeeded, processing, or failed) is displayed on the thank-you page.

## Environment Variables

The project requires the following environment variables:

- **STRIPE_SECRET_KEY**: Your Stripe secret key for handling payments.
- **STRIPE_PUBLISHABLE_KEY**: Your Stripe publishable key for the client-side.
- **PORT**: The port where the server will run (default: `3004`).

## Scripts

- `npm start`: Starts the server on the specified port.

## License

This project is open source and available under the [MIT License](LICENSE).
