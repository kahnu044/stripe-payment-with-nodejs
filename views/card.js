const publishableKey =
  "pk_test_your_key";
const stripe = Stripe(publishableKey, {
  apiVersion: "2020-08-27",
});

const paymentDetailsForm = document.getElementById("payment-details-form");
const paymentForm = document.getElementById("payment-form");
const payNowButton = document.getElementById("paynow");
const messageContainer = document.getElementById("messages");

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

  // Create and mount the linkAuthentication element
  const linkAuthenticationElement = elements.create("linkAuthentication");
  linkAuthenticationElement.mount("#link-authentication-element");

  // Show the payment form
  payNowButton.style.display = "block";
  paymentDetailsForm.style.display = "none";
  paymentForm.style.display = "block";

  // When the form is submitted...
  let submitted = false;
  paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Disable double submission of the form
    if (submitted) {
      return;
    }

    payNowButton.disabled = true;

    // Confirm the payment with the given clientSecret
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/thank-you.html`,
      },
    });

    if (stripeError) {
      messageContainer.innerHTML = stripeError.message;
      messageContainer.style.display = "block";
      console.log(stripeError.message);
      return;
    }
  });
}
