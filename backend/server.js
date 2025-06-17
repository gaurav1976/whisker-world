const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Food = require("./models/Food");

dotenv.config();
const app = express();
app.use(express.json());

// ✅ Dynamic CORS
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://whisker-world-rhgh.vercel.app",
      "https://admin-panel-ten-dun.vercel.app"
    ];
    const vercelPreviewRegex = /^https:\/\/admin-panel-[\w-]+\.vercel\.app$/;
    if (!origin || allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS BLOCKED:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ✅ Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// ✅ Multer config
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
});
const User = mongoose.model("User", userSchema);

// ✅ Blog Schema
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  image: String,
  date: { type: Date, default: Date.now },
});
const Blog = mongoose.model("Blog", blogSchema);

// ✅ Pet Schema
const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  description: String,
  photo: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Pet = mongoose.model("Pet", petSchema);

//////////////////////////////////////////
// ✅ Routes
//////////////////////////////////////////

// Register
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required!" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Error signing up", details: err.message });
  }
});

// Admin Signup
app.post("/admin/signup", async (req, res) => {
  const { name, email, password, role, secretKey } = req.body;
  if (!name || !email || !password || !role)
    return res.status(400).json({ error: "All fields are required!" });

  if (role === "superadmin" && secretKey !== process.env.SUPERADMIN_SECRET_KEY)
    return res.status(403).json({ error: "Invalid super admin secret key" });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Admin email already exists!" });

    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = new User({ name, email, password: hashed, role });
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Error signing up admin", details: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials!" });

    const token = jwt.sign({ id: user._id, role: user.role }, "your_secret_key", { expiresIn: "1h" });
    res.json({ message: "Login successful!", token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

// Admin Login
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.status(400).json({ error: "Admin not found!" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials!" });

    const token = jwt.sign({ id: admin._id, role: admin.role }, "your_secret_key", { expiresIn: "1h" });
    res.json({ message: "Admin login successful!", token, admin: { name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) {
    res.status(500).json({ error: "Admin login failed", details: err.message });
  }
});

// Get Users
app.get("/users", async (_, res) => {
  try {
    const users = await User.find({}, { name: 1, email: 1, createdAt: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users", details: err.message });
  }
});

//////////////////////////////////////////
// Food Routes
//////////////////////////////////////////

app.get("/foods", async (_, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: "Error fetching food items", details: err.message });
  }
});

app.post("/foods", upload.single("image"), async (req, res) => {
  try {
    const { name, price } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
    const food = new Food({ name, price, image: imageUrl });
    await food.save();
    res.status(201).json({ message: "Food Item Added Successfully", newFood: food });
  } catch (err) {
    res.status(500).json({ error: "Error adding food", details: err.message });
  }
});

app.put("/foods/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price } = req.body;
    const update = { name, price };
    if (req.file) update.image = `/uploads/${req.file.filename}`;

    const updated = await Food.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ error: "Food item not found" });
    res.json({ message: "Food Updated", updatedFood: updated });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
});

app.delete("/foods/:id", async (req, res) => {
  try {
    const deleted = await Food.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Food not found" });

    if (deleted.image) {
      const imgPath = path.join(__dirname, deleted.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    res.json({ message: "Food Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
});

//////////////////////////////////////////
// Blog Routes
//////////////////////////////////////////

app.get("/blogs", async (_, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Error fetching blogs", details: err.message });
  }
});

app.post("/blogs", upload.single("image"), async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
    const blog = new Blog({ title, content, author, image: imageUrl });
    await blog.save();
    res.status(201).json({ message: "Blog Added", newBlog: blog });
  } catch (err) {
    res.status(500).json({ error: "Error adding blog", details: err.message });
  }
});

app.put("/blogs/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const update = { title, content, author };
    if (req.file) update.image = `/uploads/${req.file.filename}`;

    const updated = await Blog.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ error: "Blog not found" });
    res.json({ message: "Blog Updated", updatedBlog: updated });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
});

app.delete("/blogs/:id", async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Blog not found" });

    if (deleted.image) {
      const imgPath = path.join(__dirname, deleted.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    res.json({ message: "Blog Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
});

//////////////////////////////////////////
// Pet Routes
//////////////////////////////////////////

app.post("/api/pets/create", upload.single("photo"), async (req, res) => {
  try {
    const { name, breed, age, weight, description, owner } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
    const pet = new Pet({ name, breed, age, weight, description, photo: imageUrl, owner });
    await pet.save();
    res.status(201).json({ message: "Pet added!", pet });
  } catch (err) {
    res.status(500).json({ error: "Error adding pet", details: err.message });
  }
});

app.get("/api/pets/owner/:ownerId", async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.params.ownerId });
    if (!pets.length) return res.status(404).json({ message: "No pets found." });
    res.json({ pets });
  } catch (err) {
    res.status(500).json({ error: "Error fetching pets", details: err.message });
  }
});

//////////////////////////////////////////

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));