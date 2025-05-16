import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { FaSearch, FaBell, FaUser, FaShoppingCart } from "react-icons/fa";
import useAuth from "../hooks/useAuth"; // Import authentication hook
import "../css/navbar.css"; // Ensure CSS file is correctly linked
import { CartContext } from "../CartContext";


const Navbar = () => {
  const { user, logout } = useAuth(); // Get user and logout function
  const [profileOpen, setProfileOpen] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user); // Maintain updated user state
  const profileRef = useRef(null); // Use ref to handle clicks outside
  const { cart } = useContext(CartContext); // Add this line to get cart data

  // Fetch updated user details when localStorage changes
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setUpdatedUser(JSON.parse(storedUser)); // Update state when user logs in
    }
  }, [localStorage.getItem("loggedInUser")]); // Trigger re-fetch when user logs in

  const handleLogin = (userData) => {
    if (userData) {
      localStorage.setItem("loggedInUser", JSON.stringify(userData)); // Ensure image is stored
      setUpdatedUser(userData); // Update state with new user
    }
  };


  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser"); // Ensure to remove user data
    setUpdatedUser(null); // Reset user state
    alert("Logged out successfully!");
    window.location.href = "/login";
  };


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header>
      <nav className="navbar-grid">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <img src="/img/Helvetica_World-removebg-preview.png" alt="Whisker World Logo" />
          </Link>
        </div>

        {/* Navigation Menu */}
        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/Explore">Exploreeeee</Link></li>
          <li><Link to="/Communities">Communities</Link></li>
          <li><Link to="/Food">Food</Link></li>

          <li><Link to="/ExpertsTips">Experts & Tips</Link></li>
          <li><Link to="/AboutUs">About Usgbkki</Link></li>
          <li><Link to="/InstagramClone">Social World</Link></li>
          {!user && <li><Link to="/signup">Sign Up</Link></li>}
        </ul>

        {/* Right Menu (Search, Notifications, Profile, Cart) */}
        <div className="right-menu">
          {/* Search Bar */}
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <FaSearch className="icon search-icon" />
          </div>

          {/* Notifications Icon */}
          <FaBell className="icon notification-icon" />

          {/* Shopping Cart Icon */}
          <Link to="/cart" className="cart-link">
            <div className="cart-icon-container">
              <FaShoppingCart className="icon cart-icon" />
              {cart.length > 0 && (
                <span className="cart-count-badge">{cart.length}</span>
              )}
            </div>
          </Link>


          {/* Profile Dropdown */}
          {user ? (
            <div className="profile-menu" ref={profileRef}>
              <div
                className="user-info"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event from closing immediately
                  setProfileOpen((prev) => !prev);
                }}
              >
                <img
                  src={updatedUser?.image && updatedUser.image.trim() !== "" ? updatedUser.image : "https://via.placeholder.com/100"}
                  alt="Profile"
                  className="user-profile-pic"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                  onError={(e) => e.target.src = "https://via.placeholder.com/100"} // Handle broken images
                />

                <span className="user-name">{user?.name || "User"}</span>

              </div>

              {/* Dropdown Menu */}
              {/* {profileOpen && ( */}
              <div className="dropdown-menu dropdown_menu">
                <p className="dropdown-header">Hello, {user?.name || "User"} 👋</p>
                <Link className="dropdown-item" to="/Profile">
                  My Profile
                </Link>
                <Link className="dropdown-item" to="/PetProfile">
                  My Pets
                </Link>
                <Link className="dropdown-item" to="/AddPet">
                  Add Your Pet
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setProfileOpen(false);
                  }}
                  className="logout-button"
                >
                  Logout
                </button>
              </div>
              {/* )} */}
            </div>
          ) : (
            <Link to="/login">
              <button className="login-button">Login</button>
            </Link>
          )}

        </div>
      </nav>
    </header>
  );
};

export default Navbar;
