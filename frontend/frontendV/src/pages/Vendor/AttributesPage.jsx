import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const AttributesPage = () => {
  const [products, setProducts] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [newAttribute, setNewAttribute] = useState({
    name: "",
    product_id: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/product/products/");
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products.");
      }
    };
    const fetchAttributes = async () => {
      try {
        const { data } = await api.get("/product/products/attributes/");
        setAttributes(data);
      } catch (error) {
        console.error("Failed to fetch attributes:", error);
        toast.error("Failed to load attributes.");
      }
    };

    fetchProducts();
    fetchAttributes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAttribute({ ...newAttribute, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/product/products/attributes/", newAttribute);
      toast.success("Attribute added successfully!");
      setAttributes([...attributes, newAttribute]);
      setNewAttribute({ name: "", product_id: "" });
    } catch (error) {
      console.error("Failed to add attribute:", error);
      toast.error("Failed to add attribute.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Attributes</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Attribute Name</label>
          <input
            type="text"
            name="name"
            value={newAttribute.name}
            onChange={handleChange}
            required
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Link to Product</label>
          <select
            name="product_id"
            value={newAttribute.product_id}
            onChange={handleChange}
            required
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white ${
            loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
          } focus:ring-2 focus:ring-purple-500 focus:outline-none`}
        >
          {loading ? "Adding..." : "Add Attribute"}
        </button>
      </form>
      <h3 className="text-lg font-bold text-gray-800 mt-6">Existing Attributes</h3>
      <ul className="mt-4 space-y-2">
        {attributes.map((attr) => (
          <li key={attr.id} className="p-4 bg-gray-100 rounded-md">
            {attr.name} (Product: {products.find((p) => p.id === attr.product_id)?.name || "Unknown"})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttributesPage;
