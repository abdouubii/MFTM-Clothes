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
  window.orderState = {
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1,
    searchTerm: "",
    statusFilter: "",
    dateFilter: "",
    currentOrderId: null,
  }

  // Load orders data
  loadOrdersData()

  // Order modal
  const orderModal = document.getElementById("order-modal")
  const closeModalBtns = document.querySelectorAll(".close-modal")

  // Close modal buttons
  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      orderModal.style.display = "none"
    })
  })

  // Search functionality
  const searchInput = document.getElementById("order-search")
  const searchBtn = document.getElementById("search-btn")

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      window.orderState.searchTerm = searchInput.value.toLowerCase()
      window.orderState.currentPage = 1
      loadOrdersData()
    })
  }

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        window.orderState.searchTerm = searchInput.value.toLowerCase()
        window.orderState.currentPage = 1
        loadOrdersData()
      }
    })
  }

  // Filter change events
  const statusFilter = document.getElementById("status-filter")
  const dateFilter = document.getElementById("date-filter")
  ;[statusFilter, dateFilter].forEach((filter) => {
    if (filter) {
      filter.addEventListener("change", () => {
        window.orderState.statusFilter = statusFilter.value
        window.orderState.dateFilter = dateFilter.value
        window.orderState.currentPage = 1
        loadOrdersData()
      })
    }
  })

  // Pagination
  const prevPageBtn = document.getElementById("prev-page")
  const nextPageBtn = document.getElementById("next-page")

  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => {
      if (window.orderState.currentPage > 1) {
        window.orderState.currentPage--
        loadOrdersData()
      }
    })
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => {
      if (window.orderState.currentPage < window.orderState.totalPages) {
        window.orderState.currentPage++
        loadOrdersData()
      }
    })
  }

  // Export orders button
  const exportOrdersBtn = document.getElementById("export-orders-btn")

  if (exportOrdersBtn) {
    exportOrdersBtn.addEventListener("click", () => {
      exportOrders()
    })
  }

  // Update order status
  const saveStatusBtn = document.getElementById("save-status")

  if (saveStatusBtn) {
    saveStatusBtn.addEventListener("click", () => {
      const status = document.getElementById("update-status").value

      if (window.orderState.currentOrderId) {
        // Get orders from localStorage
        const orders = JSON.parse(localStorage.getItem("orders") || "[]")

        // Find the order to update
        const orderIndex = orders.findIndex((order) => order.id === window.orderState.currentOrderId)

        if (orderIndex !== -1) {
          // Update order status
          orders[orderIndex].status = status

          // Save updated orders to localStorage
          localStorage.setItem("orders", JSON.stringify(orders))

          // Show success message
          alert("Order status updated successfully!")

          // Close the modal
          orderModal.style.display = "none"

          // Reload orders data
          loadOrdersData()
        }
      }
    })
  }

  // Setup view order buttons
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("view-btn") || e.target.closest(".view-btn")) {
      const btn = e.target.classList.contains("view-btn") ? e.target : e.target.closest(".view-btn")
      const orderId = btn.getAttribute("data-id")

      // Set current order ID
      window.orderState.currentOrderId = orderId

      // Load order details
      loadOrderDetails(orderId)

      // Show the modal
      orderModal.style.display = "block"
    }
  })
})

function loadOrdersData() {
  // Get orders from localStorage
  let orders = JSON.parse(localStorage.getItem("orders") || "[]")

  // Apply filters
  orders = filterOrders(orders)

  // Calculate pagination
  const { paginatedOrders, totalPages } = paginateOrders(orders)

  // Update state
  window.orderState.totalPages = totalPages

  // Render orders
  renderOrders(paginatedOrders)

  // Update pagination UI
  updatePaginationUI()
}

function filterOrders(orders) {
  const { searchTerm, statusFilter, dateFilter } = window.orderState

  return orders.filter((order) => {
    // Apply search filter
    if (
      searchTerm &&
      !order.id.toLowerCase().includes(searchTerm) &&
      !order.customer.name.toLowerCase().includes(searchTerm) &&
      !order.customer.email.toLowerCase().includes(searchTerm)
    ) {
      return false
    }

    // Apply status filter
    if (statusFilter && order.status !== statusFilter) {
      return false
    }

    // Apply date filter
    if (dateFilter) {
      const orderDate = new Date(order.date)
      const today = new Date()
      const weekAgo = new Date()
      weekAgo.setDate(today.getDate() - 7)
      const monthAgo = new Date()
      monthAgo.setMonth(today.getMonth() - 1)
      const yearAgo = new Date()
      yearAgo.setFullYear(today.getFullYear() - 1)

      if (
        (dateFilter === "today" && !isSameDay(orderDate, today)) ||
        (dateFilter === "week" && orderDate < weekAgo) ||
        (dateFilter === "month" && orderDate < monthAgo) ||
        (dateFilter === "year" && orderDate < yearAgo)
      ) {
        return false
      }
    }

    return true
  })
}

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function paginateOrders(orders) {
  const { currentPage, itemsPerPage } = window.orderState

  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage)

  return { paginatedOrders, totalPages }
}

function renderOrders(orders) {
  const ordersTable = document.getElementById("orders-table")

  if (!ordersTable) return

  if (orders.length === 0) {
    ordersTable.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">No orders found</td>
      </tr>
    `
    return
  }

  ordersTable.innerHTML = orders
    .map(
      (order) => `
        <tr>
          <td>${order.id}</td>
          <td>${order.customer.name}</td>
          <td>${order.date}</td>
          <td><span class="status-badge status-${order.status}">${capitalizeFirstLetter(order.status)}</span></td>
          <td>${order.items.length}</td>
          <td>${calculateOrderTotal(order).toLocaleString()} DA</td>
          <td>
            <div class="action-buttons">
              <button class="action-btn view-btn" data-id="${order.id}" title="View Order"><i class="fas fa-eye"></i></button>
            </div>
          </td>
        </tr>
      `,
    )
    .join("")
}

function updatePaginationUI() {
  const { currentPage, totalPages } = window.orderState
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

function loadOrderDetails(orderId) {
  // Get orders from localStorage
  const orders = JSON.parse(localStorage.getItem("orders") || "[]")

  // Find the order
  const order = orders.find((o) => o.id === orderId)

  if (!order) return

  // Set order ID and date
  document.getElementById("detail-order-id").textContent = order.id
  document.getElementById("detail-order-date").textContent = order.date

  // Set customer info
  document.getElementById("detail-customer-name").textContent = order.customer.name
  document.getElementById("detail-customer-email").textContent = order.customer.email
  document.getElementById("detail-customer-phone").textContent = order.customer.phone

  // Set shipping address
  document.getElementById("detail-shipping-address").textContent = order.shippingAddress

  // Set payment info
  document.getElementById("detail-payment-method").textContent = order.paymentMethod
  document.getElementById("detail-payment-status").textContent = order.paymentStatus

  // Set order status
  document.getElementById("update-status").value = order.status

  // Set order items
  const orderItems = order.items
  document.getElementById("detail-order-items").innerHTML = orderItems
    .map(
      (item) => `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px;">
              <span>${item.name}</span>
            </div>
          </td>
          <td>${item.size}</td>
          <td>${item.price.toLocaleString()} DA</td>
          <td>${item.quantity}</td>
          <td>${(item.price * item.quantity).toLocaleString()} DA</td>
        </tr>
      `,
    )
    .join("")

  // Calculate and set order summary
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = order.shipping || 0
  const total = subtotal + shipping

  document.getElementById("detail-subtotal").textContent = `${subtotal.toLocaleString()} DA`
  document.getElementById("detail-shipping").textContent = `${shipping.toLocaleString()} DA`
  document.getElementById("detail-total").textContent = `${total.toLocaleString()} DA`
}

function calculateOrderTotal(order) {
  const itemsTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return itemsTotal + (order.shipping || 0)
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function exportOrders() {
  // Get orders from localStorage
  const orders = JSON.parse(localStorage.getItem("orders") || "[]")

  // Create CSV content
  let csvContent = "Order ID,Customer,Date,Status,Items,Total\n"

  orders.forEach((order) => {
    const total = calculateOrderTotal(order)
    csvContent += `${order.id},${order.customer.name},${order.date},${order.status},${
      order.items.length
    },${total.toLocaleString()} DA\n`
  })

  // Create a blob and download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", "orders.csv")
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}