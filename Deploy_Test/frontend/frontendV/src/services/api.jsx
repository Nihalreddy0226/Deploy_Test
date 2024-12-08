import axios from "axios";
import { getCSRFToken } from "../utils/csrf";

// Base Axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // Use environment variable in production
  withCredentials: true, // Ensure cookies are sent
});

// Attach CSRF token and Authorization header to requests
api.interceptors.request.use((config) => {
  const csrfToken = getCSRFToken();

  // Attach CSRF token to all requests except login
  if (csrfToken && !config.url.includes("/api/vendor/login")) {
    config.headers["X-CSRFToken"] = csrfToken;
  }

  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Response Interceptor: Handle Expired Tokens
api.interceptors.response.use(
  (response) => response, // Pass successful responses
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 errors and refresh token availability
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          { refresh: refreshToken }
        );

        // Update tokens in local storage
        localStorage.setItem("accessToken", data.access);
        api.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

        // Retry the original request
        return api(originalRequest);
      } catch (err) {
        console.error("Token refresh failed:", err);
        // Clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    // Clear tokens and redirect if no refresh token is available
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
