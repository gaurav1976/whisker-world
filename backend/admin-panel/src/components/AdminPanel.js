import React, { useState, useEffect } from "react";
import { FaUsers, FaBlog, FaBox, FaBars, FaTrash, FaEdit } from "react-icons/fa";
import "../css/AdminPanel.css";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [foods, setFoods] = useState([]);
  const [editBlog, setEditBlog] = useState(null);
  const [editFood, setEditFood] = useState(null); // New state for editing food
  const [selectedFile, setSelectedFile] = useState(null);

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

  useEffect(() => {
    if (activeTab === "Blogs") fetchBlogs();
    if (activeTab === "Users") fetchUsers();
    if (activeTab === "Products") fetchFoods();
  }, [activeTab]);

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

  // Delete Blog
  const handleDeleteBlog = (id) => {
    fetch(`http://localhost:5000/blogs/${id}`, { method: "DELETE" })
      .then(() => fetchBlogs())
      .catch((error) => console.error("Error deleting blog:", error));
  };

  // Delete Food
  const handleDeleteFood = (id) => {
    fetch(`http://localhost:5000/foods/${id}`, { method: "DELETE" })
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

    fetch(`http://localhost:5000/blogs/${editBlog._id}`, {
      method: "PUT",
      body: formData,
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

    fetch("http://localhost:5000/blogs", {
      method: "POST",
      body: formData,
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

    fetch("http://localhost:5000/foods", {
      method: "POST",
      body: formData,
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

  return (
    <div className="admin-container">
      <div className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <button className="sidebar-button" onClick={() => setActiveTab("Dashboard")}>
          <FaBars className="icon" /> Dashboard
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
                      <img src={`http://localhost:5000${blog.image}`} alt="Blog" width="200" />
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
                          <img src={`http://localhost:5000${food.image}`} alt={food.name} width="100" />
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