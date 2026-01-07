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
            showAuthToast(result.error || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Sign in error:', error);
        showAuthToast('An error occurred. Please try again.', 'error');
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
            showAuthToast(result.error || 'Sign up failed', 'error');
        }
    } catch (error) {
        console.error('Sign up error:', error);
        showAuthToast('An error occurred. Please try again.', 'error');
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
            showAuthToast(result.error || 'Google sign in failed', 'error');
        }
    } catch (error) {
        console.error('Google sign in error:', error);
        showAuthToast('An error occurred. Please try again.', 'error');
    }
}

// Facebook Sign In Wrapper (Placeholder)
async function continueWithFacebook(role) {
    showAuthToast('Facebook login coming soon!', 'error');
    console.log('Facebook login not yet implemented');
}

// LinkedIn Sign In Wrapper (Placeholder)
async function continueWithLinkedin(role) {
    showAuthToast('LinkedIn login coming soon!', 'error');
    console.log('LinkedIn login not yet implemented');
}

console.log('✅ Login authentication wrappers loaded');
