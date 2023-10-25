const stripe = Stripe('pk_test_');
const elements = stripe.elements();

const cardElement = elements.create('card');
cardElement.mount('#card-element');

const form = document.getElementById('payment-form');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const amount = parseFloat(form.querySelector('input[name="amount"]').value);

    const response = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: 12,
            name: "kanhu",
            email: "test@test.com"
        }),
    });


    const { clientSecret } = await response.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: cardElement,
        },
    });

    if (result.error) {
        errorMessage.textContent = result.error.message;
    } else {
        successMessage.textContent = 'Payment successful!';
    }
});