// EmailJS Configuration for Order Processing
class EmailJSIntegration {
    constructor() {
        this.serviceId = 'service_xvdgi3a'; // Replace with your EmailJS service ID
        this.contactTemplateId = 'template_q8xq1mn'; // Replace with your EmailJS contact form template ID
        this.orderTemplateId = 'template_lq4xsry'; // Replace with your EmailJS order template ID
        this.userId = 'Iz-_OWs-Aa4fTK8cQ'; // Replace with your EmailJS user ID
        this.init();
    }

    init() {
        this.loadEmailJS();
        this.setupEventListeners();
    }

    loadEmailJS() {
        // Load EmailJS SDK if not already loaded
        if (typeof emailjs === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = () => {
                this.initializeEmailJS();
            };
            document.head.appendChild(script);
        } else {
            this.initializeEmailJS();
        }
    }

    initializeEmailJS() {
        try {
            emailjs.init(this.userId);
            console.log('EmailJS initialized successfully');
        } catch (error) {
            console.error('Error initializing EmailJS:', error);
        }
    }

    setupEventListeners() {
        // Contact form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendContactForm(contactForm);
            });
        }

        // Order form submission (for email orders)
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'orderForm') {
                const orderMethod = e.target.querySelector('input[name="orderMethod"]:checked');
                if (orderMethod && orderMethod.value === 'email') {
                    e.preventDefault();
                    this.processEmailOrder(e.target);
                }
            }
        });
    }

    async sendContactForm(form) {
        const formData = new FormData(form);
        const contactData = {
            name: `${formData.get('firstName')} ${formData.get('lastName')}`,
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Move button state reset outside try/catch to always run after attempt
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Send email using EmailJS
            const response = await emailjs.send(
                this.serviceId,
                this.contactTemplateId,
                {
                    to_name: 'TechStore Support',
                    from_name: contactData.name,
                    from_email: contactData.email,
                    phone: contactData.phone,
                    subject: contactData.subject,
                    message: contactData.message
                }
            );

            // Success
            this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();
            // Log success
            console.log('Contact form sent successfully:', response);

        } catch (error) {
            console.error('Error sending contact form:', error);
            this.showNotification('Failed to send message. Please try again or contact us directly.', 'error');
        }
        // Always reset button state after attempt
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }

    async processEmailOrder(form) {
        const formData = new FormData(form);
        const orderData = this.prepareOrderData(formData);
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing Order...';
        submitBtn.disabled = true;
        try {
            // Send order email
            const response = await emailjs.send(
                this.serviceId,
                this.orderTemplateId, // Use dedicated order template ID
                {
                    to_name: 'TechStore Orders',
                    customer_name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
                    customer_email: orderData.customer.email,
                    customer_phone: orderData.customer.phone,
                    shipping_address: `${orderData.shipping.address}, ${orderData.shipping.city}, ${orderData.shipping.state} ${orderData.shipping.zipCode}, ${orderData.shipping.country}`,
                    order_items: this.formatOrderItems(orderData.items),
                    total: `₦${orderData.total.toFixed(2)}`,
                    order_date: new Date().toLocaleDateString()
                }
            );
            // Only return success, do not clear cart or show notification here
            if (response && response.status === 200) {
                return true;
            } else {
                throw new Error('EmailJS did not return success status.');
            }
        } catch (error) {
            console.error('Error processing order:', error);
            throw error;
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    prepareOrderData(formData) {
        return {
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
            items: window.shoppingCart ? window.shoppingCart.cart : [],
            total: window.shoppingCart ? window.shoppingCart.getCartTotal() : 0,
            orderNumber: this.generateOrderNumber()
        };
    }

    formatOrderItems(items) {
        return items.map(item => 
            `${item.name} x${item.quantity} - ₦${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');
    }

    generateOrderNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `TS-${timestamp}-${random}`;
    }

    async sendOrderConfirmation(orderData) {
        try {
            await emailjs.send(
                this.serviceId,
                'confirmation_template_id', // Replace with your confirmation template ID
                {
                    to_name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
                    to_email: orderData.customer.email,
                    order_number: orderData.orderNumber,
                    order_date: new Date().toLocaleDateString(),
                    order_items: this.formatOrderItems(orderData.items),
                    total: `₦${orderData.total.toFixed(2)}`,
                    shipping_address: `${orderData.shipping.address}, ${orderData.shipping.city}, ${orderData.shipping.state} ${orderData.shipping.zipCode}, ${orderData.shipping.country}`,
                    estimated_delivery: this.getEstimatedDelivery(),
                    support_email: 'support@techstore.com',
                    support_phone: '+1 (555) 123-4567'
                }
            );

            console.log('Order confirmation sent to customer');
        } catch (error) {
            console.error('Error sending order confirmation:', error);
        }
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
            max-width: 350px;
            word-wrap: break-word;
        `;
        
        // Add animation styles if not already present
        if (!document.querySelector('#emailjs-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'emailjs-notification-styles';
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
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Test EmailJS connection
    async testConnection() {
        try {
            const response = await emailjs.send(
                this.serviceId,
                'test_template_id', // Replace with a test template ID
                {
                    test: 'true',
                    timestamp: new Date().toISOString()
                }
            );
            console.log('EmailJS connection test successful:', response);
            return true;
        } catch (error) {
            console.error('EmailJS connection test failed:', error);
            return false;
        }
    }

    // Update configuration
    updateConfig(serviceId, templateId, userId) {
        this.serviceId = serviceId;
        this.templateId = templateId;
        this.userId = userId;
        
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.userId);
        }
    }
}

// Initialize EmailJS integration when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.emailjsIntegration = new EmailJSIntegration();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailJSIntegration;
}