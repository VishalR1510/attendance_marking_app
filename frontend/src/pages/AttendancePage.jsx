// ============================================
// AttendancePage.jsx
// Mark attendance for students
// Teacher selects Present/Absent for each student
// ============================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./AttendancePage.css";

function AttendancePage() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Auth check
  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) navigate("/");
  }, [navigate]);

  // Fetch students on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await API.get("/students");
        setStudents(response.data);

        // Initialize all students as "Present" by default
        const initial = {};
        response.data.forEach((s) => {
          initial[s.student_id] = "Present";
        });
        setAttendance(initial);
      } catch {
        setMessage({ text: "Failed to load students.", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Update attendance status for a student
  const handleStatusChange = (studentId, status) => {
    setAttendance({ ...attendance, [studentId]: status });
  };

  // Submit attendance
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (students.length === 0) {
      setMessage({ text: "No students to mark attendance for.", type: "error" });
      return;
    }

    setSubmitting(true);

    try {
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        student_id: parseInt(studentId),
        status,
      }));

      const response = await API.post("/attendance", {
        date,
        records,
      });

      const result = response.data;
      let msg = result.message;
      if (result.errors && result.errors.length > 0) {
        msg += "\n⚠️ " + result.errors.join("\n⚠️ ");
      }

      setMessage({
        text: msg,
        type: result.errors && result.errors.length > 0 ? "error" : "success",
      });
    } catch (err) {
      const detail = err.response?.data?.detail || "Failed to submit attendance.";
      setMessage({ text: detail, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  // Mark all students with same status
  const markAll = (status) => {
    const updated = {};
    students.forEach((s) => {
      updated[s.student_id] = status;
    });
    setAttendance(updated);
  };

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <button className="btn-back" onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
        <h2>✅ Mark Attendance</h2>
      </div>

      {/* Date selector */}
      <div className="date-selector">
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text.split("\n").map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}

      {loading ? (
        <p className="loading-text">Loading students...</p>
      ) : students.length === 0 ? (
        <p className="no-data">No students found. Please add students first.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Quick actions */}
          <div className="quick-actions">
            <button type="button" className="btn-mark-all present" onClick={() => markAll("Present")}>
              Mark All Present
            </button>
            <button type="button" className="btn-mark-all absent" onClick={() => markAll("Absent")}>
              Mark All Absent
            </button>
          </div>

          {/* Attendance table */}
          <div className="table-wrapper">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.student_id}>
                    <td>{student.roll_number}</td>
                    <td>{student.name}</td>
                    <td>{student.department}</td>
                    <td>
                      <div className="status-toggle">
                        <button
                          type="button"
                          className={`status-btn ${attendance[student.student_id] === "Present" ? "active-present" : ""}`}
                          onClick={() => handleStatusChange(student.student_id, "Present")}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          className={`status-btn ${attendance[student.student_id] === "Absent" ? "active-absent" : ""}`}
                          onClick={() => handleStatusChange(student.student_id, "Absent")}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save Attendance"}
          </button>
        </form>
      )}
    </div>
  );
}

export default AttendancePage;
