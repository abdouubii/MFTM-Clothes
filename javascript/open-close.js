///////////////////////////////////////
/////////  CART OPEN-CLOSE   //////////
///////////////////////////////////////

let cartIcon = document.querySelector(".cart");
let cartPage = document.querySelector(".cart-page");
let cartClose = document.querySelector(".close-button");

cartIcon.onclick = () => {
  cartPage.classList.add("open-cart");
};

cartClose.onclick = () => {
  cartPage.classList.remove("open-cart");
};

///////////////////////////////////////
/////////  MENU OPEN-CLOSE   //////////
///////////////////////////////////////

let openIcon = document.querySelector(".fa-bars");
let menuPage = document.querySelector(".menu");
let closeIcon = document.querySelector(".fa-xmark");

openIcon.onclick = () => {
  menuPage.classList.add("open-menu");
};

closeIcon.onclick = () => {
  menuPage.classList.remove("open-menu");
};

///////////////////////////////////////
////////  Filter OPEN-CLOSE   /////////
///////////////////////////////////////

let openFilter = document.querySelector(".filter-button");
let filterPage = document.querySelector(".filter");
let closeFilter = document.querySelector(".apply-button");

openFilter.onclick = () => {
  filterPage.classList.add("open-filter");
};

closeFilter.onclick = () => {
  filterPage.classList.remove("open-filter");
};

document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const menuButton = document.querySelector(".fa-bars")
  const closeButton = document.querySelector(".fa-xmark")
  const menu = document.querySelector(".menu")

  if (menuButton) {
    menuButton.addEventListener("click", () => {
      menu.classList.add("active")
    })
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      menu.classList.remove("active")
    })
  }

  // Widget toggles for filters
  const widgets = document.querySelectorAll(".widget")

  widgets.forEach((widget) => {
    const checkbox = widget.querySelector("input[type='checkbox']")
    const label = widget.querySelector("label")

    if (label) {
      label.addEventListener("click", (e) => {
        // Prevent default to avoid checkbox behavior
        e.preventDefault()

        // Toggle the checkbox
        checkbox.checked = !checkbox.checked

        // Toggle the icon rotation
        const icon = label.querySelector("i")
        if (icon) {
          icon.style.transform = checkbox.checked ? "rotate(180deg)" : "rotate(0deg)"
        }
      })
    }
  })
})
