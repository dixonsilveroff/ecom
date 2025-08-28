// Branding and Store Configuration
class StoreBranding {
    constructor() {
        this.settings = {};
        this.init();
    }

    async init() {
        try {
            await this.loadSettings();
            this.applyBranding();
            this.setupNavigation();
        } catch (error) {
            console.error('Error initializing store branding:', error);
        }
    }

    async loadSettings() {
        try {
            const response = await fetch('../data/settings.json');
            this.settings = await response.json();
        } catch (error) {
            console.error('Error loading settings:', error);
            // Fallback to default settings
            this.settings = {
                store: {
                    name: 'TechStore',
                    tagline: 'Premium Electronics & Gadgets'
                }
            };
        }
    }

    applyBranding() {
        // Update store name and tagline
        const brandNames = document.querySelectorAll('.brand-name');
        brandNames.forEach(brand => {
            brand.textContent = this.settings.store?.name || 'TechStore';
        });

        // Update page titles if they contain store name
        if (document.title.includes('TechStore')) {
            document.title = document.title.replace('TechStore', this.settings.store?.name || 'TechStore');
        }

        // Update meta descriptions
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && this.settings.store?.description) {
            metaDescription.content = this.settings.store.description;
        }

        // Update footer details if present
        if (document.getElementById('footerStoreDesc')) {
            document.getElementById('footerStoreDesc').textContent = this.settings.store?.description || '';
        }
        if (document.getElementById('footerEmail')) {
            document.getElementById('footerEmail').textContent = `📧 ${this.settings.contact?.email || ''}`;
        }
        if (document.getElementById('footerPhone')) {
            document.getElementById('footerPhone').textContent = `📱 ${this.settings.contact?.phone || ''}`;
        }
        if (document.getElementById('footerAddress')) {
            const addr = this.settings.contact?.address;
            if (addr) {
                document.getElementById('footerAddress').textContent = `📍 ${addr.street}, ${addr.city}`;
            }
        }
    }

    setupNavigation() {
        // Mobile navigation toggle
        // Mobile nav menu toggle logic
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        let navOverlay = document.querySelector('.nav-overlay');

        // Add close button logic
        const navClose = navMenu ? navMenu.querySelector('.nav-close') : null;

        if (navClose) {
            navClose.addEventListener('click', closeMenu);
        }

        // Always ensure overlay exists in DOM
        if (!navOverlay) {
            navOverlay = document.createElement('div');
            navOverlay.className = 'nav-overlay';
            document.body.appendChild(navOverlay);
        }

        function openMenu() {
            navMenu.classList.add('open');
            navToggle.classList.add('active');
            navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            navToggle.setAttribute('aria-expanded', 'true');
        }
        function closeMenu() {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
            navToggle.setAttribute('aria-expanded', 'false');
        }

        navToggle && navToggle.addEventListener('click', function () {
            if (navMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navOverlay && navOverlay.addEventListener('click', closeMenu);

        // Close menu on ESC key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                closeMenu();
            }
        });

        // Close menu when a nav link is clicked
        navMenu && navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // Get store setting by key
    getSetting(key) {
        return key.split('.').reduce((obj, k) => obj?.[k], this.settings);
    }

    // Update cart count display
    updateCartCount(count) {
        const cartCounts = document.querySelectorAll('.cart-count');
        cartCounts.forEach(cartCount => {
            cartCount.textContent = count;
        });
    }
}

// Initialize store branding when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.storeBranding = new StoreBranding();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StoreBranding;
} 