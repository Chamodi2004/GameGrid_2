document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartTable = document.getElementById("cart");
    let totalSpan = document.getElementById("total");
    let buyNowButton = document.querySelector(".buy-now");
    let addToFavouriteButton = document.getElementById("add-to-favourite");
    let applyFavouriteButton = document.getElementById("apply-favourite");

    function saveCartToStorage() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    document.querySelectorAll(".add-to-cart").forEach(function (button) {
        button.addEventListener("click", function () {
            let name = this.getAttribute("data-name");
            let price = parseFloat(this.getAttribute("data-price"));

            let existingItem = cart.find(item => item.name === name);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name: name, price: price, quantity: 1 });
            }
            saveCartToStorage();
            updateCart();
        });
    });

    function updateCart() {
        while (cartTable.rows.length > 0) {
            cartTable.deleteRow(0);
        }

        let header = cartTable.insertRow();
        ["Item", "Price", "Quantity", "Action"].forEach(function (text) {
            let th = document.createElement("th");
            th.textContent = text;
            header.appendChild(th);
        });

        let total = 0;

        cart.forEach(function (item, index) {
            let row = cartTable.insertRow();

            row.insertCell().textContent = item.name;
            row.insertCell().textContent = "LKR " + item.price.toLocaleString();

            let quantityCell = row.insertCell();
            let quantityInput = document.createElement("input");
            quantityInput.type = "number";
            quantityInput.className = "quantity-input";
            quantityInput.min = "1";
            quantityInput.value = item.quantity;
            quantityInput.setAttribute("data-index", index);
            quantityCell.appendChild(quantityInput);

            let actionCell = row.insertCell();
            let removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.className = "remove-btn";
            removeBtn.setAttribute("data-index", index);
            actionCell.appendChild(removeBtn);

            total += item.price * item.quantity;
        });

        totalSpan.textContent = "LKR " + total.toLocaleString();

        document.querySelectorAll(".quantity-input").forEach(function (input) {
            input.addEventListener("change", function () {
                let index = parseInt(this.getAttribute("data-index"));
                let newQuantity = parseInt(this.value);
                if (newQuantity >= 1) {
                    cart[index].quantity = newQuantity;
                    saveCartToStorage();
                } else {
                    this.value = cart[index].quantity;
                }
                updateCart();
            });
        });

        document.querySelectorAll(".remove-btn").forEach(function (button) {
            button.addEventListener("click", function () {
                let index = parseInt(this.getAttribute("data-index"));
                cart.splice(index, 1);
                saveCartToStorage();
                updateCart();
            });
        });
    }

    buyNowButton.addEventListener("click", function () {
        if (cart.length > 0) {
            saveCartToStorage();
            window.location.href = "checkout.html";
        } else {
            alert("Your cart is empty!");
        }
    });

    addToFavouriteButton.addEventListener("click", function () {
        if (cart.length > 0) {
            localStorage.setItem("favouriteOrder", JSON.stringify(cart));
            alert("Items added to Favourites!");
        } else {
            alert("Your cart is empty. Add items before adding to Favourites.");
        }
    });

    applyFavouriteButton.addEventListener("click", function () {
        let saved = localStorage.getItem("favouriteOrder");
        if (saved) {
            cart = JSON.parse(saved);
            saveCartToStorage();
            updateCart();
            alert("Favourite order applied!");
        } else {
            alert("No favourite order found!");
        }
    });

    window.setCartItems = function (items) {
        cart.length = 0;
        items.forEach(function (item) {
            cart.push({
                name: item.name,
                price: item.price,
                quantity: item.quantity || 1
            });
        });
        saveCartToStorage();
        updateCart();
    };

    updateCart();
});
