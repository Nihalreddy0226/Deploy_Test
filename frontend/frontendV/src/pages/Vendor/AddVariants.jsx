import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const AddVariants = () => {
  const { productId } = useParams(); // Get product ID from URL params
  const navigate = useNavigate();
  const [variants, setVariants] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch product attributes and existing variants
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const { data } = await api.get(`/product/products/${productId}/attributes2/`);
        const attributesWithValues = await Promise.all(
          data.map(async (attribute) => {
            try {
              const valuesResponse = await api.get(
                `/product/attributes/${attribute.id}/values/`
              );
              return { ...attribute, values: valuesResponse.data };
            } catch {
              return { ...attribute, values: [] }; // Handle case when fetching values fails
            }
          })
        );
        setAttributes(attributesWithValues);
      } catch (error) {
        console.error("Failed to fetch attributes:", error);
        toast.error("Failed to load attributes.");
      }
    };

    const fetchVariants = async () => {
      try {
        const { data } = await api.get(`/product/products/${productId}/variants/`);
        setVariants(data);
      } catch (error) {
        console.error("Failed to fetch variants:", error);
        toast.error("Failed to load variants.");
      }
    };

    fetchAttributes();
    fetchVariants();
  }, [productId]);

  const handleAttributeChange = (attributeId, valueId) => {
    setSelectedAttributes((prev) => ({ ...prev, [attributeId]: valueId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        product_id: productId,
        sku,
        stock,
        price,
        attributes: Object.values(selectedAttributes), // Pass selected attribute values
      };

      const { data } = await api.post(`/product/products/${productId}/variants/`, payload);
      setVariants([...variants, data]);
      toast.success("Variant added successfully!");
      setSku("");
      setStock(0);
      setPrice("");
      setSelectedAttributes({});
    } catch (error) {
      console.error("Failed to add variant:", error);
      toast.error("Failed to add variant.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (!window.confirm("Are you sure you want to delete this variant?")) return;

    try {
      await api.delete(`/product/variants/${variantId}/`);
      setVariants(variants.filter((variant) => variant.id !== variantId));
      toast.success("Variant deleted successfully.");
    } catch (error) {
      console.error("Failed to delete variant:", error);
      toast.error("Failed to delete variant.");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Variants</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
            placeholder="e.g., SKU12345"
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            required
            placeholder="e.g., 10"
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="e.g., 19.99"
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Attributes</label>
          {attributes.length > 0 ? (
            attributes.map((attribute) => (
              <div key={attribute.id} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">{attribute.name}</label>
                <select
                  value={selectedAttributes[attribute.id] || ""}
                  onChange={(e) => handleAttributeChange(attribute.id, e.target.value)}
                  className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="">Select {attribute.name}</option>
                  {attribute.values && attribute.values.length > 0 ? (
                    attribute.values.map((value) => (
                      <option key={value.id} value={value.id}>
                        {value.value}
                      </option>
                    ))
                  ) : (
                    <option disabled>No values available</option>
                  )}
                </select>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No attributes found.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white ${
            loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
          } focus:ring-2 focus:ring-purple-500 focus:outline-none`}
        >
          {loading ? "Adding..." : "Add Variant"}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Existing Variants</h3>
        {variants.length > 0 ? (
          <ul className="space-y-2">
            {variants.map((variant) => (
              <li key={variant.id} className="p-4 bg-gray-100 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">SKU: {variant.sku}</p>
                    <p className="text-sm text-gray-700">Price: ${variant.price}</p>
                    <p className="text-sm text-gray-700">Stock: {variant.stock}</p>
                    <p className="text-sm text-gray-700">
                      Attributes:{" "}
                      {variant.attributes &&
                        variant.attributes.map((attr) => `${attr.attribute.name}: ${attr.value}`).join(", ")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteVariant(variant.id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No variants found for this product.</p>
        )}
      </div>
    </div>
  );
};

export default AddVariants;
