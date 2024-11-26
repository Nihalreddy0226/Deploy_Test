import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
  
    // console.log("PrivateRoute: user =", user, "loading =", loading);
  
    if (loading) return <p>Loading...</p>;
    return user ? children : <Navigate to="/login" />;
  };
  
  export default PrivateRoute;
  