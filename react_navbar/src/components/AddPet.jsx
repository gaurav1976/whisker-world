import React, { useState } from "react";
import "../css/AddPet.css";

const AddPet = ({ userId, onPetAdded }) => {
  const [pet, setPet] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    description: "",
    image: null,
    imagePreview: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPet({
          ...pet,
          image: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!pet.name || !pet.breed || !pet.age || !pet.weight) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // Get existing pets from localStorage or initialize empty array
    const existingPets = JSON.parse(localStorage.getItem("pets")) || [];
    
    // Create new pet object
    const newPet = {
      id: Date.now().toString(),
      name: pet.name,
      breed: pet.breed,
      age: pet.age,
      weight: pet.weight,
      description: pet.description,
      photo: pet.imagePreview, // Store image as data URL
      owner: userId || "guest", // Use provided userId or "guest"
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem("pets", JSON.stringify([...existingPets, newPet]));

    // Reset form
    setPet({
      name: "",
      breed: "",
      age: "",
      weight: "",
      description: "",
      image: null,
      imagePreview: null
    });

    setSuccess("Pet added successfully!");
    setLoading(false);

    // Notify parent component
    if (onPetAdded) onPetAdded();
  };

  return (
    <div className="add-pet">
      <div className="add-pet-container">
        <h2>Add Your Pet</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        
        <form onSubmit={handleSubmit} className="pet-form">
          <input 
            type="text" 
            name="name" 
            placeholder="Pet Name *" 
            value={pet.name} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="breed" 
            placeholder="Breed *" 
            value={pet.breed} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="number" 
            name="age" 
            placeholder="Age *" 
            value={pet.age} 
            onChange={handleChange} 
            min="0"
            required 
          />
          <input 
            type="number" 
            name="weight" 
            placeholder="Weight (kg) *" 
            value={pet.weight} 
            onChange={handleChange} 
            min="0"
            step="1"
            required 
          />
          <textarea 
            name="description" 
            placeholder="Description" 
            value={pet.description} 
            onChange={handleChange}
          ></textarea>
          
          <div className="image-upload">
          <label className="custom-file-upload">
    Choose Pet Photo
    <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        style={{ display: 'none' }}
    />
</label>
            {pet.imagePreview && (
              <div className="image-preview">
                <img src={pet.imagePreview} alt="Preview" />
              </div>
            )}
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Pet"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPet;