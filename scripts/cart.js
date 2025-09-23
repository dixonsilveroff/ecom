// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.setupEventListeners();
    }

    loadCart() {
        try {
            const savedCart = localStorage.getItem('techstore_cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            return [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem('techstore_cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }

    addToCart(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('Product added to cart!');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('Product removed from cart!');
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('Cart cleared!');
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartDisplay() {
        // Update cart count in header
        const cartCounts = document.querySelectorAll('.cart-count');
        const count = this.getCartCount();
        
        cartCounts.forEach(cartCount => {
            cartCount.textContent = count;
        });

        // Update cart items display if on checkout page
        this.updateCheckoutDisplay();
    }

    // Utility function to format price with commas
    formatPrice(amount) {
        return `₦${Number(amount).toLocaleString('en-NG', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }

    async updateCheckoutDisplay() {
        const cartItemsContainer = document.getElementById('cartItems');
        const subtotalElement = document.getElementById('subtotal');
        const shippingElement = document.getElementById('shipping');
        const totalElement = document.getElementById('total');

        if (!cartItemsContainer) return;

        // Clear existing items
        cartItemsContainer.innerHTML = '';

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            // Clear totals when cart is empty
            if (subtotalElement) subtotalElement.textContent = '₦0.00';
            if (shippingElement) shippingElement.textContent = 'FREE';
            if (totalElement) totalElement.textContent = '₦0.00';
            return;
        }

        // Update each cart item with latest product details
        if (!this.productsCache) {
            try {
                const response = await fetch('/data/products.json');
                const data = await response.json();
                this.productsCache = data.products;
            } catch (error) {
                console.error('Failed to load products.json:', error);
            }
        }
        this.cart.forEach(item => {
            const product = this.productsCache.find(p => p.id === item.id);
            if (product) {
                item.name = product.name;
                item.price = product.price;
                item.image = product.image;
            }
        });

        // Add cart items
        this.cart.forEach(item => {
            const itemElement = this.createCartItemElement(item);
            cartItemsContainer.appendChild(itemElement);
        });

        // Update totals
        const total = this.getCartTotal();
        const subtotal = total; // If you have discounts, update this logic
        const shipping = 0; // Update if you have shipping logic

        if (subtotalElement) subtotalElement.textContent = this.formatPrice(subtotal);
        if (shippingElement) shippingElement.textContent = shipping === 0 ? 'FREE' : this.formatPrice(shipping);
        if (totalElement) totalElement.textContent = this.formatPrice(total);
    }

    createCartItemElement(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="item-price">${this.formatPrice(item.price)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="window.shoppingCart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="window.shoppingCart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="window.shoppingCart.removeFromCart('${item.id}')">×</button>
        `;
        return itemDiv;
    }

    setupEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = e.target.dataset.productId;
                this.addToCartById(productId);
            }
        });

        // Checkout form submission
        const orderForm = document.getElementById('orderForm');
        if (orderForm) {
            orderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processOrder();
            });
        }
    }

    async getProductById(productId) {
        if (!this.productsCache) {
            // Fetch and cache products.json
            try {
                const response = await fetch('/data/products.json');
                const data = await response.json();
                this.productsCache = data.products;
            } catch (error) {
                console.error('Failed to load products.json:', error);
                return null;
            }
        }
        return this.productsCache.find(product => product.id === productId) || null;
    }

    // Update addToCart to support async getProductById
    async addToCartById(productId, quantity = 1) {
        const product = await this.getProductById(productId);
        if (!product) {
            this.showNotification('Product not found!', 'error');
            return;
        }
        this.addToCart(product, quantity);
    }

    async processOrder() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'error');
            return;
        }

        // Always reload products cache to ensure latest data
        try {
            const response = await fetch('/data/products.json');
            const data = await response.json();
            this.productsCache = data.products;
        } catch (error) {
            console.error('Failed to load products.json:', error);
        }
        // Update cart items with latest product details
        this.cart.forEach(item => {
            const product = this.productsCache.find(p => p.id === item.id);
            if (product) {
                item.name = product.name;
                item.price = product.price;
                item.image = product.image;
            }
        });

        const form = document.getElementById('orderForm');
        if (!form) return;

        // Send email in background, then redirect to WhatsApp
        if (window.emailjsIntegration && typeof window.emailjsIntegration.processEmailOrder === 'function') {
            window.emailjsIntegration.processEmailOrder(form).finally(() => {
                // Prepare WhatsApp message
                const orderData = window.emailjsIntegration.prepareOrderData(new FormData(form));
                const message = window.shoppingCart.formatOrderMessage(orderData);
                const whatsappNumber = '+15551234567'; // Use your WhatsApp number
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
                window.shoppingCart.clearCart();
                window.location.href = 'thank-you.html';
            });
        } else {
            this.showNotification('Order system error. Please try again.', 'error');
        }
    }

    generateOrderNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `TS-${timestamp}-${random}`;
    }

    sendWhatsAppOrder(orderData) {
        const message = this.formatOrderMessage(orderData);
        const whatsappNumber = '+15551234567'; // Replace with actual number
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Clear cart and redirect to thank you page
        this.clearCart();
        window.location.href = 'thank-you.html';
    }

    sendEmailOrder(orderData) {
        // This would integrate with EmailJS
        console.log('Sending email order:', orderData);
        
        // For now, just redirect to thank you page
        this.clearCart();
        window.location.href = 'thank-you.html';
    }

    formatOrderMessage(orderData) {
        let message = `🛒 *New Order from TechStore*\n\n`;
        message += `*Customer:* ${orderData.customer.firstName} ${orderData.customer.lastName}\n`;
        message += `*Email:* ${orderData.customer.email}\n`;
        message += `*Phone:* ${orderData.customer.phone}\n\n`;
        message += `*Shipping Address:*\n`;
        message += `${orderData.shipping.address}\n`;
        message += `${orderData.shipping.city}, ${orderData.shipping.state} ${orderData.shipping.zipCode}\n`;
        message += `${orderData.shipping.country}\n\n`;
        message += `*Order Items:*\n`;
        if (orderData.items && orderData.items.length > 0) {
            orderData.items.forEach(item => {
                message += `• ${item.name} x${item.quantity} - ${this.formatPrice(item.price * item.quantity)}\n`;
            });
        } else {
            message += `No items in cart.\n`;
        }
        message += `\n*Total:* ${this.formatPrice(orderData.total)}\n`;
        message += `*Order Number:* ${orderData.orderNumber}\n`;
        if (orderData.orderNotes) {
            message += `\n*Notes:* ${orderData.orderNotes}`;
        }
        return message;
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 75px;
            right:20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            background-color: ${type === 'success' ? '#28a745' : '#dc3545'};
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize shopping cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.shoppingCart = new ShoppingCart();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShoppingCart;
}