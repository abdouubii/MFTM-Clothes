document.addEventListener("DOMContentLoaded", () => {
    // Get all product cards
    const productCards = document.querySelectorAll(".product-card")
  
    // Filter and sort elements
    const filterButton = document.querySelector(".filter-button")
    const filterPanel = document.querySelector(".filter")
    const applyButton = document.querySelector(".apply-button")
    const sortOptions = document.querySelectorAll('input[name="sort"]')
    const sizeButtons = document.querySelectorAll(".product-size .size-button")
    const colorButtons = document.querySelectorAll(".product-color .color-button")
    const brandOptions = document.querySelectorAll(".product-brand h1")
    const lowerPriceSlider = document.getElementById("lower")
    const upperPriceSlider = document.getElementById("upper")
    const categoryButtons = document.querySelectorAll(".category-button")
  
    // Initialize products from admin dashboard if available
    initializeProducts()
  
    // Add click event to product cards to navigate to product page
    productCards.forEach((card) => {
      card.addEventListener("click", (e) => {
        // Don't navigate if clicking on size buttons
        if (e.target.classList.contains("size") || e.target.closest(".card-btn")) {
          e.stopPropagation()
          return
        }
  
        // Navigate to product page
        window.location.href = "product.html"
      })
  
      // Add quick add to cart functionality
      const sizeOptions = card.querySelectorAll(".size")
      sizeOptions.forEach((sizeBtn) => {
        sizeBtn.addEventListener("click", (e) => {
          e.stopPropagation()
  
          // Remove active class from all size buttons in this card
          sizeOptions.forEach((btn) => btn.classList.remove("active"))
  
          // Add active class to clicked button
          sizeBtn.classList.add("active")
  
          // Get product data
          const productName = card.querySelector(".product-description").textContent
          const productPrice = Number.parseFloat(card.querySelector(".price").textContent.replace(/[^\d]/g, ""))
          const productImage = card.querySelector(".img1").getAttribute("src")
          const productSize = sizeBtn.textContent
          const productId = "product-" + Date.now()
  
          // Add to cart
          addToCart(productId, productName, productPrice, productImage, productSize, 1)
        })
      })
    })
  
    // Toggle filter panel
    if (filterButton) {
      filterButton.addEventListener("click", () => {
        filterPanel.classList.toggle("show")
      })
    }
  
    // Apply filters
    if (applyButton) {
      applyButton.addEventListener("click", () => {
        applyFilters()
        filterPanel.classList.remove("show")
      })
    }
  
    // Category filter
    categoryButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all category buttons
        categoryButtons.forEach((btn) => btn.classList.remove("active"))
  
        // Add active class to clicked button
        this.classList.add("active")
  
        // Filter products by category
        const category = this.textContent.toLowerCase()
        filterProductsByCategory(category)
      })
    })
  
    // Size selection
    sizeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        this.classList.toggle("active")
      })
    })
  
    // Color selection
    colorButtons.forEach((button) => {
      button.addEventListener("click", function () {
        this.classList.toggle("active")
      })
    })
  
    // Brand selection
    brandOptions.forEach((brand) => {
      brand.addEventListener("click", function () {
        this.classList.toggle("active")
      })
    })
  
    // Functions
    function initializeProducts() {
      // Get products from localStorage (admin dashboard)
      const adminProducts = JSON.parse(localStorage.getItem("products") || "[]")
  
      // If there are products from admin dashboard, use them
      if (adminProducts.length > 0) {
        // Get the products container
        const productsContainer = document.querySelector(".products")
  
        // Clear existing products
        // productsContainer.innerHTML = "";
  
        // Add admin products to the page
        // This is commented out because we're keeping the existing products for now
        // adminProducts.forEach(product => {
        //   // Create product card
        //   const productCard = createProductCard(product);
        //   productsContainer.appendChild(productCard);
        // });
      }
    }
  
    function createProductCard(product) {
      // Create product card element
      const card = document.createElement("div")
      card.classList.add("product-card")
      card.setAttribute("data-id", product.id)
  
      // Calculate discount percentage if applicable
      let discountTag = ""
      let priceHtml = `<span class="price">${product.price.toLocaleString()}<span class="da">Da</span></span>`
  
      if (product.originalPrice && product.originalPrice > product.price) {
        const discountPercent = Math.round((1 - product.price / product.originalPrice) * 100)
        discountTag = `<span class="discount-tag">- ${discountPercent}%</span>`
        priceHtml = `
          <span class="price">${product.price.toLocaleString()}<span class="da">Da</span>
          <span class="actual-price">${product.originalPrice.toLocaleString()} Da</span></span>
        `
      }
  
      // Create card HTML
      card.innerHTML = `
        <div class="product-image">
          ${discountTag}
          <img src="${product.image2 || product.image}" class="product-thumb img2" alt="${product.name}">
          <img src="${product.image}" class="product-thumb img1" alt="${product.name}">
          <div class="card-btn">
            <div class="size">XS</div>
            <div class="size">S</div>
            <div class="size">M</div>
            <div class="size">L</div>
            <div class="size">XL</div>
          </div>
        </div>
        <div class="product-info">
          <div class="product-brand-and-description">
            <h2 class="product-brand">${product.brand}</h2>
            <p class="product-description">${product.name}</p>
          </div>
          ${priceHtml}
        </div>
      `
  
      return card
    }
  
    function addToCart(id, name, price, image, size, quantity) {
      // Initialize cart from localStorage or create empty cart
      const cart = JSON.parse(localStorage.getItem("cart")) || []
  
      // Check if item already exists in cart
      const existingItemIndex = cart.findIndex((item) => item.id === id || (item.name === name && item.size === size))
  
      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += quantity
      } else {
        // Add new item to cart
        cart.push({
          id,
          name,
          price: Number(price),
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
      const cartPage = document.getElementById("cart-page")
      if (cartPage) {
        cartPage.classList.add("open")
        renderCart()
      }
    }
  
    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem("cart")) || []
      const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  
      // Update cart count in UI
      const cartCountElement = document.querySelector(".cart-count")
  
      if (cartCountElement) {
        cartCountElement.textContent = cartCount
        cartCountElement.style.display = cartCount > 0 ? "block" : "none"
      }
    }
  
    function renderCart() {
      const cart = JSON.parse(localStorage.getItem("cart")) || []
      const cartItemsContainer = document.getElementById("cart-items")
  
      if (!cartItemsContainer) return
  
      // Clear cart items
      cartItemsContainer.innerHTML = ""
  
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<li class="empty-cart">Your bag is empty</li>'
        document.querySelector(".cart-total").innerHTML = 'Total: <span id="total-price">0.00 DA</span>'
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
      document.querySelector(".cart-total").innerHTML =
        `Total: <span id="total-price">${totalPrice.toLocaleString()} DA</span>`
    }
  
    function applyFilters() {
      // Get selected filters
      const selectedSort = document.querySelector('input[name="sort"]:checked')?.value || ""
      const selectedSizes = Array.from(document.querySelectorAll(".product-size .size-button.active")).map(
        (btn) => btn.textContent,
      )
      const selectedColors = Array.from(document.querySelectorAll(".product-color .color-button.active")).map((btn) => {
        if (btn.classList.contains("black")) return "black"
        if (btn.classList.contains("white")) return "white"
        return "colored"
      })
      const selectedBrands = Array.from(document.querySelectorAll(".product-brand h1.active")).map(
        (brand) => brand.textContent,
      )
      const minPrice = Number.parseInt(lowerPriceSlider.value)
      const maxPrice = Number.parseInt(upperPriceSlider.value)
  
      // Filter products
      productCards.forEach((card) => {
        let shouldShow = true
  
        // Price filter
        const priceText = card.querySelector(".price").textContent
        const price = Number.parseInt(priceText.replace(/[^\d]/g, ""))
  
        if (price < minPrice || price > maxPrice) {
          shouldShow = false
        }
  
        // Brand filter
        if (selectedBrands.length > 0) {
          const brand = card.querySelector(".product-brand").textContent
          if (!selectedBrands.includes(brand)) {
            shouldShow = false
          }
        }
  
        // Apply visibility
        card.style.display = shouldShow ? "block" : "none"
      })
  
      // Apply sorting
      if (selectedSort) {
        sortProducts(selectedSort)
      }
    }
  
    function sortProducts(sortOption) {
      const productsContainer = document.querySelector(".products")
      const products = Array.from(productCards)
  
      products.sort((a, b) => {
        if (sortOption === "price-low-to-high") {
          const priceA = Number.parseInt(a.querySelector(".price").textContent.replace(/[^\d]/g, ""))
          const priceB = Number.parseInt(b.querySelector(".price").textContent.replace(/[^\d]/g, ""))
          return priceA - priceB
        } else if (sortOption === "price-high-to-low") {
          const priceA = Number.parseInt(a.querySelector(".price").textContent.replace(/[^\d]/g, ""))
          const priceB = Number.parseInt(b.querySelector(".price").textContent.replace(/[^\d]/g, ""))
          return priceB - priceA
        } else if (sortOption === "alphabetically") {
          const nameA = a.querySelector(".product-description").textContent
          const nameB = b.querySelector(".product-description").textContent
          return nameA.localeCompare(nameB)
        } else if (sortOption === "newest") {
          // For demo purposes, just reverse the current order
          return -1
        }
        return 0
      })
  
      // Reorder products in the DOM
      products.forEach((product) => {
        productsContainer.appendChild(product)
      })
    }
  
    function filterProductsByCategory(category) {
      if (category === "all") {
        productCards.forEach((card) => {
          card.style.display = "block"
        })
        return
      }
  
      productCards.forEach((card) => {
        // For demo purposes, we'll just use a simple check
        // In a real app, you'd have category data on each product
        const productName = card.querySelector(".product-description").textContent.toLowerCase()
        const productBrand = card.querySelector(".product-brand").textContent.toLowerCase()
  
        if (category === "jacket" && (productName.includes("jacket") || productName.includes("vest"))) {
          card.style.display = "block"
        } else if (
          category === "hoodies & sweatshirts" &&
          (productName.includes("hoodie") ||
            productName.includes("sweatshirt") ||
            productName.includes("fleece") ||
            productName.includes("sweater"))
        ) {
          card.style.display = "block"
        } else if (category === "backpacks & bags" && (productName.includes("backpack") || productName.includes("bag"))) {
          card.style.display = "block"
        } else if (category === "t-shirt" && productName.includes("shirt")) {
          card.style.display = "block"
        } else if (category === "pants" && productName.includes("pant")) {
          card.style.display = "block"
        } else {
          card.style.display = "none"
        }
      })
    }
  
    // Initialize cart count
    updateCartCount()
  })
  