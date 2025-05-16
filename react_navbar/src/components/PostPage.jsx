  import React, { useState, useEffect } from "react";
  import { FaHeart, FaComment } from "react-icons/fa";
  import "../css/PostPage.css";

  const PostPage = () => {
    const [posts, setPosts] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [caption, setCaption] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
      // Load posts from localStorage on component mount
      const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
      setPosts(savedPosts);

      // Load user from localStorage or API
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      setUser(loggedInUser);
    }, []);

    useEffect(() => {
      // Save posts to localStorage when they change
      localStorage.setItem("posts", JSON.stringify(posts));
    }, [posts]);

    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
    };

    const handlePostSubmit = () => {
      if (!selectedFile) return;

      const newPost = {
        id: posts.length + 1,
        file: URL.createObjectURL(selectedFile),
        caption,
        likes: 0,
        comments: [],
        userName: user?.name || "User Name", // Store the username with the post
      };

      setPosts([newPost, ...posts]);
      setSelectedFile(null);
      setCaption("");
    };

    const handleLike = (postId) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    };

    return (
      <div className="Postcontainer">
        <div className="upload-box">
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="file-input" />
          <input
            type="text"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="caption-input"
          />
          <button onClick={handlePostSubmit} className="post-button">Post</button>
        </div>

        {posts.map((post) => (
          <div key={post.id} className="post-box">
            <div className="post-header">
              <div className="profile-pic"></div>
              <p className="username">{post.userName}</p>
            </div>
            {post.file.includes("video") ? (
              <video controls src={post.file} className="post-media"></video>
            ) : (
              <img src={post.file} alt="Post" className="post-media" />
            )}
            <div className="post-details">
              <div className="post-actions">
                <button
                  className="like-button"
                  onClick={() => handleLike(post.id)}
                >
                  <FaHeart /> {post.likes} Likes
                </button>
                <button className="comment-button"><FaComment /> Comment</button>
              </div>
              <p className="post-caption"><strong>{post.userName}</strong> {post.caption}</p>
            </div>
          </div>  
        ))}
      </div>
    );
  };

  export default PostPage;