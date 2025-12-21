/**
 * Authentication Utilities
 * Virtual Mega Mall - Firebase Auth Helper Functions
 */

// ==================== SIGN UP ====================
async function signUp(email, password, displayName) {
    try {
        // Create user with email and password
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Update profile with display name
        await user.updateProfile({
            displayName: displayName
        });

        // Create user document in Firestore
        await db.collection('users').doc(user.uid).set({
            email: email,
            displayName: displayName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            cartCount: 0
        });

        console.log('✅ User created:', user.uid);
        return { success: true, user };
    } catch (error) {
        console.error('❌ Sign up error:', error);
        return { success: false, error: getErrorMessage(error.code) };
    }
}

// ==================== SIGN IN ====================
async function signIn(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('✅ User signed in:', userCredential.user.uid);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('❌ Sign in error:', error);
        return { success: false, error: getErrorMessage(error.code) };
    }
}

// ==================== GOOGLE SIGN IN ====================
async function signInWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        const user = result.user;

        // Check if new user, create Firestore document
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (!userDoc.exists) {
            await db.collection('users').doc(user.uid).set({
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                cartCount: 0,
                provider: 'google'
            });
        }

        console.log('✅ Google sign in successful:', user.uid);
        return { success: true, user };
    } catch (error) {
        console.error('❌ Google sign in error:', error);
        return { success: false, error: getErrorMessage(error.code) };
    }
}

// ==================== SIGN OUT ====================
async function signOut() {
    try {
        await auth.signOut();
        console.log('✅ User signed out');
        window.location.href = 'index.html';
        return { success: true };
    } catch (error) {
        console.error('❌ Sign out error:', error);
        return { success: false, error: error.message };
    }
}

// ==================== GET CURRENT USER ====================
function getCurrentUser() {
    return auth.currentUser;
}

// ==================== CHECK IF USER IS LOGGED IN ====================
function isUserLoggedIn() {
    return auth.currentUser !== null;
}

// ==================== AUTH STATE LISTENER ====================
function onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
}

// ==================== PASSWORD RESET ====================
async function resetPassword(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        return { success: true, message: 'Password reset email sent!' };
    } catch (error) {
        console.error('❌ Password reset error:', error);
        return { success: false, error: getErrorMessage(error.code) };
    }
}

// ==================== UPDATE PROFILE ====================
async function updateUserProfile(displayName, photoURL) {
    try {
        const user = auth.currentUser;
        await user.updateProfile({ displayName, photoURL });

        // Update Firestore
        await db.collection('users').doc(user.uid).update({
            displayName,
            photoURL,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        console.error('❌ Profile update error:', error);
        return { success: false, error: error.message };
    }
}

// ==================== DELETE ACCOUNT ====================
async function deleteAccount() {
    try {
        const user = auth.currentUser;

        // Delete user data from Firestore
        await db.collection('users').doc(user.uid).delete();

        // Delete cart
        const cartRef = db.collection('users').doc(user.uid).collection('cart');
        const cartSnapshot = await cartRef.get();
        const batch = db.batch();
        cartSnapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();

        // Delete user account
        await user.delete();

        window.location.href = 'index.html';
        return { success: true };
    } catch (error) {
        console.error('❌ Account deletion error:', error);
        return { success: false, error: error.message };
    }
}

// ==================== ERROR MESSAGES ====================
function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered. Please login instead.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
        'auth/cancelled-popup-request': 'Only one popup request is allowed at a time.'
    };

    return errorMessages[errorCode] || 'An error occurred. Please try again.';
}

// ==================== SHOW TOAST NOTIFICATION ====================
function showAuthToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `auth-toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(style);
