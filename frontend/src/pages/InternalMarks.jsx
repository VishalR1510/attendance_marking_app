import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./InternalMarks.css";

function InternalMarks() {
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    // Auth check
    useEffect(() => {
        if (!localStorage.getItem("isLoggedIn")) navigate("/");
    }, [navigate]);

    // Fetch students and their marks on mount
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await API.get("/internal-marks/");
                setStudents(response.data);

                const initial = {};
                response.data.forEach((s) => {
                    initial[s.student_id] = {
                        unit_test_1: s.unit_test_1 !== "" && s.unit_test_1 !== null ? s.unit_test_1 : "",
                        unit_test_2: s.unit_test_2 !== "" && s.unit_test_2 !== null ? s.unit_test_2 : "",
                        unit_test_3: s.unit_test_3 !== "" && s.unit_test_3 !== null ? s.unit_test_3 : "",
                    };
                });
                setMarks(initial);
            } catch {
                setMessage({ text: "Failed to load students.", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // Update marks for a student
    const handleMarkChange = (studentId, testField, value) => {
        // Only allow numbers or empty string. Limit values 0-100 logic.
        if (value === "" || (/^\d+$/.test(value) && parseInt(value) <= 100)) {
            setMarks({
                ...marks,
                [studentId]: {
                    ...marks[studentId],
                    [testField]: value,
                },
            });
        }
    };

    // Submit marks
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: "", type: "" });

        if (students.length === 0) {
            setMessage({ text: "No students to enter marks for.", type: "error" });
            return;
        }

        setSubmitting(true);

        try {
            const records = Object.entries(marks).map(([studentId, testMarks]) => ({
                student_id: parseInt(studentId),
                unit_test_1: testMarks.unit_test_1 === "" ? null : parseInt(testMarks.unit_test_1),
                unit_test_2: testMarks.unit_test_2 === "" ? null : parseInt(testMarks.unit_test_2),
                unit_test_3: testMarks.unit_test_3 === "" ? null : parseInt(testMarks.unit_test_3),
            }));

            const response = await API.post("/internal-marks/", { records });

            setMessage({
                text: response.data.message || "Marks saved successfully!",
                type: "success",
            });
        } catch (err) {
            const detail = err.response?.data?.detail || "Failed to submit marks.";
            setMessage({ text: detail, type: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="internal-marks-container">
            <div className="internal-marks-header">
                <button className="btn-back" onClick={() => navigate("/dashboard")}>
                    ← Back
                </button>
                <h2>📝 Internal Marks</h2>
            </div>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            {loading ? (
                <p className="loading-text">Loading students...</p>
            ) : students.length === 0 ? (
                <p className="no-data">No students found. Please add students first.</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="table-wrapper">
                        <table className="internal-marks-table">
                            <thead>
                                <tr>
                                    <th>Roll No</th>
                                    <th>Name</th>
                                    <th>Unit Test 1 (100)</th>
                                    <th>Unit Test 2 (100)</th>
                                    <th>Unit Test 3 (100)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.student_id}>
                                        <td>{student.roll_number}</td>
                                        <td>{student.name}</td>
                                        <td>
                                            <input
                                                type="text"
                                                className="mark-input"
                                                value={marks[student.student_id]?.unit_test_1 ?? ""}
                                                onChange={(e) => handleMarkChange(student.student_id, "unit_test_1", e.target.value)}
                                                placeholder="0-100"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="mark-input"
                                                value={marks[student.student_id]?.unit_test_2 ?? ""}
                                                onChange={(e) => handleMarkChange(student.student_id, "unit_test_2", e.target.value)}
                                                placeholder="0-100"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="mark-input"
                                                value={marks[student.student_id]?.unit_test_3 ?? ""}
                                                onChange={(e) => handleMarkChange(student.student_id, "unit_test_3", e.target.value)}
                                                placeholder="0-100"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button type="submit" className="btn-submit" disabled={submitting}>
                        {submitting ? "Saving..." : "Save Marks"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default InternalMarks;
