// ============================================
// StudentList.jsx
// View all students with search and delete
// ============================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import StudentTable from "../components/StudentTable";
import "./StudentList.css";

function StudentList() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Auth check
  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) navigate("/");
  }, [navigate]);

  // Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch students from API
  const fetchStudents = async (query = "") => {
    setLoading(true);
    setError("");

    try {
      const params = query ? { search: query } : {};
      const response = await API.get("/students", { params });
      setStudents(response.data);
    } catch (err) {
      setError("Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents(search);
  };

  // Handle delete student
  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await API.delete(`/students/${studentId}`);
      // Refresh the list
      fetchStudents(search);
    } catch (err) {
      alert("Failed to delete student.");
    }
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <button className="btn-back" onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
        <h2>👥 Student List</h2>
      </div>

      {/* Search bar */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by roll number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-search">Search</button>
        <button
          type="button"
          className="btn-clear"
          onClick={() => { setSearch(""); fetchStudents(); }}
        >
          Clear
        </button>
      </form>

      {/* Error message */}
      {error && <div className="message error">{error}</div>}

      {/* Student count */}
      {!loading && (
        <p className="student-count">
          Total Students: <strong>{students.length}</strong>
        </p>
      )}

      {/* Student table */}
      {loading ? (
        <p className="loading-text">Loading students...</p>
      ) : (
        <StudentTable students={students} onDelete={handleDelete} showDelete={true} />
      )}
    </div>
  );
}

export default StudentList;
