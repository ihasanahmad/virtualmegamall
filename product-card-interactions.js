// =========================================
// 3D MAGNETIC TILT EFFECT FOR PRODUCT CARDS
// Parallax mouse tracking for immersive hover
// =========================================

class ProductCardTilt {
    constructor() {
        this.cards = [];
        this.init();
    }

    init() {
        // Find all glassmorphism product cards
        const cardElements = document.querySelectorAll('.product-card-glass');

        cardElements.forEach(card => {
            // Skip on mobile devices
            if (window.innerWidth <= 768) return;

            this.cards.push({
                element: card,
                bounds: null
            });

            // Add event listeners
            card.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, card));
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
        });
    }

    handleMouseEnter(e, card) {
        // Get card bounds for calculations
        const bounds = card.getBoundingClientRect();
        card.dataset.bounds = JSON.stringify({
            left: bounds.left,
            top: bounds.top,
            width: bounds.width,
            height: bounds.height
        });

        // Enable smooth tilt transitions
        card.classList.add('tilt-active');
    }

    handleMouseMove(e, card) {
        if (!card.dataset.bounds) return;

        const bounds = JSON.parse(card.dataset.bounds);

        // Calculate mouse position relative to card center
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        // Calculate center position
        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;

        // Calculate rotation angles (max 15deg)
        const rotateX = ((mouseY - centerY) / centerY) * -10; // Inverted for natural feel
        const rotateY = ((mouseX - centerX) / centerX) * 10;

        // Calculate subtle translation for "magnetic" effect
        const translateZ = 5; // Slight forward movement

        // Apply 3D transform
        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateZ(${translateZ}px)
            translateY(-12px)
            scale(1.02)
        `;

        // Optional: Add subtle shine effect based on mouse position
        const shine = card.querySelector('.shine-overlay');
        if (shine) {
            const shineX = (mouseX / bounds.width) * 100;
            const shineY = (mouseY / bounds.height) * 100;
            shine.style.background = `
                radial-gradient(
                    circle at ${shineX}% ${shineY}%,
                    rgba(255, 255, 255, 0.3) 0%,
                    transparent 50%
                )
            `;
        }
    }

    handleMouseLeave(e, card) {
        // Reset transform with smooth transition
        card.style.transform = '';

        // Remove tilt active class to return to normal transitions
        setTimeout(() => {
            card.classList.remove('tilt-active');
        }, 100);

        // Reset shine effect
        const shine = card.querySelector('.shine-overlay');
        if (shine) {
            shine.style.background = '';
        }
    }

    // Reinitialize on window resize
    handleResize() {
        // Clear existing cards
        this.cards = [];

        // Reinitialize if not mobile
        if (window.innerWidth > 768) {
            this.init();
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const tiltEffect = new ProductCardTilt();

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            tiltEffect.handleResize();
        }, 250);
    });
});

// =========================================
// PRODUCT CARD CLICK HANDLING
// Make entire card clickable while preserving button clicks
// =========================================

document.addEventListener('click', (e) => {
    // Check if click is on a product card
    const card = e.target.closest('.product-card-glass');
    if (!card) return;

    // Check if click is on Add to Cart button or Wishlist
    const isButton = e.target.closest('.add-to-cart-btn');
    const isWishlist = e.target.closest('.wishlist-btn');

    // If clicking button/wishlist, don't navigate
    if (isButton || isWishlist) {
        e.stopPropagation();
        return;
    }

    // Otherwise, navigate to product detail page
    const productLink = card.getAttribute('href');
    if (productLink && productLink !== '#') {
        window.location.href = productLink;
    }
}, true);

// =========================================
// ADD TO CART FUNCTIONALITY
// Prevent card navigation when clicking Add to Cart
// =========================================

document.addEventListener('click', (e) => {
    const addToCartBtn = e.target.closest('.add-to-cart-btn');
    if (!addToCartBtn) return;

    e.preventDefault();
    e.stopPropagation();

    // Extract product data from card
    const card = addToCartBtn.closest('.product-card-glass');
    const productName = card.querySelector('h4')?.textContent || '';
    const productPrice = card.querySelector('.price')?.textContent || '';
    const productBrand = card.querySelector('.brand-name')?.textContent || '';
    const productImage = card.querySelector('.product-img')?.src || '';

    // Call existing addToCart function if available
    if (typeof addToCart === 'function') {
        addToCart(productName, productPrice, productBrand, productImage);
    }

    // Visual feedback
    addToCartBtn.textContent = '✓ Added!';
    addToCartBtn.style.background = 'var(--chrome-gradient-2)';

    setTimeout(() => {
        addToCartBtn.textContent = 'Add to Cart';
        addToCartBtn.style.background = '';
    }, 2000);
}, true);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProductCardTilt };
}
