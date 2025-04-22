document.addEventListener('DOMContentLoaded', function () {
  let cartSummaryDiv = document.getElementById('cart-summary');
  let form = document.getElementById('checkout-form');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length > 0) {
    let table = document.createElement('table');

    let header = table.insertRow();
    ['Item', 'Price', 'Quantity', 'Subtotal'].forEach(function (text) {
      let th = document.createElement('th');
      th.textContent = text;
      header.appendChild(th);
    });

    let total = 0;

    cart.forEach(function (item) {
      let row = table.insertRow();

      row.insertCell().textContent = item.name;
      row.insertCell().textContent = 'LKR ' + item.price.toLocaleString();
      row.insertCell().textContent = item.quantity;

      let subtotal = item.price * item.quantity;
      row.insertCell().textContent = 'LKR ' + subtotal.toLocaleString();

      total += subtotal;
    });

    let totalRow = table.insertRow();
    let totalCell = totalRow.insertCell();
    totalCell.colSpan = 3;
    totalCell.style.fontWeight = 'bold';
    totalCell.textContent = 'Total';

    let amountCell = totalRow.insertCell();
    amountCell.style.fontWeight = 'bold';
    amountCell.textContent = 'LKR ' + total.toLocaleString();

    cartSummaryDiv.appendChild(table);
  } else {
    let message = document.createElement('p');
    message.textContent = 'Your cart is empty.';
    cartSummaryDiv.appendChild(message);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let fullName = document.getElementById('full-name').value.trim();
    let email = document.getElementById('email').value.trim();
    let address = document.getElementById('address').value.trim();
    let city = document.getElementById('city').value.trim();
    let cardName = document.getElementById('card-name').value.trim();
    let cardNumber = document.getElementById('card-number').value.trim();
    let expiry = document.getElementById('expiry').value.trim();
    let cvv = document.getElementById('cvv').value.trim();

    const nameRegex = /^[A-Za-z\s]+$/;

    if (!fullName || !email || !address || !city || !cardName || !cardNumber || !expiry || !cvv) {
      alert('Please fill in all fields.');
      return;
    }

    if (!nameRegex.test(fullName)) {
      alert('Full Name should only contain letters and spaces.');
      return;
    }

    if (!nameRegex.test(cardName)) {
      alert('Cardholder Name should only contain letters and spaces.');
      return;
    }

    if (!/^\d{16}$/.test(cardNumber)) {
      alert('Card number must be 16 digits.');
      return;
    }

    let expiryParts = expiry.split('/');
    if (
      expiryParts.length !== 2 ||
      !/^\d{2}$/.test(expiryParts[0]) ||
      !/^\d{2}$/.test(expiryParts[1])
    ) {
      alert('Expiry date must be in MM/YY format.');
      return;
    }

    let month = parseInt(expiryParts[0], 10);
    let year = parseInt(expiryParts[1], 10);

    if (isNaN(month) || isNaN(year)) {
      alert('Expiry date contains invalid numbers.');
      return;
    }

    if (month < 1 || month > 12) {
      alert('Invalid month in expiry.');
      return;
    }

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear() % 100;

    if (year < currentYear) {
      alert('Card already expired.');
      return;
    }

    if (year === currentYear && month < currentMonth) {
      alert('Card expired.');
      return;
    }

    if (!/^\d{3}$/.test(cvv)) {
      alert('CVV must be 3 digits.');
      return;
    }

    let deliveryDays = Math.floor(Math.random() * 5) + 3;
    let deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

    alert(
      'Order placed successfully!\n' +
      'Your order will be delivered in approximately ' + deliveryDays +
      ' days, on or before ' + deliveryDate.toDateString() + '.'
    );

    form.reset();
    localStorage.removeItem('cart');
    window.location.reload();
  });
});

