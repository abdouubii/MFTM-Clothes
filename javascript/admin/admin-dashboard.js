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

  // Initialize data if not exists
  initializeData()

  // Load dashboard data
  loadDashboardData()
})

function initializeData() {
  // Initialize products if not exists
  if (!localStorage.getItem("products")) {
    const initialProducts = [
      {
        id: "p1",
        name: "Men's Better Sweater® Fleece Vest",
        brand: "Patagonia",
        category: "jacket",
        price: 8500,
        originalPrice: 17000,
        discount: 50,
        stock: 15,
        description:
          "Warm, comfortable and highly functional, this vest has a soft fleece interior and a resilient sweater-knit face that refuses to compromise.",
        sizes: ["S", "M", "L", "XL"],
        images: ["/images/products/product-1-1.jpg", "/images/products/product-1-2.jpg"],
        dateAdded: "2025-04-15",
      },
      {
        id: "p2",
        name: "Trekker Recycled Deep-Pile Sherpa Fleece",
        brand: "Passenger",
        category: "hoodies",
        price: 6000,
        originalPrice: 8000,
        discount: 25,
        stock: 8,
        description:
          "Made from recycled polyester, this deep-pile sherpa fleece is perfect for cold weather adventures.",
        sizes: ["S", "M", "L"],
        images: ["/images/products/product-2-1.jpg", "/images/products/product-2-2.jpg"],
        dateAdded: "2025-04-18",
      },
      {
        id: "p3",
        name: "Beta SL Jacket M",
        brand: "Arc'teryx",
        category: "jacket",
        price: 10500,
        originalPrice: 15000,
        discount: 30,
        stock: 12,
        description: "Lightweight and packable waterproof shell for emergency weather protection in the mountains.",
        sizes: ["M", "L", "XL"],
        images: ["/images/products/product-3-1.png", "/images/products/product-3-2.png"],
        dateAdded: "2025-04-20",
      },
      {
        id: "p4",
        name: "Fog Recycled Knitted Jumper",
        brand: "Passenger",
        category: "hoodies",
        price: 4500,
        originalPrice: 5000,
        discount: 10,
        stock: 20,
        description: "A comfortable and stylish jumper made from recycled materials.",
        sizes: ["S", "M", "L", "XL"],
        images: ["/images/products/product-4-1.jpg", "/images/products/product-4-2.jpg"],
        dateAdded: "2025-04-22",
      },
      {
        id: "p5",
        name: "Mountain Backpack 30L",
        brand: "The North Face",
        category: "backpacks",
        price: 7200,
        originalPrice: 9000,
        discount: 20,
        stock: 5,
        description: "Durable 30L backpack perfect for day hikes and short adventures.",
        sizes: ["One Size"],
        images: ["/images/products/product-1-1.jpg", "/images/products/product-1-2.jpg"],
        dateAdded: "2025-04-25",
      },
      {
        id: "p6",
        name: "Hiking Pants Pro",
        brand: "Columbia",
        category: "pants",
        price: 5800,
        originalPrice: 7000,
        discount: 17,
        stock: 0,
        description: "Lightweight, quick-drying pants with UV protection for hiking and outdoor activities.",
        sizes: ["S", "M", "L"],
        images: ["/images/products/product-2-1.jpg", "/images/products/product-2-2.jpg"],
        dateAdded: "2025-04-28",
      },
    ]

    localStorage.setItem("products", JSON.stringify(initialProducts))
  }

  // Initialize orders if not exists
  if (!localStorage.getItem("orders")) {
    const initialOrders = [
      {
        id: "ORD-2025",
        customer: {
          name: "Ahmed Benali",
          email: "ahmed.benali@example.com",
          phone: "+213 555 123 456",
        },
        date: "2025-05-02",
        status: "delivered",
        items: [
          {
            productId: "p3",
            name: "Beta SL Jacket M",
            price: 10500,
            size: "M",
            quantity: 1,
            image: "/images/products/product-3-1.png",
          },
          {
            productId: "p2",
            name: "Trekker Recycled Deep-Pile Sherpa Fleece",
            price: 6000,
            size: "L",
            quantity: 1,
            image: "/images/products/product-2-1.jpg",
          },
        ],
        shipping: 500,
        shippingAddress: "123 Mountain View, Algiers, 16000, Algeria",
        paymentMethod: "Credit Card",
        paymentStatus: "Paid",
      },
      {
        id: "ORD-2024",
        customer: {
          name: "Sara Mansouri",
          email: "sara.mansouri@example.com",
          phone: "+213 555 234 567",
        },
        date: "2025-05-02",
        status: "shipped",
        items: [
          {
            productId: "p1",
            name: "Men's Better Sweater® Fleece Vest",
            price: 8500,
            size: "M",
            quantity: 1,
            image: "/images/products/product-1-1.jpg",
          },
        ],
        shipping: 500,
        shippingAddress: "45 Coastal Road, Oran, 31000, Algeria",
        paymentMethod: "PayPal",
        paymentStatus: "Paid",
      },
      {
        id: "ORD-2023",
        customer: {
          name: "Karim Hadj",
          email: "karim.hadj@example.com",
          phone: "+213 555 345 678",
        },
        date: "2025-05-01",
        status: "processing",
        items: [
          {
            productId: "p4",
            name: "Fog Recycled Knitted Jumper",
            price: 4500,
            size: "L",
            quantity: 2,
            image: "/images/products/product-4-1.jpg",
          },
          {
            productId: "p5",
            name: "Mountain Backpack 30L",
            price: 7200,
            size: "One Size",
            quantity: 1,
            image: "/images/products/product-1-1.jpg",
          },
        ],
        shipping: 500,
        shippingAddress: "78 Desert Avenue, Tamanrasset, 11000, Algeria",
        paymentMethod: "Credit Card",
        paymentStatus: "Paid",
      },
      {
        id: "ORD-2022",
        customer: {
          name: "Leila Bouaziz",
          email: "leila.bouaziz@example.com",
          phone: "+213 555 456 789",
        },
        date: "2025-05-01",
        status: "pending",
        items: [
          {
            productId: "p3",
            name: "Beta SL Jacket M",
            price: 10500,
            size: "L",
            quantity: 1,
            image: "/images/products/product-3-1.png",
          },
        ],
        shipping: 500,
        shippingAddress: "12 Mountain Street, Constantine, 25000, Algeria",
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Pending",
      },
      {
        id: "ORD-2021",
        customer: {
          name: "Omar Taleb",
          email: "omar.taleb@example.com",
          phone: "+213 555 567 890",
        },
        date: "2025-04-30",
        status: "cancelled",
        items: [
          {
            productId: "p2",
            name: "Trekker Recycled Deep-Pile Sherpa Fleece",
            price: 6000,
            size: "M",
            quantity: 1,
            image: "/images/products/product-2-1.jpg",
          },
          {
            productId: "p6",
            name: "Hiking Pants Pro",
            price: 5800,
            size: "M",
            quantity: 1,
            image: "/images/products/product-2-1.jpg",
          },
        ],
        shipping: 500,
        shippingAddress: "34 Coastal Boulevard, Annaba, 23000, Algeria",
        paymentMethod: "Credit Card",
        paymentStatus: "Refunded",
      },
    ]

    localStorage.setItem("orders", JSON.stringify(initialOrders))
  }

  // Initialize users if not exists
  if (!localStorage.getItem("users")) {
    const initialUsers = [
      {
        id: "u1",
        name: "Admin User",
        email: "admin@mftm.com",
        password: "admin123", // In a real app, this would be hashed
        phone: "+213 555 111 222",
        role: "admin",
        status: "active",
        registered: "2025-01-01",
        address: "MFTM Headquarters, Algiers, Algeria",
      },
      {
        id: "u2",
        name: "Ahmed Benali",
        email: "ahmed.benali@example.com",
        password: "user123", // In a real app, this would be hashed
        phone: "+213 555 123 456",
        role: "client",
        status: "active",
        registered: "2025-04-15",
        address: "123 Mountain View, Algiers, 16000, Algeria",
      },
      {
        id: "u3",
        name: "Sara Mansouri",
        email: "sara.mansouri@example.com",
        password: "user123", // In a real app, this would be hashed
        phone: "+213 555 234 567",
        role: "client",
        status: "active",
        registered: "2025-04-18",
        address: "45 Coastal Road, Oran, 31000, Algeria",
      },
      {
        id: "u4",
        name: "Karim Hadj",
        email: "karim.hadj@example.com",
        password: "user123", // In a real app, this would be hashed
        phone: "+213 555 345 678",
        role: "client",
        status: "active",
        registered: "2025-04-20",
        address: "78 Desert Avenue, Tamanrasset, 11000, Algeria",
      },
      {
        id: "u5",
        name: "Leila Bouaziz",
        email: "leila.bouaziz@example.com",
        password: "user123", // In a real app, this would be hashed
        phone: "+213 555 456 789",
        role: "client",
        status: "blocked",
        registered: "2025-04-10",
        address: "12 Mountain Street, Constantine, 25000, Algeria",
      },
      {
        id: "u6",
        name: "Marketing Manager",
        email: "marketing@mftm.com",
        password: "admin123", // In a real app, this would be hashed
        phone: "+213 555 222 333",
        role: "admin",
        status: "active",
        registered: "2025-02-15",
        address: "MFTM Marketing Office, Algiers, Algeria",
      },
    ]

    localStorage.setItem("users", JSON.stringify(initialUsers))
  }
}

function loadDashboardData() {
  // Get data from localStorage
  const products = JSON.parse(localStorage.getItem("products") || "[]")
  const orders = JSON.parse(localStorage.getItem("orders") || "[]")
  const users = JSON.parse(localStorage.getItem("users") || "[]").filter((user) => user.role === "client")

  // Calculate total revenue
  const totalRevenue = orders.reduce((total, order) => {
    // Only count delivered, shipped, and processing orders
    if (["delivered", "shipped", "processing"].includes(order.status)) {
      const orderTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + (order.shipping || 0)
      return total + orderTotal
    }
    return total
  }, 0)

  // Update stats
  document.getElementById("total-products").textContent = products.length
  document.getElementById("total-orders").textContent = orders.length
  document.getElementById("total-users").textContent = users.length
  document.getElementById("total-revenue").textContent = `${totalRevenue.toLocaleString()} DA`

  // Load recent orders
  loadRecentOrders(orders.slice(0, 5))

  // Load recent products
  loadRecentProducts(products.slice(0, 4))
}

function loadRecentOrders(recentOrders) {
  const recentOrdersTable = document.getElementById("recent-orders-table")
  if (!recentOrdersTable) return

  recentOrdersTable.innerHTML = recentOrders
    .map(
      (order) => `
        <tr>
          <td>${order.id}</td>
          <td>${order.customer.name}</td>
          <td>${order.date}</td>
          <td><span class="status-badge status-${order.status}">${capitalizeFirstLetter(order.status)}</span></td>
          <td>${calculateOrderTotal(order).toLocaleString()} DA</td>
        </tr>
      `,
    )
    .join("")
}

function loadRecentProducts(recentProducts) {
  const recentProductsGrid = document.getElementById("recent-products-grid")
  if (!recentProductsGrid) return

  recentProductsGrid.innerHTML = recentProducts
    .map(
      (product) => `
        <div class="product-card">
          <div class="product-image">
            <img src="${product.images[0]}" alt="${product.name}">
          </div>
          <div class="product-info">
            <div class="product-brand">${product.brand}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">
              <span class="price">${product.price.toLocaleString()} DA</span>
              <span class="stock ${getStockClass(product.stock)}">${getStockLabel(product.stock)}</span>
            </div>
          </div>
        </div>
      `,
    )
    .join("")
}

function calculateOrderTotal(order) {
  const itemsTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return itemsTotal + (order.shipping || 0)
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function getStockClass(stock) {
  if (stock <= 0) return "out-of-stock"
  if (stock < 10) return "low-stock"
  return "in-stock"
}

function getStockLabel(stock) {
  if (stock <= 0) return "Out of Stock"
  if (stock < 10) return "Low Stock"
  return "In Stock"
}
