var copy = document.querySelector(".logos-slide").cloneNode(true);
document.querySelector(".logos").appendChild(copy);

//////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    const productContainers = document.querySelectorAll('.product-container');
    const productNavigations = document.querySelectorAll('.product-navigation');

    productContainers.forEach((container, index) => {
        const preBtn = productNavigations[index].querySelector('.pre-btn');
        const nxtBtn = productNavigations[index].querySelector('.nxt-btn');
        const nbrProduct = productNavigations[index].querySelector('.nbr-product');
        const productCards = container.querySelectorAll('.product-card');
        const totalProducts = productCards.length;
        let currentIndex = 0;

        function updateCounter() {
            nbrProduct.textContent = `${currentIndex + 1}/${totalProducts}`;
        }

        preBtn.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
                container.scrollBy({
                    left: -productCards[currentIndex].offsetWidth - 30,
                    behavior: 'smooth'
                });
                updateCounter();
            }
        });

        nxtBtn.addEventListener('click', function() {
            if (currentIndex < totalProducts - 1) {
                currentIndex++;
                container.scrollBy({
                    left: productCards[currentIndex].offsetWidth + 30,
                    behavior: 'smooth'
                });
                updateCounter();
            }
        });

        updateCounter();
    });
});

//////////////////////////////////////////////////////////