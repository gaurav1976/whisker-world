import React, { useState } from "react";
import { FaUsers, FaBlog, FaFood, FaBars } from "react-icons/fa";
import "../css/adminpanel.css"; // Ensure CSS file is correctly linked

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "Users":
        return <div className="p-4">Manage Users Data Here</div>;
      case "Blogs":
        return <div className="p-4">Manage Blog Content Here</div>;
      case "Foods":
        return <div className="p-4">Manage Product Listings Here</div>;
      default:
        return <div className="p-4">Welcome to the Admin Dashboard</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <button className="flex items-center p-2 hover:bg-blue-700 rounded" onClick={() => setActiveTab("Dashboard")}>
          <FaBars className="mr-2" /> Dashboard
        </button>
        <button className="flex items-center p-2 hover:bg-blue-700 rounded" onClick={() => setActiveTab("Users")}>
          <FaUsers className="mr-2" /> Users
        </button>
        <button className="flex items-center p-2 hover:bg-blue-700 rounded" onClick={() => setActiveTab("Blogs")}>
          <FaBlog className="mr-2" /> Blogs
        </button>
        <button className="flex items-center p-2 hover:bg-blue-700 rounded" onClick={() => setActiveTab("Food")}>
          <FaFood className="mr-2" /> Foods
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6">{renderContent()}</div>
    </div>
  );
};

export default AdminPanel;
