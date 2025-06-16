import React, { useState, useEffect } from "react";
import { FaUsers, FaBlog, FaBox, FaBars, FaTrash, FaEdit, FaUser, FaSignOutAlt, FaLock } from "react-icons/fa";
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
  const [adminList, setAdminList] = useState([]); // For super admin to manage other admins

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
  const [adminRole, setAdminRole] = useState("");

  // New Admin States (for super admin)
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("junioradmin");

  useEffect(() => {
    // Check if admin is logged in
    const loggedInAdmin = JSON.parse(localStorage.getItem('adminUser'));
    if (loggedInAdmin) {
      setAdminUser(loggedInAdmin);
      setAdminName(loggedInAdmin.name);
      setAdminEmail(loggedInAdmin.email);
      setAdminPhoto(loggedInAdmin.photo || '');
      setAdminRole(loggedInAdmin.role || 'admin');
    } else {
      // Redirect to login if not authenticated
      window.location.href = '/admin/login';
    }

    if (activeTab === "Blogs") fetchBlogs();
    if (activeTab === "Users") fetchUsers();
    if (activeTab === "Products") fetchFoods();
    if (activeTab === "Admins" && adminUser?.role === "superadmin") fetchAdmins();
  }, [activeTab, adminUser]);

  // Fetch Blogs
  const fetchBlogs = () => {
    fetch("http://localhost:5000/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((error) => console.error("Error fetching blogs:", error));
  };

  // Fetch Users
  const fetchUsers = () => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  // Fetch Food Data
  const fetchFoods = () => {
    fetch("http://localhost:5000/foods")
      .then((res) => res.json())
      .then((data) => setFoods(data))
      .catch((error) => console.error("Error fetching foods:", error));
  };

  // Fetch Admins (only for super admin)
  const fetchAdmins = () => {
    fetch("http://localhost:5000/admin", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
      .then((res) => res.json())
      .then((data) => setAdminList(data))
      .catch((error) => console.error("Error fetching admins:", error));
  };

  // Delete Blog
  const handleDeleteBlog = (id) => {
    // Junior admins can't delete blogs
    if (adminUser.role === "junioradmin") {
      alert("You don't have permission to delete blogs");
      return;
    }
    
    fetch(`http://localhost:5000/blogs/${id}`, { 
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
    // Junior admins can't delete foods
    if (adminUser.role === "junioradmin") {
      alert("You don't have permission to delete products");
      return;
    }
    
    fetch(`http://localhost:5000/foods/${id}`, { 
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
      .then(() => fetchFoods())
      .catch((error) => console.error("Error deleting food:", error));
  };

  // Delete Admin (only for super admin)
  const handleDeleteAdmin = (id) => {
    if (adminUser.role !== "superadmin") return;
    
    fetch(`http://localhost:5000/admin/${id}`, { 
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
      .then(() => fetchAdmins())
      .catch((error) => console.error("Error deleting admin:", error));
  };

  // Edit Blog
  const handleEditBlog = (blog) => {
    // Junior admins can only edit their own blogs (if implemented)
    setEditBlog(blog);
    setUpdatedTitle(blog.title);
    setUpdatedImage(blog.image);
    setUpdatedContent(blog.content);
  };

  // Edit Food
  const handleEditFood = (food) => {
    // Junior admins can only edit their own foods (if implemented)
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

    fetch(`http://localhost:5000/blogs/${editBlog._id}`, {
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

    fetch(`http://localhost:5000/foods/${editFood._id}`, {
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

    fetch("http://localhost:5000/blogs", {
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

    fetch("http://localhost:5000/foods", {
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

  // Add New Admin (only for super admin)
  const handleAddAdmin = async () => {
    if (adminUser.role !== "superadmin") return;
    
    if (!newAdminName || !newAdminEmail || !newAdminPassword) {
      alert("Please fill all fields!");
      return;
    }

    const newAdmin = {
      name: newAdminName,
      email: newAdminEmail,
      password: newAdminPassword,
      role: newAdminRole
    };

    fetch("http://localhost:5000/admin/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify(newAdmin)
    })
      .then((res) => res.json())
      .then(() => {
        fetchAdmins();
        setNewAdminName("");
        setNewAdminEmail("");
        setNewAdminPassword("");
        setNewAdminRole("junioradmin");
      })
      .catch((error) => console.error("Error adding admin:", error));
  };

  // Update Admin Profile
  const handleUpdateAdminProfile = () => {
    const updatedAdmin = {
      ...adminUser,
      name: adminName,
      email: adminEmail,
      photo: adminPhoto,
    };
    
    // In a real app, you would send this to your backend
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

  // Check if current admin has permission for an action
  const hasPermission = (requiredRole) => {
    if (!adminUser) return false;
    if (adminUser.role === "superadmin") return true;
    if (requiredRole === "admin" && adminUser.role === "admin") return true;
    return adminUser.role === requiredRole;
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
              <p className="admin-role-badge">{adminUser.role}</p>
            </>
          )}
        </div>
        <button className="sidebar-button" onClick={() => setActiveTab("Dashboard")}>
          <FaBars className="icon" /> Dashboard
        </button>
        <button className="sidebar-button" onClick={() => setActiveTab("AdminProfile")}>
          <FaUser className="icon" /> Admin Profile
        </button>
        
        {hasPermission("admin") && (
          <button className="sidebar-button" onClick={() => setActiveTab("Users")}>
            <FaUsers className="icon" /> Users
          </button>
        )}
        
        <button className="sidebar-button" onClick={() => setActiveTab("Blogs")}>
          <FaBlog className="icon" /> Blogs
        </button>
        
        <button className="sidebar-button" onClick={() => setActiveTab("Products")}>
          <FaBox className="icon" /> Products
        </button>
        
        {adminUser?.role === "superadmin" && (
          <button className="sidebar-button" onClick={() => setActiveTab("Admins")}>
            <FaLock className="icon" /> Manage Admins
          </button>
        )}
        
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
              {adminUser?.role === "superadmin" && (
                <div className="stat-card">
                  <FaLock className="stat-icon" />
                  <h4>Total Admins</h4>
                  <p>{adminList.length}</p>
                </div>
              )}
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
                  <p className={`admin-role ${adminUser.role}`}>
                    {adminUser.role === "superadmin" ? "Super Administrator" : 
                     adminUser.role === "admin" ? "Administrator" : "Junior Administrator"}
                  </p>
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
        {activeTab === "Users" && hasPermission("admin") && (
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
                      {hasPermission("admin") && (
                        <button className="delete-btn">
                          <FaTrash />
                        </button>
                      )}
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

            {/* Add Blog Form - Only for admins and super admins */}
            {(hasPermission("admin") || adminUser?.role === "superadmin") && (
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
            )}

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
                      <img src={`http://localhost:5000${blog.image}`} alt="Blog" width="200" />
                      <div className="blog-details">
                        <h4>{blog.title}</h4>
                        <p>{blog.content}</p>
                      </div>
                      <div className="blog-actions">
                        <button className="edit-btn" onClick={() => handleEditBlog(blog)}>
                          <FaEdit />
                        </button>
                        {hasPermission("admin") && (
                          <button className="delete-btn" onClick={() => handleDeleteBlog(blog._id)}>
                            <FaTrash />
                          </button>
                        )}
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

            {/* Add Food Form - Only for admins and super admins */}
            {(hasPermission("admin") || adminUser?.role === "superadmin") && (
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
            )}

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
                          <img src={`http://localhost:5000${food.image}`} alt={food.name} width="100" />
                        </td>
                        <td>{food.name}</td>
                        <td>₹{food.price}</td>
                        <td>{food.category}</td>
                        <td>
                          <button className="edit-btn" onClick={() => handleEditFood(food)}>
                            <FaEdit />
                          </button>
                          {hasPermission("admin") && (
                            <button className="delete-btn" onClick={() => handleDeleteFood(food._id)}>
                              <FaTrash />
                            </button>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Admins Tab (Super Admin Only) */}
        {activeTab === "Admins" && adminUser?.role === "superadmin" && (
          <div className="content">
            <h3>Manage Administrators</h3>

            {/* Add Admin Form */}
            <div className="add-admin-form">
              <h4>Add a New Administrator</h4>
              <input
                type="text"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                placeholder="Enter admin name"
              />
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="Enter admin email"
              />
              <input
                type="password"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                placeholder="Enter password"
              />
              <select
                value={newAdminRole}
                onChange={(e) => setNewAdminRole(e.target.value)}
              >
                <option value="superadmin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="junioradmin">Junior Admin</option>
              </select>
              <button onClick={handleAddAdmin}>Add Admin</button>
            </div>

            {/* Admins List */}
            <table className="admins-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminList.map((admin) => (
                  <tr key={admin._id}>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td className={`role-badge ${admin.role}`}>
                      {admin.role === "superadmin" ? "Super Admin" : 
                       admin.role === "admin" ? "Admin" : "Junior Admin"}
                    </td>
                    <td>
                      <button className="edit-btn">
                        <FaEdit />
                      </button>
                      {admin.role !== "superadmin" && (
                        <button 
                          className="delete-btn" 
                          onClick={() => handleDeleteAdmin(admin._id)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
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