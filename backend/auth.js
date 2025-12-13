const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = "my_super_secret_key_change_in_prod"; // In production, use process.env.JWT_SECRET

const User = require('./models/User');

// Register Logic
const register = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Check if user exists
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// Login Logic
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate Token
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ token, user: { email: user.email, role: user.role, name: user.email.split('@')[0] } });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Middleware to Protect Routes
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = { register, login, verifyToken };
