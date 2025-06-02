import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/Explore.css";
import Navbar from "./Navbar";

// Shuffle helper function
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
  const [error, setError] = useState(null);

  // Fetch Blogs from API and shuffle
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${API_BASE}/blogs`);
        const shuffled = shuffleArray(response.data);
        setBlogPosts(shuffled);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <Navbar />
      <div className="explore">
        <h1>Blogs</h1>

        {/* Show Loading State */}
        {loading && <p>Loading blogs...</p>}

        {/* Show Error Message */}
        {error && <p className="error">{error}</p>}

        {/* Show No Blogs Message */}
        {!loading && !error && blogPosts.length === 0 && (
          <p>No blogs available</p>
        )}

        {/* Display Blogs */}
        {!loading &&
          !error &&
          blogPosts.map((post) => (
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
                <span>By {post.author || "Admin"}</span> | 
                <span>{new Date(post.date).toLocaleDateString()}</span> | 
                <span>{post.category || "General"}</span>
              </div>

              <p className="blog-content">
                {post.content.length > 200
                  ? `${post.content.substring(0, 200)}...`
                  : post.content}
              </p>

              {post.link ? (
                <Link to={post.link} className="read-more-btn">
                  Read More
                </Link>
              ) : (
                <Link to="/Explore" className="read-more-btn">
                  Love More
                </Link>
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default Explore;