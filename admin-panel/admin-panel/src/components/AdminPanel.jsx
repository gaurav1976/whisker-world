import React, { useState, useEffect, useCallback } from "react";
import { FaUsers, FaBlog, FaBox, FaBars, FaTrash, FaEdit, FaUser, FaSignOutAlt } from "react-icons/fa";
import "../css/AdminPanel.css";

const AdminPanel = () => {
  // State management
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  // Blog states
  const [blogEditData, setBlogEditData] = useState({
    id: null,
    title: '',
    content: '',
    image: '',
    imageFile: null
  });

  // Food states
  const [foodEditData, setFoodEditData] = useState({
    id: null,
    name: '',
    price: '',
    category: '',
    image: '',
    imageFile: null
  });

  // New item states
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    imageFile: null
  });

  const [newFood, setNewFood] = useState({
    name: '',
    price: '',
    category: '',
    imageFile: null
  });

  // Admin profile states
  const [adminProfile, setAdminProfile] = useState({
    name: '',
    email: '',
    password: '',
    photo: ''
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Fetch data functions
  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/blogs`);
      if (!res.ok) throw new Error('Failed to fetch blogs');
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching blogs:", err);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE]);

  const fetchFoods = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/foods`);
      if (!res.ok) throw new Error('Failed to fetch foods');
      const data = await res.json();
      setFoods(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching foods:", err);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE]);

  // Load data based on active tab
  useEffect(() => {
    const loggedInAdmin = JSON.parse(localStorage.getItem('adminUser'));
    if (loggedInAdmin) {
      setAdminUser(loggedInAdmin);
      setAdminProfile({
        name: loggedInAdmin.name,
        email: loggedInAdmin.email,
        photo: loggedInAdmin.photo || '',
        password: ''
      });
    } else {
      window.location.href = '/admin/login';
    }

    switch (activeTab) {
      case "Blogs":
        fetchBlogs();
        break;
      case "Users":
        fetchUsers();
        break;
      case "Products":
        fetchFoods();
        break;
      default:
        break;
    }
  }, [activeTab, fetchBlogs, fetchUsers, fetchFoods]);

  // Blog CRUD operations
  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete blog');
      await fetchBlogs();
    } catch (err) {
      setError(err.message);
      console.error("Error deleting blog:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBlog = (blog) => {
    setBlogEditData({
      id: blog._id,
      title: blog.title,
      content: blog.content,
      image: blog.image,
      imageFile: null
    });
  };

  const handleUpdateBlog = async () => {
    if (!blogEditData.title || !blogEditData.content) {
      alert("Title and content are required!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", blogEditData.title);
    formData.append("content", blogEditData.content);
    if (blogEditData.imageFile) {
      formData.append("image", blogEditData.imageFile);
    }

    try {
      const res = await fetch(`${API_BASE}/blogs/${blogEditData.id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (!res.ok) throw new Error('Failed to update blog');
      
      await fetchBlogs();
      setBlogEditData({
        id: null,
        title: '',
        content: '',
        image: '',
        imageFile: null
      });
    } catch (err) {
      setError(err.message);
      console.error("Error updating blog:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBlog = async () => {
    if (!newBlog.title || !newBlog.content || !newBlog.imageFile) {
      alert("Please fill all fields and upload an image!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", newBlog.title);
    formData.append("content", newBlog.content);
    formData.append("image", newBlog.imageFile);
    formData.append("authorId", adminUser._id);

    try {
      const res = await fetch(`${API_BASE}/blogs`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (!res.ok) throw new Error('Failed to add blog');
      
      await fetchBlogs();
      setNewBlog({
        title: '',
        content: '',
        imageFile: null
      });
    } catch (err) {
      setError(err.message);
      console.error("Error adding blog:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Food CRUD operations
  const handleDeleteFood = async (id) => {
    if (!window.confirm("Are you sure you want to delete this food item?")) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/foods/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete food');
      await fetchFoods();
    } catch (err) {
      setError(err.message);
      console.error("Error deleting food:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditFood = (food) => {
    setFoodEditData({
      id: food._id,
      name: food.name,
      price: food.price,
      category: food.category,
      image: food.image,
      imageFile: null
    });
  };

  const handleUpdateFood = async () => {
    if (!foodEditData.name || !foodEditData.price || !foodEditData.category) {
      alert("All fields are required!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", foodEditData.name);
    formData.append("price", foodEditData.price);
    formData.append("category", foodEditData.category);
    if (foodEditData.imageFile) {
      formData.append("image", foodEditData.imageFile);
    }

    try {
      const res = await fetch(`${API_BASE}/foods/${foodEditData.id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (!res.ok) throw new Error('Failed to update food');
      
      await fetchFoods();
      setFoodEditData({
        id: null,
        name: '',
        price: '',
        category: '',
        image: '',
        imageFile: null
      });
    } catch (err) {
      setError(err.message);
      console.error("Error updating food:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFood = async () => {
    if (!newFood.name || !newFood.price || !newFood.category || !newFood.imageFile) {
      alert("Please fill all fields and upload an image!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", newFood.name);
    formData.append("price", newFood.price);
    formData.append("category", newFood.category);
    formData.append("image", newFood.imageFile);
    formData.append("addedBy", adminUser._id);

    try {
      const res = await fetch(`${API_BASE}/foods`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (!res.ok) throw new Error('Failed to add food');
      
      await fetchFoods();
      setNewFood({
        name: '',
        price: '',
        category: '',
        imageFile: null
      });
    } catch (err) {
      setError(err.message);
      console.error("Error adding food:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Admin profile operations
  const handleAdminPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminProfile(prev => ({
          ...prev,
          photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateAdminProfile = () => {
    if (!adminProfile.name || !adminProfile.email) {
      alert("Name and email are required!");
      return;
    }

    const updatedAdmin = {
      ...adminUser,
      name: adminProfile.name,
      email: adminProfile.email,
      photo: adminProfile.photo,
    };

    if (adminProfile.password) {
      updatedAdmin.password = adminProfile.password;
    }

    localStorage.setItem('adminUser', JSON.stringify(updatedAdmin));
    setAdminUser(updatedAdmin);
    alert('Profile updated successfully!');
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  // Helper function for file handling
  const handleFileChange = (e, setStateFunction) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setStateFunction(prev => ({
          ...prev,
          image: reader.result,
          imageFile: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <div className="admin-profile-sidebar">
          {adminUser && (
            <>
              <div className="admin-photo">
                {adminProfile.photo ? (
                  <img src={adminProfile.photo} alt="Admin" />
                ) : (
                  <FaUser className="default-photo" />
                )}
              </div>
              <p className="admin-name">{adminUser.name}</p>
              <p className="admin-email">{adminUser.email}</p>
            </>
          )}
        </div>
        <button className="sidebar-button" onClick={() => setActiveTab("Dashboard")}>
          <FaBars className="icon" /> Dashboard
        </button>
        <button className="sidebar-button" onClick={() => setActiveTab("AdminProfile")}>
          <FaUser className="icon" /> Admin Profile
        </button>
        <button className="sidebar-button" onClick={() => setActiveTab("Users")}>
          <FaUsers className="icon" /> Users
        </button>
        <button className="sidebar-button" onClick={() => setActiveTab("Blogs")}>
          <FaBlog className="icon" /> Blogs
        </button>
        <button className="sidebar-button" onClick={() => setActiveTab("Products")}>
          <FaBox className="icon" /> Products
        </button>
        <button className="sidebar-button logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="icon" /> Logout
        </button>
      </div>

      <div className="main-content">
        {isLoading && <div className="loading-overlay">Loading...</div>}
        {error && <div className="error-message">{error}</div>}

        {/* Dashboard Tab */}
        {activeTab === "Dashboard" && (
          <div className="content">
            <h3>Admin Dashboard</h3>
            <div className="stats-container">
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <h4>Total Users</h4>
                <p>{users.length}</p>
              </div>
              <div className="stat-card">
                <FaBlog className="stat-icon" />
                <h4>Total Blogs</h4>
                <p>{blogs.length}</p>
              </div>
              <div className="stat-card">
                <FaBox className="stat-icon" />
                <h4>Total Products</h4>
                <p>{foods.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Admin Profile Tab */}
        {activeTab === "AdminProfile" && adminUser && (
          <div className="content">
            <h3>Admin Profile</h3>
            <div className="admin-profile-container">
              <div className="admin-profile-header">
                <div className="admin-profile-photo">
                  {adminProfile.photo ? (
                    <img src={adminProfile.photo} alt="Admin" />
                  ) : (
                    <div className="admin-profile-photo-placeholder">
                      <FaUser />
                    </div>
                  )}
                  <input
                    type="file"
                    id="admin-photo-upload"
                    onChange={handleAdminPhotoChange}
                    accept="image/*"
                  />
                  <label htmlFor="admin-photo-upload" className="change-photo-btn">
                    Change Photo
                  </label>
                </div>
                <div className="admin-profile-info">
                  <h2>{adminProfile.name}</h2>
                  <p className="admin-role">Administrator</p>
                </div>
              </div>

              <div className="admin-profile-details">
                <div className="profile-form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={adminProfile.name}
                    onChange={(e) => setAdminProfile(prev => ({...prev, name: e.target.value}))}
                  />
                </div>
                <div className="profile-form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={adminProfile.email}
                    onChange={(e) => setAdminProfile(prev => ({...prev, email: e.target.value}))}
                  />
                </div>
                <div className="profile-form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={adminProfile.password}
                    onChange={(e) => setAdminProfile(prev => ({...prev, password: e.target.value}))}
                    placeholder="Enter new password"
                  />
                </div>
                <button className="update-profile-btn" onClick={handleUpdateAdminProfile}>
                  Update Profile
                </button>
              </div>

              <div className="admin-stats">
                <div className="admin-stat-card">
                  <h4>Account Created</h4>
                  <p>{new Date(adminUser.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
                <div className="admin-stat-card">
                  <h4>Last Login</h4>
                  <p>{new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "Users" && (
          <div className="content">
            <h3>Manage Users</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="edit-btn">
                        <FaEdit />
                      </button>
                      <button className="delete-btn">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === "Blogs" && (
          <div className="content">
            <h3>Manage Blog Content</h3>

            {/* Add Blog Form */}
            <div className="add-blog-form">
              <h4>Add a New Blog</h4>
              <input
                type="text"
                value={newBlog.title}
                onChange={(e) => setNewBlog(prev => ({...prev, title: e.target.value}))}
                placeholder="Enter blog title"
              />
              <input 
                type="file" 
                onChange={(e) => handleFileChange(e, setNewBlog)} 
                accept="image/*"
              />
              {newBlog.image && <img src={newBlog.image} alt="Preview" width="200" />}
              <textarea
                value={newBlog.content}
                onChange={(e) => setNewBlog(prev => ({...prev, content: e.target.value}))}
                placeholder="Enter blog content"
              />
              <button onClick={handleAddBlog}>Add Blog</button>
            </div>

            {/* Blog List */}
            <ul className="blog-list">
              {blogs.map((blog) => (
                <li key={blog._id}>
                  {blogEditData.id === blog._id ? (
                    <div className="edit-blog-form">
                      <input
                        type="text"
                        value={blogEditData.title}
                        onChange={(e) => setBlogEditData(prev => ({...prev, title: e.target.value}))}
                        placeholder="Enter new title"
                      />
                      <input 
                        type="file" 
                        onChange={(e) => handleFileChange(e, setBlogEditData)} 
                        accept="image/*"
                      />
                      {blogEditData.image && <img src={blogEditData.image} alt="Preview" width="200" />}
                      <textarea
                        value={blogEditData.content}
                        onChange={(e) => setBlogEditData(prev => ({...prev, content: e.target.value}))}
                        placeholder="Enter blog content"
                      />
                      <div className="edit-actions">
                        <button onClick={handleUpdateBlog}>Save</button>
                        <button onClick={() => setBlogEditData({
                          id: null,
                          title: '',
                          content: '',
                          image: '',
                          imageFile: null
                        })}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="blog-item">
                      <img 
                        src={blog.image.startsWith('http') ? blog.image : `${API_BASE}${blog.image}`} 
                        alt="Blog" 
                        width="200" 
                      />
                      <div className="blog-details">
                        <h4>{blog.title}</h4>
                        <p>{blog.content}</p>
                        <p className="blog-date">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="blog-actions">
                        <button className="edit-btn" onClick={() => handleEditBlog(blog)}>
                          <FaEdit />
                        </button>
                        <button className="delete-btn" onClick={() => handleDeleteBlog(blog._id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "Products" && (
          <div className="content">
            <h3>Manage Food Products</h3>

            {/* Add Food Form */}
            <div className="add-food-form">
              <h4>Add a New Food Product</h4>
              <input
                type="text"
                value={newFood.name}
                onChange={(e) => setNewFood(prev => ({...prev, name: e.target.value}))}
                placeholder="Enter food name"
              />
              <input
                type="text"
                value={newFood.price}
                onChange={(e) => setNewFood(prev => ({...prev, price: e.target.value}))}
                placeholder="Enter price"
              />
              <input
                type="text"
                value={newFood.category}
                onChange={(e) => setNewFood(prev => ({...prev, category: e.target.value}))}
                placeholder="Enter category"
              />
              <input 
                type="file" 
                onChange={(e) => handleFileChange(e, setNewFood)} 
                accept="image/*"
              />
              {newFood.image && <img src={newFood.image} alt="Preview" width="200" />}
              <button onClick={handleAddFood}>Add Food</button>
            </div>

            {/* Food List */}
            <table className="food-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => (
                  <tr key={food._id}>
                    {foodEditData.id === food._id ? (
                      <>
                        <td>
                          <input 
                            type="file" 
                            onChange={(e) => handleFileChange(e, setFoodEditData)} 
                            accept="image/*"
                          />
                          {foodEditData.image && (
                            <img src={foodEditData.image} alt="Preview" width="100" />
                          )}
                        </td>
                        <td>
                          <input
                            type="text"
                            value={foodEditData.name}
                            onChange={(e) => setFoodEditData(prev => ({...prev, name: e.target.value}))}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={foodEditData.price}
                            onChange={(e) => setFoodEditData(prev => ({...prev, price: e.target.value}))}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={foodEditData.category}
                            onChange={(e) => setFoodEditData(prev => ({...prev, category: e.target.value}))}
                          />
                        </td>
                        <td>
                          {new Date(food.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <button onClick={handleUpdateFood}>Save</button>
                          <button onClick={() => setFoodEditData({
                            id: null,
                            name: '',
                            price: '',
                            category: '',
                            image: '',
                            imageFile: null
                          })}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <img 
                            src={food.image.startsWith('http') ? food.image : `${API_BASE}${food.image}`} 
                            alt={food.name} 
                            width="100" 
                          />
                        </td>
                        <td>{food.name}</td>
                        <td>₹{food.price}</td>
                        <td>{food.category}</td>
                        <td>{new Date(food.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button className="edit-btn" onClick={() => handleEditFood(food)}>
                            <FaEdit />
                          </button>
                          <button className="delete-btn" onClick={() => handleDeleteFood(food._id)}>
                            <FaTrash />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;