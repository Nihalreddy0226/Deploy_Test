import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Decode JWT to extract user information
  const decodeJWT = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  // Check if user is authenticated when the component mounts
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const decodedUser = decodeJWT(accessToken);
        if (decodedUser && Date.now() / 1000 < decodedUser.exp) {
          setUser(decodedUser); // Set user if token is valid and not expired
        } else {
          logout(); // Logout if token is expired or invalid
        }
      }
      setLoading(false); // Stop loading
    };
    checkAuth();
  }, []);

  // Handle vendor login
  const login = async (credentials) => {
    try {
      const { data } = await api.post("/api/vendor/login", credentials);
      localStorage.setItem("accessToken", data.access); // Save access token
      localStorage.setItem("refreshToken", data.refresh); // Save refresh token

      const decodedUser = decodeJWT(data.access);
      if (!decodedUser) {
        throw new Error("Failed to decode user from token.");
      }

      setUser(decodedUser); // Set user state
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.detail || "Unable to login. Please try again."
      );
    }
  };

  // Handle vendor logout
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
