document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form")

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    // Simple validation
    if (!email || !password) {
      alert("Please enter both email and password")
      return
    }

    // Check if user exists in localStorage
    const userData = JSON.parse(localStorage.getItem("userData") || "{}")

    // For demo purposes, also allow admin login
    if (email === "admin@mftm.com" && password === "admin123") {
      localStorage.setItem("adminLoggedIn", "true")
      localStorage.setItem("adminName", "Admin User")
      window.location.href = "admin/dashboard.html"
      return
    }

    // Check user credentials
    if (userData.email === email && userData.password === password) {
      localStorage.setItem("isLoggedIn", "true")
      window.location.href = "index.html"
    } else {
      alert("Invalid email or password")
    }
  })
})
