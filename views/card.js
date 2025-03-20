const publishableKey = "pk_test_51KW0U6SEKNzBqiq5oMLI9ZOKfPxRwKnbjhjsBFS7mHfGymEfCJyl3lXmO3ukKwKSgjkkfndMowYjkovat7CZSmnH00TiPDYjJe";
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
  fetch("http://localhost:3006/create-payment-intent", {
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

function checkPaymentStatus() {

  // Function to get the query parameter from the URL
  function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  }

  // Extract the client_secret from the URL
  const clientSecret = getQueryParam("payment_intent_client_secret");

  if (clientSecret) {
    // Retrieve the Payment Intent using the client_secret
    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }) => {
        const paymentStatusElement = document.getElementById("payment-status");

        switch (paymentIntent.status) {
          case "succeeded":
            paymentStatusElement.textContent = "Payment succeeded!";
            break;
          case "processing":
            paymentStatusElement.textContent =
              "Payment processing. We'll update you once the payment is complete.";
            break;
          case "requires_payment_method":
            paymentStatusElement.textContent =
              "Payment failed. Please try again with a different payment method.";
            break;
          default:
            paymentStatusElement.textContent =
              "Something went wrong with your payment. Please contact support.";
            break;
        }
      })
      .catch((error) => {
        console.error("Error retrieving payment intent:", error);
        document.getElementById("payment-status").textContent =
          "Error retrieving payment status.";
      });
  } else {
    document.getElementById("payment-status").textContent =
      "No payment information found.";
  }
}
