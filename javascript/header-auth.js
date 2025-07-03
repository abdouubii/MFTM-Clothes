document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
  
    // Get the account button in the header
    const accountButton = document.querySelector(".button a")
    const cartCountElement = document.querySelector(".cart-count")
  
    if (accountButton) {
      if (isLoggedIn) {
        // User is logged in, change button text to "PROFILE"
        accountButton.textContent = "PROFILE"
        accountButton.href = "profile.html"
      } else if (isAdminLoggedIn) {
        // Admin is logged in, change button text to "ADMIN"
        accountButton.textContent = "ADMIN"
        accountButton.href = "admin/dashboard.html"
      } else {
        // No one is logged in, keep as "LOGIN"
        accountButton.textContent = "LOGIN"
        accountButton.href = "login.html"
      }
    }
  
    // Update cart count
    updateCartCount()
  })
  
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
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
  