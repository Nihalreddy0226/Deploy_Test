import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated when the component mounts
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          // Decode token or fetch minimal user data if necessary
          const decodedUser = JSON.parse(atob(accessToken.split(".")[1])); // Decode JWT payload
          setUser(decodedUser); // Set user details from token
        //   console.log("User authenticated from token:", decodedUser);
        } catch (error) {
          console.error("Failed to parse token:", error);
          logout(); // Logout if token is invalid
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

      // Decode token to get user data
      const decodedUser = JSON.parse(atob(data.access.split(".")[1])); // Decode JWT payload
      setUser(decodedUser); // Set user state
    //   console.log("Login successful. User data:", decodedUser);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error; // Rethrow error to handle it in the login form
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
