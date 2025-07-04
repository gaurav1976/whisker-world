const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Food = require("./models/Food"); // ✅ Import the Food model

dotenv.config();
const app = express();
app.use(express.json());

// ✅ Updated dynamic CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://whisker-world-rhgh.vercel.app",  // ✅ Your Vercel frontend
      "https://admin-panel-ten-dun.vercel.app"  // ✅ Your admin panel
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
app.options("*", cors(corsOptions)); // Explicitly handle preflight requests

// ✅ Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// upper code chage//////////////////////////////
// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((error) => console.log("❌ MongoDB Connection Error:", error));

// ✅ User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" }, // <-- Role field
  createdAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("Whisker World API is running!");
});

// fetch all foods items:
app.get("/foods", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    console.error("Error fetching foods:", error.message);
    res.status(500).json({
      error: "Error fetching food items",
      details: error.message,
    });
  }
});


// ✅ Blog Schema
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  image: String,
  date: { type: Date, default: Date.now },
});

const Blog = mongoose.model("Blog", blogSchema);

// ✅ Setup Multer for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ USER SIGNUP
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error signing up", details: error.message });
  }
});

// ✅ ADMIN SIGNUP
app.post("/admin/signup", async (req, res) => {
  const { name, email, password, role, secretKey } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  // Check secret key if superadmin
  if (role === "superadmin" && secretKey !== process.env.SUPERADMIN_SECRET_KEY) {
    return res.status(403).json({ error: "Invalid super admin secret key" });
  }

  try {
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({ name, email, password: hashedPassword, role });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error signing up admin", details: error.message });
  }
});


// ✅ USER LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, "your_secret_key", { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful!",
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// ✅ ADMIN LOGIN
app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(400).json({ error: "Admin not found!" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Admin login successful!",
      token,
      admin: { name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    res.status(500).json({ error: "Admin login failed", details: error.message });
  }
});



// ✅ Get All Users (Admin Panel)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { name: 1, email: 1, createdAt: 1 }); // ✅ Excluded password for security
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users", details: error.message });
  }
});

// ADD NEW FOOD ITEM (with Image Upload)

app.post("/foods", upload.single("image"), async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newFood = new Food({ name, price, image: imageUrl });
    await newFood.save();
    res.status(201).json({ message: "Food Item Added Successfully", newFood });
  } catch (error) {
    res.status(500).json({ error: "Error adding food item", details: error.message });
  }
});

// UPDATE FOOD ITEM BY ID (with Image Upload)

app.put("/foods/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price } = req.body;
    let updatedData = { name, price };

    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const updatedFood = await Food.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedFood) {
      return res.status(404).json({ error: "Food item not found" });
    }
    res.json({ message: "Food Item Updated Successfully", updatedFood });
  } catch (error) {
    res.status(500).json({ error: "Error updating foods item", details: error.message });
  }
});
//  DELETE FOOD ITEM BY ID

app.delete("/foods/:id", async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) {
      return res.status(404).json({ error: "Food item not found" });
    } 

    // Delete the image file if it exists
    if (deletedFood.image) {
      const imagePath = path.join(__dirname, deletedFood.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: "Food Item Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting foods item", details: error.message });
  }
});

//  GET ALL FOOD ITEMS

app.get("/foods", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: "Error fetching foods items", details: error.message });
  }
});




// ✅ GET ALL BLOGS
app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching blogs", details: error.message });
  }
});

// ✅ ADD NEW BLOG (with Image Upload)
app.post("/blogs", upload.single("image"), async (req, res) => {
  try {
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newBlog = new Blog({ title, content, author, image: imageUrl });
    await newBlog.save();
    res.status(201).json({ message: "Blog Added Successfully", newBlog });
  } catch (error) {
    res.status(500).json({ error: "Error adding blog", details: error.message });
  }
});

// ✅ UPDATE BLOG BY ID (with Image Upload)
app.put("/blogs/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, content, author } = req.body;
    let updatedData = { title, content, author };

    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json({ message: "Blog Updated Successfully", updatedBlog });
  } catch (error) {
    res.status(500).json({ error: "Error updating blog", details: error.message });
  }
});

// ✅ DELETE BLOG BY ID
app.delete("/blogs/:id", async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Delete the image file if it exists
    if (deletedBlog.image) {
      const imagePath = path.join(__dirname, deletedBlog.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: "Blog Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting blog", details: error.message });
  }
});

// ✅ Pet Schema
const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  description: String,
  photo: String, // Store image path
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Link pet to a user
});
app.post("/api/pets/create", upload.single("photo"), async (req, res) => {z
  try {
    const { name, breed, age, weight, description, owner } = req.body;
    if (!name || !breed || !age || !weight || !owner) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newPet = new Pet({
      name,
      breed,
      age,
      weight,
      description,
      photo: imageUrl,
      owner,
    });

    await newPet.save();
    res.status(201).json({ message: "Pet added successfully!", pet: newPet });
  } catch (error) {
    console.error("Error adding pet:", error);
    res.status(500).json({ error: "Error adding pet", details: error.message });
  }
});

const Pet = mongoose.model("Pet", petSchema);

// ✅ Get Pets by Owner ID
app.get("/api/pets/owner/:ownerId", async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.params.ownerId });
    if (!pets || pets.length === 0) {
      return res.status(404).json({ message: "No pets found for this owner." });
    }
    res.status(200).json({ pets });
  } catch (error) {
    res.status(500).json({ error: "Error fetching pets", details: error.message });
  }
});



// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));