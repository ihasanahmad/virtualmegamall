/* =========================================
   SEARCH & SCANNER LOGIC
   ========================================= */

// --- SCANNER ---
let scannerStream = null;

async function openScanner(type) {
    const modal = document.getElementById('scanner-modal');
    const title = document.getElementById('scanner-title');
    const video = document.getElementById('scanner-video');
    const status = document.getElementById('scanner-status');

    modal.style.display = "flex";
    title.innerText = type === 'barcode' ? "Scan Barcode" : "Scan Product Image";
    status.innerText = "Initializing Camera...";
    status.style.color = "#666";

    try {
        scannerStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = scannerStream;
        status.innerText = "Align target within frame";
    } catch (err) {
        console.error(err);
        status.innerText = "Camera Access Denied. Please enable permissions.";
        status.style.color = "red";
    }
}

function closeScanner() {
    const modal = document.getElementById('scanner-modal');
    const video = document.getElementById('scanner-video');

    modal.style.display = "none";
    if (scannerStream) {
        scannerStream.getTracks().forEach(track => track.stop());
        scannerStream = null;
    }
    video.srcObject = null;
}

function captureScan() {
    const status = document.getElementById('scanner-status');
    status.innerText = "Scanning...";
    status.style.color = "var(--accent-gold)";

    // SIMULATE SCANNING PROCESS
    setTimeout(() => {
        // Randomly pick a mock product to 'find'
        const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];

        status.innerText = `Product Found: ${randomProduct.name}`;
        status.style.color = "green";

        setTimeout(() => {
            closeScanner();
            // Redirect to store or show product details? 
            // For now, let's filter the home grid to show this product
            showToast(`Scanned: ${randomProduct.name}`, "fa-barcode");
            // alert(`Scanned: ${randomProduct.name}\nPrice: ${randomProduct.price}\nRedirecting to store...`);
            setTimeout(() => {
                window.location.href = `store.html?brand=${encodeURIComponent(randomProduct.brand)}`;
            }, 1000);
        }, 1500);

    }, 2000);
}

// --- SEARCH & FILTER ---
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('global-search');
    const filterSelect = document.getElementById('search-filter');

    if (searchInput) {
        searchInput.addEventListener('input', () => handleSearch(searchInput.value, filterSelect.value));
    }
    if (filterSelect) {
        filterSelect.addEventListener('change', () => handleSearch(searchInput.value, filterSelect.value));
    }
});

function handleSearch(query, filter) {
    const q = query.toLowerCase();

    // We need to function even if not on store page. 
    // If on Index, maybe hide brand boxes and show product grid? 
    // For MVP, we'll apply this logic to the 'mockProducts' and maybe alert or log if no grid exists.
    // Ideally, Index should have a 'Featured Products' section we can filter.

    // Let's assume we are filtering the 'mockProducts' global array and rendering to a potentially new results container?
    // OR, simpler: If on index, redirect to a search results page? 
    // Let's implement: If on Store page, filter current list. If on Index, maybe console log for now as Index is Brands only mostly.
    // WAIT: User "Index" has "Featured Products" section? Let's check.
    // Re-using 'renderStorePage' logic but for generic search results would be best.

    // Quick Fix: Filter 'mockProducts' and re-render wherever we can.

    let results = mockProducts.filter(p => {
        const matchesName = p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
        const matchesFilter = filter === 'all' ? true :
            filter === 'clothing' ? p.category === 'clothing' :
                filter === 'shoes' ? p.category === 'shoes' :
                    filter === 'tech' ? p.category === 'tech' : true;

        return matchesName && matchesFilter;
    });

    if (filter === 'price_low') {
        results.sort((a, b) => parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, '')));
    } else if (filter === 'price_high') {
        results.sort((a, b) => parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, '')));
    }

    // Render these results
    // If we are on Store.html, update grid.
    const storeGrid = document.getElementById('store-products');
    if (storeGrid) {
        storeGrid.innerHTML = "";
        results.forEach(p => storeGrid.innerHTML += createProductCard(p));
    } else {
        // If on Index, we might want to hide Brands and show results?
        // Let's just log it for this step, or find a container.
        console.log("Found products:", results.length);
    }
}
