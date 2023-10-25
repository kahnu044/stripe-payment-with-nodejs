const express = require('express');
const app = express();
const path = require('path');

// Stripe
const stripe = require('stripe')('sk_test_');

// render views
app.set('view engine', 'ejs');

// use the below code for html file rendering
// app.engine('html', require('ejs').renderFile);

// parses incoming requests with URL-encoded payloads and json body data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// it used for serving HTML, CSS, and JavaScript files
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, name, email } = req.body;
        console.log('body', req.body);

        stripe.customers.create({
            name: name,
            email: email,
        }).then(async (customer) => {
            console.log('Customer ID:', customer.id);

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100,
                currency: 'inr',
                payment_method_types: ['card'],
                receipt_email: email,
                description: `Payment for ${name} (${email})`,
                customer: customer.id
            });
            return res.send({ clientSecret: paymentIntent.client_secret });
        }).catch(error => {
            console.error('Error creating customer:', error);
            return res.status(400).json({
                status: 'Bad Request',
                error: error.message
            });
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log('Server is running...', PORT));