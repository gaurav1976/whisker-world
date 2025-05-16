const express = require("express");
const multer = require("multer");
const Pet = require("../models/Pet"); // Pet Model

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Create Pet Profile
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, breed, age, weight, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const newPet = new Pet({ name, breed, age, weight, description, image });
    await newPet.save();

    res.status(201).json({ message: "Pet profile created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// ✅ Add a Pet
app.post("/api/pets/create", upload.single("photo"), async (req, res) => {
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
    res.status(500).json({ error: "Error adding pet", details: error.message });
  }
});


module.exports = router;
        