const form = document.getElementById("payment-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("Payment Button Click");

  const amount = parseFloat(document.getElementById("stripe-amount").value);
  console.log("amount", amount);

  if (!amount || amount <= 9) {
    console.log("Invalid amount, amount must be greater than 10");
  }




});
