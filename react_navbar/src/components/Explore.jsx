import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { FaCalendarAlt, FaUser, FaTags, FaArrowRight } from "react-icons/fa";
import { Skeleton } from "@mui/material";
import DOMPurify from "dompurify"; // For sanitizing HTML content

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
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API_BASE}/explore`);
        const shuffled = shuffleArray(response.data);
        setBlogPosts(shuffled);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Sanitize and format blog content
  const formatContent = (content) => {
    if (!content) return "";
    
    // 1. Clean HTML tags
    const cleanText = content.replace(/<[^>]*>/g, "");
    
    // 2. Handle special characters
    const decodedText = new DOMParser().parseFromString(cleanText, "text/html").body.textContent || "";
    
    // 3. Truncate for excerpt
    return decodedText.length > 200 
      ? `${decodedText.substring(0, 200)}...` 
      : decodedText;
  };

  return (
    <>
      <Navbar />
      <div className="blog-page">
        <div className="blog-hero">
          <div className="hero-content">
            <h1>Discover Pet Care Insights</h1>
            <p>Expert advice, tips, and stories for pet lovers</p>
          </div>
        </div>

        <div className="blog-container">
          {loading ? (
            <div className="skeleton-grid">
              {[...Array(3)].map((_, index) => (
                <div className="blog-card skeleton" key={index}>
                  <Skeleton variant="rectangular" height={200} />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="100%" height={60} />
                  <Skeleton variant="rectangular" width={120} height={40} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="empty-state">
              <img src="/img/no-blogs.svg" alt="No blogs found" />
              <h3>No blogs available yet</h3>
              <p>Check back later for new pet care articles</p>
            </div>
          ) : (
            <div className="blog-grid">
              {blogPosts.map((post) => (
                <article className="blog-card" key={post._id}>
                  <div className="card-image">
                    {post.image ? (
                      <img
                        src={
                          post.image.startsWith("/uploads/")
                            ? `${API_BASE}${post.image}`
                            : post.image
                        }
                        alt={post.title}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "/fallback-blog.jpg";
                          e.target.alt = "Image not available";
                        }}
                      />
                    ) : (
                      <div className="image-placeholder">
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="card-content">
                    <div className="blog-meta">
                      <span><FaUser /> {post.author || "Admin"}</span>
                      <span><FaCalendarAlt /> {new Date(post.date).toLocaleDateString()}</span>
                      {post.category && (
                        <span className="category-tag">
                          <FaTags /> {post.category}
                        </span>
                      )}
                    </div>
                    <h2>{post.title || "Untitled Blog Post"}</h2>
                    <p className="excerpt">
                      {formatContent(post.content)}
                    </p>
                    <Link 
                      to={post.link || `/blog/${post._id}`} 
                      className="read-more"
                    >
                      Read More <FaArrowRight />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Explore;