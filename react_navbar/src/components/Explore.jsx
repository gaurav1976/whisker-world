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

// 👉 Sanitize helper function
const sanitizeContent = (content) => {
  if (!content) return '';
  return content
    .replace(/const API_BASE = import\.meta\.env\.VITE_API_BASE_URL;/gi, '')
    .replace(/contact API_BASE = importmeis\.envNTE_API_BASE_URL:/gi, '')
    .trim();
};

const Explore = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios.get(`${API_BASE}/explore`)
      .then((response) => {
        const shuffled = shuffleArray(response.data);
        setBlogPosts(shuffled);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="explore">
        <h1>Blogs</h1>

        {loading && <p>Loading blogs...</p>}
        {!loading && blogPosts.length === 0 && <p>No blogs available</p>}

        {!loading && blogPosts.map((post) => {
          const cleanContent = sanitizeContent(post.content);
          return (
            <div className="explore-container" key={post._id}>
              <h2 className="blog-title">{post.title}</h2>

              {post.image && (
                <img
                  src={
                    post.image.startsWith("/uploads/")
                      ? `${API_BASE}${post.image}`
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
                {cleanContent.length > 2000
                  ? `${cleanContent.substring(0, 2000)}...`
                  : cleanContent}
              </p>

              {post.link ? (
                <Link to={post.link} className="read-more-btn">Read More</Link>
              ) : (
                <a href="/Explore" className="read-more-btn">Love More</a>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Explore;