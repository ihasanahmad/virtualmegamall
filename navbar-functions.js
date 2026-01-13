// User dropdown toggle
function toggleUserMenu() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Search menu toggle
function toggleSearchMenu() {
    const menu = document.getElementById('search-menu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

// Perform text search
function performTextSearch() {
    const searchInput = document.getElementById('global-search');
    if (searchInput && searchInput.value.trim()) {
        const query = searchInput.value.trim();
        window.location.href = `category.html?search=${encodeURIComponent(query)}`;
    }
    toggleSearchMenu();
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    const userMenu = document.querySelector('.user-menu-wrapper');
    const searchWrapper = document.querySelector('.search-btn-wrapper');

    if (userMenu && !userMenu.contains(e.target)) {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) dropdown.classList.remove('show');
    }

    if (searchWrapper && !searchWrapper.contains(e.target)) {
        const menu = document.getElementById('search-menu');
        if (menu) menu.classList.remove('show');
    }
});

// Make functions globally available
window.toggleUserMenu = toggleUserMenu;
window.toggleSearchMenu = toggleSearchMenu;
window.performTextSearch = performTextSearch;
