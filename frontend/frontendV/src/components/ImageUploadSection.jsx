import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

const ImageUploadSection = () => {
  const { productId } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      toast.error("Please select images to upload.");
      return;
    }

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    setLoading(true);
    try {
      await api.post(`/product/products/${productId}/images/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Images uploaded successfully!");
    } catch (error) {
      console.error("Failed to upload images:", error);
      toast.error("Failed to upload images.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Images</h2>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        accept="image/*"
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`w-full py-2 rounded-md text-white ${
          loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
        } focus:ring-2 focus:ring-purple-500 focus:outline-none`}
      >
        {loading ? "Uploading..." : "Upload Images"}
      </button>
    </div>
  );
};

export default ImageUploadSection;
