import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
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

const App = () => (
  <AuthProvider>
    {/* Enable React Router v7 Future Flags */}
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
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
          <Route path="/dashboard/upload-images/:productId" element={<ImageUploadSection />} />
          <Route path="/dashboard/attributes" element={<AttributesPage />} />
          <Route path="/dashboard/products/:productId/add-attribute" element={<AddAttribute />} />
          <Route path="/dashboard/products/:productId/add-variant" element={<AddVariants />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
