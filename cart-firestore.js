/**
 * Cart Management with Firestore
 * Virtual Mega Mall - Cloud-synced Shopping Cart
 */

// ==================== ADD TO CART ====================
async function addToCartFirestore(product) {
    const user = firebase.auth().currentUser;

    if (!user) {
        const returnUrl = window.location.pathname + window.location.search;
        window.location.href = `login.html?return=${encodeURIComponent(returnUrl)}`;
        return { success: false, error: 'Not authenticated' };
    }

    try {
        // Ensure product has an ID
        const productId = product.id || product.name.replace(/\s+/g, '-').toLowerCase();

        const cartRef = db.collection('users').doc(user.uid).collection('cart').doc(productId);
        const doc = await cartRef.get();

        if (doc.exists) {
            // Product exists, increase quantity
            const currentQty = doc.data().quantity || 1;
            await cartRef.update({
                quantity: currentQty + 1,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } else {
            // New product, add to cart
            await cartRef.set({
                id: productId,
                name: product.name,
                price: product.price,
                brand: product.brand || 'Brand',
                imageUrl: product.img || product.imageUrl || 'https://via.placeholder.com/200',
                quantity: product.qty || 1,
                size: product.size || null,
                color: product.color || null,
                addedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Error adding to cart:', error);
        return { success: false, error: error.message };
    }
}

// ==================== GET CART ITEMS (Real-time) ====================
function getCartItemsLive(callback) {
    const user = firebase.auth().currentUser;

    if (!user) {
        callback([]);
        return null;
    }

    return db.collection('users')
        .doc(user.uid)
        .collection('cart')
        .orderBy('addedAt', 'desc')
        .onSnapshot(snapshot => {
            const items = [];
            snapshot.forEach(doc => {
                items.push({ id: doc.id, ...doc.data() });
            });
            callback(items);
        }, error => {
            console.error('Error fetching cart:', error);
            callback([]);
        });
}

// ==================== GET CART ITEMS (One-time) ====================
async function getCartItems() {
    const user = firebase.auth().currentUser;

    if (!user) {
        return [];
    }

    try {
        const snapshot = await db.collection('users')
            .doc(user.uid)
            .collection('cart')
            .orderBy('addedAt', 'desc')
            .get();

        const items = [];
        snapshot.forEach(doc => {
            items.push({ id: doc.id, ...doc.data() });
        });

        return items;
    } catch (error) {
        console.error('Error getting cart:', error);
        return [];
    }
}

// ==================== UPDATE QUANTITY ====================
async function updateCartQuantity(productId, quantity) {
    const user = firebase.auth().currentUser;

    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        if (quantity <= 0) {
            return await removeFromCart(productId);
        }

        // Max quantity limit
        if (quantity > 10) {
            quantity = 10;
        }

        await db.collection('users')
            .doc(user.uid)
            .collection('cart')
            .doc(productId)
            .update({
                quantity: quantity,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

        return { success: true };
    } catch (error) {
        console.error('Error updating quantity:', error);
        return { success: false, error: error.message };
    }
}

// ==================== REMOVE FROM CART ====================
async function removeFromCart(productId) {
    const user = firebase.auth().currentUser;

    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        await db.collection('users')
            .doc(user.uid)
            .collection('cart')
            .doc(productId)
            .delete();

        return { success: true };
    } catch (error) {
        console.error('Error removing from cart:', error);
        return { success: false, error: error.message };
    }
}

// ==================== CLEAR CART ====================
async function clearCart() {
    const user = firebase.auth().currentUser;

    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        const batch = db.batch();
        const snapshot = await db.collection('users')
            .doc(user.uid)
            .collection('cart')
            .get();

        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        return { success: true };
    } catch (error) {
        console.error('Error clearing cart:', error);
        return { success: false, error: error.message };
    }
}

// ==================== GET CART COUNT ====================
async function getCartCount() {
    const user = firebase.auth().currentUser;

    if (!user) {
        return 0;
    }

    try {
        const snapshot = await db.collection('users')
            .doc(user.uid)
            .collection('cart')
            .get();

        let total = 0;
        snapshot.forEach(doc => {
            total += doc.data().quantity || 1;
        });

        return total;
    } catch (error) {
        console.error('Error getting cart count:', error);
        return 0;
    }
}

// ==================== UPDATE CART BADGE ====================
async function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;

    const count = await getCartCount();
    badge.textContent = count;

    // Animate badge
    if (count > 0) {
        badge.style.animation = 'none';
        setTimeout(() => {
            badge.style.animation = 'pulse 0.3s ease';
        }, 10);
    }
}

// ==================== MIGRATE LOCALSTORAGE CART ====================
async function migrateLocalStorageCart() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    const localCart = localStorage.getItem('cart');
    if (!localCart) return;

    try {
        const items = JSON.parse(localCart);
        if (!items || items.length === 0) return;

        let migratedCount = 0;
        for (const item of items) {
            const result = await addToCartFirestore(item);
            if (result.success) migratedCount++;
        }

        // Clear localStorage cart
        localStorage.removeItem('cart');

        if (migratedCount > 0) {
            showAuthToast(`${migratedCount} item${migratedCount > 1 ? 's' : ''} moved to your cloud cart!`, 'success');
        }
    } catch (error) {
        console.error('Error migrating cart:', error);
    }
}

// ==================== INITIALIZE CART BADGE LISTENER ====================
function initCartBadgeListener() {
    firebase.auth().onAuthStateChanged(async user => {
        const badge = document.getElementById('cart-badge');
        if (!badge) return;

        if (user) {
            // Initial count
            const count = await getCartCount();
            badge.textContent = count;

            // Real-time listener
            db.collection('users')
                .doc(user.uid)
                .collection('cart')
                .onSnapshot(() => {
                    updateCartBadge();
                });
        } else {
            badge.textContent = '0';
        }
    });
}

// Auto-initialize on page load
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCartBadgeListener);
    } else {
        initCartBadgeListener();
    }
}
