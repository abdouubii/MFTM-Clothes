const mainImg = document.querySelector(".main-img");
const thumbnailbImg = document.querySelectorAll(".thumb-img");

const minusBtn = document.querySelector(".minus");
const cartNumber = document.querySelector(".cart-number");
const plusBtn = document.querySelector(".plus");

//////////////////////////////////////

for (let i = 0; i < thumbnailbImg.length; i++) {
  thumbnailbImg[i].addEventListener("click", function () {
    for (let j = 0; j < thumbnailbImg.length; j++) {
      thumbnailbImg[j].classList.remove("active-thumb");
    }
    thumbnailbImg[i].classList.add("active-thumb");

    const thumbnailTag = thumbnailbImg[i].querySelector("img");
    const thumbnailSrc = thumbnailTag.getAttribute("src");
    mainImg.src = thumbnailSrc;
  });
}

////////////////////////////////

let cartCount = 0;

minusBtn.addEventListener("click", function () {
  if (cartCount >= 1) {
    cartCount -= 1;
    cartNumber.textContent = cartCount;
  }
});

plusBtn.addEventListener("click", function () {
  if (cartCount <= 9) {
    cartCount += 1;
    cartNumber.textContent = cartCount;
  }
});

/////////////////
const navCart = document.querySelector(".cart");
const cartBox = document.querySelector(".cart-box");
const emptyCart = document.querySelector(".empty-cart");
const filledCart = document.querySelector(".filled-cart");
const sectionContainer = document.querySelector(".container");

const btnLeft = document.querySelector(".btn-left");
const btnRight = document.querySelector(".btn-right");
const numbercart = document.querySelector(".count-items");
const currPrice = document.querySelector(".current-price"); 
const deleteIcon = document.querySelector(".delete"); 
const navAfter = document.querySelector(".nav-cart-after"); 

let itemsCount = 0;

navCart.addEventListener("click", function () {
  cartBox.classList.toggle("show");
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") cartBox.classList.remove("show");
});

btnRight.addEventListener("click", function () {
  if (cartCount > 0 && itemsCount + cartCount <= 20) {
    itemsCount += cartCount;
    emptyCart.classList.remove("show");
    filledCart.classList.add("show");
    currPrice.textContent = `$${itemsCount * 125}.00`;
    numbercart.textContent = itemsCount;
    navAfter.classList.add("show");
    navAfter.textContent = itemsCount;
  }

  if (itemsCount === 20) {
    navAfter.textContent = "full";
  }
});

deleteIcon.addEventListener("click", function () {
  emptyCart.classList.add("show");
  filledCart.classList.remove("show");
  itemsCount = 0;
  navAfter.classList.remove("show");
});

document.body.addEventListener("click", function (e) {
  if (!cartBox.classList.contains("show")) {
    return;
  }

  const arr = e.path || (e.composedPath && e.composedPath());
  for (let i = 0; i < arr.length; i++) {
    if (
      btnRight === arr[i] ||
      btnLeft === arr[i] ||
      navCart === arr[i] ||
      cartBox === arr[i]
    ) {
      return;
    }
  }

  cartBox.classList.remove("show");
});
