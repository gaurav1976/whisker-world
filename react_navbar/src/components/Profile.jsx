import React, { useState, useEffect } from "react";
import "../css/Profile.css";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({
    username: "",
    name: "",
    fullname: "",
    email: "",
    phone: "",
    location: "",
    dob: "",
    image: "",
  });

  const [image, setImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      setUser(userData);
      setImage(userData.image || "https://via.placeholder.com/120");
    } else {
      navigate("/login"); // Redirect to login if no user data
    }
    setIsLoading(false);
  }, [navigate]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        const updatedUser = { ...user, image: reader.result };
        setUser(updatedUser);
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    setIsEditing(false);
  };

  const handleDelete = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-box">
        <label htmlFor="imageUpload" className="profile-image-container">
          <img src={image} alt="Profile" className="profile-image" />
          <input 
            type="file" 
            id="imageUpload" 
            accept="image/*" 
            onChange={handleImageUpload} 
            hidden 
          />
          <FaEdit className="edit-icon" />
        </label>

        <h2>{user.name || "User"}</h2>

        <div className="user-details">
          <p>
            <strong>Username:</strong>
            {isEditing ? (
              <input type="text" name="username" value={user.username} onChange={handleChange} />
            ) : (
              <span>{user.username || "N/A"}</span>
            )}
          </p>

          <p>
            <strong>Full Name:</strong>
            {isEditing ? (
              <input type="text" name="name" value={user.name} onChange={handleChange} />
            ) : (
              <span>{user.name || "N/A"}</span>
            )}
          </p>

          <p>
            <strong>Email:</strong>
            {isEditing ? (
              <input type="email" name="email" value={user.email} onChange={handleChange} />
            ) : (
              <span>{user.email || "N/A"}</span>
            )}
          </p>

          <p>
            <strong>Phone:</strong>
            {isEditing ? (
              <input type="tel" name="phone" value={user.phone} onChange={handleChange} />
            ) : (
              <span>{user.phone || "N/A"}</span>
            )}
          </p>

          <p>
            <strong>Location:</strong>
            {isEditing ? (
              <input type="text" name="location" value={user.location} onChange={handleChange} />
            ) : (
              <span>{user.location || "N/A"}</span>
            )}
          </p>

          <p>
            <strong>Date of Birth:</strong>
            {isEditing ? (
              <input type="date" name="dob" value={user.dob} onChange={handleChange} />
            ) : (
              <span>{user.dob || "N/A"}</span>
            )}
          </p>
        </div>

        <div className="button-group">
          {isEditing ? (
            <button className="save-btn" onClick={handleSave}>Save Changes</button>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Profile
            </button>
          )}
          <button className="delete-btn" onClick={handleDelete}>Delete Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;