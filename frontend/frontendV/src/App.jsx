import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Import Navigate
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import DetailsForm from "./pages/Auth/DetailsForm";
import DashboardLayout from "./pages/Vendor/Dashboard";
import Profile from "./pages/Vendor/Profile";
import Products from "./pages/Vendor/Products";
import AddProduct from "./pages/Vendor/AddProduct";
import PrivateRoute from "./components/PrivateRoute";
import ImageUploadSection from "./components/ImageUploadSection";
import AttributesPage from "./pages/Vendor/AttributesPage";
import AddAttribute from "./pages/Vendor/AddAttribute";
import AddVariants from "./pages/Vendor/AddVariants";
import ProductDetails from "./pages/Vendor/ProductDetails";
import AppLayout from "./AppLayout"; // Import AppLayout component
import AddVariantImages from "./pages/Vendor/AddVariantImages";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Redirect root route to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/details"
          element={
            <PrivateRoute>
              <DetailsForm />
            </PrivateRoute>
          }
        />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AppLayout>
                <DashboardLayout />
              </AppLayout>
            </PrivateRoute>
          }
        >
          <Route path="profile" element={<Profile />} />
          <Route path="products" element={<Products />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="upload-images/:productId" element={<ImageUploadSection />} />
          <Route path="attributes" element={<AttributesPage />} />
          <Route path="products/:productId/add-attribute" element={<AddAttribute />} />
          <Route path="products/:productId/add-variant" element={<AddVariants />} />
          <Route path="products/:productId" element={<ProductDetails />} />
          <Route path="variants/add-images" element={<AddVariantImages />} />

        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
