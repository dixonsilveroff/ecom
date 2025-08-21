// Product Filtering and Search
class ProductFiltering {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentFilters = {
            search: '',
            category: '',
            priceRange: '',
            sortBy: 'name'
        };
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupEventListeners();
        this.displayProducts();
    }

    async loadProducts() {
        try {
            const response = await fetch('../data/products.json');
            const data = await response.json();
            this.products = data.products;
            this.filteredProducts = [...this.products];
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = [];
            this.filteredProducts = [];
        }
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.applyFilters();
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.applyFilters();
            });
        }

        // Price filter
        const priceFilter = document.getElementById('priceFilter');
        if (priceFilter) {
            priceFilter.addEventListener('change', (e) => {
                this.currentFilters.priceRange = e.target.value;
                this.applyFilters();
            });
        }

        // Sort select
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentFilters.sortBy = e.target.value;
                this.applyFilters();
            });
        }

        // Clear filters button
        const clearFiltersBtn = document.getElementById('clearFilters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // Reset search button
        const resetSearchBtn = document.getElementById('resetSearch');
        if (resetSearchBtn) {
            resetSearchBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search.toLowerCase();
                const productText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
                if (!productText.includes(searchTerm)) {
                    return false;
                }
            }

            // Category filter
            if (this.currentFilters.category && product.category !== this.currentFilters.category) {
                return false;
            }

            // Price range filter
            if (this.currentFilters.priceRange) {
                const [min, max] = this.parsePriceRange(this.currentFilters.priceRange);
                if (product.price < min || (max !== Infinity && product.price > max)) {
                    return false;
                }
            }

            return true;
        });

        // Apply sorting
        this.sortProducts();

        // Display results
        this.displayProducts();
    }

    parsePriceRange(priceRange) {
        if (priceRange === '1000+') {
            return [1000, Infinity];
        }
        
        const [min, max] = priceRange.split('-').map(Number);
        return [min, max];
    }

    sortProducts() {
        switch (this.currentFilters.sortBy) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
            default:
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }

    displayProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const featuredProducts = document.getElementById('featuredProducts');
        const resultsCount = document.getElementById('resultsCount');
        const noResults = document.getElementById('noResults');

        if (!productsGrid && !featuredProducts) return;

        const targetContainer = productsGrid || featuredProducts;
        const productsToShow = productsGrid ? this.filteredProducts : this.getFeaturedProducts();

        // Update results count
        if (resultsCount) {
            resultsCount.textContent = productsToShow.length;
        }

        // Show/hide no results message
        if (noResults) {
            noResults.style.display = productsToShow.length === 0 ? 'block' : 'none';
        }

        // Clear existing products
        targetContainer.innerHTML = '';

        // Display products
        productsToShow.forEach(product => {
            const productElement = this.createProductElement(product);
            targetContainer.appendChild(productElement);
        });
    }

    getFeaturedProducts() {
        return this.products.filter(product => product.featured).slice(0, 4);
    }

    createProductElement(product) {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-card';
        const discount = product.originalPrice > product.price;
        const discountPercentage = discount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
        productDiv.innerHTML = `
            <div class="product-image" style="background: url(${product.image}); background-repeat: round;">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <span class="stars">${'\u2b50'.repeat(Math.floor(product.rating))}</span>
                    <span class="rating-text">${product.rating} (${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${discount ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                    <button class="btn btn-secondary view-details" onclick="window.productFiltering.viewProductDetails('${product.id}')">
                        View Details
                    </button>
                </div>
            </div>
        `;
        return productDiv;
    }

    viewProductDetails(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            // For now, just log the product details
            // In a real implementation, this would open a modal or navigate to a product page
            console.log('Product details:', product);
            
            // You could implement a modal here
            this.showProductModal(product);
        }
    }

    showProductModal(product) {
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'product-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <div class="modal-body">
                        <div class="product-modal-image">
                            <img src="${product.image}" alt="${product.name}" style="width:120px;height:120px;object-fit:contain;" />
                        </div>
                        <div class="product-modal-info">
                            <h2>${product.name}</h2>
                            <p class="product-description">${product.description}</p>
                            <div class="product-features">
                                <h4>Key Features:</h4>
                                <ul>
                                    ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="product-price">
                                <span class="current-price">$${product.price.toFixed(2)}</span>
                                ${product.originalPrice > product.price ? 
                                    `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                            </div>
                            <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .product-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
            }
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
            }
            .modal-content {
                background-color: white;
                border-radius: 12px;
                max-width: 800px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            }
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: #666;
            }
            .modal-body {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                padding: 2rem;
            }
            .product-emoji-large {
                font-size: 8rem;
                display: block;
                text-align: center;
            }
            .product-features ul {
                list-style: none;
                padding: 0;
            }
            .product-features li {
                padding: 0.5rem 0;
                border-bottom: 1px solid #eee;
            }
            .product-features li:before {
                content: "✓";
                color: #28a745;
                font-weight: bold;
                margin-right: 0.5rem;
            }
            @media (max-width: 768px) {
                .modal-body {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);

        // Add to page
        document.body.appendChild(modal);

        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        closeBtn.addEventListener('click', () => modal.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) modal.remove();
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') modal.remove();
        });
    }

    clearFilters() {
        this.currentFilters = {
            search: '',
            category: '',
            priceRange: '',
            sortBy: 'name'
        };

        // Reset form elements
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        const sortSelect = document.getElementById('sortSelect');

        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (priceFilter) priceFilter.value = '';
        if (sortSelect) sortSelect.value = 'name';

        // Apply cleared filters
        this.applyFilters();
    }
}

// Initialize product filtering when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productFiltering = new ProductFiltering();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductFiltering;
} 