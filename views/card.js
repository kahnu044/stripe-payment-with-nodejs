const publishableKey =
  "pk_test_your_key";
const stripe = Stripe(publishableKey, {
  apiVersion: "2020-08-27",
});

console.log("stripe===>>>", stripe);

function initiatePaymentIntent(event) {
  event.preventDefault();

  const amount = parseFloat(document.getElementById("stripe-amount").value);
  if (!amount || amount <= 9) {
    console.log("Invalid amount, amount must be greater than 10");
  }

  const data = {
    amount: amount,
    name: "Hello Name",
    email: "testtest123@gmail.com",
  };

  // Call the API using fetch()
  fetch("http://localhost:3004/create-payment-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("API response:", result);

      initializeStripe(result.clientSecret);
    })
    .catch((error) => {
      console.error("API error:", error);
    });
}

// Initialize Stripe Elements with the PaymentIntent's clientSecret,
function initializeStripe(clientSecret) {
  const loader = "auto";
  const elements = stripe.elements({ clientSecret, loader });
  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");

  // Create and mount the linkAuthentication Element to enable autofilling customer payment details
  const linkAuthenticationElement = elements.create("linkAuthentication");
  linkAuthenticationElement.mount("#link-authentication-element");

  // When the form is submitted...
  const form = document.getElementById("payment-form");
  let submitted = false;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Disable double submission of the form
    if (submitted) {
      return;
    }

    form.querySelector("button").disabled = true;

    const nameInput = document.querySelector("#name");

    // Confirm the payment given the clientSecret
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/thank-you.html`,
      },
    });

    if (stripeError) {
      console.log(stripeError.message);
      return;
    }
  });
}
