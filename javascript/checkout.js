document.addEventListener("DOMContentLoaded", () => {
  // Load cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Check if cart is empty
  if (cart.length === 0) {
    alert("Your cart is empty. Please add items to your cart before checkout.")
    window.location.href = "index.html"
    return
  }

  // Load order summary
  loadOrderSummary()

  // Load user data for checkout form
  loadUserData()

  // Checkout form submission
  const checkoutForm = document.getElementById("checkout-form")
  const paymentForm = document.getElementById("payment-form")
  const placeOrderBtn = document.querySelector(".place-order-btn")

  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", () => {
      // Check if forms are valid
      if (!checkoutForm.checkValidity() || !paymentForm.checkValidity()) {
        alert("Please fill in all required fields")
        return
      }

      // Process order
      processOrder()
    })
  }

  // Functions
  function loadOrderSummary() {
    const orderItemsContainer = document.getElementById("order-items")
    const subtotalElement = document.getElementById("subtotal")
    const totalElement = document.getElementById("total")

    if (!orderItemsContainer) return

    // Clear order items
    orderItemsContainer.innerHTML = ""

    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = 500 // Fixed shipping cost
    const total = subtotal + shipping

    // Render order items
    cart.forEach((item) => {
      const orderItem = document.createElement("li")
      orderItem.classList.add("order-item")

      orderItem.innerHTML = `
        <div class="item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="item-details">
          <h3>${item.name}</h3>
          <p>Size: ${item.size}</p>
          <p>Quantity: ${item.quantity}</p>
          <p class="item-price">${(item.price * item.quantity).toLocaleString()} DA</p>
        </div>
      `

      orderItemsContainer.appendChild(orderItem)
    })

    // Update totals
    subtotalElement.textContent = `${subtotal.toLocaleString()} DA`
    totalElement.textContent = `${total.toLocaleString()} DA`
  }

  function loadUserData() {
    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem("userData") || "{}")

    // Set form values if user data exists
    if (userData.firstName) {
      document.getElementById("name").value = `${userData.firstName} ${userData.lastName || ""}`
      document.getElementById("email").value = userData.email || ""
      document.getElementById("phone").value = userData.phone || ""

      // Set card name if available
      document.getElementById("card-name").value = `${userData.firstName} ${userData.lastName || ""}`
    }
  }

  function processOrder() {
    // Generate order ID
    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000)

    // Get form data
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const phone = document.getElementById("phone").value
    const address = document.getElementById("address").value

    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = 500
    const total = subtotal + shipping

    // Create order object
    const order = {
      id: orderId,
      date: new Date().toISOString(),
      customer: {
        name,
        email,
        phone,
        address,
      },
      items: cart,
      subtotal,
      shipping,
      total,
      status: "pending",
    }

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    orders.push(order)
    localStorage.setItem("orders", JSON.stringify(orders))

    // Update product inventory in admin dashboard
    updateInventory(cart)

    // Clear cart
    localStorage.setItem("cart", JSON.stringify([]))

    // Show success message
    alert(`Order placed successfully! Your order ID is ${orderId}.`)

    // Redirect to order confirmation page
    window.location.href = "index.html"
  }

  function updateInventory(cartItems) {
    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem("products") || "[]")

    // Update inventory for each product
    cartItems.forEach((item) => {
      const productIndex = products.findIndex((p) => p.name === item.name)
      if (productIndex !== -1) {
        // Reduce inventory
        if (products[productIndex].inventory) {
          products[productIndex].inventory -= item.quantity
          if (products[productIndex].inventory < 0) {
            products[productIndex].inventory = 0
          }
        }

        // Update sales count
        if (!products[productIndex].sales) {
          products[productIndex].sales = 0
        }
        products[productIndex].sales += item.quantity
      }
    })

    // Save updated products
    localStorage.setItem("products", JSON.stringify(products))
  }
})
