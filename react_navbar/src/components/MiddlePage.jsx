import React from "react";
import "../css/middlepage.css"; // Ensure you have the corresponding CSS file

const MiddlePage = () => {
  return (
    <div className="middlepage">
      <div className="middlepage-img">
        <img src="img/pet-health.webp" alt="PetCircle - Pet Community" />
        <div className="image-text">
          <h1>Welcome to Whisker World</h1>
          <h5>
            A dedicated platform for pet lovers to connect, share experiences, and seek guidance.Join a thriving community where pet owners discuss pet care, health, training, adoption, and more!
          </h5>
        </div>
      </div>
    </div>
  );
};

export default MiddlePage;
