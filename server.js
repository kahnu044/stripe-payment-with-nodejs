const express = require('express');
const app = express();
const path = require('path');

// Stripe
const stripe = require('stripe')('sk_test_');

// render views
app.set('view engine', 'ejs');

// use the below code for html file rendering
// app.engine('html', require('ejs').renderFile);

// parses incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// it used for serving HTML, CSS, and JavaScript files
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
    res.render('index');
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log('Server is running...', PORT));