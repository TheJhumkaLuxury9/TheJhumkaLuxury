// Product filtering and sorting functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeFiltering();
    initializeSorting();
});

function initializeFiltering() {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    filterContainer.innerHTML = `
        <div class="filter-group">
            <label>Price Range:</label>
            <select id="priceFilter">
                <option value="all">All Prices</option>
                <option value="0-500">Under 500 NOK</option>
                <option value="500-1000">500 - 1000 NOK</option>
                <option value="1000+">Over 1000 NOK</option>
            </select>
        </div>
        <div class="filter-group">
            <label>Style:</label>
            <select id="styleFilter">
                <option value="all">All Styles</option>
                <option value="traditional">Traditional</option>
                <option value="modern">Modern</option>
                <option value="temple">Temple Style</option>
            </select>
        </div>
    `;

    const productsSection = document.querySelector('.products');
    productsSection.insertBefore(filterContainer, productsSection.firstChild);

    // Event listeners for filters
    document.getElementById('priceFilter').addEventListener('change', applyFilters);
    document.getElementById('styleFilter').addEventListener('change', applyFilters);
}

function initializeSorting() {
    const sortContainer = document.createElement('div');
    sortContainer.className = 'sort-container';
    sortContainer.innerHTML = `
        <label>Sort By:</label>
        <select id="sortSelect">
            <option value="default">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
        </select>
    `;

    const filterContainer = document.querySelector('.filter-container');
    filterContainer.appendChild(sortContainer);

    document.getElementById('sortSelect').addEventListener('change', applySort);
}

function applyFilters() {
    const priceFilter = document.getElementById('priceFilter').value;
    const styleFilter = document.getElementById('styleFilter').value;
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        const price = parseInt(product.querySelector('.price-tag').textContent);
        const style = product.dataset.style || 'traditional'; // Default to traditional if not set

        let showProduct = true;

        // Apply price filter
        if (priceFilter !== 'all') {
            const [min, max] = priceFilter.split('-').map(num => num === '+' ? Infinity : Number(num));
            if (price < min || price >= max) showProduct = false;
        }

        // Apply style filter
        if (styleFilter !== 'all' && style !== styleFilter) {
            showProduct = false;
        }

        product.style.display = showProduct ? 'block' : 'none';
    });
}

function applySort() {
    const sortValue = document.getElementById('sortSelect').value;
    const productsContainer = document.querySelector('.products');
    const products = Array.from(document.querySelectorAll('.product-card'));

    products.sort((a, b) => {
        switch (sortValue) {
            case 'price-low':
                return getPriceFromCard(a) - getPriceFromCard(b);
            case 'price-high':
                return getPriceFromCard(b) - getPriceFromCard(a);
            case 'name':
                return getNameFromCard(a).localeCompare(getNameFromCard(b));
            default:
                return 0;
        }
    });

    products.forEach(product => productsContainer.appendChild(product));
}

function getPriceFromCard(card) {
    return parseInt(card.querySelector('.price-tag').textContent);
}

function getNameFromCard(card) {
    return card.querySelector('.product-title').textContent;
}

// Add search functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="searchInput" placeholder="Search products...">
    `;

    const filterContainer = document.querySelector('.filter-container');
    filterContainer.insertBefore(searchContainer, filterContainer.firstChild);

    document.getElementById('searchInput').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const products = document.querySelectorAll('.product-card');

        products.forEach(product => {
            const title = product.querySelector('.product-title').textContent.toLowerCase();
            const description = product.querySelector('.product-description').textContent.toLowerCase();
            const shouldShow = title.includes(searchTerm) || description.includes(searchTerm);
            product.style.display = shouldShow ? 'block' : 'none';
        });
    });
});