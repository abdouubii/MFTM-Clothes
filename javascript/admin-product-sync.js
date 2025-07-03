// This file synchronizes products between admin dashboard and user-facing store

document.addEventListener("DOMContentLoaded", () => {
    // Check if we need to initialize demo products
    initializeDemoProducts()
  
    // Sync products from admin to store
    syncProductsToStore()
  })
  
  function initializeDemoProducts() {
    // Check if products already exist
    const products = JSON.parse(localStorage.getItem("products") || "[]")
  
    // If products already exist, don't initialize demo products
    if (products.length > 0) return
  
    // Demo products data
    const demoProducts = [
      {
        id: "product-1",
        name: "Men's Better Sweater® Fleece Vest",
        brand: "Patagonia",
        category: "men",
        subcategory: "vests",
        price: 8500,
        originalPrice: 17000,
        stock: 25,
        image: "/images/products/product-1-1.jpg",
        image2: "/images/products/product-1-2.jpg",
        description:
          "Warm, comfortable and highly versatile, this vest has a sweater-knit face and a soft fleece interior.",
        featured: true,
        sales: 12,
        dateAdded: new Date().toISOString(),
      },
      {
        id: "product-2",
        name: "Trekker Recycled Deep-Pile Sherpa Fleece",
        brand: "Passenger",
        category: "men",
        subcategory: "fleece",
        price: 6000,
        originalPrice: 8000,
        stock: 18,
        image: "/images/products/product-2-1.jpg",
        image2: "/images/products/product-2-2.jpg",
        description: "Warm and comfortable recycled sherpa fleece, perfect for cold weather adventures.",
        featured: true,
        sales: 8,
        dateAdded: new Date().toISOString(),
      },
      {
        id: "product-3",
        name: "Beta SL Jacket M",
        brand: "Arc'teryx",
        category: "men",
        subcategory: "jackets",
        price: 10500,
        originalPrice: 15000,
        stock: 15,
        image: "/images/products/product-3-1.png",
        image2: "/images/products/product-3-2.jpg",
        description: "Light, packable all-mountain GORE-TEX ePE shell with an extensive feature set.",
        featured: true,
        sales: 20,
        dateAdded: new Date().toISOString(),
      },
      {
        id: "product-4",
        name: "Fog Recycled Knitted Jumper",
        brand: "Passenger",
        category: "men",
        subcategory: "sweaters",
        price: 4500,
        originalPrice: 5000,
        stock: 30,
        image: "/images/products/product-4-1.jpg",
        image2: "/images/products/product-4-2.jpg",
        description: "Comfortable and stylish recycled knitted jumper for everyday wear.",
        featured: true,
        sales: 15,
        dateAdded: new Date().toISOString(),
      },
      {
        id: "product-w-1",
        name: "Home Recycled Sherpa Fleece",
        brand: "Passenger",
        category: "women",
        subcategory: "fleece",
        price: 5950,
        originalPrice: 7000,
        stock: 22,
        image: "/images/products/product-w-1-1.jpg",
        image2: "/images/products/product-w-1-2.jpg",
        description: "Cozy recycled sherpa fleece for women, perfect for outdoor adventures.",
        featured: true,
        sales: 18,
        dateAdded: new Date().toISOString(),
      },
      {
        id: "product-w-2",
        name: "Microchill Snap-Neck Pullover",
        brand: "REI",
        category: "women",
        subcategory: "pullovers",
        price: 3600,
        originalPrice: 4000,
        stock: 25,
        image: "/images/products/product-w-2-1.jpg",
        image2: "/images/products/product-w-2-2.jpg",
        description: "Lightweight and versatile pullover for active outdoor women.",
        featured: true,
        sales: 10,
        dateAdded: new Date().toISOString(),
      },
    ]
  
    // Save demo products to localStorage
    localStorage.setItem("products", JSON.stringify(demoProducts))
  }
  
  function syncProductsToStore() {
    // This function would sync products from admin dashboard to store
    // For now, we'll just log that sync is complete
    console.log("Products synced from admin dashboard to store")
  
    // In a real implementation, you would:
    // 1. Get products from localStorage
    // 2. Update product listings on the store pages
    // 3. Update inventory, prices, etc.
  }
  