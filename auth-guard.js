/**
 * Auth Guard - Protect Routes
 * Redirects to login if user is not authenticated
 */

function requireAuth(redirectPath = null) {
    // Wait for Firebase to initialize
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            // User not logged in, redirect to login
            const currentPath = redirectPath || window.location.pathname;
            const params = new URLSearchParams(window.location.search);
            const returnUrl = params.get('return') || currentPath;

            window.location.href = `login.html?return=${encodeURIComponent(returnUrl)}`;
        }
    });
}

// Auto-execute if this script is included in a protected page
if (typeof window !== 'undefined' && window.location.pathname !== '/login.html') {
    // Check if we're on a protected page
    const protectedPages = ['profile.html', 'cart.html', 'payment.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage)) {
        requireAuth();
    }
}
