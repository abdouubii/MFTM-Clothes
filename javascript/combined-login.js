document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const loginForm = document.getElementById("login-form")
  const errorMessage = document.getElementById("login-error")
  const userTab = document.getElementById("user-tab")
  const adminTab = document.getElementById("admin-tab")
  const loginTitle = document.getElementById("login-title")
  const loginSubtitle = document.getElementById("login-subtitle")
  const socialLogin = document.getElementById("social-login")
  const orDivider = document.querySelector(".or")
  const signupLink = document.getElementById("signup-link")
  const demoAccount = document.getElementById("demo-account")
  const demoAccountAdmin = document.getElementById("demo-account-admin")

  // Check if user is already logged in
  if (localStorage.getItem("adminLoggedIn") === "true") {
    window.location.href = "admin/dashboard.html"
    return
  } else if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "profile.html"
    return
  }

  // Current login mode
  let isAdminLogin = false

  // Tab switching functionality
  userTab.addEventListener("click", () => {
    if (isAdminLogin) {
      switchToUserLogin()
    }
  })

  adminTab.addEventListener("click", () => {
    if (!isAdminLogin) {
      switchToAdminLogin()
    }
  })

  // Switch to user login mode
  function switchToUserLogin() {
    isAdminLogin = false
    userTab.classList.add("active")
    adminTab.classList.remove("active")
    loginTitle.textContent = "User Login"
    loginSubtitle.textContent = "Your Adventure Begins Here!"
    socialLogin.classList.add("active")
    orDivider.classList.add("active")
    signupLink.style.display = "block"
    demoAccount.style.display = "block"
    errorMessage.textContent = ""
  }

  // Switch to admin login mode
  function switchToAdminLogin() {
    isAdminLogin = true
    adminTab.classList.add("active")
    userTab.classList.remove("active")
    loginTitle.textContent = "Admin Login"
    loginSubtitle.textContent = "Manage Your Mountain Business"
    socialLogin.classList.remove("active")
    orDivider.classList.remove("active")
    signupLink.style.display = "none"
    demoAccount.style.display = "none"
    demoAccountAdmin.style.display = "block"
    errorMessage.textContent = ""
  }

  // Form submission
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    // Simple validation
    if (!email || !password) {
      errorMessage.textContent = "Please enter both email and password"
      return
    }

    if (isAdminLogin) {
      // Admin login logic
      if (email === "admin@mftm.com" && password === "admin123") {
        // Store login state
        localStorage.setItem("adminLoggedIn", "true")
        localStorage.setItem("adminName", "Admin User")

        // Redirect to dashboard
        window.location.href = "admin/dashboard.html"
      } else {
        errorMessage.textContent = "Invalid admin credentials"
      }
    } else {
      // User login logic
      // Check for demo user
      if (email === "user@mftm.com" && password === "user1234") {
        // Create demo user data if it doesn't exist
        if (!localStorage.getItem("userData")) {
          const demoUserData = {
            firstName: "Demo",
            lastName: "User",
            email: "user@mftm.com",
            phone: "+213 555 987 654",
            password: "user123",
          }
          localStorage.setItem("userData", JSON.stringify(demoUserData))
        }

        localStorage.setItem("isLoggedIn", "true")
        window.location.href = "profile.html"
        return
      }

      // Check if user exists in localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}")

      // Check user credentials
      if (userData.email === email && userData.password === password) {
        localStorage.setItem("isLoggedIn", "true")
        window.location.href = "profile.html"
      } else {
        errorMessage.textContent = "Invalid email or password"
      }
    }
  })

  // Initialize social login buttons to prevent form submission
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault()
      alert("Social login is not implemented in this demo")
    })
  })
})
