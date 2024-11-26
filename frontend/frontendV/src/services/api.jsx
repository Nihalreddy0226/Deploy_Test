import axios from "axios";

// Base Axios instance
const api = axios.create({
  baseURL:  "http://127.0.0.1:8000",
  withCredentials: true, // For CSRF handling
});

// Fetch CSRF Token
const fetchCSRFToken = async () => {
  try {
    const response = await api.get("/set-csrf-token/");
    const csrfToken = response.headers["x-csrftoken"];
    if (csrfToken) {
      api.defaults.headers.common["X-CSRFToken"] = csrfToken;
    }
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
  }
};

// Request Interceptor: Attach Authorization Header
api.interceptors.request.use((config) => {
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
          `${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}/api/token/refresh/`,
          { refresh: refreshToken }
        );
        // Update tokens in local storage
        localStorage.setItem("accessToken", data.access);
        api.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
        return api(originalRequest); // Retry original request
      } catch (err) {
        // If refresh token fails, log out the user
        console.error("Token refresh failed:", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirect to login page
      }
    } else if (error.response?.status === 401) {
      // No refresh token available, force logout
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login"; // Redirect to login page
    }

    return Promise.reject(error);
  }
);

export { fetchCSRFToken };
export default api;
