// ============================================
// Dashboard.jsx
// Main dashboard page after login
// Shows navigation buttons for all features
// ============================================

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) {
      navigate("/");
    }
  }, [navigate]);

  // Dashboard menu items
  const menuItems = [
    {
      title: "Add Student",
      description: "Register a new student",
      icon: "➕",
      path: "/add-student",
      color: "#10b981",
    },
    {
      title: "View Students",
      description: "Browse & manage students",
      icon: "👥",
      path: "/students",
      color: "#3b82f6",
    },
    {
      title: "Mark Attendance",
      description: "Record daily attendance",
      icon: "✅",
      path: "/attendance",
      color: "#8b5cf6",
    },
    {
      title: "Generate Report",
      description: "View & download reports",
      icon: "📊",
      path: "/report",
      color: "#f59e0b",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {localStorage.getItem("username") || "Teacher"}!</h2>
        <p>Select an option to get started</p>
      </div>

      <div className="dashboard-grid">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className="dashboard-card"
            onClick={() => navigate(item.path)}
            style={{ borderTop: `4px solid ${item.color}` }}
          >
            <span className="card-icon">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
