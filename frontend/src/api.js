// ============================================
// api.js
// Axios instance for API communication
// Base URL points to FastAPI backend
// ============================================

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
