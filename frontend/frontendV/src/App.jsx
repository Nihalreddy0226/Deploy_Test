import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import DetailsForm from "./pages/Auth/DetailsForm";
import DashboardLayout from "./pages/Vendor/Dashboard";
import Profile from "./pages/Vendor/Profile";
import Products from "./pages/Vendor/Products";
import AddProduct from "./pages/Vendor/AddProduct";
// import Orders from "./pages/Orders";
// import Settings from "./pages/Settings";
import PrivateRoute from "./components/PrivateRoute";

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/details"
          element={
            <PrivateRoute>
              <DetailsForm />
            </PrivateRoute>
          }
        />
        {/* Dashboard Layout with Nested Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="profile" element={<Profile />} />
          <Route path="products" element={<Products />} />
          <Route path="add-product" element={<AddProduct />} />
          {/* <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} /> */}
        </Route>
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
