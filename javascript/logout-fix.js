// This is a special script to force clear the login state
// Add this to your page temporarily if you're still having issues

document.addEventListener("DOMContentLoaded", () => {
    console.log("Logout fix script loaded")
  
    // Clear all login-related localStorage items
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("adminLoggedIn")
  
    console.log("Login state cleared")
  
    // Add a manual logout button to the page
    const logoutFixBtn = document.createElement("button")
    logoutFixBtn.textContent = "Force Logout"
    logoutFixBtn.style.position = "fixed"
    logoutFixBtn.style.bottom = "20px"
    logoutFixBtn.style.right = "20px"
    logoutFixBtn.style.zIndex = "9999"
    logoutFixBtn.style.padding = "10px 20px"
    logoutFixBtn.style.backgroundColor = "#f44336"
    logoutFixBtn.style.color = "white"
    logoutFixBtn.style.border = "none"
    logoutFixBtn.style.borderRadius = "5px"
    logoutFixBtn.style.cursor = "pointer"
  
    logoutFixBtn.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("adminLoggedIn")
      alert("Logged out successfully!")
      window.location.href = "login.html"
    })
  
    document.body.appendChild(logoutFixBtn)
  })
  