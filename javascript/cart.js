document.addEventListener("DOMContentLoaded", () => {
  // Initialize cart from localStorage or create empty cart
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Update cart count
  updateCartCount()

  // Add to cart functionality
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn") || e.target.closest(".add-to-cart-btn")) {
      const btn = e.target.classList.contains("add-to-cart-btn") ? e.target : e.target.closest(".add-to-cart-btn")
      const productId = btn.getAttribute("data-id")
      const productName = btn.getAttribute("data-name")
      const productPrice = btn.getAttribute("data-price")
      const productImage = btn.getAttribute("data-image")
      const productSize = document.querySelector('input[name="size"]:checked')?.value || "M"
      const productQuantity = Number.parseInt(document.getElementById("quantity")?.value || 1)

      addToCart(productId, productName, productPrice, productImage, productSize, productQuantity)
    }
  })

  // Cart toggle
  const cartToggle = document.querySelector(".cart")
  const cartPage = document.getElementById("cart-page")
  const closeCartBtn = document.querySelector(".cart-page .close-button")

  if (cartToggle) {
    cartToggle.addEventListener("click", (e) => {
      e.preventDefault()
      cartPage.classList.add("open")
      renderCart()
    })
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", () => {
      cartPage.classList.remove("open")
    })
  }

  // Cart item quantity change
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("quantity-btn")) {
      const itemId = e.target.closest(".cart-item").getAttribute("data-id")
      const action = e.target.getAttribute("data-action")

      updateCartItemQuantity(itemId, action)
    }
  })

  // Remove from cart
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn") || e.target.closest(".remove-btn")) {
      const itemId = e.target.closest(".cart-item").getAttribute("data-id")
      removeFromCart(itemId)
    }
  })

  // Functions
  function addToCart(id, name, price, image, size, quantity) {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex((item) => item.id === id && item.size === size)

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      cart[existingItemIndex].quantity += quantity
    } else {
      // Add new item to cart
      cart.push({
        id,
        name,
        price: Number.parseFloat(price),
        image,
        size,
        quantity,
      })
    }

    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart))

    // Update cart count
    updateCartCount()

    // Show success message
    alert(`${name} (Size: ${size}) added to cart!`)

    // Open cart
    document.getElementById("cart-page").classList.add("open")
    renderCart()
  }

  function updateCartItemQuantity(id, action) {
    const itemIndex = cart.findIndex((item) => item.id === id)

    if (itemIndex !== -1) {
      if (action === "increase") {
        cart[itemIndex].quantity++
      } else if (action === "decrease") {
        if (cart[itemIndex].quantity > 1) {
          cart[itemIndex].quantity--
        } else {
          // Remove item if quantity becomes 0
          cart.splice(itemIndex, 1)
        }
      }

      // Save cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cart))

      // Update cart count
      updateCartCount()

      // Render cart
      renderCart()
    }
  }

  function removeFromCart(id) {
    const itemIndex = cart.findIndex((item) => item.id === id)

    if (itemIndex !== -1) {
      cart.splice(itemIndex, 1)

      // Save cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cart))

      // Update cart count
      updateCartCount()

      // Render cart
      renderCart()
    }
  }

  function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

    // Update cart count in UI
    const cartCountElement = document.querySelector(".cart-count")

    if (cartCountElement) {
      cartCountElement.textContent = cartCount

      if (cartCount > 0) {
        cartCountElement.style.display = "block"
      } else {
        cartCountElement.style.display = "none"
      }
    }
  }

  function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items")
    const totalPriceElement = document.getElementById("total-price")

    if (!cartItemsContainer) return

    // Clear cart items
    cartItemsContainer.innerHTML = ""

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<li class="empty-cart">Your bag is empty</li>'
      totalPriceElement.textContent = "0.00 DA"
      return
    }

    // Calculate total price
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0)

    // Render cart items
    cart.forEach((item) => {
      const cartItem = document.createElement("li")
      cartItem.classList.add("cart-item")
      cartItem.setAttribute("data-id", item.id)

      cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Size: ${item.size}</p>
                    <p class="cart-item-price">${item.price.toLocaleString()} DA</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-action="increase">+</button>
                    </div>
                </div>
                <button class="remove-btn">
                    <i class="fas fa-trash"></i>
                </button>
            `

      cartItemsContainer.appendChild(cartItem)
    })

    // Update total price
    totalPriceElement.textContent = `${totalPrice.toLocaleString()} DA`
  }
})
