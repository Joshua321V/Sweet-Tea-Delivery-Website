// --- Cart State ---
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  if (!cartCount) return;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function calculateGrandTotal() {
  return cart.reduce((sum, it) => sum + (it.total || it.price * it.quantity), 0);
}

// --- Add to Cart ---
function addToCart(itemName, itemPrice) {
  let size = "N/A";
  let quantity = 1;

  const isDrink = itemName.toLowerCase().includes("tea") || itemName.toLowerCase().includes("cappuccino");

  if (isDrink) {
    let sizeChoice = prompt(`Choose a cup size for ${itemName}:\n- Small\n- Medium\n- Large`, "Medium");
    if (!sizeChoice) return;
    sizeChoice = sizeChoice.trim().toLowerCase();
    if (!["small","medium","large"].includes(sizeChoice)) return alert("Invalid size.");
    size = sizeChoice.charAt(0).toUpperCase() + sizeChoice.slice(1);
  }

  let quantityInput = prompt(`Enter quantity for ${itemName}:`, "1");
  if (!quantityInput) return;
  quantity = parseInt(quantityInput, 10);
  if (isNaN(quantity) || quantity < 1) return alert("Invalid quantity.");

  let adjustedPrice = itemPrice;
  if (isDrink) {
    if (size === "Medium") adjustedPrice += 10;
    if (size === "Large") adjustedPrice += 20;
  }

  const existingIndex = cart.findIndex(it => it.name === itemName && it.size === size);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
    cart[existingIndex].price = adjustedPrice;
    cart[existingIndex].total = cart[existingIndex].price * cart[existingIndex].quantity;
  } else {
    cart.push({
      name: itemName,
      price: adjustedPrice,
      size: size,
      quantity: quantity,
      total: adjustedPrice * quantity
    });
  }

  saveCart();
  updateCartCount();
  alert(`${quantity} x ${itemName} (${size}) added to cart.`);
  displayCart();
}

// --- Display Cart ---
function displayCart() {
  const cartItemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  if (!cartItemsEl || !totalEl) return;

  cartItemsEl.innerHTML = "";

  cart.forEach((item, idx) => {
    const li = document.createElement("li");
    li.className = "cart-item-line";

    const title = document.createElement("div");
    title.textContent = `${item.name} (${item.size}) — ₱${item.price.toFixed(2)} each`;
    title.style.marginBottom = "6px";
    li.appendChild(title);

    const qtyLabel = document.createElement("label");
    qtyLabel.textContent = "Quantity: ";
    qtyLabel.setAttribute("for", `qty-${idx}`);
    li.appendChild(qtyLabel);

    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.min = "1";
    qtyInput.value = item.quantity;
    qtyInput.id = `qty-${idx}`;
    qtyInput.style.width = "60px";
    qtyInput.style.marginRight = "12px";
    qtyInput.addEventListener("change", (e) => {
      let newQty = parseInt(e.target.value, 10);
      if (isNaN(newQty) || newQty < 1) newQty = 1;
      item.quantity = newQty;
      item.total = item.price * item.quantity;
      saveCart();
      updateCartCount();
      displayCart();
    });
    li.appendChild(qtyInput);

    const subtotal = document.createElement("span");
    subtotal.textContent = `Subtotal: ₱${(item.price * item.quantity).toFixed(2)}`;
    subtotal.style.marginRight = "12px";
    li.appendChild(subtotal);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.style.marginLeft = "8px";
    removeBtn.addEventListener("click", () => {
      if (confirm(`Remove ${item.name} (${item.size}) from cart?`)) {
        cart.splice(idx, 1);
        saveCart();
        updateCartCount();
        displayCart();
      }
    });
    li.appendChild(removeBtn);

    cartItemsEl.appendChild(li);
  });

  totalEl.textContent = `Total: ₱${calculateGrandTotal().toFixed(2)}`;
  updateCartCount();
}

// --- Checkout via Google Form ---
function buildGoogleFormPrefillURL() {
  const formBase = "https://docs.google.com/forms/d/e/1FAIpQLSfqFyt4ZizABH1CCt6XHKkvD_gp3xX2RI-KdEWZt6nS8Urjfg/viewform?usp=pp_url";
  if (cart.length === 0) return formBase;

  const lines = cart.map(it => `${it.quantity}x ${it.name} (${it.size}) - ₱${(it.price * it.quantity).toFixed(2)}`);
  const productFieldValue = lines.join(" ; ") + ` | TOTAL: ₱${calculateGrandTotal().toFixed(2)}`;
  const params = `&entry.2055684413=${encodeURIComponent(productFieldValue)}`;

  return formBase + params;
}

function handleCheckout() {
  if (cart.length === 0) return alert("Your cart is empty!");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    alert("You must log in first before checking out!");
    localStorage.setItem("redirectAfterLogin", "cart.html");
    window.location.href = "loginform.html";
    return;
  }

  const prefillURL = buildGoogleFormPrefillURL();
  window.open(prefillURL, "_blank");

  cart = [];
  saveCart();
  displayCart();
  alert("Order sent to checkout form. Cart cleared.");
}

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  displayCart();
  updateCartCount();

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", handleCheckout);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const loginLink = document.getElementById("loginLink");
  const welcomeUser = document.getElementById("WelcomeUser");
  const logoutLink = document.getElementById("logoutLink");

  if (loggedInUser && welcomeUser && logoutLink && loginLink) {
    loginLink.style.display = "none";
    welcomeUser.textContent = `Welcome, ${loggedInUser.username}!`;
    logoutLink.style.display = "inline-block";
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("loggedInUser");
      window.location.href = "index.html";
    });
  } else if (loginLink && logoutLink && welcomeUser) {
    loginLink.style.display = "inline-block";
    logoutLink.style.display = "none";
    welcomeUser.textContent = "";
  }

  const backToTop = document.getElementById("backToTop");
  if (backToTop) backToTop.addEventListener("click", e => {
    e.preventDefault();
    window.scrollTo({top:0, behavior:'smooth'});
  });

  // Carousel scroll buttons
  const prevBtn = document.querySelector(".explore-btn.prev");
  const nextBtn = document.querySelector(".explore-btn.next");
  const track = document.querySelector(".explore-track");

  if (prevBtn && nextBtn && track) {
    prevBtn.addEventListener("click", () => track.scrollBy({left: -220, behavior: "smooth"}));
    nextBtn.addEventListener("click", () => track.scrollBy({left: 220, behavior: "smooth"}));
  }
});
