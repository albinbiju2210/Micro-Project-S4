// JavaScript using AJAX
function loadProducts() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'products.json', true); // Replace 'products.json' with your actual data source

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const products = JSON.parse(xhr.responseText);
                displayProducts(products);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                showErrorMessage();
            }
        } else {
            console.error('Request failed with status:', xhr.status);
            showErrorMessage();
        }
    };

    xhr.onerror = function() {
        console.error('Network error occurred.');
        showErrorMessage();
    };

    xhr.send();
}

function displayProducts(products) {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = ''; // Clear loading message or previous content

    products.forEach(product => {
        // Create a container for the tiles
        const productTilesContainer = document.createElement('div');
        productTilesContainer.classList.add('product-tiles-container');

        // Iterate through the variations in the JSON
        product.variations.forEach(variation => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.classList.add('product-tile'); // Add a class for tile styling

            const img = document.createElement('img');
            img.src = variation.image;
            img.alt = variation.name;

            const h2 = document.createElement('h2');
            h2.textContent = variation.name;

            const p = document.createElement('p');
            p.textContent = variation.description;

            productCard.appendChild(img);
            productCard.appendChild(h2);
            productCard.appendChild(p);

            productTilesContainer.appendChild(productCard); // Append tile to tile container
        });

        productContainer.appendChild(productTilesContainer); // Append tile container to main container
    });
}

function showErrorMessage() {
    document.getElementById('loading-message').style.display = 'none';
    document.getElementById('error-message').style.display = 'block';
}

// Load products when the page loads
window.onload = loadProducts;

document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-tiles');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');
    
    const bannerImages = document.querySelectorAll('.banner-image');
    const bannerDotsContainer = document.getElementById('banner-dots');
    let currentIndex = 0;

    // Create dots for the banner
    bannerImages.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateBanner();
        });
        bannerDotsContainer.appendChild(dot);
    });

    function updateBanner() {
        bannerImages.forEach((img, index) => {
            img.style.display = index === currentIndex ? 'block' : 'none';
        });
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % bannerImages.length; // Move to the next image
        updateBanner();
    }

    // Start the banner rotation every 4 seconds
    setInterval(showNextImage, 4000);

    async function fetchProducts() {
        try {
            const response = await fetch('product.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();
            displayProducts(products);
            loadingMessage.style.display = 'none';
            productContainer.style.display = 'grid';
        } catch (error) {
            console.error('Error fetching products:', error);
            loadingMessage.style.display = 'none';
            errorMessage.style.display = 'block';
        }
    }

    function displayProducts(products) {
        productContainer.innerHTML = ''; // Clear previous content
        products.forEach(product => {
            createProductTile(product);
        });
    }

    function createProductTile(product) {
        const tile = document.createElement('div');
        tile.className = 'product-tile';
        tile.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">$${product.price}</p>
        `;
        productContainer.appendChild(tile);
    }

    // Start loading products
    fetchProducts();
});