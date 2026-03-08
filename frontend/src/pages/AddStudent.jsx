// ============================================
// AddStudent.jsx
// Page to add a new student
// Sends student data to backend API
// ============================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./FormPage.css";

function AddStudent() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    roll_number: "",
    name: "",
    department: "",
    year: "",
    email: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  // Auth check
  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) navigate("/");
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    // Validate required fields
    if (!formData.roll_number || !formData.name || !formData.department || !formData.year) {
      setMessage({ text: "Please fill in all required fields.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        year: parseInt(formData.year),
      };
      const response = await API.post("/students", payload);
      setMessage({ text: response.data.message, type: "success" });

      // Reset form
      setFormData({ roll_number: "", name: "", department: "", year: "", email: "" });
    } catch (err) {
      const detail = err.response?.data?.detail || "Failed to add student.";
      setMessage({ text: detail, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <button className="btn-back" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <h2>➕ Add New Student</h2>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Roll Number *</label>
            <input
              type="text"
              name="roll_number"
              placeholder="e.g., 101"
              value={formData.roll_number}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., John Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Department *</label>
            <input
              type="text"
              name="department"
              placeholder="e.g., CSE"
              value={formData.department}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Year *</label>
            <input
              type="number"
              name="year"
              placeholder="e.g., 2"
              min="1"
              max="5"
              value={formData.year}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="e.g., john@college.edu"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Adding..." : "Add Student"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;
