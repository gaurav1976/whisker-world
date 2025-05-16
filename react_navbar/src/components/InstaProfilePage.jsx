import React, { useState, useEffect } from "react";
import { FaHeart, FaComment, FaUserPlus, FaUserCheck, FaEllipsisH } from "react-icons/fa";
import { IoMdPhotos } from "react-icons/io";
import { Link } from "react-router-dom";
import "../css/InstaProfilePage.css";

const InstaProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [user, setUser] = useState({
    id: 1,
    username: "your_username",
    fullName: "Your Name",
    bio: "This is my bio ✨",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
    posts: 24,
    followers: 543,
    following: 321,
    isFollowing: false
  });
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    const samplePosts = [
      {
        id: 1,
        image: "https://picsum.photos/id/10/500/500",
        likes: 124,
        comments: 23,
        caption: "Beautiful day at the beach! 🏖️"
      },
      {
        id: 2,
        image: "https://picsum.photos/id/11/500/500",
        likes: 89,
        comments: 12,
        caption: "Exploring new places 🌍"
      },
      {
        id: 3,
        image: "https://picsum.photos/id/12/500/500",
        likes: 215,
        comments: 42,
        caption: "Food adventures 🍜"
      }
    ];

    const sampleFollowers = [
      { id: 1, username: "follower1", fullName: "Follower One", isFollowing: true },
      { id: 2, username: "follower2", fullName: "Follower Two", isFollowing: false },
      { id: 3, username: "follower3", fullName: "Follower Three", isFollowing: true }
    ];

    const sampleFollowing = [
      { id: 1, username: "following1", fullName: "Following One", isFollowing: true },
      { id: 2, username: "following2", fullName: "Following Two", isFollowing: true },
      { id: 3, username: "following3", fullName: "Following Three", isFollowing: false }
    ];

    setPosts(samplePosts);
    setFollowers(sampleFollowers);
    setFollowing(sampleFollowing);
  }, []);

  const handleFollow = () => {
    setUser(prev => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1
    }));
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handlePostSubmit = () => {
    if (!selectedFile) return;

    const newPost = {
      id: posts.length + 1,
      image: URL.createObjectURL(selectedFile),
      likes: 0,
      comments: [],
      caption,
      createdAt: new Date().toISOString()
    };

    setPosts([newPost, ...posts]);
    setUser(prev => ({ ...prev, posts: prev.posts + 1 }));
    setSelectedFile(null);
    setCaption("");
  };

  const handleLike = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    
    <div className="instaprofile-container">
      {/* Header */}
      <header className="instaprofile-header">
        <div className="header-content">
          <h1>{user.username}</h1>
          <div className="header-actions">
            <button className="icon-button">
              <FaEllipsisH />
            </button>
          </div>
        </div>
      </header>

      {/* Profile Info */}
      <div className="instaprofile-info">
        <div className="instaprofile-top">
          <div className="instaprofile-image-container">
            <img src={user.profileImage} alt="profile" className="instaprofile-image" />
          </div>
          <div className="instaprofile-stats">
            <div className="stat">
              <span className="stat-number">{formatNumber(user.posts)}</span>
              <span className="stat-label">Posts</span>
            </div>
            <Link to="/followers" className="stat">
              <span className="stat-number">{formatNumber(user.followers)}</span>
              <span className="stat-label">Followers</span>
            </Link>
            <Link to="/following" className="stat">
              <span className="stat-number">{formatNumber(user.following)}</span>
              <span className="stat-label">Following</span>
            </Link>
          </div>
        </div>

        <div className="instaprofile-details">
          <h2>{user.fullName}</h2>
          <p className="bio">{user.bio}</p>
        </div>

        <div className="instaprofile-actions">
          <button 
            className={`follow-button ${user.isFollowing ? 'following' : ''}`}
            onClick={handleFollow}
          >
            {user.isFollowing ? (
              <>
                <FaUserCheck /> Following
              </>
            ) : (
              <>
                <FaUserPlus /> Follow
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="instaprofile-tabs">
        <button 
          className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          <IoMdPhotos /> Posts
        </button>
        <button 
          className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <IoMdPhotos /> Saved
        </button>
      </div>

      {/* Tab Content */}
      <div className="instaprofile-content">
        {activeTab === 'posts' && (
          <div className="insta-posts-grid">
            {posts.map(post => (
              <div key={post.id} className="insta-post-thumbnail">
                <img src={post.image} alt="Post" />
                <div className="insta-post-overlay">
                  <span><FaHeart /> {post.likes}</span>
                  <span><FaComment /> {post.comments.length}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="saved-posts">
            <p>No saved posts yet</p>
          </div>
        )}
      </div>

      {/* Upload Post Modal */}
      {/* <div className="insta-upload-modal">
        <div className="insta-upload-box">
          <h3>Create New Post</h3>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="insta-file-input" 
          />
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="insta-caption-input"
          />
          <button onClick={handlePostSubmit} className="insta-post-button">
            Share
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default InstaProfilePage;
