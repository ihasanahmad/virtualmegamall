/**
 * Admin Route Guard
 * Ensures only vendors can access admin dashboard
 */

// Check authentication and vendor role
firebase.auth().onAuthStateChanged(async user => {
    const loadingEl = document.getElementById('loading-screen');

    if (!user) {
        // Not logged in, redirect to login
        window.location.href = 'login.html?return=admin.html';
        return;
    }

    try {
        // Check if user has vendor role
        const userDoc = await db.collection('users').doc(user.uid).get();

        if (!userDoc.exists) {
            showAuthToast('User data not found. Please contact support.', 'error');
            setTimeout(() => window.location.href = 'index.html', 2000);
            return;
        }

        const userData = userDoc.data();

        if (userData.role !== 'vendor') {
            showAuthToast('Access denied. This page is for vendors only.', 'error');
            setTimeout(() => window.location.href = 'index.html', 2000);
            return;
        }

        // User is authorized vendor
        if (loadingEl) loadingEl.style.display = 'none';
        if (typeof initAdminDashboard === 'function') {
            initAdminDashboard(user, userData);
        }

    } catch (error) {
        console.error('Error checking user role:', error);
        showAuthToast('Error loading dashboard', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
    }
});
