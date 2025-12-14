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
    updateCartDisplay();
    // Render Functions triggered if container exists
    if (document.getElementById('clothing-container')) renderBrands();
});

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
   2. CART LOGIC
   ========================================= */
let cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
const cartNav = document.getElementById('cart-nav-btn');

function updateCartDisplay() {
    const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

    if (cartNav) {
        cartNav.innerText = `Cart (${totalQty})`;
        if (totalQty > 0) {
            cartNav.style.color = "#8E7C68";
            cartNav.style.borderColor = "#8E7C68"; // Hazel
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
];

// Mock Products
const mockProducts = [
    { name: "Khaadi Lawn 3pc", brand: "Khaadi", price: "Rs. 4,500", img: "https://via.placeholder.com/300/8E7C68/FFF?text=Khaadi+Lawn" },
    { name: "Kurta Shalwar", brand: "J.", price: "Rs. 6,000", img: "https://via.placeholder.com/300/8E7C68/FFF?text=J.+Kurta" },
    { name: "Sapphire Pop", brand: "Sapphire", price: "Rs. 3,200", img: "https://via.placeholder.com/300/8E7C68/FFF?text=Sapphire+Pop" },
    { name: "Stylo Fancy Heels", brand: "Stylo", price: "Rs. 2,800", img: "https://via.placeholder.com/300/8E7C68/FFF?text=Stylo+Heels" },
    { name: "Galaxy S24 Ultra", brand: "Samsung", price: "Rs. 400,000", img: "https://via.placeholder.com/300/8E7C68/FFF?text=S24+Ultra" },
    { name: "iPhone 15 Pro", brand: "Apple", price: "Rs. 500,000", img: "https://via.placeholder.com/300/8E7C68/FFF?text=iPhone+15" },
    { name: "Redmi Note 13", brand: "Xiaomi", price: "Rs. 60,000", img: "https://via.placeholder.com/300/8E7C68/FFF?text=Redmi+Note" },
    { name: "Gold Plated Set", brand: "Tesoro", price: "Rs. 5,500", img: "https://via.placeholder.com/300/8E7C68/FFF?text=Tesoro+Set" },
    { name: "Diamond Ring", brand: "Hanif", price: "Rs. 150,000", img: "https://via.placeholder.com/300/664/FFF?text=Hanif+Diamond" },
    { name: "Bata Comfit", brand: "Bata", price: "Rs. 3,500", img: "https://via.placeholder.com/300/444/FFF?text=Bata+Comfit" },
    { name: "Infinix Zero 30", brand: "Infinix", price: "Rs. 70,000", img: "https://via.placeholder.com/300/8E7C68/FFF?text=Infinix" }
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
            'jewelry': "Watches & Jewelry"
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