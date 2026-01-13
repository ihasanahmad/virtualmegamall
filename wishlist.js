// =========================================
// WISHLIST TOGGLE FUNCTION
// For glassmorphism product cards
// =========================================

function toggleWishlist(button) {
    // Toggle active class
    button.classList.toggle('active');

    // Change icon
    const icon = button.querySelector('i');
    if (button.classList.contains('active')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');

        // Store in localStorage
        const card = button.closest('.product-card-glass');
        const productId = card.getAttribute('href').split('id=')[1];
        addToWishlist(productId);

        // Show toast
        if (typeof showToast === 'function') {
            showToast('Added to wishlist ❤️', 'success');
        }
    } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');

        // Remove from localStorage
        const card = button.closest('.product-card-glass');
        const productId = card.getAttribute('href').split('id=')[1];
        removeFromWishlist(productId);

        // Show toast
        if (typeof showToast === 'function') {
            showToast('Removed from wishlist', 'info');
        }
    }
}

function addToWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
}

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Initialize wishlist hearts on page load
document.addEventListener('DOMContentLoaded', () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

    document.querySelectorAll('.product-card-glass').forEach(card => {
        const productId = card.getAttribute('href')?.split('id=')[1];
        if (productId && wishlist.includes(productId)) {
            const wishlistBtn = card.querySelector('.wishlist-btn');
            if (wishlistBtn) {
                wishlistBtn.classList.add('active');
                const icon = wishlistBtn.querySelector('i');
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            }
        }
    });
});
