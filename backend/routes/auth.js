const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin"); // ✅ Use correct model

const router = express.Router();

// ✅ ADMIN SIGNUP
router.post("/admin/signup", async (req, res) => {
  const { name, email, password, role, secretKey } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  // Super admin secret check (if needed)
  if (role === "superadmin" && secretKey !== process.env.SUPER_ADMIN_SECRET) {
    return res.status(403).json({ error: "Invalid secret key for super admin!" });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword, role });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error signing up admin", details: error.message });
  }
});

// ✅ ADMIN LOGIN
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "Admin not found!" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Admin login successful!",
      token,
      admin: { name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});

// ✅ Middleware
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    req.adminRole = decoded.role;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = { router, adminAuth };