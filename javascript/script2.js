var lastScrollTop = 0;
var navbar = document.getElementById("navbar");
var scrollThreshold = 10;

window.addEventListener("scroll", function () {
    var screenHeight = window.innerHeight;

    if (screenHeight >= 720) {
        navbar.style.top = "0px"; 
        return;
    }

    if (screenHeight <= 598) {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) { 
            navbar.style.top = "-70px"; 
        } else if (scrollTop < lastScrollTop) { 
            navbar.style.top = "0px"; 
        }

        lastScrollTop = scrollTop;
    }
});

///////////////////

const lowerSlider = document.querySelector('#lower');
const upperSlider = document.querySelector('#upper');
const minPrice = document.querySelector('#min-price');
const maxPrice = document.querySelector('#max-price');

lowerSlider.addEventListener('input', updatePrice);
upperSlider.addEventListener('input', updatePrice);

function updatePrice() {
    if (parseInt(lowerSlider.value) > parseInt(upperSlider.value)) {
        lowerSlider.value = upperSlider.value;
    }

    if (parseInt(upperSlider.value) < parseInt(lowerSlider.value)) {
        upperSlider.value = lowerSlider.value;
    }

    const formatPrice = (price) => {
        return price.toLocaleString() + " DA";
    };

    minPrice.textContent = formatPrice(parseInt(lowerSlider.value));
    maxPrice.textContent = formatPrice(parseInt(upperSlider.value));
}