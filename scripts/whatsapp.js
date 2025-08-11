// WhatsApp Integration for Orders
class WhatsAppIntegration {
    constructor() {
        this.phoneNumber = '+15551234567'; // Replace with actual WhatsApp number
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // WhatsApp order buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('whatsapp-order')) {
                e.preventDefault();
                this.processWhatsAppOrder();
            }
        });

        // WhatsApp support buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('whatsapp-support')) {
                e.preventDefault();
                this.openWhatsAppSupport();
            }
        });
    }

    processWhatsAppOrder() {
        // Get cart data from shopping cart
        if (window.shoppingCart && window.shoppingCart.cart.length > 0) {
            const orderData = this.prepareOrderData();
            this.sendWhatsAppOrder(orderData);
        } else {
            this.showNotification('Your cart is empty! Please add some products first.', 'error');
        }
    }

    prepareOrderData() {
        const cart = window.shoppingCart.cart;
        const total = window.shoppingCart.getCartTotal();
        
        let message = `🛒 *New Order from TechStore*\n\n`;
        message += `*Order Summary:*\n`;
        
        cart.forEach(item => {
            message += `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
        });
        
        message += `\n*Total:* $${total.toFixed(2)}\n`;
        message += `*Order Number:* TS-${Date.now()}\n\n`;
        message += `Please provide your shipping information and we'll process your order immediately! 🚀`;
        
        return message;
    }

    sendWhatsAppOrder(orderData) {
        const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(orderData)}`;
        window.open(whatsappUrl, '_blank');
        
        // Show success notification
        this.showNotification('WhatsApp order initiated! Please complete your order details.', 'success');
    }

    openWhatsAppSupport() {
        const supportMessage = `Hi! I need help with my TechStore order. Can you assist me? 🤔`;
        const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(supportMessage)}`;
        window.open(whatsappUrl, '_blank');
    }

    // Send order details via WhatsApp (used by cart.js)
    sendOrder(orderData) {
        const message = this.formatOrderMessage(orderData);
        const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        return true;
    }

    formatOrderMessage(orderData) {
        let message = `🛒 *New Order from TechStore*\n\n`;
        
        // Customer information
        message += `*Customer Details:*\n`;
        message += `Name: ${orderData.customer.firstName} ${orderData.customer.lastName}\n`;
        message += `Email: ${orderData.customer.email}\n`;
        message += `Phone: ${orderData.customer.phone}\n\n`;
        
        // Shipping information
        message += `*Shipping Address:*\n`;
        message += `${orderData.shipping.address}\n`;
        message += `${orderData.shipping.city}, ${orderData.shipping.state} ${orderData.shipping.zipCode}\n`;
        message += `${orderData.shipping.country}\n\n`;
        
        // Order items
        message += `*Order Items:*\n`;
        orderData.items.forEach(item => {
            message += `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
        });
        
        // Order summary
        message += `\n*Order Summary:*\n`;
        message += `Subtotal: $${orderData.total.toFixed(2)}\n`;
        message += `Shipping: ${orderData.total >= 50 ? 'FREE' : '$5.99'}\n`;
        message += `Total: $${(orderData.total + (orderData.total >= 50 ? 0 : 5.99)).toFixed(2)}\n`;
        message += `Order Number: ${orderData.orderNumber}\n\n`;
        
        // Additional notes
        if (orderData.orderNotes) {
            message += `*Special Instructions:*\n${orderData.orderNotes}\n\n`;
        }
        
        message += `Please confirm this order and provide payment instructions. Thank you! 🙏`;
        
        return message;
    }

    // Quick order for single products
    quickOrder(product) {
        const message = `🛒 *Quick Order from TechStore*\n\n`;
        message += `*Product:* ${product.name}\n`;
        message += `*Price:* $${product.price.toFixed(2)}\n`;
        message += `*Description:* ${product.description}\n\n`;
        message += `I'd like to order this product. Please provide shipping and payment information.`;
        
        const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    // Support inquiry
    supportInquiry(topic = 'general') {
        const topics = {
            'general': 'general inquiry',
            'technical': 'technical support',
            'order': 'order status',
            'returns': 'returns and refunds',
            'shipping': 'shipping information'
        };
        
        const message = `💬 *Support Request*\n\n`;
        message += `I need help with: ${topics[topic] || 'general inquiry'}\n\n`;
        message += `Please provide assistance. Thank you!`;
        
        const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
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
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        // Add animation styles if not already present
        if (!document.querySelector('#whatsapp-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'whatsapp-notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    // Check if WhatsApp is available
    isWhatsAppAvailable() {
        // Basic check - in a real app you might want to check if the user has WhatsApp installed
        return true;
    }

    // Get formatted phone number
    getFormattedPhone() {
        return this.phoneNumber.replace('+', '');
    }

    // Update phone number (useful for dynamic configuration)
    updatePhoneNumber(newNumber) {
        this.phoneNumber = newNumber;
    }
}

// Initialize WhatsApp integration when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.whatsappIntegration = new WhatsAppIntegration();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WhatsAppIntegration;
} 