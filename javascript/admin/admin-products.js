document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "login.html"
    return
  }

  // Set admin name
  const adminName = document.getElementById("admin-name")
  if (adminName) {
    adminName.textContent = localStorage.getItem("adminName") || "Admin User"
  }

  // Toggle sidebar
  const toggleSidebar = document.getElementById("toggle-sidebar")
  const sidebar = document.querySelector(".sidebar")

  if (toggleSidebar) {
    toggleSidebar.addEventListener("click", () => {
      sidebar.classList.toggle("active")
    })
  }

  // Logout functionality
  const logoutBtn = document.getElementById("logout-btn")

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("adminLoggedIn")
      localStorage.removeItem("adminName")
      window.location.href = "../index.html"
    })
  }

  // Initialize state
  window.productState = {
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1,
    searchTerm: "",
    categoryFilter: "",
    brandFilter: "",
    sortBy: "newest",
    editingProductId: null,
  }

  // Load products data
  loadProductsData()

  // Add product button
  const addProductBtn = document.getElementById("add-product-btn")
  const productModal = document.getElementById("product-modal")
  const closeModalBtns = document.querySelectorAll(".close-modal")
  const cancelProductBtn = document.getElementById("cancel-product")

  if (addProductBtn) {
    addProductBtn.addEventListener("click", () => {
      document.getElementById("modal-title").textContent = "Add New Product"
      document.getElementById("product-form").reset()
      window.productState.editingProductId = null

      // Clear image previews
      clearImagePreviews()

      productModal.style.display = "block"
    })
  }

  // Close modal buttons
  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      productModal.style.display = "none"
      document.getElementById("delete-modal").style.display = "none"
    })
  })

  // Cancel product button
  if (cancelProductBtn) {
    cancelProductBtn.addEventListener("click", () => {
      productModal.style.display = "none"
    })
  }

  // Product form submission
  const productForm = document.getElementById("product-form")

  if (productForm) {
    productForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const name = document.getElementById("product-name").value
      const brand = document.getElementById("product-brand").value
      const category = document.getElementById("product-category").value
      const price = Number.parseInt(document.getElementById("product-price").value)
      const discount = Number.parseInt(document.getElementById("product-discount").value || "0")
      const stock = Number.parseInt(document.getElementById("product-stock").value)
      const description = document.getElementById("product-description").value

      // Get selected sizes
      const sizeCheckboxes = document.querySelectorAll('input[name="size"]:checked')
      const sizes = Array.from(sizeCheckboxes).map((checkbox) => checkbox.value)

      // Calculate original price based on discount
      const originalPrice = discount > 0 ? Math.round(price / (1 - discount / 100)) : price

      // Get products from localStorage
      const products = JSON.parse(localStorage.getItem("products") || "[]")

      if (window.productState.editingProductId) {
        // Update existing product
        const productIndex = products.findIndex((p) => p.id === window.productState.editingProductId)

        if (productIndex !== -1) {
          const updatedProduct = {
            ...products[productIndex],
            name,
            brand,
            category,
            price,
            originalPrice,
            discount,
            stock,
            description,
            sizes,
          }

          // Update images if new ones are provided
          const image1Input = document.getElementById("product-image-1")
          const image2Input = document.getElementById("product-image-2")

          // In a real app, we would upload these images to a server
          // For this demo, we'll just keep the existing images if no new ones are provided
          if (image1Input.files && image1Input.files[0]) {
            // This is a simplified approach for demo purposes
            // In a real app, you would upload the image and get a URL
            updatedProduct.images[0] = URL.createObjectURL(image1Input.files[0])
          }

          if (image2Input.files && image2Input.files[0]) {
            updatedProduct.images[1] = URL.createObjectURL(image2Input.files[0])
          }

          products[productIndex] = updatedProduct
        }
      } else {
        // Add new product
        const newProduct = {
          id: `p${Date.now()}`, // Generate a unique ID
          name,
          brand,
          category,
          price,
          originalPrice,
          discount,
          stock,
          description,
          sizes,
          images: [
            "/images/products/product-1-1.jpg", // Default images for demo
            "/images/products/product-1-2.jpg",
          ],
          dateAdded: new Date().toISOString().split("T")[0],
        }

        // In a real app, we would upload images and update the URLs
        const image1Input = document.getElementById("product-image-1")
        const image2Input = document.getElementById("product-image-2")

        if (image1Input.files && image1Input.files[0]) {
          // This is a simplified approach for demo purposes
          newProduct.images[0] = URL.createObjectURL(image1Input.files[0])
        }

        if (image2Input.files && image2Input.files[0]) {
          newProduct.images[1] = URL.createObjectURL(image2Input.files[0])
        }

        products.push(newProduct)
      }

      // Save updated products to localStorage
      localStorage.setItem("products", JSON.stringify(products))

      // Close the modal
      productModal.style.display = "none"

      // Show success message
      const action = window.productState.editingProductId ? "updated" : "added"
      alert(`Product ${action} successfully!`)

      // Reload products data
      loadProductsData()
    })
  }

  // Image upload preview
  const productImage1 = document.getElementById("product-image-1")
  const productImage2 = document.getElementById("product-image-2")

  if (productImage1) {
    productImage1.addEventListener("change", (e) => {
      previewImage(e.target, "image-preview-1")
    })
  }

  if (productImage2) {
    productImage2.addEventListener("change", (e) => {
      previewImage(e.target, "image-preview-2")
    })
  }

  // Search functionality
  const searchInput = document.getElementById("product-search")
  const searchBtn = document.getElementById("search-btn")

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      window.productState.searchTerm = searchInput.value.toLowerCase()
      window.productState.currentPage = 1
      loadProductsData()
    })
  }

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        window.productState.searchTerm = searchInput.value.toLowerCase()
        window.productState.currentPage = 1
        loadProductsData()
      }
    })
  }

  // Filter change events
  const categoryFilter = document.getElementById("category-filter")
  const brandFilter = document.getElementById("brand-filter")
  const sortBy = document.getElementById("sort-by")
  ;[categoryFilter, brandFilter, sortBy].forEach((filter) => {
    if (filter) {
      filter.addEventListener("change", () => {
        window.productState.categoryFilter = categoryFilter.value
        window.productState.brandFilter = brandFilter.value
        window.productState.sortBy = sortBy.value
        window.productState.currentPage = 1
        loadProductsData()
      })
    }
  })

  // Pagination
  const prevPageBtn = document.getElementById("prev-page")
  const nextPageBtn = document.getElementById("next-page")

  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => {
      if (window.productState.currentPage > 1) {
        window.productState.currentPage--
        loadProductsData()
      }
    })
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => {
      if (window.productState.currentPage < window.productState.totalPages) {
        window.productState.currentPage++
        loadProductsData()
      }
    })
  }

  // Delete product functionality
  const deleteModal = document.getElementById("delete-modal")
  const cancelDeleteBtn = document.getElementById("cancel-delete")
  const confirmDeleteBtn = document.getElementById("confirm-delete")
  let productToDelete = null

  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", () => {
      deleteModal.style.display = "none"
    })
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", () => {
      if (productToDelete) {
        // Get products from localStorage
        const products = JSON.parse(localStorage.getItem("products") || "[]")

        // Filter out the product to delete
        const updatedProducts = products.filter((product) => product.id !== productToDelete)

        // Save updated products to localStorage
        localStorage.setItem("products", JSON.stringify(updatedProducts))

        // Close the modal
        deleteModal.style.display = "none"

        // Show success message
        alert("Product deleted successfully!")

        // Reload products data
        loadProductsData()
      }
    })
  }

  // Setup delete and edit product buttons
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn") || e.target.closest(".delete-btn")) {
      const btn = e.target.classList.contains("delete-btn") ? e.target : e.target.closest(".delete-btn")
      productToDelete = btn.getAttribute("data-id")
      deleteModal.style.display = "block"
    }

    if (e.target.classList.contains("edit-btn") || e.target.closest(".edit-btn")) {
      const btn = e.target.classList.contains("edit-btn") ? e.target : e.target.closest(".edit-btn")
      const productId = btn.getAttribute("data-id")

      // Get products from localStorage
      const products = JSON.parse(localStorage.getItem("products") || "[]")

      // Find the product to edit
      const product = products.find((p) => p.id === productId)

      if (product) {
        // Set editing product ID
        window.productState.editingProductId = productId

        // Set form title
        document.getElementById("modal-title").textContent = "Edit Product"

        // Populate form with product data
        document.getElementById("product-name").value = product.name
        document.getElementById("product-brand").value = product.brand
        document.getElementById("product-category").value = product.category
        document.getElementById("product-price").value = product.price
        document.getElementById("product-discount").value = product.discount
        document.getElementById("product-stock").value = product.stock
        document.getElementById("product-description").value = product.description

        // Check size checkboxes
        document.querySelectorAll('input[name="size"]').forEach((checkbox) => {
          checkbox.checked = product.sizes.includes(checkbox.value)
        })

        // Show image previews
        if (product.images && product.images.length > 0) {
          const preview1 = document.getElementById("image-preview-1")
          const preview2 = document.getElementById("image-preview-2")

          // Clear existing previews
          clearImagePreviews()

          // Set image previews
          if (product.images[0]) {
            const img1 = document.createElement("img")
            img1.src = product.images[0]
            preview1.appendChild(img1)
            preview1.querySelector(".upload-label").style.display = "none"
          }

          if (product.images[1]) {
            const img2 = document.createElement("img")
            img2.src = product.images[1]
            preview2.appendChild(img2)
            preview2.querySelector(".upload-label").style.display = "none"
          }
        }

        // Show the modal
        productModal.style.display = "block"
      }
    }
  })
})

function loadProductsData() {
  // Get products from localStorage
  let products = JSON.parse(localStorage.getItem("products") || "[]")

  // Apply filters
  products = filterProducts(products)

  // Apply sorting
  products = sortProducts(products)

  // Calculate pagination
  const { paginatedProducts, totalPages } = paginateProducts(products)

  // Update state
  window.productState.totalPages = totalPages

  // Render products
  renderProducts(paginatedProducts)

  // Update pagination UI
  updatePaginationUI()
}

function filterProducts(products) {
  const { searchTerm, categoryFilter, brandFilter } = window.productState

  return products.filter((product) => {
    // Apply search filter
    if (
      searchTerm &&
      !product.name.toLowerCase().includes(searchTerm) &&
      !product.brand.toLowerCase().includes(searchTerm) &&
      !product.description.toLowerCase().includes(searchTerm)
    ) {
      return false
    }

    // Apply category filter
    if (categoryFilter && product.category !== categoryFilter) {
      return false
    }

    // Apply brand filter
    if (brandFilter && product.brand.toLowerCase() !== brandFilter.toLowerCase()) {
      return false
    }

    return true
  })
}

function sortProducts(products) {
  const { sortBy } = window.productState

  return [...products].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.dateAdded) - new Date(a.dateAdded)
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name-asc":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })
}

function paginateProducts(products) {
  const { currentPage, itemsPerPage } = window.productState

  const totalPages = Math.ceil(products.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage)

  return { paginatedProducts, totalPages }
}

function renderProducts(products) {
  const productsTable = document.getElementById("products-table")

  if (!productsTable) return

  if (products.length === 0) {
    productsTable.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">No products found</td>
      </tr>
    `
    return
  }

  productsTable.innerHTML = products
    .map(
      (product) => `
        <tr>
          <td><img src="${product.images[0]}" alt="${product.name}"></td>
          <td>${product.name}</td>
          <td>${product.brand}</td>
          <td>${product.category}</td>
          <td>
            ${product.price.toLocaleString()} DA
            ${product.discount > 0 ? `<small class="status-badge status-pending">${product.discount}% off</small>` : ""}
          </td>
          <td><span class="status-badge ${getStockClass(product.stock)}">${getStockLabel(product.stock)}</span></td>
          <td>
            <div class="action-buttons">
              <button class="action-btn view-btn" title="View Product"><i class="fas fa-eye"></i></button>
              <button class="action-btn edit-btn" data-id="${product.id}" title="Edit Product"><i class="fas fa-edit"></i></button>
              <button class="action-btn delete-btn" data-id="${product.id}" title="Delete Product"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `,
    )
    .join("")
}

function updatePaginationUI() {
  const { currentPage, totalPages } = window.productState
  const prevPageBtn = document.getElementById("prev-page")
  const nextPageBtn = document.getElementById("next-page")
  const pageInfo = document.getElementById("page-info")

  if (prevPageBtn) {
    prevPageBtn.disabled = currentPage <= 1
  }

  if (nextPageBtn) {
    nextPageBtn.disabled = currentPage >= totalPages
  }

  if (pageInfo) {
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`
  }
}

function getStockClass(stock) {
  if (stock <= 0) return "status-cancelled"
  if (stock < 10) return "status-pending"
  return "status-delivered"
}

function getStockLabel(stock) {
  if (stock <= 0) return "Out of Stock"
  if (stock < 10) return "Low Stock"
  return "In Stock"
}

function previewImage(input, previewId) {
  const preview = document.getElementById(previewId)

  if (input.files && input.files[0]) {
    const reader = new FileReader()

    reader.onload = (e) => {
      // Remove upload label
      const uploadLabel = preview.querySelector(".upload-label")
      if (uploadLabel) {
        uploadLabel.style.display = "none"
      }

      // Check if preview image already exists
      let previewImg = preview.querySelector("img")

      if (!previewImg) {
        // Create new image element
        previewImg = document.createElement("img")
        preview.appendChild(previewImg)
      }

      // Set image source
      previewImg.src = e.target.result
    }

    reader.readAsDataURL(input.files[0])
  }
}

function clearImagePreviews() {
  const previews = document.querySelectorAll(".image-preview")

  previews.forEach((preview) => {
    // Remove any existing images
    const img = preview.querySelector("img")
    if (img) {
      img.remove()
    }

    // Show upload label
    const uploadLabel = preview.querySelector(".upload-label")
    if (uploadLabel) {
      uploadLabel.style.display = "flex"
    }
  })
}
