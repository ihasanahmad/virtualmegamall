/* =========================================
   1. GLOBAL INIT & AUTH
   ========================================= */

// Categories Dropdown Toggle
function toggleCategoriesMenu() {
    const menu = document.getElementById('categories-menu');
    menu.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.categories-dropdown');
    const menu = document.getElementById('categories-menu');
    if (dropdown && menu && !dropdown.contains(e.target)) {
        menu.classList.remove('show');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
    initSlider();
    initCategorySliders();
    initWishlist();
    initSearchAutocomplete();
    updateCartDisplay();
    initNewsletterPopup();
    initAppBanner();
    initCartPreview();
    // Render Functions triggered if container exists
    if (document.getElementById('clothing-container')) renderBrands();
});

/* =========================================
   VOICE SEARCH (Web Speech API)
   ========================================= */
function startVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('Voice search not supported in this browser');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    const voiceBtn = document.getElementById('voice-btn');
    const searchInput = document.getElementById('global-search');

    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceBtn.classList.add('listening');
    showToast('🎤 Listening...');

    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        voiceBtn.classList.remove('listening');
        showToast(`Searching for: ${transcript}`);
        searchFor(transcript);
    };

    recognition.onerror = (event) => {
        voiceBtn.classList.remove('listening');
        showToast('Voice search error. Try again.');
    };

    recognition.onend = () => {
        voiceBtn.classList.remove('listening');
    };
}

window.startVoiceSearch = startVoiceSearch;

/* =========================================
   CART PREVIEW ON HOVER
   ========================================= */
function initCartPreview() {
    updateCartPreview();
}

function showCartPreview() {
    updateCartPreview();
}

function hideCartPreview() {
    // Preview hides via CSS on mouse leave
}

function updateCartPreview() {
    const container = document.getElementById('cart-preview-items');
    if (!container) return;

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    if (cartItems.length === 0) {
        container.innerHTML = '<div class="cart-preview-empty"><i class="fa-solid fa-bag-shopping" style="font-size:30px;color:#444;margin-bottom:10px;display:block"></i>Your cart is empty</div>';
        return;
    }

    container.innerHTML = cartItems.slice(0, 3).map(item => `
        <div class="cart-preview-item">
            <img src="${item.img}" alt="${item.name}">
            <div class="item-info">
                <h5>${item.name}</h5>
                <span>${item.price} × ${item.qty}</span>
            </div>
        </div>
    `).join('');

    if (cartItems.length > 3) {
        container.innerHTML += `<div style="text-align:center;color:#888;font-size:12px;padding:10px;">+${cartItems.length - 3} more items</div>`;
    }
}

window.showCartPreview = showCartPreview;
window.hideCartPreview = hideCartPreview;
window.updateCartPreview = updateCartPreview;

/* =========================================
   QUICK VIEW MODAL
   ========================================= */
let currentQuickViewProduct = null;

function openQuickView(name, price, brand, img) {
    currentQuickViewProduct = { name, price, brand, img };

    document.getElementById('qv-name').textContent = name;
    document.getElementById('qv-price').textContent = price;
    document.getElementById('qv-brand').textContent = brand;
    document.getElementById('qv-image').src = img;
    document.getElementById('qv-desc').textContent = 'Premium quality product with exceptional craftsmanship. Made with the finest materials for lasting comfort and style.';

    document.getElementById('quick-view-modal').classList.add('active');
    document.body.style.overflow = 'hidden';

    // Set up add to cart button
    document.getElementById('qv-add-btn').onclick = () => {
        addToCart(name, price, brand, img);
        closeQuickView();
    };

    // Set up view details button
    document.getElementById('qv-view-btn').onclick = () => {
        window.location.href = `product.html?name=${encodeURIComponent(name)}`;
    };
}

function closeQuickView() {
    document.getElementById('quick-view-modal').classList.remove('active');
    document.body.style.overflow = '';
    currentQuickViewProduct = null;
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('quick-view-modal');
    if (e.target === modal) {
        closeQuickView();
    }
});

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeQuickView();
    }
});

window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;

/* =========================================
   SOCIAL PROOF NOTIFICATIONS
   ========================================= */
const fakeProofData = [
    { name: 'Sara', city: 'Lahore', product: 'Khaadi Lawn 3pc' },
    { name: 'Ali', city: 'Karachi', product: 'Nike Air Max' },
    { name: 'Fatima', city: 'Islamabad', product: 'Samsung S24 Ultra' },
    { name: 'Omer', city: 'Faisalabad', product: 'Men\'s Kurta' },
    { name: 'Zainab', city: 'Multan', product: 'Gold Plated Watch' }
];

const productImages = [
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=50',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50',
    'https://images.unsplash.com/photo-1598327773204-7cd3a17e01e5?w=50'
];

function initSocialProof() {
    // Show first notification after 10 seconds
    setTimeout(showProof, 10000);
}

function showProof() {
    const toast = document.getElementById('social-proof-toast');
    if (!toast) return;

    const data = fakeProofData[Math.floor(Math.random() * fakeProofData.length)];
    const img = productImages[Math.floor(Math.random() * productImages.length)];

    document.getElementById('proof-name').textContent = data.name;
    document.getElementById('proof-city').textContent = data.city;
    document.getElementById('proof-product').textContent = data.product;
    document.getElementById('proof-img').src = img;
    document.getElementById('proof-time').textContent = Math.floor(Math.random() * 59) + ' mins ago';

    toast.classList.add('active');

    // Hide after 5 seconds
    setTimeout(() => {
        toast.classList.remove('active');
        // Schedule next notification (random 15-45s)
        const nextTime = Math.random() * 30000 + 15000;
        setTimeout(showProof, nextTime);
    }, 5000);
}

function closeSocialProof() {
    document.getElementById('social-proof-toast').classList.remove('active');
}

window.closeSocialProof = closeSocialProof;

/* =========================================
   NEWSLETTER POPUP
   ========================================= */
function initNewsletterPopup() {
    // Show popup after 5 seconds if not already shown in session
    if (!sessionStorage.getItem('newsletter-popup-shown')) {
        setTimeout(() => {
            const popup = document.getElementById('newsletter-popup');
            if (popup) {
                initSocialProof(); // Start social proof after newsletter
                popup.classList.add('active');
            }
        }, 5000);
    } else {
        initSocialProof(); // Start immediately if newsletter already shown
    }
}

function closeNewsletterPopup() {
    const popup = document.getElementById('newsletter-popup');
    if (popup) {
        popup.classList.remove('active');
        sessionStorage.setItem('newsletter-popup-shown', 'true');
    }
}

function submitPopupNewsletter(e) {
    e.preventDefault();
    const email = document.getElementById('popup-email').value;

    // Store subscription
    const subscribers = JSON.parse(localStorage.getItem('newsletter-subscribers')) || [];
    subscribers.push({ email, date: new Date().toISOString(), source: 'popup' });
    localStorage.setItem('newsletter-subscribers', JSON.stringify(subscribers));

    showToast('Thanks for subscribing! 🎉 10% off coming your way!');
    closeNewsletterPopup();
}

window.closeNewsletterPopup = closeNewsletterPopup;
window.submitPopupNewsletter = submitPopupNewsletter;

/* =========================================
   MOBILE APP BANNER
   ========================================= */
function initAppBanner() {
    // Hide if already dismissed in session
    if (sessionStorage.getItem('app-banner-closed')) {
        const banner = document.getElementById('app-banner');
        if (banner) banner.style.display = 'none';
    }
}

function closeAppBanner() {
    const banner = document.getElementById('app-banner');
    if (banner) {
        banner.style.display = 'none';
        sessionStorage.setItem('app-banner-closed', 'true');
    }
}

window.closeAppBanner = closeAppBanner;

/* =========================================
   CURRENCY & LANGUAGE SELECTORS
   ========================================= */
function changeCurrency(currency) {
    localStorage.setItem('selected-currency', currency);
    showToast(`Currency changed to ${currency}`);
    // In production, this would trigger price recalculation
}

function changeLanguage(lang) {
    localStorage.setItem('selected-language', lang);
    const langNames = { en: 'English', ur: 'اردو', ar: 'العربية' };
    showToast(`Language: ${langNames[lang] || lang}`);
    // In production, this would reload page with translation
}

window.changeCurrency = changeCurrency;
window.changeLanguage = changeLanguage;

// Category Ad Sliders - Auto rotate every 4 seconds
function initCategorySliders() {
    const sliders = document.querySelectorAll('.category-ad-slider');
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.cat-slide');
        if (slides.length <= 1) return;

        let currentIndex = 0;
        setInterval(() => {
            slides[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % slides.length;
            slides[currentIndex].classList.add('active');
        }, 4000); // Change every 4 seconds
    });
}

function checkAuthState() {
    const authSection = document.getElementById('auth-section');
    if (!authSection) return;

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
        authSection.innerHTML = `
            <a href="profile.html" class="auth-btn" style="background:var(--accent-gold);">
                <i class="fa-solid fa-user"></i> ${user.name || 'My Account'}
            </a>
        `;
    } else {
        authSection.innerHTML = `
            <a href="login.html" class="auth-btn">Login / Sign Up</a>
        `;
    }
}

/* =========================================
   PHASE 1: WISHLIST FUNCTIONALITY
   ========================================= */
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function toggleWishlist(btn, productId) {
    const icon = btn.querySelector('i');
    const index = wishlist.indexOf(productId);

    if (index === -1) {
        // Add to wishlist
        wishlist.push(productId);
        btn.classList.add('active');
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        showToast('Added to Wishlist ❤️');
    } else {
        // Remove from wishlist
        wishlist.splice(index, 1);
        btn.classList.remove('active');
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        showToast('Removed from Wishlist');
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Initialize wishlist buttons on page load
function initWishlist() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = btn.getAttribute('onclick').match(/'([^']+)'/)?.[1];
        if (productId && wishlist.includes(productId)) {
            btn.classList.add('active');
            const icon = btn.querySelector('i');
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
        }
    });
}

/* =========================================
   CART FUNCTIONALITY - Global Functions
   ========================================= */

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cartItems', JSON.stringify(cart));
    updateCartDisplay();
}

// Add to Cart - Now using Firestore
async function addToCart(name, price, brand, img) {
    const user = firebase.auth().currentUser;

    // Check if user is logged in
    if (!user) {
        const returnUrl = window.location.pathname + window.location.search;
        window.location.href = `login.html?return=${encodeURIComponent(returnUrl)}`;
        return;
    }

    // Create product object
    const product = {
        id: name.replace(/\s+/g, '-').toLowerCase(),
        name: name,
        price: price,
        brand: brand,
        img: img || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100',
        qty: 1
    };

    // Add to Firestore
    const result = await addToCartFirestore(product);

    if (result.success) {
        showToast(`${name} added to cart! 🛒`);
        updateCartBadge();
    } else {
        showToast('Failed to add to cart. Please try again.', 'fa-exclamation-circle');
    }
}

// Remove from Cart
function removeFromCart(index) {
    const cart = getCart();
    const removed = cart.splice(index, 1);
    saveCart(cart);
    showToast(`${removed[0]?.name || 'Item'} removed from cart`);
}

// Change quantity (+/-)
function changeQty(index, delta) {
    const cart = getCart();
    if (cart[index]) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        saveCart(cart);
    }
}

// Update cart badge display
function updateCartDisplay() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    // Update all cart badges on page
    document.querySelectorAll('.cart-count, #cart-count').forEach(badge => {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// Show toast notification
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.cart-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, var(--primary-hazel, #8E7C68), var(--hazel-gold, #C5A065));
        color: white;
        padding: 15px 30px;
        border-radius: 50px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        animation: slideUp 0.3s ease, fadeOut 0.3s ease 2.5s forwards;
        display: flex;
        align-items: center;
        gap: 10px;
    `;

    // Add animation keyframes if not exists
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideUp {
                from { transform: translateX(-50%) translateY(50px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
            @keyframes fadeOut {
                to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Remove after animation
    setTimeout(() => toast.remove(), 3000);
}

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.changeQty = changeQty;
window.updateCartDisplay = updateCartDisplay;
window.showToast = showToast;

/* =========================================
   NEWSLETTER SUBSCRIPTION
   ========================================= */
function subscribeNewsletter(e) {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;

    // In production, send to backend/API
    console.log('Newsletter subscription:', email);

    // Show success message
    document.querySelector('.newsletter-form').style.display = 'none';
    document.getElementById('newsletter-success').style.display = 'flex';

    // Store in localStorage for demo
    const subscribers = JSON.parse(localStorage.getItem('newsletter-subscribers')) || [];
    subscribers.push({ email, date: new Date().toISOString() });
    localStorage.setItem('newsletter-subscribers', JSON.stringify(subscribers));

    showToast('Thanks for subscribing! 📧');
}

window.subscribeNewsletter = subscribeNewsletter;

/* =========================================
   NOTIFY ME WHEN AVAILABLE
   ========================================= */
let currentNotifyProduct = null;

function openNotifyModal(productName, productImg) {
    currentNotifyProduct = productName;

    // Create modal if doesn't exist
    if (!document.getElementById('notify-modal')) {
        const modal = document.createElement('div');
        modal.id = 'notify-modal';
        modal.className = 'notify-modal';
        modal.innerHTML = `
            <div class="notify-modal-content">
                <h3><i class="fa-solid fa-bell"></i> Get Notified</h3>
                <p id="notify-product-name">We'll email you when this item is back in stock</p>
                <input type="email" id="notify-email" placeholder="Your email address" required>
                <button onclick="submitNotifyForm()">Notify Me</button>
                <p style="margin-top:15px; font-size:12px; color:#999; cursor:pointer;" onclick="closeNotifyModal()">Cancel</p>
            </div>
        `;
        document.body.appendChild(modal);
    }

    document.getElementById('notify-product-name').textContent = `We'll notify you when "${productName}" is back in stock`;
    document.getElementById('notify-modal').classList.add('active');
}

function closeNotifyModal() {
    document.getElementById('notify-modal').classList.remove('active');
}

function submitNotifyForm() {
    const email = document.getElementById('notify-email').value;

    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }

    // Store notification request
    const notifications = JSON.parse(localStorage.getItem('product-notifications')) || [];
    notifications.push({
        product: currentNotifyProduct,
        email: email,
        date: new Date().toISOString()
    });
    localStorage.setItem('product-notifications', JSON.stringify(notifications));

    closeNotifyModal();
    showToast(`We'll notify you when ${currentNotifyProduct} is available! 📧`);
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('notify-modal');
    if (modal && e.target === modal) {
        closeNotifyModal();
    }
});

window.openNotifyModal = openNotifyModal;
window.closeNotifyModal = closeNotifyModal;
window.submitNotifyForm = submitNotifyForm;

/* =========================================
   PHASE 1: SEARCH AUTOCOMPLETE
   ========================================= */
function initSearchAutocomplete() {
    const searchInput = document.getElementById('global-search');
    const suggestions = document.getElementById('search-suggestions');

    if (!searchInput || !suggestions) return;

    // Show suggestions on focus
    searchInput.addEventListener('focus', () => {
        suggestions.classList.add('active');
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            suggestions.classList.remove('active');
        }
    });

    // Filter suggestions as user types
    searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length < 2) {
            document.getElementById('product-suggestions').style.display = 'none';
            document.getElementById('trending-section').style.display = 'block';
            return;
        }

        // Hide trending, show product matches
        document.getElementById('trending-section').style.display = 'none';

        // Search through products (you can enhance this with API call)
        const productSection = document.getElementById('product-suggestions');
        const matchedProducts = searchProducts(query);

        if (matchedProducts.length > 0) {
            productSection.style.display = 'block';
            productSection.innerHTML = `
                <div class="suggestion-title">🛍️ Products</div>
                ${matchedProducts.map(p => `
                    <div class="suggestion-item" onclick="window.location='product.html?id=${p.id}'">
                        <img src="${p.img}" alt="${p.name}">
                        <div class="item-info">
                            <div class="item-name">${p.name}</div>
                            <div class="item-category">${p.category}</div>
                        </div>
                        <div class="item-price">${p.price}</div>
                    </div>
                `).join('')}
            `;
        } else {
            productSection.style.display = 'none';
        }
    }, 300));
}

// Sample product search (replace with real data/API)
function searchProducts(query) {
    const sampleProducts = [
        { id: 1, name: 'Nike Air Max', category: 'Shoes', price: 'Rs. 12,000', img: 'https://via.placeholder.com/40/8E7C68/fff?text=N' },
        { id: 2, name: 'Khaadi Lawn 3pc', category: 'Clothing', price: 'Rs. 4,550', img: 'https://via.placeholder.com/40/8E7C68/fff?text=K' },
        { id: 3, name: 'Samsung Galaxy S24', category: 'Electronics', price: 'Rs. 350,000', img: 'https://via.placeholder.com/40/8E7C68/fff?text=S' },
        { id: 4, name: 'Rolex Submariner', category: 'Watches', price: 'Rs. 1,875,000', img: 'https://via.placeholder.com/40/C5A065/fff?text=R' },
        { id: 5, name: 'iPhone 15 Pro', category: 'Electronics', price: 'Rs. 450,000', img: 'https://via.placeholder.com/40/333/fff?text=i' },
    ];

    return sampleProducts.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    ).slice(0, 4);
}

function searchFor(query) {
    document.getElementById('global-search').value = query;
    document.getElementById('search-suggestions').classList.remove('active');
    // Trigger search or navigate
    window.location = `category.html?search=${encodeURIComponent(query)}`;
}

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/* =========================================
   2. CART LOGIC
   ========================================= */
let cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];

function updateCartDisplay() {
    const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

    // Update cart badge (new icon design)
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        cartBadge.innerText = totalQty;
        if (totalQty > 0) {
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }
    }

    // Automatically render if on cart page
    if (window.location.pathname.includes("cart.html")) {
        renderCartPage();
    }
}

// --- PREMUIM UI HELPERS ---
function showToast(message, icon = "fa-check-circle") {
    // Create toast if not exists
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    toast.classList.add('show');

    // Hide after 3s
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function addToCart(btn, productDataStr) {
    let product = productDataStr;
    if (!product && btn.dataset.product) product = JSON.parse(btn.dataset.product);

    // Fallback
    if (!product) return;

    const existingIndex = cartItems.findIndex(p => p.name === product.name);
    if (existingIndex > -1) {
        cartItems[existingIndex].qty += 1;
    } else {
        if (!product.qty) product.qty = 1;
        cartItems.push(product);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();

    // Premium Feedback
    showToast(`Added ${product.name} to Cart`);

    // Button Animation
    btn.innerHTML = "<i class='fa-solid fa-check'></i>";
    btn.style.background = "var(--primary-hazel)";
    btn.style.color = "white";
    setTimeout(() => {
        btn.innerHTML = "Add to Cart";
        btn.style.background = "";
        btn.style.color = "";
    }, 1000);
}

function removeFromCart(index) {
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();
}

function changeQty(index, delta) {
    cartItems[index].qty += delta;
    if (cartItems[index].qty < 1) cartItems[index].qty = 1;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();
    renderCartPage();
}

// DEFINING THE MISSING RENDER FUNCTION
function renderCartPage() {
    const cartTbody = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');

    if (!cartTbody) return;

    cartTbody.innerHTML = "";
    let grandTotal = 0;

    if (cartItems.length === 0) {
        cartTbody.innerHTML = "<tr><td colspan='5' style='text-align:center; padding: 40px;'>Your cart is empty. <a href='index.html'>Go Shopping</a></td></tr>";
    }

    cartItems.forEach((item, index) => {
        // Clean price string to number
        let priceNum = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
        let lineTotal = priceNum * item.qty;
        grandTotal += lineTotal;

        cartTbody.innerHTML += `
            <tr>
                <td style="display:flex; align-items:center; gap:10px;">
                    <img src="${item.img}" style="width:50px; height:50px; object-fit:contain;">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small>${item.brand}</small>
                    </div>
                </td>
                <td>${item.price}</td>
                <td>
                    <button onclick="changeQty(${index}, -1)" style="width:30px; padding:0; background:#ddd; color:black;">-</button>
                    <span style="margin:0 10px;">${item.qty}</span>
                    <button onclick="changeQty(${index}, 1)" style="width:30px; padding:0; background:#ddd; color:black;">+</button>
                </td>
                <td>Rs. ${lineTotal.toLocaleString()}</td>
                <td><button onclick="removeFromCart(${index})" style="background:red; width:auto; padding:5px 10px; font-size:12px; color:white;"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
        `;
    });

    if (cartItems.length > 0) {
        // Add Checkout Button
        cartTbody.innerHTML += `
            <tr style="background: transparent; box-shadow:none;">
                <td colspan="5" style="text-align: right; padding-top: 30px; border:none;">
                    <a href="payment.html" class="cta-button">Proceed to Checkout <i class="fa-solid fa-arrow-right"></i></a>
                </td>
            </tr>
        `;
    }

    if (totalEl) totalEl.innerText = "Rs. " + grandTotal.toLocaleString();
}


/* =========================================
   3. BRAND DATA (EXPANDED EXTENSIVE LIST)
   ========================================= */
const brandData = [
    // Clothing (Pakistan)
    { name: "Khaadi", category: "clothing", slogan: "Weave Your Soul", img: "https://via.placeholder.com/150", link: "store.html?brand=Khaadi" },
    { name: "Sapphire", category: "clothing", slogan: "Ready to Wear", img: "https://via.placeholder.com/150", link: "store.html?brand=Sapphire" },
    { name: "J.", category: "clothing", slogan: "Soully East", img: "https://via.placeholder.com/150", link: "store.html?brand=J." },
    { name: "GulAhmed", category: "clothing", slogan: "Ideas for Life", img: "https://via.placeholder.com/150", link: "store.html?brand=GulAhmed" },
    { name: "Outfitters", category: "clothing", slogan: "Urban Fashion", img: "https://via.placeholder.com/150", link: "store.html?brand=Outfitters" },
    { name: "Bonanza", category: "clothing", slogan: "Satrangi", img: "https://via.placeholder.com/150", link: "store.html?brand=Bonanza" },
    { name: "AlKaram", category: "clothing", slogan: "Rangon Ki Duniya", img: "https://via.placeholder.com/150", link: "store.html?brand=AlKaram" },
    { name: "Nishat", category: "clothing", slogan: "Fabric of Pakistan", img: "https://via.placeholder.com/150", link: "store.html?brand=Nishat" },
    { name: "Maria.B", category: "clothing", slogan: "Unleash Your Inner Diva", img: "https://via.placeholder.com/150", link: "store.html?brand=Maria.B" },
    { name: "Limelight", category: "clothing", slogan: "Style for Everyone", img: "https://via.placeholder.com/150", link: "store.html?brand=Limelight" },
    { name: "Ethnic", category: "clothing", slogan: "By Outfitters", img: "https://via.placeholder.com/150", link: "store.html?brand=Ethnic" },
    { name: "SanaSafinaz", category: "clothing", slogan: "The SS Experience", img: "https://via.placeholder.com/150", link: "store.html?brand=SanaSafinaz" },

    // Shoes
    { name: "Stylo", category: "shoes", slogan: "Jo Chahay Wo Paye", img: "https://via.placeholder.com/150", link: "store.html?brand=Stylo" },
    { name: "Bata", category: "shoes", slogan: "Surprisingly Bata", img: "https://via.placeholder.com/150", link: "store.html?brand=Bata" },
    { name: "Service", category: "shoes", slogan: "Shoes for Everyone", img: "https://via.placeholder.com/150", link: "store.html?brand=Service" },
    { name: "Borjan", category: "shoes", slogan: "Walk the Fashion", img: "https://via.placeholder.com/150", link: "store.html?brand=Borjan" },
    { name: "ECS", category: "shoes", slogan: "Ehsan Chappal Store", img: "https://via.placeholder.com/150", link: "store.html?brand=ECS" },
    { name: "Ndure", category: "shoes", slogan: "Move with Style", img: "https://via.placeholder.com/150", link: "store.html?brand=Ndure" },

    // Tech
    { name: "Samsung", category: "tech", slogan: "Do What You Can't", img: "https://via.placeholder.com/150", link: "store.html?brand=Samsung" },
    { name: "Xiaomi", category: "tech", slogan: "Innovation for Everyone", img: "https://via.placeholder.com/150", link: "store.html?brand=Xiaomi" },
    { name: "Apple", category: "tech", slogan: "Think Different", img: "https://via.placeholder.com/150", link: "store.html?brand=Apple" },
    { name: "Infinix", category: "tech", slogan: "The Future is Now", img: "https://via.placeholder.com/150", link: "store.html?brand=Infinix" },
    { name: "Tecno", category: "tech", slogan: "Stop at Nothing", img: "https://via.placeholder.com/150", link: "store.html?brand=Tecno" },

    // Jewelry
    { name: "Tesoro", category: "jewelry", slogan: "The Accessory Shop", img: "https://via.placeholder.com/150", link: "store.html?brand=Tesoro" },
    { name: "Hanif", category: "jewelry", slogan: "Timeless Elegance", img: "https://via.placeholder.com/150", link: "store.html?brand=Hanif" },
    { name: "Damas", category: "jewelry", slogan: "Art of Beauty", img: "https://via.placeholder.com/150", link: "store.html?brand=Damas" },
    { name: "Solitaire", category: "jewelry", slogan: "Precious Moments", img: "https://via.placeholder.com/150", link: "store.html?brand=Solitaire" },

    // Beauty
    { name: "L'Oreal", category: "beauty", slogan: "Because You're Worth It", img: "https://via.placeholder.com/150", link: "store.html?brand=LOreal" },
    { name: "Maybelline", category: "beauty", slogan: "Maybe She's Born With It", img: "https://via.placeholder.com/150", link: "store.html?brand=Maybelline" },
    { name: "The Body Shop", category: "beauty", slogan: "Enrich Not Exploit", img: "https://via.placeholder.com/150", link: "store.html?brand=The Body Shop" },
    { name: "Mac", category: "beauty", slogan: "All Ages, All Races, All Genders", img: "https://via.placeholder.com/150", link: "store.html?brand=Mac" },

    // Home
    { name: "Habitt", category: "home", slogan: "Dil Ki Habbit", img: "https://via.placeholder.com/150", link: "store.html?brand=Habitt" },
    { name: "Interwood", category: "home", slogan: "Trusted Since 1974", img: "https://via.placeholder.com/150", link: "store.html?brand=Interwood" },
    { name: "Dolce Vita", category: "home", slogan: "Sleep Well, Live Well", img: "https://via.placeholder.com/150", link: "store.html?brand=Dolce Vita" }
];

// Mock Products
const mockProducts = [
    { name: "Khaadi Lawn 3pc", brand: "Khaadi", price: "Rs. 4,500", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&q=80" },
    { name: "Kurta Shalwar", brand: "J.", price: "Rs. 6,000", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80" },
    { name: "Sapphire Pop", brand: "Sapphire", price: "Rs. 3,200", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80" },
    { name: "Running Shoes", brand: "Nike Store", price: "Rs. 12,000", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80" },
    { name: "Galaxy S24", brand: "Samsung Official", price: "Rs. 350,000", img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&q=80" },
    { name: "iPhone 15 Pro", brand: "Apple", price: "Rs. 500,000", img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&q=80" },
    { name: "Summer Kurta", brand: "J. (Junaid Jamshed)", price: "Rs. 4,500", img: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=300&q=80" },
    { name: "Gold Plated Set", brand: "Tesoro", price: "Rs. 5,500", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&q=80" },
    { name: "Luxury Watch", brand: "Rolex", price: "Rs. 150,000", img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&q=80" },
    { name: "Sport Sneakers", brand: "Adidas", price: "Rs. 8,500", img: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&q=80" },
    { name: "Earbuds Pro", brand: "Samsung", price: "Rs. 25,000", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&q=80" },

    // Beauty Products
    { name: "Revitalift Serum", brand: "L'Oreal", price: "Rs. 3,500", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80" },
    { name: "Matte Lipstick", brand: "Mac", price: "Rs. 4,200", img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&q=80" },
    { name: "Fit Me Foundation", brand: "Maybelline", price: "Rs. 2,100", img: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=300&q=80" },
    { name: "Tea Tree Oil", brand: "The Body Shop", price: "Rs. 1,800", img: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=300&q=80" },

    // Home Products
    { name: "Luxury Bed Set", brand: "Habitt", price: "Rs. 85,000", img: "https://images.unsplash.com/photo-1505693416388-33406375881d?w=300&q=80" },
    { name: "Modern Sofa", brand: "Interwood", price: "Rs. 120,000", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80" },
    { name: "Orthopedic Mattress", brand: "Dolce Vita", price: "Rs. 45,000", img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&q=80" }
];

/* =========================================
   4. RENDER LOGIC
   ========================================= */
const clothingContainer = document.getElementById('clothing-container');
const shoesContainer = document.getElementById('shoes-container');
const techContainer = document.getElementById('tech-container');
const watchContainer = document.getElementById('watch-container');

function renderBrands() {
    brandData.forEach(brand => {
        const brandHTML = `
            <a href="${brand.link}" style="text-decoration:none; color:inherit;">
                <div class="brand-box">
                    <h3>${brand.name}</h3>
                    <p style="color:var(--primary-hazel); font-size:12px;">Official Store</p>
                </div>
            </a>
        `;

        if (brand.category === 'clothing') clothingContainer.innerHTML += brandHTML;
        else if (brand.category === 'shoes') shoesContainer.innerHTML += brandHTML;
        else if (brand.category === 'tech') techContainer.innerHTML += brandHTML;
        else if (brand.category === 'jewelry' && watchContainer) watchContainer.innerHTML += brandHTML;
    });
}

// Store Page Rendering
if (window.location.pathname.includes("store.html")) renderStorePage();

async function renderStorePage() {
    const params = new URLSearchParams(window.location.search);
    const brandName = params.get('brand');
    const heroTitle = document.getElementById('store-name');

    if (!brandName) return;

    // Find Brand Meta
    const brandInfo = brandData.find(b => b.name === brandName) || { slogan: "Official Store" };

    if (heroTitle) {
        heroTitle.innerText = brandName.toUpperCase();
        document.getElementById('store-slogan').innerText = brandInfo.slogan;
        document.getElementById('nav-brand-name').innerText = brandName;
    }

    const grid = document.getElementById('store-products');
    if (grid) {
        grid.innerHTML = "<p>Loading products...</p>";

        try {
            // Fetch Real Products from Backend
            // Note: If DB is empty, this returns [], so we rely on Seed Data being there or Vendor Uploads
            const res = await fetch('https://virtualmall-backend.onrender.com/api/products');
            const allProducts = await res.json();

            // Filter
            const storeProducts = allProducts.filter(p => p.brand === brandName);

            grid.innerHTML = "";
            if (storeProducts.length === 0) {
                // FALLBACK: Use Mock Data if API returns nothing (for demo continuity if seeding hasn't happened)
                // In a real production scenario, we would show "No products found".
                // Checking if mockProducts is defined globally (it is in previous code block, 
                // but let's assume we want to transition fully. If DB is empty, show empty).
                const localMocks = mockProducts.filter(p => p.brand === brandName);
                if (localMocks.length > 0) {
                    localMocks.forEach(prod => {
                        grid.innerHTML += createProductCard(prod);
                    });
                    return;
                }

                grid.innerHTML = `<p style="grid-column:1/-1;">Welcome to the official ${brandName} store. New collection arriving soon.</p>`;
            } else {
                storeProducts.forEach(prod => {
                    grid.innerHTML += createProductCard(prod);
                });
            }
        } catch (err) {
            console.error("API Error:", err);
            grid.innerHTML = "<p>Error loading products. Please try again later.</p>";
        }
    }
}

/* =========================================
   5. RENDER CATEGORY & PRODUCT LINKS
   ========================================= */

// Updated Card Creator with Link
function createProductCard(product) {
    const productStr = JSON.stringify(product).replace(/"/g, "&quot;");
    // Ensure price is formatted
    return `
        <div class="product-card">
            <a href="product.html?name=${encodeURIComponent(product.name)}" style="text-decoration:none; color:inherit;">
                <img src="${product.img}" alt="${product.name}" class="product-img" style="width:100%; object-fit:cover;">
                <h4>${product.name}</h4>
                <p class="brand-name" style="color:#666; font-size:14px;">${product.brand}</p>
                <p class="price" style="color:var(--primary-hazel); font-weight:bold;">${product.price}</p>
            </a>
            <button onclick="addToCart(this, '${productStr}')" style="margin-top:10px;">Add to Cart</button>
        </div>
    `;
}

// Logic for Category Page
function renderCategoryPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const container = document.getElementById('category-products');
    const title = document.getElementById('category-title');

    if (!container) return;

    if (!type) {
        title.innerText = "All Products";
    } else {
        const typeMap = {
            'clothing': "Clothing & Fashion",
            'shoes': "Shoes & Footwear",
            'tech': "Electronics & Tech",
            'jewelry': "Watches & Jewelry",
            'beauty': "Beauty & Cosmetics",
            'home': "Home & Living"
        };
        title.innerText = typeMap[type] || "Collection";
    }

    // Filter Mock Products (In real app, fetch from API with filter)
    // Actually, mockProducts array in previous file view didn't have 'category' property explicitly on PRODUCTS, only on BRANDS.
    // We need to infer or add categories to mockProducts.
    // For now, let's map by brand category logic or just show all for demo if matching fails.

    // Better strategy: Filter based on Brand's category.
    // 1. Find brands of this category.
    const relevantBrands = brandData.filter(b => b.category === type).map(b => b.name);

    // 2. Filter products that belong to these brands.
    const productsToShow = mockProducts.filter(p => relevantBrands.includes(p.brand));

    container.innerHTML = "";
    if (productsToShow.length === 0) {
        container.innerHTML = "<p>No products found in this category yet.</p>";
    } else {
        productsToShow.forEach(p => {
            container.innerHTML += createProductCard(p);
        });
    }
}

// Hook into Init
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('category.html')) {
        renderCategoryPage();
    }
});

/* =========================================
   3. HERO SLIDER
   ========================================= */
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    let currentSlide = 0;

    // Reset: Ensure only the first slide is showing initially
    slides.forEach((slide, index) => {
        slide.classList.remove('active-slide');
        if (index === 0) slide.classList.add('active-slide');
    });

    // Start Loop
    setInterval(() => {
        // Remove active class from current
        slides[currentSlide].classList.remove('active-slide');

        // Increment
        currentSlide = (currentSlide + 1) % slides.length;

        // Add active class to new
        slides[currentSlide].classList.add('active-slide');
    }, 5000); // 5 seconds
}

/* =========================================
   6. SEARCH (Client Side)
   ========================================= */
const searchInput = document.querySelector('.search-container input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        console.log("Searching for:", term);
    });
}