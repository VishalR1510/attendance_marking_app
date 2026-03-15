import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./PerformanceTracker.css";

function PerformanceTracker() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    // Auth check
    useEffect(() => {
        if (!localStorage.getItem("isLoggedIn")) navigate("/");
    }, [navigate]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setMessage({ text: "Please enter a Student ID or Roll Number.", type: "error" });
            setPerformanceData(null);
            return;
        }

        setLoading(true);
        setMessage({ text: "", type: "" });
        setPerformanceData(null);

        try {
            const response = await API.get(`/performance/${searchQuery}`);
            setPerformanceData(response.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setMessage({ text: "Student not found. Please check the ID or Roll Number.", type: "error" });
            } else {
                setMessage({ text: "Failed to fetch performance data.", type: "error" });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="performance-container">
            <div className="performance-header">
                <button className="btn-back" onClick={() => navigate("/dashboard")}>
                    ← Back
                </button>
                <h2>📈 Performance Tracker</h2>
            </div>

            <div className="search-section">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Enter Student ID or Roll Number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="btn-search" disabled={loading}>
                        {loading ? "Searching..." : "Search"}
                    </button>
                </form>
            </div>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            {performanceData && (
                <div className="performance-card">
                    <div className="student-profile">
                        <div className="profile-icon">👤</div>
                        <div className="profile-details">
                            <h3>{performanceData.name}</h3>
                            <p>Roll No: {performanceData.roll_number} | {performanceData.department} - Year {performanceData.year}</p>
                        </div>
                        <div className={`status-badge ${performanceData.status_indicator === 'Good Performance' ? 'good' : performanceData.status_indicator === 'Needs Improvement' ? 'needs-improvement' : 'no-data'}`}>
                            {performanceData.status_indicator}
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-box attendance-box">
                            <h4>Attendance</h4>
                            <div className="stat-value">{performanceData.attendance_percentage}%</div>
                            <p className="stat-subtext">{performanceData.present_classes} / {performanceData.total_classes} classes</p>
                        </div>

                        <div className="stat-box avg-marks-box">
                            <h4>Average Marks</h4>
                            <div className="stat-value">{performanceData.average_marks}</div>
                            <p className="stat-subtext">Overall performance</p>
                        </div>
                    </div>

                    <div className="marks-breakdown">
                        <h4>Internal Marks Breakdown</h4>
                        <div className="marks-list">
                            <div className="mark-item">
                                <span className="mark-label">Unit Test 1</span>
                                <span className="mark-score">{performanceData.unit_test_1 ?? "N/A"}</span>
                            </div>
                            <div className="mark-item">
                                <span className="mark-label">Unit Test 2</span>
                                <span className="mark-score">{performanceData.unit_test_2 ?? "N/A"}</span>
                            </div>
                            <div className="mark-item">
                                <span className="mark-label">Unit Test 3</span>
                                <span className="mark-score">{performanceData.unit_test_3 ?? "N/A"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PerformanceTracker;
