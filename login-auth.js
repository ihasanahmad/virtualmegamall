/**
 * Login Page Authentication Wrappers
 * This file bridges login.html with auth.js functions
 */

// Email Sign In Wrapper
async function signInWithEmail(email, password, role) {
    try {
        const result = await signIn(email, password);

        if (result.success) {
            // Store role
            localStorage.setItem('userRole', role);

            // Get return URL from query params
            const urlParams = new URLSearchParams(window.location.search);
            const returnUrl = urlParams.get('return') || (role === 'vendor' ? 'vendor-dash.html' : 'index.html');

            showAuthToast('✅ Login successful! Redirecting...', 'success');

            // Redirect after short delay
            setTimeout(() => {
                window.location.href = returnUrl;
            }, 1000);
        } else {
            // Show specific error message from auth.js
            showAuthToast(result.error || '❌ Login failed', 'error');
        }
    } catch (error) {
        console.error('Sign in error:', error);

        // Show user-friendly error messages based on Firebase error codes
        let userMessage = '❌ An error occurred. Please try again.';

        if (error.code === 'auth/invalid-login-credentials' || error.code === 'auth/user-not-found') {
            userMessage = '❌ Account doesn\'t exist. Click "Sign Up" to create one!';
        } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            userMessage = '❌ Incorrect password. Please try again.';
        } else if (error.code === 'auth/invalid-email') {
            userMessage = '❌ Invalid email format.';
        } else if (error.code === 'auth/too-many-requests') {
            userMessage = '❌ Too many failed attempts. Try again later.';
        } else if (error.code === 'auth/network-request-failed') {
            userMessage = '❌ Network error. Check your internet.';
        } else if (error.message) {
            // Show cleaned Firebase error message
            userMessage = '❌ ' + error.message.replace('Firebase: ', '').replace(/\(auth\/.*?\)\.?/, '').trim();
        }

        showAuthToast(userMessage, 'error');
    }
}

// Email Sign Up Wrapper
async function signUpWithEmail(displayName, email, password, role) {
    try {
        const result = await signUp(email, password, displayName);

        if (result.success) {
            // Store role
            localStorage.setItem('userRole', role);

            showAuthToast('✅ Account created successfully! Redirecting...', 'success');

            // Redirect to appropriate dashboard
            setTimeout(() => {
                const returnUrl = role === 'vendor' ? 'vendor-dash.html' : 'index.html';
                window.location.href = returnUrl;
            }, 1000);
        } else {
            // Show specific error from auth.js
            showAuthToast(result.error || '❌ Sign up failed', 'error');
        }
    } catch (error) {
        console.error('Sign up error:', error);

        let userMessage = '❌ An error occurred. Please try again.';

        if (error.code === 'auth/email-already-in-use') {
            userMessage = '❌ Email already registered. Please sign in instead!';
        } else if (error.code === 'auth/weak-password') {
            userMessage = '❌ Password too weak. Use at least 6 characters.';
        } else if (error.code === 'auth/invalid-email') {
            userMessage = '❌ Invalid email format.';
        } else if (error.message) {
            userMessage = '❌ ' + error.message.replace('Firebase: ', '').replace(/\(auth\/.*?\)\.?/, '').trim();
        }

        showAuthToast(userMessage, 'error');
    }
}

// Google Sign In Wrapper
async function continueWithGoogle(role) {
    try {
        const result = await signInWithGoogle();

        if (result.success) {
            localStorage.setItem('userRole', role);

            // Get return URL
            const urlParams = new URLSearchParams(window.location.search);
            const returnUrl = urlParams.get('return') || (role === 'vendor' ? 'vendor-dash.html' : 'index.html');

            showAuthToast('✅ Google sign in successful!', 'success');

            setTimeout(() => {
                window.location.href = returnUrl;
            }, 1000);
        } else {
            showAuthToast(result.error || '❌ Google sign in failed', 'error');
        }
    } catch (error) {
        console.error('Google sign in error:', error);

        let userMessage = '❌ Google sign-in failed';

        if (error.code === 'auth/unauthorized-domain') {
            userMessage = '❌ Google login not configured for this domain. Please use email/password for now.';
        } else if (error.code === 'auth/popup-closed-by-user') {
            userMessage = 'ℹ️ Sign-in popup was closed. Please try again.';
        } else if (error.message) {
            userMessage = '❌ ' + error.message.replace('Firebase: ', '').replace(/\(auth\/.*?\)\.?/, '').trim();
        }

        showAuthToast(userMessage, 'error');
    }
}

// Facebook Sign In Wrapper (Placeholder)
async function continueWithFacebook(role) {
    showAuthToast('ℹ️ Facebook login coming soon! Use email/password for now.', 'error');
    console.log('Facebook login not yet implemented');
}

// LinkedIn Sign In Wrapper (Placeholder)
async function continueWithLinkedin(role) {
    showAuthToast('ℹ️ LinkedIn login coming soon! Use email/password for now.', 'error');
    console.log('LinkedIn login not yet implemented');
}

console.log('✅ Login authentication wrappers loaded');
