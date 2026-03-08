// ============================================
// Navbar.jsx
// Navigation bar component
// Shows app title and logout button when logged in
// ============================================

import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Handle logout - clear session and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => isLoggedIn && navigate("/dashboard")}>
        <span className="navbar-icon">📋</span>
        <h1>Dr.M.G.R Janaki College of arts and science for women</h1>
      </div>
      {isLoggedIn && (
        <div className="navbar-actions">
          <span className="navbar-user">
            👤 {localStorage.getItem("username") || "Teacher"}
          </span>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
