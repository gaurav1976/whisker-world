import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/Explore.css";
import Navbar from "./Navbar";

// 👉 Shuffle helper function
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Explore = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Blogs from API and shuffle
    // const API_BASE = import.meta.env.VITE_API_BASE_URL;
 useEffect(() => {

  axios.get(`${API_BASE}/explore`)
    .then((response) => {
      const shuffled = shuffleArray(response.data);
      setBlogPosts(shuffled);
    })
    .catch((error) => {
      console.error("Error fetching blogs:", error);
      // Set an error state to display to users
    })
    .finally(() => setLoading(false));
}, []);

  return (
    <>
      <Navbar />
      <div className="explore">
        <h1>Blogs</h1>

        {/* Show Loading State */}
        {loading && <p>Loading blogs...</p>}

        {/* Show No Blogs Message */}
        {!loading && blogPosts.length === 0 && <p>No blogs available</p>}

        {/* Display Blogs */}
        {!loading && blogPosts.map((post) => (
          <div className="explore-container" key={post._id}>
            <h2 className="blog-title">{post.title}</h2>
{post.image && (
  <img
    src={
      post.image.startsWith("/uploads/")
        ? `${import.meta.env.VITE_API_BASE_URL}${post.image}`
        : post.image
    }
    alt={post.title}
    className="blog-image"
  />
)}


            <div className="blog-meta">
              <span>By Admin</span> | 
              <span>{new Date(post.date).toLocaleDateString()}</span> | 
              <span>{post.category || "General"}</span>
            </div>

            <p className="blog-content">
              {post.content.length > 2000000 ? `${post.content.substring(0, 2000000)}...` : post.content}
            </p>

            {/* Keep your original links exactly as they were */}
            {post.link ? (
              <Link to={post.link} className="read-more-btn">Read More</Link>
            ) : (
              <a href="/Explore" className="read-more-btn">Love More</a>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Explore;
