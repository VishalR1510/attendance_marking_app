// ============================================
// App.jsx
// Main application component with routing
// ============================================

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AddStudent from "./pages/AddStudent";
import StudentList from "./pages/StudentList";
import AttendancePage from "./pages/AttendancePage";
import InternalMarks from "./pages/InternalMarks";
import PerformanceTracker from "./pages/PerformanceTracker";
import ReportPage from "./pages/ReportPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-student" element={<AddStudent />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/internal-marks" element={<InternalMarks />} />
            <Route path="/performance" element={<PerformanceTracker />} />
            <Route path="/report" element={<ReportPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
