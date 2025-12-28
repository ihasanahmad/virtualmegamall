// User Dropdown Menu Toggle
function toggleUserMenu() {
    const dropdown = document.getElementById('user-dropdown');
    dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
    const userMenu = document.querySelector('.user-menu-wrapper');
    const dropdown = document.getElementById('user-dropdown');

    if (dropdown && !userMenu.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});
