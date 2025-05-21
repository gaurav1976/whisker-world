const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // make sure this path is correct

const router = express.Router(); // ✅ Use router instead of app

// ✅ ADMIN SIGNUP
router.post("/admin/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({ name, email, password: hashedPassword, role: "admin" });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Signup failed", details: error.message });
  }
});

// ✅ ADMIN LOGIN
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email });
    if (!admin || admin.role !== "admin") {
      return res.status(400).json({ error: "Admin not found!" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, "your_secret_key", { expiresIn: "1h" });

    res.status(200).json({
      message: "Admin login successful!",
      token,
      admin: { name: admin.name, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});

// ✅ ADMIN AUTH MIDDLEWARE
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    if (decoded.role !== "admin") return res.status(403).json({ error: "Forbidden" });

    req.adminId = decoded.id;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// ✅ Export both router and middleware
module.exports = { router, adminAuth };
