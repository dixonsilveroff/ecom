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
            existingItem.quantity += quantity;
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

    updateCheckoutDisplay() {
        const cartItemsContainer = document.getElementById('cartItems');
        const subtotalElement = document.getElementById('subtotal');
        const shippingElement = document.getElementById('shipping');
        const totalElement = document.getElementById('total');

        if (!cartItemsContainer) return;

        // Clear existing items
        cartItemsContainer.innerHTML = '';

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }

        // Add cart items
        this.cart.forEach(item => {
            const itemElement = this.createCartItemElement(item);
            cartItemsContainer.appendChild(itemElement);
        });

        // Update totals
        const subtotal = this.getCartTotal();
        const shipping = subtotal >= 50 ? 0 : 5.99; // Free shipping over $50
        const total = subtotal + shipping;

        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    }

    createCartItemElement(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-image">
                <span class="item-emoji">${item.image}</span>
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="item-price">$${item.price.toFixed(2)}</p>
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
                const product = this.getProductById(productId);
                if (product) {
                    this.addToCart(product);
                }
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

    getProductById(productId) {
        // This would typically fetch from products.json
        // For now, return a mock product
        return {
            id: productId,
            name: 'Product',
            price: 0,
            image: '📦'
        };
    }

    processOrder() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'error');
            return;
        }

        const formData = new FormData(document.getElementById('orderForm'));
        const orderData = {
            customer: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone')
            },
            shipping: {
                address: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                zipCode: formData.get('zipCode'),
                country: formData.get('country')
            },
            orderNotes: formData.get('orderNotes'),
            orderMethod: formData.get('orderMethod'),
            items: this.cart,
            total: this.getCartTotal(),
            orderNumber: this.generateOrderNumber()
        };

        if (orderData.orderMethod === 'whatsapp') {
            this.sendWhatsAppOrder(orderData);
        } else {
            this.sendEmailOrder(orderData);
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
        
        orderData.items.forEach(item => {
            message += `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
        });
        
        message += `\n*Total:* $${orderData.total.toFixed(2)}\n`;
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
            top: 20px;
            right: 20px;
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