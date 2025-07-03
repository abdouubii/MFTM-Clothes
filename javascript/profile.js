document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html"
    return // Stop execution if not logged in
  }

  // Load user data
  const userData = JSON.parse(localStorage.getItem("userData") || "{}")

  // Set profile name and email
  document.getElementById("profile-name").textContent = `${userData.firstName || ""} ${userData.lastName || ""}`
  document.getElementById("profile-email").textContent = userData.email || ""

  // Set form values
  document.getElementById("first-name").value = userData.firstName || ""
  document.getElementById("last-name").value = userData.lastName || ""
  document.getElementById("email").value = userData.email || ""
  document.getElementById("phone").value = userData.phone || ""

  // Tab navigation
  const menuItems = document.querySelectorAll(".profile-menu li a")
  const sections = document.querySelectorAll(".profile-section")

  menuItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      if (this.getAttribute("id") === "logout-btn") {
        return // Let the logout button handle its own click
      }

      e.preventDefault()

      const target = this.getAttribute("href").substring(1)

      // Remove active class from all menu items and sections
      menuItems.forEach((item) => item.parentElement.classList.remove("active"))
      sections.forEach((section) => section.classList.remove("active"))

      // Add active class to clicked menu item and corresponding section
      this.parentElement.classList.add("active")
      document.getElementById(target).classList.add("active")
    })
  })

  // Logout functionality
  const logoutBtn = document.getElementById("logout-btn")

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()

      // Clear user data
      localStorage.removeItem("isLoggedIn")

      // Redirect to login page
      window.location.href = "index.html"
    })
  }

  // Account form submission
  const accountForm = document.getElementById("account-form")

  if (accountForm) {
    accountForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const firstName = document.getElementById("first-name").value
      const lastName = document.getElementById("last-name").value
      const email = document.getElementById("email").value
      const phone = document.getElementById("phone").value
      const currentPassword = document.getElementById("current-password").value
      const newPassword = document.getElementById("new-password").value
      const confirmPassword = document.getElementById("confirm-password").value

      // Simple validation
      if (!firstName || !lastName || !email || !phone) {
        alert("Please fill in all required fields")
        return
      }

      // Check current password if trying to change password
      if ((newPassword || confirmPassword) && currentPassword !== userData.password) {
        alert("Current password is incorrect")
        return
      }

      // Check if new passwords match
      if (newPassword && newPassword !== confirmPassword) {
        alert("New passwords do not match")
        return
      }

      // Update user data
      const updatedUserData = {
        ...userData,
        firstName,
        lastName,
        email,
        phone,
      }

      // Update password if provided
      if (newPassword) {
        updatedUserData.password = newPassword
      }

      // Save updated user data
      localStorage.setItem("userData", JSON.stringify(updatedUserData))

      // Update profile name and email
      document.getElementById("profile-name").textContent = `${firstName} ${lastName}`
      document.getElementById("profile-email").textContent = email

      // Clear password fields
      document.getElementById("current-password").value = ""
      document.getElementById("new-password").value = ""
      document.getElementById("confirm-password").value = ""

      // Show success message
      alert("Account information updated successfully!")
    })
  }

  // Avatar upload
  const avatarUpload = document.getElementById("avatar-upload")
  const profileAvatar = document.getElementById("profile-avatar")

  if (avatarUpload && profileAvatar) {
    avatarUpload.addEventListener("change", (e) => {
      const file = e.target.files[0]

      if (file) {
        const reader = new FileReader()

        reader.onload = (e) => {
          profileAvatar.src = e.target.result

          // Save avatar to localStorage
          localStorage.setItem("userAvatar", e.target.result)
        }

        reader.readAsDataURL(file)
      }
    })

    // Load avatar if exists
    const savedAvatar = localStorage.getItem("userAvatar")
    if (savedAvatar) {
      profileAvatar.src = savedAvatar
    }
  }

  // Load order history
  loadOrderHistory()

  // Load addresses
  loadAddresses()

  // Load wishlist
  loadWishlist()

  // Address modal
  const addAddressBtn = document.getElementById("add-address-btn")
  const addressModal = document.getElementById("address-modal")
  const closeModalBtn = document.querySelector(".close-modal")
  const cancelAddressBtn = document.getElementById("cancel-address")
  const addressForm = document.getElementById("address-form")

  if (addAddressBtn && addressModal) {
    addAddressBtn.addEventListener("click", () => {
      // Reset form
      addressForm.reset()
      // Set editing address ID to null
      addressForm.dataset.editId = ""
      // Set modal title
      document.querySelector("#address-modal .modal-header h2").textContent = "Add New Address"
      // Show modal
      addressModal.style.display = "block"
    })
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      addressModal.style.display = "none"
    })
  }

  if (cancelAddressBtn) {
    cancelAddressBtn.addEventListener("click", () => {
      addressModal.style.display = "none"
    })
  }

  if (addressForm) {
    addressForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const addressName = document.getElementById("address-name").value
      const fullName = document.getElementById("full-name").value
      const streetAddress = document.getElementById("street-address").value
      const city = document.getElementById("city").value
      const postalCode = document.getElementById("postal-code").value
      const country = document.getElementById("country").value
      const phone = document.getElementById("address-phone").value
      const isDefault = document.getElementById("default-address").checked

      // Simple validation
      if (!addressName || !fullName || !streetAddress || !city || !postalCode || !country || !phone) {
        alert("Please fill in all fields")
        return
      }

      // Get addresses from localStorage
      const addresses = JSON.parse(localStorage.getItem("userAddresses") || "[]")

      // Check if we're editing an existing address
      const editId = addressForm.dataset.editId

      if (editId) {
        // Find the address to edit
        const addressIndex = addresses.findIndex((addr) => addr.id === editId)

        if (addressIndex !== -1) {
          // Update the address
          addresses[addressIndex] = {
            id: editId,
            addressName,
            fullName,
            streetAddress,
            city,
            postalCode,
            country,
            phone,
            isDefault,
          }

          // If this address is set as default, update other addresses
          if (isDefault) {
            addresses.forEach((addr, index) => {
              if (index !== addressIndex) {
                addr.isDefault = false
              }
            })
          }
        }
      } else {
        // Create new address object
        const newAddress = {
          id: `addr_${Date.now()}`,
          addressName,
          fullName,
          streetAddress,
          city,
          postalCode,
          country,
          phone,
          isDefault,
        }

        // If this is the first address or set as default, update other addresses
        if (isDefault || addresses.length === 0) {
          addresses.forEach((addr) => {
            addr.isDefault = false
          })
          newAddress.isDefault = true
        }

        // Add new address to array
        addresses.push(newAddress)
      }

      // Save addresses to localStorage
      localStorage.setItem("userAddresses", JSON.stringify(addresses))

      // Close modal
      addressModal.style.display = "none"

      // Reload addresses
      loadAddresses()

      // Show success message
      alert(editId ? "Address updated successfully!" : "Address added successfully!")
    })
  }

  // Setup address edit and delete buttons
  document.addEventListener("click", (e) => {
    // Edit address
    if (e.target.classList.contains("edit-address") || e.target.closest(".edit-address")) {
      const btn = e.target.classList.contains("edit-address") ? e.target : e.target.closest(".edit-address")
      const addressId = btn.getAttribute("data-id")

      // Get addresses from localStorage
      const addresses = JSON.parse(localStorage.getItem("userAddresses") || "[]")

      // Find the address to edit
      const address = addresses.find((addr) => addr.id === addressId)

      if (address) {
        // Set form values
        document.getElementById("address-name").value = address.addressName
        document.getElementById("full-name").value = address.fullName
        document.getElementById("street-address").value = address.streetAddress
        document.getElementById("city").value = address.city
        document.getElementById("postal-code").value = address.postalCode
        document.getElementById("country").value = address.country
        document.getElementById("address-phone").value = address.phone
        document.getElementById("default-address").checked = address.isDefault

        // Set editing address ID
        addressForm.dataset.editId = addressId

        // Set modal title
        document.querySelector("#address-modal .modal-header h2").textContent = "Edit Address"

        // Show modal
        addressModal.style.display = "block"
      }
    }

    // Delete address
    if (e.target.classList.contains("delete-address") || e.target.closest(".delete-address")) {
      const btn = e.target.classList.contains("delete-address") ? e.target : e.target.closest(".delete-address")
      const addressId = btn.getAttribute("data-id")

      // Confirm deletion
      if (confirm("Are you sure you want to delete this address?")) {
        // Get addresses from localStorage
        const addresses = JSON.parse(localStorage.getItem("userAddresses") || "[]")

        // Filter out the address to delete
        const updatedAddresses = addresses.filter((addr) => addr.id !== addressId)

        // If we deleted the default address and there are other addresses, make the first one default
        if (addresses.find((addr) => addr.id === addressId)?.isDefault && updatedAddresses.length > 0) {
          updatedAddresses[0].isDefault = true
        }

        // Save updated addresses to localStorage
        localStorage.setItem("userAddresses", JSON.stringify(updatedAddresses))

        // Reload addresses
        loadAddresses()

        // Show success message
        alert("Address deleted successfully!")
      }
    }

    // Set default address
    if (e.target.classList.contains("set-default-address") || e.target.closest(".set-default-address")) {
      const btn = e.target.classList.contains("set-default-address")
        ? e.target
        : e.target.closest(".set-default-address")
      const addressId = btn.getAttribute("data-id")

      // Get addresses from localStorage
      const addresses = JSON.parse(localStorage.getItem("userAddresses") || "[]")

      // Update default status
      addresses.forEach((addr) => {
        addr.isDefault = addr.id === addressId
      })

      // Save updated addresses to localStorage
      localStorage.setItem("userAddresses", JSON.stringify(addresses))

      // Reload addresses
      loadAddresses()

      // Show success message
      alert("Default address updated successfully!")
    }

    // Wishlist actions
    if (e.target.classList.contains("add-to-cart-wishlist") || e.target.closest(".add-to-cart-wishlist")) {
      const btn = e.target.classList.contains("add-to-cart-wishlist")
        ? e.target
        : e.target.closest(".add-to-cart-wishlist")
      const productId = btn.getAttribute("data-id")

      // Get product details
      const products = JSON.parse(localStorage.getItem("products") || "[]")
      const product = products.find((p) => p.id === productId)

      if (product) {
        // Add to cart
        addToCart(product)
        alert("Product added to cart!")
      }
    }

    if (e.target.classList.contains("remove-from-wishlist") || e.target.closest(".remove-from-wishlist")) {
      const btn = e.target.classList.contains("remove-from-wishlist")
        ? e.target
        : e.target.closest(".remove-from-wishlist")
      const productId = btn.getAttribute("data-id")

      // Get wishlist from localStorage
      const wishlist = JSON.parse(localStorage.getItem("userWishlist") || "[]")

      // Filter out the product to remove
      const updatedWishlist = wishlist.filter((id) => id !== productId)

      // Save updated wishlist to localStorage
      localStorage.setItem("userWishlist", JSON.stringify(updatedWishlist))

      // Reload wishlist
      loadWishlist()

      // Show success message
      alert("Product removed from wishlist!")
    }
  })

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === addressModal) {
      addressModal.style.display = "none"
    }
  })
})

function loadOrderHistory() {
  const ordersContainer = document.querySelector(".orders-list")
  if (!ordersContainer) return

  // Get user email
  const userData = JSON.parse(localStorage.getItem("userData") || "{}")
  const userEmail = userData.email

  if (!userEmail) {
    ordersContainer.innerHTML = "<p>No order history found.</p>"
    return
  }

  // Get orders from localStorage
  const allOrders = JSON.parse(localStorage.getItem("orders") || "[]")

  // Filter orders for this user
  const userOrders = allOrders.filter((order) => order.customer.email === userEmail)

  if (userOrders.length === 0) {
    ordersContainer.innerHTML = "<p>No order history found.</p>"
    return
  }

  // Sort orders by date (newest first)
  userOrders.sort((a, b) => new Date(b.date) - new Date(a.date))

  // Clear container
  ordersContainer.innerHTML = ""

  // Render orders
  userOrders.forEach((order) => {
    const orderCard = document.createElement("div")
    orderCard.className = "order-card"

    // Calculate total
    const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + (order.shipping || 0)

    orderCard.innerHTML = `
      <div class="order-header">
        <div class="order-info">
          <h3>Order #${order.id}</h3>
          <p>${order.date}</p>
        </div>
        <div class="order-status">
          <span class="status-badge status-${order.status}">${capitalizeFirstLetter(order.status)}</span>
        </div>
      </div>
      <div class="order-items">
        ${order.items
          .map(
            (item) => `
          <div class="order-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
              <h4>${item.name}</h4>
              <p>Size: ${item.size}</p>
              <p>${item.price.toLocaleString()} DA</p>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
      <div class="order-footer">
        <div class="order-total">
          <p>Total: ${total.toLocaleString()} DA</p>
        </div>
        <div class="order-actions">
          <button class="secondary-btn view-order-details" data-id="${order.id}">View Details</button>
          ${order.status === "delivered" ? '<button class="primary-btn buy-again" data-id="' + order.id + '">Buy Again</button>' : ""}
        </div>
      </div>
    `

    ordersContainer.appendChild(orderCard)
  })
}

function loadAddresses() {
  const addressesContainer = document.querySelector(".addresses-list")
  if (!addressesContainer) return

  // Get addresses from localStorage
  const addresses = JSON.parse(localStorage.getItem("userAddresses") || "[]")

  // Clear container except for the add address card
  const addAddressCardElement = addressesContainer.querySelector(".add-address-card")
  addressesContainer.innerHTML = ""

  if (addresses.length === 0) {
    // No addresses found, just show the add address card
    addressesContainer.innerHTML = `
      <div class="add-address-card">
        <button id="add-address-btn">
          <i class="fas fa-plus"></i>
          <span>Add New Address</span>
        </button>
      </div>
    `
    return
  }

  // Render addresses
  addresses.forEach((address) => {
    const addressCard = document.createElement("div")
    addressCard.className = `address-card ${address.isDefault ? "default" : ""}`

    addressCard.innerHTML = `
      <div class="address-header">
        <h3>${address.addressName}</h3>
        ${address.isDefault ? '<span class="default-badge">Default</span>' : ""}
      </div>
      <div class="address-content">
        <p>${address.fullName}</p>
        <p>${address.streetAddress}</p>
        <p>${address.city}, ${address.postalCode}</p>
        <p>${address.country}</p>
        <p>${address.phone}</p>
      </div>
      <div class="address-actions">
        <button class="secondary-btn edit-address" data-id="${address.id}">Edit</button>
        <button class="danger-btn delete-address" data-id="${address.id}">Delete</button>
        ${!address.isDefault ? `<button class="primary-btn set-default-address" data-id="${address.id}">Set as Default</button>` : ""}
      </div>
    `

    addressesContainer.appendChild(addressCard)
  })

  // Add the "add address" card
  const addAddressCard = document.createElement("div")
  addAddressCard.className = "add-address-card"
  addAddressCard.innerHTML = `
    <button id="add-address-btn">
      <i class="fas fa-plus"></i>
      <span>Add New Address</span>
    </button>
  `

  addressesContainer.appendChild(addAddressCard)
}

function loadWishlist() {
  const wishlistContainer = document.querySelector(".wishlist-items")
  if (!wishlistContainer) return

  // Get wishlist from localStorage
  const wishlist = JSON.parse(localStorage.getItem("userWishlist") || "[]")

  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>"
    return
  }

  // Get products from localStorage
  const products = JSON.parse(localStorage.getItem("products") || "[]")

  // Filter products in wishlist
  const wishlistProducts = products.filter((product) => wishlist.includes(product.id))

  if (wishlistProducts.length === 0) {
    wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>"
    return
  }

  // Clear container
  wishlistContainer.innerHTML = ""

  // Render wishlist items
  wishlistProducts.forEach((product) => {
    const wishlistItem = document.createElement("div")
    wishlistItem.className = "wishlist-item"

    wishlistItem.innerHTML = `
      <div class="item-image">
        <img src="${product.images[0]}" alt="${product.name}">
      </div>
      <div class="item-details">
        <h3>${product.name}</h3>
        <p class="item-brand">${product.brand}</p>
        <p class="item-price">${product.price.toLocaleString()} DA
          ${product.discount > 0 ? `<span class="original-price">${product.originalPrice.toLocaleString()} DA</span>` : ""}
        </p>
      </div>
      <div class="item-actions">
        <button class="primary-btn add-to-cart-wishlist" data-id="${product.id}">Add to Cart</button>
        <button class="danger-btn remove-from-wishlist" data-id="${product.id}"><i class="fas fa-trash"></i></button>
      </div>
    `

    wishlistContainer.appendChild(wishlistItem)
  })
}

function addToCart(product) {
  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart") || "[]")

  // Check if product already in cart
  const existingItemIndex = cart.findIndex((item) => item.id === product.id)

  if (existingItemIndex !== -1) {
    // Increment quantity
    cart[existingItemIndex].quantity += 1
  } else {
    // Add new item
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: product.sizes[0] || "M", // Default to first size or M
      quantity: 1,
    })
  }

  // Save cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Update cart count
  updateCartCount()
}

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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
