import React, { useState, useEffect, useCallback } from "react";
import { FaUsers, FaBlog, FaBox, FaBars, FaTrash, FaEdit, FaUser, FaSignOutAlt } from "react-icons/fa";
import "../css/AdminPanel.css";



const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [foods, setFoods] = useState([]);
  const [editBlog, setEditBlog] = useState(null);
  const [editFood, setEditFood] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  // Blog Editing States
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedImage, setUpdatedImage] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");

  // Food Editing States
  const [updatedFoodName, setUpdatedFoodName] = useState("");
  const [updatedFoodPrice, setUpdatedFoodPrice] = useState("");
  const [updatedFoodCategory, setUpdatedFoodCategory] = useState("");
  const [updatedFoodImage, setUpdatedFoodImage] = useState("");

  // New Blog States
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  // New Food States
  const [newFoodName, setNewFoodName] = useState("");
  const [newFoodPrice, setNewFoodPrice] = useState("");
  const [newFoodCategory, setNewFoodCategory] = useState("");

  // Admin Profile States
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPhoto, setAdminPhoto] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Fetch Blogs
  const fetchBlogs = useCallback(() => {
    fetch(`${API_BASE}/blogs`)
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((error) => console.error("Error fetching blogs:", error));
  }, [API_BASE]);

  // Fetch Users
  const fetchUsers = useCallback(() => {
    fetch(`${API_BASE}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, [API_BASE]);

  // Fetch Food Data
  const fetchFoods = useCallback(() => {
    fetch(`${API_BASE}/foods`)
      .then((res) => res.json())
      .then((data) => setFoods(data))
      .catch((error) => console.error("Error fetching foods:", error));
  }, [API_BASE]);

  useEffect(() => {
    const loggedInAdmin = JSON.parse(localStorage.getItem('adminUser'));
    if (loggedInAdmin) {
      setAdminUser(loggedInAdmin);
      setAdminName(loggedInAdmin.name);
      setAdminEmail(loggedInAdmin.email);
      setAdminPhoto(loggedInAdmin.photo || '');
    } else {
      window.location.href = '/admin/login';
    }

    if (activeTab === "Blogs") fetchBlogs();
    if (activeTab === "Users") fetchUsers();
    if (activeTab === "Products") fetchFoods();
  }, [activeTab, adminUser, fetchBlogs, fetchUsers, fetchFoods]);

  // Delete Blog
  const handleDeleteBlog = (id) => {
    fetch(`${API_BASE}/blogs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
      .then(() => fetchBlogs())
      .catch((error) => console.error("Error deleting blog:", error));
  };

  // Delete Food
  const handleDeleteFood = (id) => {
    fetch(`${API_BASE}/foods/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
      .then(() => fetchFoods())
      .catch((error) => console.error("Error deleting food:", error));
  };

  // Edit Blog
  const handleEditBlog = (blog) => {
    setEditBlog(blog);
    setUpdatedTitle(blog.title);
    setUpdatedImage(blog.image);
    setUpdatedContent(blog.content);
  };

  // Edit Food
  const handleEditFood = (food) => {
    setEditFood(food);
    setUpdatedFoodName(food.name);
    setUpdatedFoodPrice(food.price);
    setUpdatedFoodCategory(food.category);
    setUpdatedFoodImage(food.image);
  };

  // Update Blog
  const handleUpdateBlog = async () => {
    const formData = new FormData();
    formData.append("title", updatedTitle);
    formData.append("content", updatedContent);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    fetch(`${API_BASE}/blogs/${editBlog._id}`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
      .then(() => {
        fetchBlogs();
        setEditBlog(null);
        setSelectedFile(null);
      })
      .catch((error) => console.error("Error updating blog:", error));
  };

  // Update Food
  const handleUpdateFood = async () => {
    const formData = new FormData();
    formData.append("name", updatedFoodName);
    formData.append("price", updatedFoodPrice);
    formData.append("category", updatedFoodCategory);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    fetch(`${API_BASE}/foods/${editFood._id}`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
      .then(() => {
        fetchFoods();
        setEditFood(null);
        setSelectedFile(null);
      })
      .catch((error) => console.error("Error updating food:", error));
  };

  // Handle File Change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (editBlog) {
      setUpdatedImage(URL.createObjectURL(file));
    }
    if (editFood) {
      setUpdatedFoodImage(URL.createObjectURL(file));
    }
  };

  // Handle Admin Photo Change
  const handleAdminPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add New Blog
  const handleAddBlog = async () => {
    if (!newTitle || !selectedFile || !newContent) {
      alert("Please fill all fields and upload an image!");
      return;
    }

    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("content", newContent);
    formData.append("image", selectedFile);
    formData.append("authorId", adminUser._id);

    fetch(`${API_BASE}/blogs`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
      .then((res) => res.json())
      .then(() => {
        fetchBlogs();
        setNewTitle("");
        setNewContent("");
        setSelectedFile(null);
      })
      .catch((error) => console.error("Error adding blog:", error));
  };

  // Add New Food
  const handleAddFood = async () => {
    if (!newFoodName || !newFoodPrice || !newFoodCategory || !selectedFile) {
      alert("Please fill all fields and upload an image!");
      return;
    }

    const formData = new FormData();
    formData.append("name", newFoodName);
    formData.append("price", newFoodPrice);
    formData.append("category", newFoodCategory);
    formData.append("image", selectedFile);
    formData.append("addedBy", adminUser._id);

    fetch(`${API_BASE}/foods`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
      .then((res) => res.json())
      .then(() => {
        fetchFoods();
        setNewFoodName("");
        setNewFoodPrice("");
        setNewFoodCategory("");
        setSelectedFile(null);
      })
      .catch((error) => console.error("Error adding food:", error));
  };

  // Update Admin Profile
  const handleUpdateAdminProfile = () => {
    const updatedAdmin = {
      ...adminUser,
      name: adminName,
      email: adminEmail,
      photo: adminPhoto,
    };

    localStorage.setItem('adminUser', JSON.stringify(updatedAdmin));
    setAdminUser(updatedAdmin);
    alert('Profile updated successfully!');
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <div className="admin-profile-sidebar">
          {adminUser && (
            <>
              <div className="admin-photo">
                {adminPhoto ? (
                  <img src={adminPhoto} alt="Admin" />
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
                  {adminPhoto ? (
                    <img src={adminPhoto} alt="Admin" />
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
                  <h2>{adminName}</h2>
                  <p className="admin-role">Administrator</p>
                </div>
              </div>

              <div className="admin-profile-details">
                <div className="profile-form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                  />
                </div>
                <div className="profile-form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
                <div className="profile-form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
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
                  <p>{new Date().toLocaleDateString()}</p>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
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
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter blog title"
              />
              <input type="file" onChange={handleFileChange} />
              {selectedFile && <img src={URL.createObjectURL(selectedFile)} alt="Preview" width="200" />}
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Enter blog content"
              />
              <button onClick={handleAddBlog}>Add Blog</button>
            </div>

            {/* Blog List */}
            <ul className="blog-list">
              {blogs.map((blog) => (
                <li key={blog._id}>
                  {editBlog && editBlog._id === blog._id ? (
                    <div className="edit-blog-form">
                      <input
                        type="text"
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                        placeholder="Enter new title"
                      />
                      <input type="file" onChange={handleFileChange} />
                      {updatedImage && <img src={updatedImage} alt="Preview" width="200" />}
                      <textarea
                        value={updatedContent}
                        onChange={(e) => setUpdatedContent(e.target.value)}
                        placeholder="Enter blog content"
                      />
                      <div className="edit-actions">
                        <button onClick={handleUpdateBlog}>Save</button>
                        <button onClick={() => setEditBlog(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="blog-item">
                      <img src={`${API_BASE}${blog.image}`} alt="Blog" width="200" />
                      <div className="blog-details">
                        <h4>{blog.title}</h4>
                        <p>{blog.content}</p>
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
                value={newFoodName}
                onChange={(e) => setNewFoodName(e.target.value)}
                placeholder="Enter food name"
              />
              <input
                type="text"
                value={newFoodPrice}
                onChange={(e) => setNewFoodPrice(e.target.value)}
                placeholder="Enter price"
              />
              <input
                type="text"
                value={newFoodCategory}
                onChange={(e) => setNewFoodCategory(e.target.value)}
                placeholder="Enter category"
              />
              <input type="file" onChange={handleFileChange} />
              {selectedFile && <img src={URL.createObjectURL(selectedFile)} alt="Preview" width="200" />}
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => (
                  <tr key={food._id}>
                    {editFood && editFood._id === food._id ? (
                      <>
                        <td>
                          <input type="file" onChange={handleFileChange} />
                          {updatedFoodImage && (
                            <img src={updatedFoodImage} alt="Preview" width="100" />
                          )}
                        </td>
                        <td>
                          <input
                            type="text"
                            value={updatedFoodName}
                            onChange={(e) => setUpdatedFoodName(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={updatedFoodPrice}
                            onChange={(e) => setUpdatedFoodPrice(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={updatedFoodCategory}
                            onChange={(e) => setUpdatedFoodCategory(e.target.value)}
                          />
                        </td>
                        <td>
                          <button onClick={handleUpdateFood}>Save</button>
                          <button onClick={() => setEditFood(null)}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <img src={`${API_BASE}${food.image}`} alt={food.name} width="100" />
                        </td>
                        <td>{food.name}</td>
                        <td>₹{food.price}</td>
                        <td>{food.category}</td>
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