// ============================================
// StudentTable.jsx
// Reusable table component to display student data
// Used in StudentList and AttendancePage
// ============================================

import "./StudentTable.css";

function StudentTable({ students, onDelete, showDelete = false }) {
  if (students.length === 0) {
    return <p className="no-data">No students found.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="student-table">
        <thead>
          <tr>
            <th>Roll Number</th>
            <th>Name</th>
            <th>Department</th>
            <th>Year</th>
            <th>Email</th>
            {showDelete && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.student_id}>
              <td>{student.roll_number}</td>
              <td>{student.name}</td>
              <td>{student.department}</td>
              <td>{student.year}</td>
              <td>{student.email || "—"}</td>
              {showDelete && (
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(student.student_id)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
