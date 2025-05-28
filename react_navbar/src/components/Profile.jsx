import React, { useState, useEffect } from "react";
import "../css/Profile.css"; // Import CSS for styling
import { FaEdit } from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    address: "",
    nickname: "",
    dob: "",
    image: "",
  });

  const [image, setImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch logged-in user data
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      setUser(userData);
      setImage(userData.image || "#");
    }
  }, []);

  // Handle profile image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setUser((prevUser) => ({ ...prevUser, image: reader.result }));
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ ...user, image: reader.result })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Save updated user data
  const handleSave = () => {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        {/* Profile Image Upload */}
        <label htmlFor="imageUpload" className="profile-image-container">
          <img src={image} alt="Profile" className="profile-image" />
          <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} hidden />
        </label>

        {/* User Name */}
        <h2>{user?.name || "User Name"}</h2>

        {/* User Details (Editable) */}
        <div className="user-details">
  <p><strong>Username:</strong> 
    {isEditing ? (
      <input type="text" name="username" value={user.username} onChange={handleChange} />
    ) : (
      <span>{user.username || "N/A"}</span>
    )}
  </p>

  <p><strong>Full Name:</strong> 
    {isEditing ? (
      <input type="text" name="fullname" value={user.fullname} onChange={handleChange} />
    ) : (
      <span>{user.fullname || "N/A"}</span>
    )}
  </p>

  <p><strong>Email:</strong> 
    {isEditing ? (
      <input type="email" name="email" value={user.email} onChange={handleChange} />
    ) : (
      <span>{user.email || "N/A"}</span>
    )}
  </p>

  <p><strong>Phone Number:</strong> 
    {isEditing ? (
      <input type="number" name="phone" value={user.phone} onChange={handleChange} />
    ) : (
      <span>{user.phone || "N/A"}</span>
    )}
  </p>

  <p><strong>Location:</strong> 
    {isEditing ? (
      <input type="text" name="location" value={user.location} onChange={handleChange} />
    ) : (
      <span>{user.location || "N/A"}</span>
    )}
  </p>

  <p><strong>Date of Birth:</strong> 
    {isEditing ? (
      <input type="date" name="dob" value={user.dob} onChange={handleChange} />
    ) : (
      <span>{user.dob || "N/A"}</span>
    )}
  </p>
</div>


        {/* Edit & Save Buttons */}
        {isEditing ? (
          <button className="edit-btn" onClick={handleSave}>Save</button>
        ) : (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
        )}
        
        <button className="delete-btn">Delete Profile</button>
      </div>
    </div>
  );
};

export default Profile;
