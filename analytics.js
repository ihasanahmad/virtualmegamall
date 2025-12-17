/**
 * Analytics & Personalization Module
 * Tracks user behavior and manages mock data layer
 */

const Analytics = {
    init() {
        this.trackPageView();
        this.setupEventListeners();
    },

    // Track page views
    trackPageView() {
        const page = window.location.pathname.split('/').pop() || 'home';
        console.log(`[Analytics] Page View: ${page}`);

        // Mock data layer push
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'page_view',
            page_path: page,
            timestamp: new Date().getTime()
        });

        // Track recently viewed for personalization
        if (page.includes('product.html')) {
            this.trackProductView();
        }
    },

    // Track specific product views
    trackProductView() {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');
        const productName = params.get('name') || document.querySelector('.product-title')?.textContent;

        if (productName) {
            console.log(`[Analytics] View Item: ${productName}`);
            this.addToHistory(productName);
        }
    },

    // Add to local history for "Recently Viewed" section
    addToHistory(productName) {
        let history = JSON.parse(localStorage.getItem('viewHistory')) || [];
        // Remove duplicate if exists to push to top
        history = history.filter(p => p !== productName);
        history.unshift(productName);
        // Limit to 5 items
        if (history.length > 5) history.pop();
        localStorage.setItem('viewHistory', JSON.stringify(history));
    },

    // Track events (Add to Cart, Wishlist, etc)
    trackEvent(eventName, params = {}) {
        console.log(`[Analytics] Event: ${eventName}`, params);
        window.dataLayer.push({
            event: eventName,
            params: params,
            timestamp: new Date().getTime()
        });
    },

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            // Track Add to Cart
            if (e.target.closest('.add-to-cart-btn') || e.target.closest('.add-btn')) {
                const btn = e.target.closest('button');
                const product = btn.dataset.productName || 'Unknown Product';
                this.trackEvent('add_to_cart', { product });
            }

            // Track Wishlist
            if (e.target.closest('.wishlist-btn')) {
                this.trackEvent('add_to_wishlist');
            }
        });
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    Analytics.init();
    window.trackEvent = Analytics.trackEvent.bind(Analytics);
});
