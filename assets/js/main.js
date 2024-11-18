// main.js
function loadComponent(id, file) {
  return fetch(file)
      .then(response => response.text())
      .then(data => {
          document.getElementById(id).innerHTML = data;
          if (id === 'header') initializeCartEvents(); // Inicializa los eventos del carrito al cargar el header
      })
      .catch(error => console.error('Error cargando el componente:', error));
}

// Cargar header y footer
loadComponent('header', 'header.html');
loadComponent('footer', 'footer.html');

// Inicializar eventos del carrito
function initializeCartEvents() {
    const cartIcon = document.querySelector("#cart-icon");
    const cart = document.querySelector(".cart");
    const closeCart = document.querySelector("#cart-close");

    cartIcon.addEventListener("click", () => {
        cart.classList.add("active");
    });

    closeCart.addEventListener("click", () => {
        cart.classList.remove("active");
    });

    addEvents(); // Llamar a addEvents después de que se carguen los elementos
}

// Start when the document is ready
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}

// =============== START ====================
function start() {
  addEvents();
}

// ============= UPDATE & RERENDER ===========
function update() {
  addEvents();
  updateTotal();
}

// =============== ADD EVENTS ===============
function addEvents() {
  // Configura los eventos en los botones de agregar al carrito
  let addCart_btns = document.querySelectorAll(".add-cart");
  addCart_btns.forEach((btn) => {
      btn.addEventListener("click", handle_addCartItem);
  });

  let cartRemove_btns = document.querySelectorAll(".cart-remove");
  cartRemove_btns.forEach((btn) => {
      btn.addEventListener("click", handle_removeCartItem);
  });

  let cartQuantity_inputs = document.querySelectorAll(".cart-quantity");
  cartQuantity_inputs.forEach((input) => {
      input.addEventListener("change", handle_changeItemQuantity);
  });

  const buy_btn = document.querySelector(".btn-buy");
  if (buy_btn) buy_btn.addEventListener("click", handle_buyOrder);
}

// Resto de las funciones de manejo de carrito...


// ============= HANDLE EVENTS FUNCTIONS =============
let itemsAdded = [];

// Función para agregar productos al carrito o incrementar la cantidad si ya existe
function handle_addCartItem() {
  let product = this.parentElement;
  let title = product.querySelector(".product-title").innerText;
  let price = product.querySelector(".product-price").innerText;
  let imgSrc = product.querySelector(".product-img").src;

  let existingItem = itemsAdded.find(item => item.title === title);
  
  if (existingItem) {
      // Incrementa la cantidad si el producto ya está en el carrito
      let cartBox = [...document.querySelectorAll(".cart-box")].find(
          (box) => box.querySelector(".cart-product-title").innerText === title
      );
      let quantityInput = cartBox.querySelector(".cart-quantity");
      quantityInput.value = parseInt(quantityInput.value) + 1;
  } else {
      // Agrega el producto si no está en el carrito
      let newToAdd = { title, price, imgSrc, quantity: 1 };
      itemsAdded.push(newToAdd);

      let cartBoxElement = CartBoxComponent(title, price, imgSrc);
      const cartContent = document.querySelector(".cart-content");
      cartContent.insertAdjacentHTML("beforeend", cartBoxElement);
  }

  update();
}


function handle_removeCartItem() {
  this.parentElement.remove();
  itemsAdded = itemsAdded.filter(
    (el) =>
      el.title !=
      this.parentElement.querySelector(".cart-product-title").innerHTML
  );

  update();
}

function handle_changeItemQuantity() {
  if (isNaN(this.value) || this.value < 1) {
    this.value = 1;
  }
  this.value = Math.floor(this.value); // to keep it integer

  update();
}

function handle_buyOrder() {
  if (itemsAdded.length <= 0) {
    alert("There is No Order to Place Yet! \nPlease Make an Order first.");
    return;
  }
  const cartContent = cart.querySelector(".cart-content");
  cartContent.innerHTML = "";
  alert("Your Order is Placed Successfully :)");
  itemsAdded = [];

  update();
}

// =========== UPDATE & RERENDER FUNCTIONS =========
// Función para actualizar el contador en el ícono del carrito
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  let totalItems = 0;

  // Sumar todas las cantidades de los productos en el carrito
  document.querySelectorAll(".cart-quantity").forEach((input) => {
      totalItems += parseInt(input.value);
  });

  // Mostrar la cantidad total en la burbuja
  cartCount.textContent = totalItems;
}

// Actualiza el total del carrito sumando los precios de cada producto según su cantidad
function updateTotal() {
  const cartBoxes = document.querySelectorAll(".cart-box");
  const totalElement = document.querySelector(".total-price");
  let total = 0;

  cartBoxes.forEach((cartBox) => {
      const priceElement = cartBox.querySelector(".cart-price");
      const quantityInput = cartBox.querySelector(".cart-quantity");

      let price = parseFloat(priceElement.innerText.replace("$", ""));
      let quantity = parseInt(quantityInput.value);

      total += price * quantity;
  });

  // Mostrar el total con dos decimales
  totalElement.innerText = "$" + total.toFixed(2);

    // Actualizar el contador del carrito
    updateCartCount();
}

// Llamar a updateCartCount también cada vez que un producto se agregue o se modifique su cantidad
function handle_addCartItem() {
  let product = this.parentElement;
  let title = product.querySelector(".product-title").innerText;
  let price = product.querySelector(".product-price").innerText;
  let imgSrc = product.querySelector(".product-img").src;

  let existingItem = itemsAdded.find(item => item.title === title);
  
  if (existingItem) {
      // Incrementa la cantidad si el producto ya está en el carrito
      let cartBox = [...document.querySelectorAll(".cart-box")].find(
          (box) => box.querySelector(".cart-product-title").innerText === title
      );
      let quantityInput = cartBox.querySelector(".cart-quantity");
      quantityInput.value = parseInt(quantityInput.value) + 1;
  } else {
      // Agrega el producto si no está en el carrito
      let newToAdd = { title, price, imgSrc, quantity: 1 };
      itemsAdded.push(newToAdd);

      let cartBoxElement = CartBoxComponent(title, price, imgSrc);
      const cartContent = document.querySelector(".cart-content");
      cartContent.insertAdjacentHTML("beforeend", cartBoxElement);
  }

  update();
}

// ============ COMPONENTE HTML PARA EL CARRITO ===========
function CartBoxComponent(title, price, imgSrc) {
  return `
  <div class="cart-box">
      <img src="${imgSrc}" alt="" class="cart-img">
      <div class="detail-box">
          <div class="cart-product-title">${title}</div>
          <div class="cart-price">${price}</div>
          <input type="number" value="1" class="cart-quantity" min="1">
      </div>
      <i class='bx bxs-trash-alt cart-remove'></i>
  </div>`;
}

// Configurar evento para actualizar el total al cambiar la cantidad
function addEvents() {
  // Configura los eventos de los botones de añadir al carrito
  document.querySelectorAll(".add-cart").forEach((btn) =>
      btn.addEventListener("click", handle_addCartItem)
  );

  // Configura los eventos de remover del carrito
  document.querySelectorAll(".cart-remove").forEach((btn) =>
      btn.addEventListener("click", handle_removeCartItem)
  );

  // Configura los eventos para cambiar la cantidad de productos
  document.querySelectorAll(".cart-quantity").forEach((input) =>
      input.addEventListener("change", () => {
          if (isNaN(input.value) || input.value < 1) input.value = 1;
          update();
      })
  );

  const buyBtn = document.querySelector(".btn-buy");
  if (buyBtn) buyBtn.addEventListener("click", handle_buyOrder);
}