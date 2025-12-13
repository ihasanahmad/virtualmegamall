/* =========================================
   1. CART LOGIC (Premium Object-Based)
   ========================================= */
// STRUCTURE: JSON.parse(localStorage.getItem('cartItems')) -> [{ id, name, price, brand, img, qty }]
let cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
const cartNav = document.querySelector('.cart-btn');

updateCartDisplay();

function updateCartDisplay() {
    const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

    if (cartNav) {
        cartNav.innerText = `Cart (${totalQty})`;
        if (totalQty > 0) {
            cartNav.style.color = "#e6b800";
            cartNav.style.borderColor = "#e6b800";
            cartNav.classList.add('pulse-anim'); // We will add this animation in CSS
        }
    }

    // If we are on the cart page, render the list
    if (window.location.pathname.includes("cart.html")) {
        renderCartPage();
    }
}

function addToCart(btn, productDataStr) {
    // productDataStr should be a JSON stringified object attached to the button or passed directly
    // Fallback if data is passed via arguments or found in DOM
    let product = productDataStr;

    // If called from button with data attributes (recommended way for cleaner HTML)
    if (!product && btn.dataset.product) {
        product = JSON.parse(btn.dataset.product);
    }

    // Fallback for existing hardcoded calls (Legacy Support)
    if (!product) {
        // Scrape from card (Not ideal but works for existing static HTML)
        const card = btn.closest('.product-card');
        product = {
            id: card.querySelector('h4').innerText + "-" + Math.random().toString(36).substr(2, 9),
            name: card.querySelector('h4').innerText,
            price: card.querySelector('.price').innerText,
            brand: card.querySelector('.brand-name') ? card.querySelector('.brand-name').innerText : "Unknown",
            img: card.querySelector('img').src,
            qty: 1
        };
    }

    // Logic: Check if exists
    const existingIndex = cartItems.findIndex(p => p.name === product.name); // Using Name as ID for now if no ID

    if (existingIndex > -1) {
        cartItems[existingIndex].qty += 1;
    } else {
        if (!product.qty) product.qty = 1;
        cartItems.push(product);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();

    // Feedback
    const originalText = btn.innerText;
    btn.innerText = "Added! ✔";
    btn.style.backgroundColor = "#28a745";
    btn.style.color = "white";
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.backgroundColor = "#222";
    }, 1000);
}

function removeFromCart(index) {
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();
}

function clearCart() {
    cartItems = [];
    localStorage.setItem('cartItems', JSON.stringify([]));
    updateCartDisplay();
    alert("Cart cleared!");
}

/* =========================================
   2. COMPARISON LOGIC (Engine)
   ========================================= */
let compareList = localStorage.getItem('compareList') ? JSON.parse(localStorage.getItem('compareList')) : [];

function addToCompare(btn) {
    const card = btn.closest('.product-card');
    const product = {
        name: card.querySelector('h4').innerText,
        price: card.querySelector('.price').innerText,
        brand: card.querySelector('.brand-name') ? card.querySelector('.brand-name').innerText : "Unknown",
        img: card.querySelector('img').src,
        rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1), // Simulating rating
        delivery: "2-3 Days"
    };

    if (compareList.length >= 3) {
        alert("You can only compare up to 3 items.");
        return;
    }

    const exists = compareList.find(p => p.name === product.name);
    if (exists) {
        alert("Item already in comparison list.");
        return;
    }

    compareList.push(product);
    localStorage.setItem('compareList', JSON.stringify(compareList));

    btn.innerText = "VS Added";
    btn.style.background = "#e6b800";
    btn.style.color = "black";
}

/* =========================================
   3. BRAND NAVIGATION & SEARCH
   ========================================= */
const brandData = [
    { name: "Nike", category: "clothing", link: "store.html?brand=Nike" },
    { name: "Samsung", category: "tech", link: "store.html?brand=Samsung" },
    { name: "Khaadi", category: "clothing", link: "store.html?brand=Khaadi" },
    { name: "Apple", category: "tech", link: "store.html?brand=Apple" },
    { name: "J.", category: "clothing", link: "store.html?brand=J." },
    { name: "Outfitters", category: "clothing", link: "store.html?brand=Outfitters" },
    { name: "Bata", category: "shoes", link: "store.html?brand=Bata" },
    { name: "Sapphire", category: "clothing", link: "store.html?brand=Sapphire" },
    { name: "GulAhmed", category: "clothing", link: "store.html?brand=GulAhmed" },
    { name: "Service", category: "shoes", link: "store.html?brand=Service" },
    { name: "Stylo", category: "shoes", link: "store.html?brand=Stylo" },
    { name: "Xiaomi", category: "tech", link: "store.html?brand=Xiaomi" }
];

const clothingContainer = document.getElementById('clothing-container');
const shoesContainer = document.getElementById('shoes-container');
const techContainer = document.getElementById('tech-container');

if (clothingContainer) { renderBrands(); }

function renderBrands() {
    brandData.forEach(brand => {
        const brandHTML = `
            <a href="${brand.link}" style="text-decoration: none; color: inherit;">
                <div class="brand-box">
                    <h3>${brand.name}</h3>
                    <p style="color:#888; font-size:12px;">Official Store</p>
                </div>
            </a>
        `;
        if (brand.category === 'clothing') clothingContainer.innerHTML += brandHTML;
        else if (brand.category === 'shoes') shoesContainer.innerHTML += brandHTML;
        else if (brand.category === 'tech') techContainer.innerHTML += brandHTML;
    });
}

function handleSearch(e) {
    // Basic Client-Side Search
    const term = e.target.value.toLowerCase();
    const allCards = document.querySelectorAll('.product-card');

    allCards.forEach(card => {
        const title = card.querySelector('h4').innerText.toLowerCase();
        const brand = card.querySelector('.brand-name') ? card.querySelector('.brand-name').innerText.toLowerCase() : "";
        if (title.includes(term) || brand.includes(term)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });

    // Also filter brands if on home
    const brandBoxes = document.querySelectorAll('.brand-box');
    brandBoxes.forEach(box => {
        const name = box.querySelector('h3').innerText.toLowerCase();
        if (name.includes(term)) {
            box.closest('a').style.display = "block";
        } else {
            box.closest('a').style.display = "none";
        }
    });
}
const searchInput = document.querySelector('.search-bar input');
if (searchInput) searchInput.addEventListener('input', handleSearch);

/* =========================================
   4. FETCH REAL DATA FROM BACKEND API
   ========================================= */
let allProducts = []; // Stores data from MongoDB

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();

        allProducts = data;
        console.log("✅ Products loaded from Database:", allProducts);

        // Render pages based on data
        renderTrendingProducts();

        if (window.location.pathname.includes("store.html")) {
            renderStorePage();
        }

        if (window.location.pathname.includes("product.html")) {
            renderProductDetails();
        }

        // Comparison Page Logic
        if (window.location.pathname.includes("comparison.html")) {
            renderComparisonPage();
        }

    } catch (error) {
        console.log("Starting in Offline Mode / Server Connect Error");
        // Fallback or "Offline Mode" notice handled in UI
    }
}

// Start the process
fetchProducts();


/* =========================================
   5. RENDER LOGIC
   ========================================= */

// Render Trending (Index Page)
function renderTrendingProducts() {
    const productContainer = document.querySelector('.product-grid');
    if (productContainer && !window.location.pathname.includes("store.html")) {
        productContainer.innerHTML = '';

        // Take first 8 items from Database or use fallbacks if empty
        const trending = allProducts.length > 0 ? allProducts.slice(0, 8) : [];

        trending.forEach(product => {
            const productHTML = createProductCard(product);
            productContainer.innerHTML += productHTML;
        });
    }
}

function createProductCard(product) {
    // Helper to generate consistent card HTML
    // Storing data-product attribute for easier "Add to Cart"
    const safeProduct = JSON.stringify(product).replace(/"/g, '&quot;');
    return `
        <div class="product-card">
            <a href="product.html?name=${encodeURIComponent(product.name)}&brand=${encodeURIComponent(product.brand)}">
                <img src="${product.img}" class="product-img" style="width:100%; height:200px; object-fit:contain; margin-bottom:10px; cursor:pointer;">
            </a>
            <h4>${product.name}</h4>
            <p class="brand-name">${product.brand}</p>
            <p class="price">${product.price}</p>
            <div style="display:flex; gap:5px;">
                <button onclick="addToCart(this, ${JSON.stringify(safeProduct).replace(/^"|"$/g, '')})" style="flex:2;">Add to Cart</button>
                <button onclick="addToCompare(this)" style="flex:1; background:#555; font-size:12px;">VS</button>
            </div>
        </div>
    `;
}

/* =========================================
   5. STORE PAGE LOGIC
   ========================================= */
// Metadata only (Colors/Slogans) - Products come from DB now!
const storeMeta = {
    "Nike": { slogan: "Just Do It.", color: "linear-gradient(#000, #434343)", categories: ["Men", "Women"] },
    "Samsung": { slogan: "Do What You Can't.", color: "linear-gradient(#141E30, #243B55)", categories: ["Mobiles", "Tablets"] },
    "Khaadi": { slogan: "Weave Your Soul.", color: "linear-gradient(#e65c00, #F9D423)", categories: ["Unstitched", "Pret"] },
    "Apple": { slogan: "Think Different.", color: "linear-gradient(#000, #434343)", categories: ["iPhone", "Mac"] },
    "Default": { slogan: "Official Store", color: "#333", categories: ["All Products"] }
};

function renderStorePage() {
    const params = new URLSearchParams(window.location.search);
    const brandName = params.get('brand');

    // 1. Setup Header
    const meta = storeMeta[brandName] || storeMeta["Default"];
    if (brandName) {
        document.getElementById('store-name').innerText = brandName;
        const navTitle = document.getElementById('nav-brand-name');
        if (navTitle) navTitle.innerText = brandName.toUpperCase();
        document.getElementById('store-slogan').innerText = meta.slogan;
        document.getElementById('store-hero').style.background = meta.color;

        // 2. Filter Products from Database
        const storeProducts = allProducts.filter(p => p.brand === brandName);

        // 3. Render Grid
        const grid = document.getElementById('store-products');
        if (grid) {
            grid.innerHTML = "";
            if (storeProducts.length === 0) {
                grid.innerHTML = "<p>No products found for this brand in database.</p>";
            }
            storeProducts.forEach(prod => {
                const productHTML = createProductCard(prod);
                grid.innerHTML += productHTML;
            });
        }

        // 4. Sidebar Categories
        const sidebarList = document.getElementById('dynamic-categories');
        const sidebarTitle = document.getElementById('sidebar-title');
        if (sidebarList) {
            sidebarList.innerHTML = "";
            if (sidebarTitle) sidebarTitle.innerText = brandName + " Menu";
            if (meta.categories) {
                meta.categories.forEach(cat => { sidebarList.innerHTML += `<a href="#">${cat}</a>`; });
            }
        }
    }
}

/* =========================================
   6. PAGE SPECIFIC RENDERS (Cart, Compare)
   ========================================= */

function renderCartPage() {
    const cartTbody = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');

    if (!cartTbody) return;

    cartTbody.innerHTML = "";
    let grandTotal = 0;

    if (cartItems.length === 0) {
        cartTbody.innerHTML = "<tr><td colspan='4' style='text-align:center;'>Your cart is empty.</td></tr>";
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
                    <button onclick="changeQty(${index}, -1)" style="width:25px; padding:0;">-</button>
                    ${item.qty}
                    <button onclick="changeQty(${index}, 1)" style="width:25px; padding:0;">+</button>
                </td>
                <td>Rs. ${lineTotal.toLocaleString()}</td>
                <td><button onclick="removeFromCart(${index})" style="background:red; width:auto; padding:5px 10px; font-size:12px;">X</button></td>
            </tr>
        `;
    });

    if (totalEl) totalEl.innerText = "Rs. " + grandTotal.toLocaleString();
}

function changeQty(index, delta) {
    cartItems[index].qty += delta;
    if (cartItems[index].qty < 1) cartItems[index].qty = 1;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCartPage();
    updateCartDisplay();
}

function renderComparisonPage() {
    const tableContainer = document.querySelector('section.comparison-container table');
    if (!tableContainer) return;

    if (compareList.length < 2) {
        tableContainer.innerHTML = "<tr><td style='text-align:center; padding:50px;'>Please select at least 2 items to compare. <a href='index.html'>Go Shopping</a></td></tr>";
        return;
    }

    // Build Table Header
    let html = `
        <tr>
            <th>Feature</th>
            ${compareList.map(p => `
                <td class="product-col">
                    <div class="comp-img"><img src="${p.img}" style="width:100%; height:100%; object-fit:contain;"></div>
                    <h3>${p.name}</h3>
                    <p style="color: #666;">${p.brand}</p>
                    <button onclick="removeFromCompare('${p.name}')" style="background:#ddd; color:black; margin-top:5px; font-size:10px; width:auto; padding:2px 5px;">Remove</button>
                </td>
            `).join('')}
        </tr>
    `;

    // Dynamic Rows
    const rows = [
        { label: "Price", key: "price" },
        { label: "Rating", key: "rating", suffix: " ⭐" },
        { label: "Delivery", key: "delivery" },
    ];

    rows.forEach(row => {
        html += `<tr><th>${row.label}</th>`;
        compareList.forEach(p => {
            let val = p[row.key] || "-";
            if (row.suffix) val += row.suffix;

            // Simple highlighting logic for Rating
            let highlightClass = "";
            if (row.key === "rating" && parseFloat(p.rating) >= 4.5) highlightClass = "highlight";

            html += `<td class="${highlightClass}">${val}</td>`;
        });
        html += `</tr>`;
    });

    // Add to Cart Row
    html += `<tr><th>Action</th>`;
    compareList.forEach(p => {
        // Need to reconstruct product object roughly for the button
        const safeProd = JSON.stringify(p).replace(/"/g, '&quot;');
        html += `<td><button onclick="addToCart(this, ${JSON.stringify(safeProd).replace(/^"|"$/g, '')})">Add to Cart</button></td>`;
    });
    html += `</tr>`;

    tableContainer.innerHTML = html;
}

function removeFromCompare(name) {
    compareList = compareList.filter(p => p.name !== name);
    localStorage.setItem('compareList', JSON.stringify(compareList));
    renderComparisonPage();
}

/* =========================================
   6. PRODUCT DETAILS LOGIC
   ========================================= */
function renderProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const prodName = params.get('name');
    const brandName = params.get('brand') || "Official Store";

    // Find in downloaded data
    let foundProduct = allProducts.find(p => p.name === prodName);

    // Fallback
    if (!foundProduct) foundProduct = { name: prodName, price: "Rs. Unknown", img: "https://via.placeholder.com/400" };

    document.getElementById('pdp-img').src = foundProduct.img;
    document.getElementById('pdp-name').innerText = foundProduct.name;
    document.getElementById('pdp-price').innerText = foundProduct.price;
    document.getElementById('pdp-brand').innerText = brandName;
    document.getElementById('pdp-desc').innerText = `Official authentic product from ${brandName}. In stock now.`;
}

// Toggle Menu Logic
function toggleMenu() {
    const sidebar = document.getElementById("side-menu");
    const overlay = document.getElementById("overlay");
    if (sidebar.style.width === "300px") { sidebar.style.width = "0"; overlay.style.display = "none"; }
    else { sidebar.style.width = "300px"; overlay.style.display = "block"; }
}

/* =========================================
   7. ANIMATIONS (Scroll Observer)
   ========================================= */
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

// Observe all potential elements (Cards, Sections)
// We wait slightly for dynamic content to load
setTimeout(() => {
    document.querySelectorAll('.product-card, .brand-box, h2, h3').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}, 1000);