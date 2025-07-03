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
  window.userState = {
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1,
    searchTerm: "",
    roleFilter: "",
    statusFilter: "",
    editingUserId: null,
    actionType: "delete", // delete, block, unblock
  }

  // Load users data
  loadUsersData()

  // Add user button
  const addUserBtn = document.getElementById("add-user-btn")
  const userModal = document.getElementById("user-modal")
  const closeModalBtns = document.querySelectorAll(".close-modal")
  const cancelUserBtn = document.getElementById("cancel-user")

  if (addUserBtn) {
    addUserBtn.addEventListener("click", () => {
      document.getElementById("modal-title").textContent = "Add New User"
      document.getElementById("user-form").reset()
      window.userState.editingUserId = null

      // Show password field as required
      document.getElementById("user-password").required = true
      document.querySelector(".password-hint").style.display = "none"

      userModal.style.display = "block"
    })
  }

  // Close modal buttons
  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      userModal.style.display = "none"
      document.getElementById("delete-modal").style.display = "none"
    })
  })

  // Cancel user button
  if (cancelUserBtn) {
    cancelUserBtn.addEventListener("click", () => {
      userModal.style.display = "none"
    })
  }

  // User form submission
  const userForm = document.getElementById("user-form")

  if (userForm) {
    userForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const name = document.getElementById("user-name").value
      const email = document.getElementById("user-email").value
      const password = document.getElementById("user-password").value
      const phone = document.getElementById("user-phone").value
      const role = document.getElementById("user-role").value
      const status = document.getElementById("user-status").value
      const address = document.getElementById("user-address").value

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      if (window.userState.editingUserId) {
        // Update existing user
        const userIndex = users.findIndex((u) => u.id === window.userState.editingUserId)

        if (userIndex !== -1) {
          const updatedUser = {
            ...users[userIndex],
            name,
            email,
            phone,
            role,
            status,
            address,
          }

          // Update password only if provided
          if (password) {
            updatedUser.password = password
          }

          users[userIndex] = updatedUser
        }
      } else {
        // Check if email already exists
        const emailExists = users.some((user) => user.email === email)
        if (emailExists) {
          alert("A user with this email already exists.")
          return
        }

        // Add new user
        const newUser = {
          id: `u${Date.now()}`, // Generate a unique ID
          name,
          email,
          password, // In a real app, this would be hashed
          phone,
          role,
          status,
          address,
          registered: new Date().toISOString().split("T")[0],
        }

        users.push(newUser)
      }

      // Save updated users to localStorage
      localStorage.setItem("users", JSON.stringify(users))

      // Close the modal
      userModal.style.display = "none"

      // Show success message
      const action = window.userState.editingUserId ? "updated" : "added"
      alert(`User ${action} successfully!`)

      // Reload users data
      loadUsersData()
    })
  }

  // Search functionality
  const searchInput = document.getElementById("user-search")
  const searchBtn = document.getElementById("search-btn")

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      window.userState.searchTerm = searchInput.value.toLowerCase()
      window.userState.currentPage = 1
      loadUsersData()
    })
  }

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        window.userState.searchTerm = searchInput.value.toLowerCase()
        window.userState.currentPage = 1
        loadUsersData()
      }
    })
  }

  // Filter change events
  const roleFilter = document.getElementById("role-filter")
  const statusFilter = document.getElementById("status-filter")
  ;[roleFilter, statusFilter].forEach((filter) => {
    if (filter) {
      filter.addEventListener("change", () => {
        window.userState.roleFilter = roleFilter.value
        window.userState.statusFilter = statusFilter.value
        window.userState.currentPage = 1
        loadUsersData()
      })
    }
  })

  // Pagination
  const prevPageBtn = document.getElementById("prev-page")
  const nextPageBtn = document.getElementById("next-page")

  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => {
      if (window.userState.currentPage > 1) {
        window.userState.currentPage--
        loadUsersData()
      }
    })
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => {
      if (window.userState.currentPage < window.userState.totalPages) {
        window.userState.currentPage++
        loadUsersData()
      }
    })
  }

  // User actions (delete, block, unblock)
  const deleteModal = document.getElementById("delete-modal")
  const cancelDeleteBtn = document.getElementById("cancel-delete")
  const confirmDeleteBtn = document.getElementById("confirm-delete")
  let userToAction = null

  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", () => {
      deleteModal.style.display = "none"
    })
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", () => {
      if (userToAction) {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem("users") || "[]")

        if (window.userState.actionType === "delete") {
          // Filter out the user to delete
          const updatedUsers = users.filter((user) => user.id !== userToAction)
          localStorage.setItem("users", JSON.stringify(updatedUsers))
          alert("User deleted successfully!")
        } else if (window.userState.actionType === "block" || window.userState.actionType === "unblock") {
          // Find the user to update
          const userIndex = users.findIndex((user) => user.id === userToAction)
          if (userIndex !== -1) {
            users[userIndex].status = window.userState.actionType === "block" ? "blocked" : "active"
            localStorage.setItem("users", JSON.stringify(users))
            alert(`User ${window.userState.actionType === "block" ? "blocked" : "unblocked"} successfully!`)
          }
        }

        // Close the modal
        deleteModal.style.display = "none"

        // Reload users data
        loadUsersData()
      }
    })
  }

  // Setup user action buttons
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn") || e.target.closest(".delete-btn")) {
      const btn = e.target.classList.contains("delete-btn") ? e.target : e.target.closest(".delete-btn")
      userToAction = btn.getAttribute("data-id")
      window.userState.actionType = "delete"

      document.getElementById("delete-message").textContent =
        "Are you sure you want to delete this user? This action cannot be undone."
      document.getElementById("confirm-delete").textContent = "Delete"

      deleteModal.style.display = "block"
    }

    if (e.target.classList.contains("block-btn") || e.target.closest(".block-btn")) {
      const btn = e.target.classList.contains("block-btn") ? e.target : e.target.closest(".block-btn")
      userToAction = btn.getAttribute("data-id")
      const userStatus = btn.getAttribute("data-status")

      if (userStatus === "active") {
        window.userState.actionType = "block"
        document.getElementById("delete-message").textContent = "Are you sure you want to block this user?"
        document.getElementById("confirm-delete").textContent = "Block"
      } else {
        window.userState.actionType = "unblock"
        document.getElementById("delete-message").textContent = "Are you sure you want to unblock this user?"
        document.getElementById("confirm-delete").textContent = "Unblock"
      }

      deleteModal.style.display = "block"
    }

    if (e.target.classList.contains("edit-btn") || e.target.closest(".edit-btn")) {
      const btn = e.target.classList.contains("edit-btn") ? e.target : e.target.closest(".edit-btn")
      const userId = btn.getAttribute("data-id")

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // Find the user to edit
      const user = users.find((u) => u.id === userId)

      if (user) {
        // Set editing user ID
        window.userState.editingUserId = userId

        // Set form title
        document.getElementById("modal-title").textContent = "Edit User"

        // Populate form with user data
        document.getElementById("user-name").value = user.name
        document.getElementById("user-email").value = user.email
        document.getElementById("user-phone").value = user.phone
        document.getElementById("user-role").value = user.role
        document.getElementById("user-status").value = user.status
        document.getElementById("user-address").value = user.address || ""

        // Hide password requirement
        document.getElementById("user-password").required = false
        document.querySelector(".password-hint").style.display = "block"

        // Show the modal
        userModal.style.display = "block"
      }
    }
  })
})

function loadUsersData() {
  // Get users from localStorage
  let users = JSON.parse(localStorage.getItem("users") || "[]")

  // Apply filters
  users = filterUsers(users)

  // Calculate pagination
  const { paginatedUsers, totalPages } = paginateUsers(users)

  // Update state
  window.userState.totalPages = totalPages

  // Render users
  renderUsers(paginatedUsers)

  // Update pagination UI
  updatePaginationUI()
}

function filterUsers(users) {
  const { searchTerm, roleFilter, statusFilter } = window.userState

  return users.filter((user) => {
    // Apply search filter
    if (
      searchTerm &&
      !user.name.toLowerCase().includes(searchTerm) &&
      !user.email.toLowerCase().includes(searchTerm) &&
      !user.phone.toLowerCase().includes(searchTerm)
    ) {
      return false
    }

    // Apply role filter
    if (roleFilter && user.role !== roleFilter) {
      return false
    }

    // Apply status filter
    if (statusFilter && user.status !== statusFilter) {
      return false
    }

    return true
  })
}

function paginateUsers(users) {
  const { currentPage, itemsPerPage } = window.userState

  const totalPages = Math.ceil(users.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage)

  return { paginatedUsers, totalPages }
}

function renderUsers(users) {
  const usersTable = document.getElementById("users-table")

  if (!usersTable) return

  if (users.length === 0) {
    usersTable.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">No users found</td>
      </tr>
    `
    return
  }

  // Get orders to count per user
  const orders = JSON.parse(localStorage.getItem("orders") || "[]")

  usersTable.innerHTML = users
    .map((user) => {
      // Count orders for this user
      const userOrders = orders.filter((order) => order.customer.email === user.email).length

      return `
        <tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td><span class="status-badge role-${user.role}">${capitalizeFirstLetter(user.role)}</span></td>
          <td><span class="status-badge status-${user.status}">${capitalizeFirstLetter(user.status)}</span></td>
          <td>${user.registered}</td>
          <td>${userOrders}</td>
          <td>
            <div class="action-buttons">
              <button class="action-btn edit-btn" data-id="${user.id}" title="Edit User"><i class="fas fa-edit"></i></button>
              <button class="action-btn block-btn" data-id="${user.id}" data-status="${user.status}" title="${
                user.status === "active" ? "Block User" : "Unblock User"
              }">
                <i class="fas ${user.status === "active" ? "fa-ban" : "fa-unlock"}"></i>
              </button>
              <button class="action-btn delete-btn" data-id="${user.id}" title="Delete User"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `
    })
    .join("")
}

function updatePaginationUI() {
  const { currentPage, totalPages } = window.userState
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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
