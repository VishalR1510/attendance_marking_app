// ============================================
// api.js
// Axios instance for API communication
// Base URL points to FastAPI backend
// ============================================

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://attendance-marking-app.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
