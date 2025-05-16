import React from "react";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import "../css/Footer.css"; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Store Info */}
        <div className="footer-column">
          <h3>Our Flagship Store</h3>
          <p>500 Terry Francine Street</p>
          <p>San Francisco, CA 94158</p>
          <p>Tel: 123-456-7890</p>
          <a href="Food">View Stores List</a>
        </div>

        {/* Shop Links */}
        <div className="footer-column">
          <h3>Shop</h3>
          <a href="Food">Dogs</a>
          <a href="Food">Cats</a>
          <a href="Food">Birds</a>
          <a href="Food">Fish & Aquatics</a>
          <a href="Food">Small Animals</a>
          <a href="Food">Reptiles</a>
        </div>

        {/* Info Links */}
        <div className="footer-column">
          <h3>Info</h3>
          <a href="AboutUs">Our Story</a>
          <a href="AboutUs">Contact</a>
          <a href="cart">Shipping & Returns</a>
          <a href="#">Store Policy</a>
          <a href="#">FAQ</a>
        </div>

        {/* Subscription Form */}
        <div className="footer-column">
          <h3>Get Special Deals & Offers</h3>
          <label>Email Address*</label>
          <input type="email" placeholder="Enter your email" className="subscribe-input" />
          <button className="subscribe-button">Subscribe</button>
          <p>Thanks for submitting!</p>

          {/* Social Media Links */}
          <h3>Become Our Bestie!</h3>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaYoutube /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
