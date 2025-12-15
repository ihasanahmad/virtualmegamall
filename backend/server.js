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

// POST: Public - Add product (for demo/CSV upload)
app.post('/api/products', async (req, res) => {
    const product = new Product(req.body);
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// SEED: Populate demo products
app.get('/api/seed', async (req, res) => {
    try {
        const count = await Product.countDocuments();
        if (count > 0) {
            return res.json({ message: `Database already has ${count} products` });
        }
        
        const sampleProducts = [
            { name: 'Air Max 270', price: 'Rs. 24,000', brand: 'Nike', category: 'Shoes', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
            { name: 'Summer Lawn 3pc', price: 'Rs. 6,500', brand: 'Khaadi', category: 'Clothing', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400' },
            { name: 'Galaxy S24 Ultra', price: 'Rs. 450,000', brand: 'Samsung', category: 'Electronics', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400' },
            { name: 'Embroidered Kurta', price: 'Rs. 8,000', brand: 'Khaadi', category: 'Clothing', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
            { name: 'Ready to Wear', price: 'Rs. 5,500', brand: 'Sapphire', category: 'Clothing', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400' },
            { name: 'Galaxy Buds Pro', price: 'Rs. 45,000', brand: 'Samsung', category: 'Electronics', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400' },
            { name: 'Air Force 1', price: 'Rs. 18,000', brand: 'Nike', category: 'Shoes', img: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400' },
            { name: 'Kurta Shalwar', price: 'Rs. 7,500', brand: 'J.', category: 'Clothing', img: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=400' },
            { name: 'iPhone 15 Pro', price: 'Rs. 480,000', brand: 'Apple', category: 'Electronics', img: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400' },
            { name: 'Gold Necklace Set', price: 'Rs. 25,000', brand: 'Tesoro', category: 'Jewelry', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400' },
            { name: 'Party Heels', price: 'Rs. 4,500', brand: 'Stylo', category: 'Shoes', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400' },
            { name: 'MacBook Air', price: 'Rs. 350,000', brand: 'Apple', category: 'Electronics', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' },
        ];
        
        await Product.insertMany(sampleProducts);
        res.json({ message: `Seeded ${sampleProducts.length} products!`, products: sampleProducts });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));