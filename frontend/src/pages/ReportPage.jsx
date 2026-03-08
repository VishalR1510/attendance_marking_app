// ============================================
// ReportPage.jsx
// Generate and download attendance reports
// Teacher selects a date to view/download CSV
// ============================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./ReportPage.css";

function ReportPage() {
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auth check
  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) navigate("/");
  }, [navigate]);

  // Fetch report for selected date
  const fetchReport = async () => {
    setReport(null);
    setError("");
    setLoading(true);

    try {
      const response = await API.get(`/report/${date}`);
      setReport(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`No attendance records found for ${date}`);
      } else {
        setError("Failed to generate report.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Download CSV
  const downloadCSV = async () => {
    try {
      const response = await API.get(`/report/download/${date}`, {
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Attendance_Report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download report.");
    }
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <button className="btn-back" onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
        <h2>📊 Attendance Report</h2>
      </div>

      {/* Date selector */}
      <div className="report-controls">
        <div className="date-selector">
          <label>Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button className="btn-generate" onClick={fetchReport} disabled={loading}>
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {error && <div className="message error">{error}</div>}

      {/* Report display */}
      {report && (
        <div className="report-content">
          {/* Summary cards */}
          <div className="summary-cards">
            <div className="summary-card total">
              <span className="summary-number">{report.total_students}</span>
              <span className="summary-label">Total Students</span>
            </div>
            <div className="summary-card present">
              <span className="summary-number">{report.present}</span>
              <span className="summary-label">Present</span>
            </div>
            <div className="summary-card absent">
              <span className="summary-number">{report.absent}</span>
              <span className="summary-label">Absent</span>
            </div>
          </div>

          {/* Report table */}
          <div className="table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Student Name</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {report.records.map((record, index) => (
                  <tr key={index}>
                    <td>{record["Roll Number"]}</td>
                    <td>{record["Student Name"]}</td>
                    <td>{record["Department"]}</td>
                    <td>
                      <span className={`status-badge ${record["Status"].toLowerCase()}`}>
                        {record["Status"]}
                      </span>
                    </td>
                    <td>{record["Date"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Download button */}
          <button className="btn-download" onClick={downloadCSV}>
            📥 Download CSV Report
          </button>
        </div>
      )}
    </div>
  );
}

export default ReportPage;
