import React, { useState } from "react";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import "../css/Footer.css"; 

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Store Info */}
        <div className="footer-column">
          <h3>Our Flagship Store</h3>
          <p>500 Terry Francine Street</p>
          <p>San Francisco, CA 94158</p>
          <p>Tel: 123-456-7890</p>
          <a href="/food">View Stores List</a>
        </div>

        {/* Shop Links */}
        <div className="footer-column">
          <h3>Shop</h3>
          <a href="/food">Dogs</a>
          <a href="/food">Cats</a>
          <a href="/food">Birds</a>
          <a href="/food">Fish & Aquatics</a>
          <a href="/food">Small Animals</a>
          <a href="/food">Reptiles</a>
        </div>

        {/* Info Links */}
        <div className="footer-column">
          <h3>Info</h3>
          <a href="/AboutUs">Our Story</a>
          <a href="/AboutUs">Contact</a>
          <a href="/Cart">Shipping & Returns</a>
          <a href="#">Store Policy</a>
          <a href="#">FAQ</a>
        </div>

        {/* Subscription Form */}
        <div className="footer-column">
          <h3>Get Special Deals & Offers</h3>
          <form onSubmit={handleSubscribe}>
            <label htmlFor="footer-email">Email Address*</label>
            <input
              id="footer-email"
              type="email"
              required
              placeholder="Enter your email"
              className="subscribe-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="subscribe-button">Subscribe</button>
          </form>
          {subscribed && <p className="subscribe-thanks">Thanks for subscribing!</p>}

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
