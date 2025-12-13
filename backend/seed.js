const mongoose = require('mongoose');
require('dotenv').config();

// 1. Connect to MongoDB (Fixed: Removed deprecated options)
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected for Seeding"))
.catch(err => {
    console.log("❌ DB Connection Failed:", err);
    process.exit(1);
});

// 2. Define the Blueprint (Schema) - Must match server.js
const productSchema = new mongoose.Schema({
    name: String,
    price: String,
    brand: String,
    category: String,
    img: String
});

const Product = mongoose.model('Product', productSchema);

// 3. The Data to Upload (Real Products)
const products = [
    // --- FEATURED HIGHLIGHTS ---
    { name: "Air Jordan 1 High", brand: "Nike", price: "Rs. 38,000", img: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/custom-nike-dunk-high-by-you-shoes.png", category: "shoes" },
    { name: "Galaxy S24 Ultra", brand: "Samsung", price: "Rs. 399,999", img: "https://images.samsung.com/is/image/samsung/p6pim/pk/sm-s928bzkqpkd/gallery/pk-galaxy-s24-s928-sm-s928bzkqpkd-539304675?$650_519_PNG$", category: "tech" },
    { name: "MacBook Air M2", brand: "Apple", price: "Rs. 350,000", img: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665", category: "tech" },
    
    // --- CLOTHING ---
    { name: "Kameez Shalwar (Men)", brand: "J. Junaid Jamshed", price: "Rs. 8,500", img: "https://via.placeholder.com/300x300?text=J.+Junaid+Jamshed", category: "clothing" },
    { name: "Printed Lawn 3pc", brand: "Khaadi", price: "Rs. 4,500", img: "https://via.placeholder.com/300x300?text=Khaadi+Lawn", category: "clothing" },
    { name: "Ready to Wear Kurta", brand: "Sapphire", price: "Rs. 3,990", img: "https://via.placeholder.com/300x300?text=Sapphire+Kurta", category: "clothing" },
    { name: "Graphic Tee", brand: "Outfitters", price: "Rs. 1,990", img: "https://via.placeholder.com/300x300?text=Outfitters+Tee", category: "clothing" },
    { name: "Unstitched Fabric", brand: "Gul Ahmed", price: "Rs. 6,000", img: "https://via.placeholder.com/300x300?text=Gul+Ahmed", category: "clothing" },
    
    // --- SHOES ---
    { name: "Formal Leather", brand: "Bata", price: "Rs. 6,000", img: "https://via.placeholder.com/300x300?text=Bata+Shoes", category: "shoes" },
    { name: "Sports Runners", brand: "Ndure", price: "Rs. 3,000", img: "https://via.placeholder.com/300x300?text=Ndure+Sports", category: "shoes" },
    
    // --- TECH ---
    { name: "Redmi Note 13", brand: "Xiaomi", price: "Rs. 55,000", img: "https://via.placeholder.com/300x300?text=Xiaomi+Redmi", category: "tech" },
    { name: "WH-1000XM5", brand: "Sony", price: "Rs. 85,000", img: "https://via.placeholder.com/300x300?text=Sony+Headphones", category: "tech" }
];

// 4. Run the Import
const importData = async () => {
    try {
        await Product.deleteMany(); // Clear old data first
        await Product.insertMany(products); // Add new data
        console.log("✅ Data Imported Successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Error with data import:", error);
        process.exit(1);
    }
};

// Wait for connection before importing
mongoose.connection.once('open', () => {
    importData();