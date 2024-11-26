import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

const DetailsForm = () => {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/vendor/profile/update/", {
        store_name: storeName,
        phone_number: phoneNumber,
        store_address: storeAddress,
      });
      toast.success("Details saved successfully!");
      navigate("/dashboard"); // Redirect to vendor dashboard
    } catch (error) {
      toast.error("Failed to save details. Please try again.");
    }
  };

  return (
    <div className="details-form-container">
      <h2>Vendor Details</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Store Name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <textarea
          placeholder="Store Address"
          value={storeAddress}
          onChange={(e) => setStoreAddress(e.target.value)}
          required
        ></textarea>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default DetailsForm;
