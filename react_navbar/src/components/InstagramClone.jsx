import React, { useState } from "react";
import "../css/InstagramClone.css";
import { 
  FaHome, FaSearch, FaCompass, FaFilm, FaFacebookMessenger, 
  FaRegHeart, FaHeart, FaPlusSquare, FaUser, FaBookmark, 
  FaRegBookmark, FaEllipsisH, FaTimes, FaRegComment, FaPaperPlane 
} from "react-icons/fa";
import { RiThreadsFill } from "react-icons/ri";

const InstagramClone = () => {
  // Current user data
  const [currentUser, setCurrentUser] = useState({
    id: 'user-1',
    username: "that_gauzavv",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    followers: 245,
    following: 312,
    postsCount: 10,
    bio: "Gauzavv History 1"
  });

  // App state
  const [activeTab, setActiveTab] = useState("home");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ image: "", caption: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [viewedStories, setViewedStories] = useState([]);
  const [commentText, setCommentText] = useState("");

  // Data states
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: "that_gauzavv",
      userImage: "https://randomuser.me/api/portraits/men/1.jpg",
      image: "https://picsum.photos/id/10/600/600",
      caption: "Gauzavv History 1 #history #photography",
      likes: 245,
      comments: [
        { id: 1, username: "user1", text: "Great post!", time: "1 hour ago" },
        { id: 2, username: "user2", text: "Amazing content!", time: "45 mins ago" }
      ],
      time: "2 hours ago",
      isLiked: false,
      isSaved: false
    },
    {
      id: 2,
      username: "travel_enthusiast",
      userImage: "https://randomuser.me/api/portraits/women/1.jpg",
      image: "https://picsum.photos/id/100/600/600",
      caption: "Beautiful sunset views from my recent trip 🌅 #travel #sunset",
      likes: 1024,
      comments: [
        { id: 3, username: "user3", text: "Stunning view!", time: "3 hours ago" }
      ],
      time: "5 hours ago",
      isLiked: true,
      isSaved: false
    }
  ]);

  const [suggestedUsers, setSuggestedUsers] = useState([
    { 
      id: 'user-2',
      username: "Jennyyoki", 
      followedBy: "week_android + 1 more", 
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      isFollowing: false 
    },
    { 
      id: 'user-3',
      username: "newst@gujarati", 
      followedBy: "_newty_ + 12 more", 
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      isFollowing: false 
    },
    { 
      id: 'user-4',
      username: "bivitiskunali", 
      followedBy: "dribu_1237 + 12...", 
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      isFollowing: false 
    },
    { 
      id: 'user-5',
      username: "the_prime_mobiles", 
      tag: "Popular", 
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      isFollowing: false 
    },
    { 
      id: 'user-6',
      username: "youx_maxeron", 
      followedBy: "dreamfoundpick3R...", 
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      isFollowing: false 
    }
  ]);

  const [stories, setStories] = useState([
    { 
      id: 'story-1',
      username: "your_story", 
      userImage: "https://randomuser.me/api/portraits/men/1.jpg", 
      isYourStory: true 
    },
    { 
      id: 'story-2',
      username: "user1", 
      userImage: "https://randomuser.me/api/portraits/women/5.jpg" 
    },
    { 
      id: 'story-3',
      username: "user2", 
      userImage: "https://randomuser.me/api/portraits/men/5.jpg" 
    },
    { 
      id: 'story-4',
      username: "user3", 
      userImage: "https://randomuser.me/api/portraits/women/6.jpg" 
    },
    { 
      id: 'story-5',
      username: "user4", 
      userImage: "https://randomuser.me/api/portraits/men/6.jpg" 
    },
    { 
      id: 'story-6',
      username: "user5", 
      userImage: "https://randomuser.me/api/portraits/women/7.jpg" 
    },
    { 
      id: 'story-7',
      username: "user6", 
      userImage: "https://randomuser.me/api/portraits/men/7.jpg" 
    }
  ]);

  // Handle post like
  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  // Handle post save
  const handleSave = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isSaved: !post.isSaved
        };
      }
      return post;
    }));
  };

  // Handle story view
  const handleStoryView = (storyId) => {
    if (!storyId || viewedStories.includes(storyId)) return;
    
    setViewedStories([...viewedStories, storyId]);
    
    // Update the story as viewed in the stories array
    setStories(stories.map(story => {
      if (story.id === storyId && !story.isYourStory) {
        return { ...story, viewed: true };
      }
      return story;
    }));
  };

  // Handle follow user
  const handleFollow = (userId) => {
    setSuggestedUsers(suggestedUsers.map(user => {
      if (user.id === userId) {
        // Update followers count for current user
        setCurrentUser(prev => ({
          ...prev,
          following: user.isFollowing ? prev.following - 1 : prev.following + 1
        }));
        return { ...user, isFollowing: !user.isFollowing };
      }
      return user;
    }));
  };

  // Handle file upload for new post
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewPost({
          ...newPost,
          image: event.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle create new post
  const handleCreatePost = () => {
    if (newPost.image) {
      const post = {
        id: Date.now(),
        username: currentUser.username,
        userImage: currentUser.image,
        image: newPost.image,
        caption: newPost.caption,
        likes: 0,
        comments: [],
        time: "Just now",
        isLiked: false,
        isSaved: false
      };
      
      setPosts([post, ...posts]);
      setNewPost({ image: "", caption: "" });
      setShowCreatePost(false);
      
      // Update user's post count
      setCurrentUser(prev => ({
        ...prev,
        postsCount: prev.postsCount + 1
      }));
    }
  };

  // Handle add comment
  const handleAddComment = (postId) => {
    if (!commentText.trim()) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, {
            id: Date.now(),
            username: currentUser.username,
            text: commentText,
            time: "Just now"
          }]
        };
      }
      return post;
    }));
    
    setCommentText("");
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(e.target.value.trim() !== "");
  };

  // Search Page Component
  const SearchPage = () => {
    const filteredResults = [...suggestedUsers, ...stories]
      .filter(item => 
        item.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(item => ({
        id: item.id,
        username: item.username,
        image: item.userImage || item.image,
        type: stories.some(s => s.id === item.id) ? "story" : "user",
        isFollowing: item.isFollowing || false
      }));

    return (
      <div className="ig-search-results">
        {filteredResults.length > 0 ? (
          filteredResults.map(result => (
            <div key={result.id} className="ig-search-result">
              <img 
                src={result.image} 
                alt={result.username} 
                className="ig-search-result-image"
              />
              <div className="ig-search-result-info">
                <span className="ig-search-username">{result.username}</span>
                <span className="ig-search-type">{result.type}</span>
              </div>
              {result.type === "user" && result.username !== currentUser.username && (
                <button 
                  className={`ig-follow-btn ${result.isFollowing ? 'ig-following' : ''}`}
                  onClick={() => handleFollow(result.id)}
                >
                  {result.isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="ig-no-results">No results found for "{searchQuery}"</div>
        )}
      </div>
    );
  };

  // Post Page Component
  const PostPage = () => (
    <div className="ig-post-feed">
      <div className="ig-stories-container">
        <div className="ig-stories">
          {/* Your Story */}
          <div className="ig-story" onClick={() => setShowCreatePost(true)}>
            <div className="ig-story-border ig-your-story">
              <img 
                src={currentUser.image} 
                alt="Your story" 
                className="ig-story-image"
              />
            </div>
            <span className="ig-story-username">Your Story</span>
          </div>
          
          {/* Other Stories */}
          {stories.filter(s => !s.isYourStory).map((story) => (
            <div 
              key={story.id} 
              className="ig-story"
              onClick={() => handleStoryView(story.id)}
            >
              <div className={`ig-story-border ${viewedStories.includes(story.id) ? 'ig-viewed' : ''}`}>
                <img 
                  src={story.userImage} 
                  alt={story.username} 
                  className="ig-story-image"
                />
              </div>
              <span className="ig-story-username">
                {story.username}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {posts.map(post => (
        <div key={post.id} className="ig-post-container">
          <div className="ig-post-header">
            <div className="ig-user-info">
              <img 
                src={post.userImage} 
                alt={post.username} 
                className="ig-profile-pic"
              />
              <span className="ig-username">{post.username}</span>
            </div>
            <button className="ig-more-options">
              <FaEllipsisH />
            </button>
          </div>
          
          <div className="ig-post-media">
            <img src={post.image} alt={post.caption} />
          </div>
          
          <div className="ig-post-actions">
            <div className="ig-left-actions">
              <button 
                className="ig-action-btn" 
                onClick={() => handleLike(post.id)}
              >
                {post.isLiked ? <FaHeart className="ig-liked" /> : <FaRegHeart />}
              </button>
              <button className="ig-action-btn">
                <FaRegComment />
              </button>
              <button className="ig-action-btn">
                <FaPaperPlane />
              </button>
            </div>
            <button 
              className="ig-action-btn" 
              onClick={() => handleSave(post.id)}
            >
              {post.isSaved ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          </div>
          
          <div className="ig-post-details">
            <div className="ig-likes">{post.likes.toLocaleString()} likes</div>
            <div className="ig-caption">
              <span className="ig-username">{post.username}</span> {post.caption}
            </div>
            {post.comments.length > 0 && (
              <div className="ig-comments">
                {post.comments.length > 2 && (
                  <span>View all {post.comments.length} comments</span>
                )}
                {post.comments.slice(0, 2).map(comment => (
                  <div key={comment.id} className="ig-comment">
                    <span className="ig-comment-username">{comment.username}</span>
                    <span className="ig-comment-text">{comment.text}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="ig-time">{post.time}</div>
          </div>
          
          <div className="ig-add-comment">
            <input 
              type="text" 
              placeholder="Add a comment..." 
              className="ig-comment-input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
            />
            <button 
              className="ig-post-comment"
              onClick={() => handleAddComment(post.id)}
              disabled={!commentText.trim()}
            >
              Post
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Profile Page Component
  const ProfilePage = () => (
    <div className="ig-profile-container">
      <div className="ig-profile-header">
        <div className="ig-profile-pic-large-container">
          <img 
            src={currentUser.image} 
            alt={currentUser.username} 
            className="ig-profile-pic-large"
          />
        </div>
        <div className="ig-profile-stats">
          <div className="ig-stat">
            <span className="ig-count">{currentUser.postsCount}</span>
            <span className="ig-label">Posts</span>
          </div>
          <div className="ig-stat">
            <span className="ig-count">{currentUser.followers}</span>
            <span className="ig-label">Followers</span>
          </div>
          <div className="ig-stat">
            <span className="ig-count">{currentUser.following}</span>
            <span className="ig-label">Following</span>
          </div>
        </div>
      </div>
      
      <div className="ig-profile-info">
        <h2>{currentUser.username}</h2>
        <p>{currentUser.bio}</p>
      </div>
      
      <div className="ig-profile-buttons">
        <button className="ig-edit-profile">Edit Profile</button>
        <button className="ig-share-profile">Share Profile</button>
        <button className="ig-contact">Contact</button>
      </div>
      
      <div className="ig-highlights">
        <div className="ig-highlight">
          <div className="ig-highlight-circle"></div>
          <span>Travel</span>
        </div>
        <div className="ig-highlight">
          <div className="ig-highlight-circle"></div>
          <span>Food</span>
        </div>
        <div className="ig-highlight">
          <div className="ig-highlight-circle"></div>
          <span>Nature</span>
        </div>
      </div>
      
      <div className="ig-profile-tabs">
        <button className="ig-tab ig-active-tab">
          <span>POSTS</span>
        </button>
        <button className="ig-tab">
          <span>REELS</span>
        </button>
        <button className="ig-tab">
          <span>TAGGED</span>
        </button>
      </div>
      
      <div className="ig-profile-posts">
        {posts
          .filter(post => post.username === currentUser.username)
          .map(post => (
            <div key={post.id} className="ig-profile-post">
              <img src={post.image} alt={`Post by ${post.username}`} />
            </div>
          ))}
      </div>
    </div>
  );

  const renderContent = () => {
    if (showSearchResults) {
      return <SearchPage />;
    }
    
    switch (activeTab) {
      case "home":
        return <PostPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <div className="ig-coming-soon">Coming Soon</div>;
    }
  };

  return (
    <div className="ig-container">
      {/* Left Sidebar Navigation */}
      <div className="ig-sidebar">
        <div className="ig-sidebar-content">
          <h1 className="ig-logo">
            <img 
              src="/img/Helvetica_World-removebg-preview.png" 
              alt="Whisker World Logo" 
              className="ig-logo-img"
            />
          </h1>
          
          <nav className="ig-nav-menu">
            <button 
              className={`ig-nav-item ${activeTab === "home" && !showSearchResults ? "ig-active" : ""}`}
              onClick={() => {
                setActiveTab("home");
                setShowSearchResults(false);
              }}
            >
              <FaHome className="ig-nav-icon" />
              <span>Home</span>
            </button>
            
            <button 
              className={`ig-nav-item ${showSearchResults ? "ig-active" : ""}`}
              onClick={() => {
                setShowSearchResults(true);
                setActiveTab("");
              }}
            >
              <FaSearch className="ig-nav-icon" />
              <span>Search</span>
            </button>
            
            <button className="ig-nav-item">
              <FaCompass className="ig-nav-icon" />
              <span>Explore</span>
            </button>
            
            <button className="ig-nav-item">
              <FaFilm className="ig-nav-icon" />
              <span>Reels</span>
            </button>
            
            <button className="ig-nav-item">
              <FaFacebookMessenger className="ig-nav-icon" />
              <span>Messages</span>
            </button>
            
            <button className="ig-nav-item">
              <FaRegHeart className="ig-nav-icon" />
              <span>Notifications</span>
            </button>
            
            <button 
              className="ig-nav-item"
              onClick={() => setShowCreatePost(true)}
            >
              <FaPlusSquare className="ig-nav-icon" />
              <span>Create</span>
            </button>
            
            <button 
              className={`ig-nav-item ${activeTab === "profile" ? "ig-active" : ""}`}
              onClick={() => {
                setActiveTab("profile");
                setShowSearchResults(false);
              }}
            >
              <FaUser className="ig-nav-icon" />
              <span>Profile</span>
            </button>
          </nav>
          
          <div className="ig-ai-studio">
            <div className="ig-section-title">AI Studio</div>
            <button className="ig-nav-item">
              <RiThreadsFill className="ig-nav-icon" />
              <span>Threads</span>
            </button>
            <button className="ig-nav-item">
              <span>More</span>
            </button>
          </div>
          
          <div className="ig-user-profile">
            <img 
              src={currentUser.image} 
              alt="Profile" 
              className="ig-profile-pic"
            />
            <div className="ig-profile-info">
              <span className="ig-username">{currentUser.username}</span>
              <span className="ig-switch">Switch</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */} 
      <div className="ig-main-content">
        {showSearchResults && (
          <div className="ig-search-bar">
            <FaSearch className="ig-search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
              className="ig-search-input"
              autoFocus
            />
          </div>
        )}
        {renderContent()}
      </div>
      
      {/* Right Sidebar - Suggested Users */}
      {!showSearchResults && (
        <div className="ig-right-sidebar">
          <div className="ig-current-user">
            <img 
              src={currentUser.image} 
              alt={currentUser.username} 
              className="ig-user-pic"
            />
            <div className="ig-user-details">
              <span className="ig-username">{currentUser.username}</span>
              <span className="ig-user-name">{currentUser.bio}</span>
            </div>
          </div>
          
          <div className="ig-suggestions-header">
            <span>Suggested for you</span>
            <button className="ig-see-all">See All</button>
          </div>
          
          <div className="ig-suggested-users">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="ig-suggested-user">
                <div className="ig-user-info">
                  <img 
                    src={user.image} 
                    alt={user.username} 
                    className="ig-user-pic"
                  />
                  <div className="ig-user-details">
                    <span className="ig-username">{user.username}</span>
                    <span className="ig-followed-by">
                      {user.followedBy || user.tag}
                    </span>
                  </div>
                </div>
                <button 
                  className={`ig-follow-btn ${user.isFollowing ? 'ig-following' : ''}`}
                  onClick={() => handleFollow(user.id)}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
          
          <div className="ig-footer-links">
            <span>About</span>
            <span>Help</span>
            <span>Press</span>
            <span>API</span>
            <span>Jobs</span>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Locations</span>
            <span>Language</span>
            <span>Meta Verified</span>
          </div>
          
          <div className="ig-copyright">
            © 2023 WHISKER WORLD
          </div>
        </div>
      )}
      
      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="ig-modal-overlay">
          <div className="ig-create-post-modal">
            <div className="ig-modal-header">
              <h3>Create new post</h3>
              <button onClick={() => setShowCreatePost(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="ig-modal-content">
              {newPost.image ? (
                <div className="ig-post-preview">
                  <img src={newPost.image} alt="Preview" className="ig-preview-image" />
                  <textarea
                    placeholder="Write a caption..."
                    value={newPost.caption}
                    onChange={(e) => setNewPost({...newPost, caption: e.target.value})}
                    className="ig-caption-input"
                  />
                  <button 
                    onClick={handleCreatePost}
                    className="ig-share-button"
                  >
                    Share
                  </button>
                </div>
              ) : (
                <div className="ig-upload-area">
                  <FaPlusSquare className="ig-upload-icon" />
                  <p>Drag photos and videos here</p>
                  <input
                    type="file"
                    id="post-upload"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="post-upload" className="ig-select-btn">
                    Select from computer
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramClone;