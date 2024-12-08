import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const AddVariantImagesPage = () => {
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchVariants();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/product/products/");
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch products.");
    }
  };

  const fetchVariants = async () => {
    try {
      const response = await api.get("/product/product-variants/");
      setVariants(response.data);
    } catch (error) {
      toast.error("Failed to fetch variants.");
    }
  };

  const handleProductChange = (e) => {
    const productId = parseInt(e.target.value);
    setSelectedProduct(productId);
    const filtered = variants.filter((variant) => variant.product === productId);
    setFilteredVariants(filtered);
  };

  const handleFileChange = (variantId, files) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [variantId]: files,
    }));
  };

  const handleUploadImages = async (variantId) => {
    if (!selectedFiles[variantId] || selectedFiles[variantId].length === 0) {
      toast.error("Please select files to upload.");
      return;
    }

    const formData = new FormData();
    Array.from(selectedFiles[variantId]).forEach((file) => {
      formData.append("images", file); // Updated key to match backend expectation
    });

    try {
      setLoading(true);
      await api.post(`/product/variants/${variantId}/images/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Images uploaded successfully!");
      setSelectedFiles((prev) => ({
        ...prev,
        [variantId]: null,
      }));
    } catch (error) {
      console.error(error.response?.data);
      const errorMessage =
        error.response?.data?.images?.[0] || "Failed to upload images.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">
        Add Product Variant Images
      </h1>

      {/* Product Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-2">Product *</label>
        <select
          className="w-full border border-gray-300 rounded p-2"
          onChange={handleProductChange}
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      {/* Variant List */}
      {filteredVariants.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Variants for Selected Product
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Variant ID</th>
                <th className="border border-gray-300 px-4 py-2">Stock</th>
                <th className="border border-gray-300 px-4 py-2">
                  Discounted Price
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Original Price
                </th>
                <th className="border border-gray-300 px-4 py-2">Add Images</th>
              </tr>
            </thead>
            <tbody>
              {filteredVariants.map((variant) => (
                <tr key={variant.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {variant.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {variant.stock}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {variant.discounted_price_v}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {variant.original_price_v}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        handleFileChange(variant.id, e.target.files)
                      }
                      className="mb-2"
                    />
                    <button
                      onClick={() => handleUploadImages(variant.id)}
                      className={`bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={loading}
                    >
                      {loading ? "Uploading..." : "Upload Images"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedProduct && filteredVariants.length === 0 && (
        <p className="text-gray-600 mt-6">
          No variants found for the selected product.
        </p>
      )}
    </div>
  );
};

export default AddVariantImagesPage;
