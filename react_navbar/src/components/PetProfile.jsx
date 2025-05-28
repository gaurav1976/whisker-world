import React, { useEffect, useState } from "react";
import "../css/Profile.css"; // Use the same styling as the profile page
import { FaEdit } from "react-icons/fa";

const PetProfile = ({ userId }) => {
  const [pet, setPet] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    description: "",
    photo: "", // Default placeholder
  });

  const [image, setImage] = useState(pet.photo);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedPets = JSON.parse(localStorage.getItem("pets")) || [];
    const userPet = storedPets.find((p) => p.owner === (userId || "guest")) || null;
    if (userPet) {
      setPet(userPet);
      setImage(userPet.photo || "");
    }
  }, [userId]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setPet((prevPet) => ({ ...prevPet, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("pets", JSON.stringify([pet]));
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <label htmlFor="imageUpload" className="profile-image-container">
          <img src={image} alt="Pet" className="profile-image" />
          <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} hidden />
        </label>
        <h2>{pet.name || "Pet Name"}</h2>
        <div className="user-details">
          <p>
            <strong>Breed:</strong>
            {isEditing ? <input type="text" name="breed" value={pet.breed} onChange={handleChange} /> : <span>{pet.breed || "N/A"}</span>}
          </p>
          <p>
            <strong>Age:</strong>
            {isEditing ? <input type="text" name="age" value={pet.age} onChange={handleChange} /> : <span>{pet.age || "N/A"}</span>}
          </p>
          <p>
            <strong>Weight:</strong>
            {isEditing ? <input type="text" name="weight" value={pet.weight} onChange={handleChange} /> : <span>{pet.weight || "N/A"}</span>}
          </p>
          <p>
            <strong>Description:</strong>
            {isEditing ? <input type="text" name="description" value={pet.description} onChange={handleChange} /> : <span>{pet.description || "N/A"}</span>}
          </p>
        </div>
        {isEditing ? (
          <button className="edit-btn" onClick={handleSave}>Save</button>
        ) : (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
        )}
      </div>
    </div>
  );
};

export default PetProfile;
