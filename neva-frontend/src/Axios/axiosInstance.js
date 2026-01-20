import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // backend URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10s timeout
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
