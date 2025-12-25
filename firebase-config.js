/**
 * Firebase Configuration
 * Virtual Mega Mall - Authentication & Database
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a new project or select existing "Virtual Mega Mall"
 * 3. Go to Project Settings → General → Your apps
 * 4. If no web app exists, click "Add app" and select Web (</>)
 * 5. Copy the firebaseConfig object and replace the placeholder below
 */

// Firebase Configuration - Virtual Mega Mall
const firebaseConfig = {
    apiKey: "AIzaSyA8jD3BgvXhn7L06pEFzPEsHqErZYP6Lrs",
    authDomain: "virtual-mega-mall.firebaseapp.com",
    projectId: "virtual-mega-mall",
    storageBucket: "virtual-mega-mall.firebasestorage.app",
    messagingSenderId: "1054738442654",
    appId: "1:1054738442654:web:3fc66e363952313bb18e8f"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
}

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Enable persistence (offline support)
db.enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.warn('Multiple tabs open, persistence enabled in first tab only');
        } else if (err.code == 'unimplemented') {
            console.warn('Browser does not support persistence');
        }
    });

// Export for use in other files
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseStorage = storage;
