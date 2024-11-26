import api from "../services/api";

export const fetchCSRFToken = async () => {
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
