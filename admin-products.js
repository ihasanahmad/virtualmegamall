/**
 * Admin Product Management
 * CRUD operations for vendor products
 */

// Global products array for real-time updates
let vendorProducts = [];
let productsUnsubscribe = null;

// ==================== ADD PRODUCT ====================
async function addProduct(formData) {
    const user = firebase.auth().currentUser;
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
        // Get form values
        const name = formData.get('name');
        const brand = formData.get('brand');
        const price = formData.get('price');
        const category = formData.get('category');
        const description = formData.get('description');
        const stock = parseInt(formData.get('stock')) || 0;
        const featured = formData.get('featured') === 'on';
        const imageFile = formData.get('image');

        // Validate
        if (!name || !brand || !price || !category || !imageFile) {
            return { success: false, error: 'All fields are required' };
        }

        // Create product ID
        const productRef = db.collection('products').doc();
        const productId = productRef.id;

        // Upload image to Firebase Storage
        const storageRef = firebase.storage().ref(`products/${productId}/main.jpg`);
        await storageRef.put(imageFile);
        const imageUrl = await storageRef.getDownloadURL();

        // Add product to Firestore
        await productRef.set({
            name,
            brand,
            price,
            category,
            description: description || '',
            imageUrl,
            stock,
            featured,
            vendorId: user.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        return { success: true, productId };

    } catch (error) {
        console.error('Error adding product:', error);
        return { success: false, error: error.message };
    }
}

// ==================== UPDATE PRODUCT ====================
async function updateProduct(productId, updates) {
    const user = firebase.auth().currentUser;
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
        // Check ownership
        const productDoc = await db.collection('products').doc(productId).get();
        if (!productDoc.exists) {
            return { success: false, error: 'Product not found' };
        }

        if (productDoc.data().vendorId !== user.uid) {
            return { success: false, error: 'Unauthorized' };
        }

        // Update product
        await db.collection('products').doc(productId).update({
            ...updates,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        return { success: true };

    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, error: error.message };
    }
}

// ==================== DELETE PRODUCT ====================
async function deleteProduct(productId) {
    const user = firebase.auth().currentUser;
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
        // Check ownership
        const productDoc = await db.collection('products').doc(productId).get();
        if (!productDoc.exists) {
            return { success: false, error: 'Product not found' };
        }

        if (productDoc.data().vendorId !== user.uid) {
            return { success: false, error: 'Unauthorized' };
        }

        // Delete image from storage
        try {
            const imageRef = firebase.storage().ref(`products/${productId}/main.jpg`);
            await imageRef.delete();
        } catch (storageError) {
            console.warn('Image deletion failed:', storageError);
        }

        // Delete product from Firestore
        await db.collection('products').doc(productId).delete();

        return { success: true };

    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, error: error.message };
    }
}

// ==================== GET VENDOR PRODUCTS (Real-time) ====================
function getVendorProducts(vendorId, callback) {
    return db.collection('products')
        .where('vendorId', '==', vendorId)
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            const products = [];
            snapshot.forEach(doc => {
                products.push({ id: doc.id, ...doc.data() });
            });
            callback(products);
        }, error => {
            console.error('Error fetching products:', error);
            callback([]);
        });
}

// ==================== RENDER PRODUCTS TABLE ====================
function renderProductsTable(products) {
    const tbody = document.getElementById('products-tbody');
    if (!tbody) return;

    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:40px; color:#888;">
                    <i class="fa-solid fa-box-open" style="font-size:40px; margin-bottom:15px; display:block;"></i>
                    No products yet. Add your first product above!
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.imageUrl}" alt="${product.name}" style="width:60px; height:60px; object-fit:cover; border-radius:8px;"></td>
            <td>${product.name}</td>
            <td>${product.brand}</td>
            <td>${product.price}</td>
            <td>${product.stock} <span style="color:${product.stock > 0 ? '#4CAF50' : '#ff4757'}">${product.stock > 0 ? '✓' : '✗'}</span></td>
            <td>
                <button class="action-btn edit-btn" onclick="editProduct('${product.id}')" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="action-btn delete-btn" onclick="confirmDeleteProduct('${product.id}', '${product.name}')" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ==================== EDIT PRODUCT ====================
async function editProduct(productId) {
    const product = vendorProducts.find(p => p.id === productId);
    if (!product) return;

    // Populate form
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-brand').value = product.brand;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-featured').checked = product.featured;

    // Change form to edit mode
    const form = document.getElementById('product-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Update Product';
    submitBtn.dataset.editId = productId;

    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
}

// ==================== CONFIRM DELETE ====================
function confirmDeleteProduct(productId, productName) {
    if (confirm(`Are you sure you want to delete "${productName}"?\n\nThis action cannot be undone.`)) {
        handleDeleteProduct(productId);
    }
}

async function handleDeleteProduct(productId) {
    const result = await deleteProduct(productId);

    if (result.success) {
        showToast('Product deleted successfully', 'success');
    } else {
        showToast(result.error, 'error');
    }
}

// ==================== SHOW TOAST ====================
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.admin-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'admin-toast ' + type;
    toast.innerHTML = `
        <i class="fa-solid fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#ff4757'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.5s forwards;
        display: flex;
        align-items: center;
        gap: 10px;
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Add animation styles
if (!document.getElementById('admin-toast-styles')) {
    const style = document.createElement('style');
    style.id = 'admin-toast-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}
