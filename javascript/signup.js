document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already logged in
  if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "profile.html"
    return
  } else if (localStorage.getItem("adminLoggedIn") === "true") {
    window.location.href = "admin/dashboard.html"
    return
  }

  const signupForm = document.getElementById("signup-form")

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form values
    const firstName = document.getElementById("first-name").value
    const lastName = document.getElementById("last-name").value
    const email = document.getElementById("email").value
    const phone = document.getElementById("phone").value
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirm-password").value
    const termsChecked = document.getElementById("terms").checked

    // Simple validation
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      alert("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    if (!termsChecked) {
      alert("Please agree to the Terms and Conditions")
      return
    }

    // Check if email already exists
    const existingUserData = JSON.parse(localStorage.getItem("userData") || "{}")
    if (existingUserData.email === email) {
      alert("An account with this email already exists")
      return
    }

    // For demo purposes, store user data in localStorage
    // In a real application, this would be sent to a server
    const userData = {
      firstName,
      lastName,
      email,
      phone,
      // In a real application, never store passwords in localStorage
      // This is just for demo purposes
      password,
    }

    localStorage.setItem("userData", JSON.stringify(userData))
    localStorage.setItem("isLoggedIn", "true")

    // Initialize empty wishlist and addresses
    localStorage.setItem("userWishlist", JSON.stringify([]))
    localStorage.setItem("userAddresses", JSON.stringify([]))

    // Redirect to profile page
    alert("Account created successfully! You are now logged in.")
    window.location.href = "profile.html"
  })
})
