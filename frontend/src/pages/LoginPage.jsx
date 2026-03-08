// ============================================
// LoginPage.jsx
// Teacher login page
// Validates credentials via backend API
// ============================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validate empty fields
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/login", { username, password });

      if (response.data.message === "Login successful") {
        // Store login state
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", response.data.username);
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">🎓</span>
          <h2>Attendance Marker System</h2>
          <p>Teacher Login</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <p>Default: admin / admin123</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
