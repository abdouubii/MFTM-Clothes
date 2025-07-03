document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("admin-login-form")
  const errorMessage = document.getElementById("login-error")

  // Check if user is already logged in
  if (localStorage.getItem("adminLoggedIn") === "true") {
    window.location.href = "dashboard.html"
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    // Simple validation
    if (!email || !password) {
      errorMessage.textContent = "Please enter both email and password"
      return
    }

    // For demo purposes, hardcoded admin credentials
    // In a real application, this would be a server request
    if (email === "admin@mftm.com" && password === "admin123") {
      // Store login state
      localStorage.setItem("adminLoggedIn", "true")
      localStorage.setItem("adminName", "Admin User")

      // Redirect to dashboard
      window.location.href = "dashboard.html"
    } else {
      errorMessage.textContent = "Invalid email or password"
    }
  })
})
