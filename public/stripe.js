var stripe = Stripe('pk_test_51OJRKbKItFPp7Th9iINzkJsEUhkmHOTuBceQU1fKT7RjGAqzgSM8lkNPZ5hHvhFylybkVPecm2yUHHQCo2Fk63Z500aptz9mC8');

var checkoutButton = document.getElementById('checkout-button');

checkoutButton.addEventListener('click', function () {
    // Retrieve cart items from localStorage or your cart's storage
    var cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Convert cart items to Stripe line items format
    var lineItems = cart.map(item => {
        return {
            price: item.stripePriceID, // Replace with Stripe Price ID for each item
            quantity: item.quantity
        };
    });

    stripe.redirectToCheckout({
        lineItems: lineItems,
        mode: 'payment',
        successUrl: 'http://localhost/success.html', 
        cancelUrl: 'http://localhost/cancel.html', 
    })
    .then(function (result) {
        if (result.error) {
            alert(result.error.message);
        }
    });
});
