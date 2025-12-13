// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware (Security & Data handling)
app.use(cors()); // Allows your frontend to talk to this backend
app.use(express.json()); // Allows server to read JSON data

// 1. DATABASE CONNECTION (MongoDB)
// (We will add the real link in Step 3)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/virtualmall')
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ DB Connection Error:", err));

// IMPORT AUTH HANDLERS
const { register, login, verifyToken } = require('./auth');

// AUTH ROUTES
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// 2. DEFINE THE PRODUCT SCHEMA (The Blueprint)
const productSchema = new mongoose.Schema({
    name: String,
    price: String,
    brand: String, // This ensures Vendor Isolation
    category: String,
    img: String,
    specs: Object
});

const Product = mongoose.model('Product', productSchema);

// 3. API ROUTES (The Endpoints)

// GET: Public - Send all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Add a new product (Protected - Vendor Only)
app.post('/api/products', verifyToken, async (req, res) => {
    // RBAC Check
    if (req.user.role !== 'vendor' && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access Denied: Vendors Only" });
    }

    const product = new Product(req.body);
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 4. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));