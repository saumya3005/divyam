import axios from "axios";

// Create Axios instance with default config
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    // We get the token from localStorage
    // In Next.js, this only works on the client-side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout if token is expired/invalid
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        // We'll let Zustand handle the state update via an event or the authStore, 
        // but for now, hard-redirect is safest to clear bad state
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
