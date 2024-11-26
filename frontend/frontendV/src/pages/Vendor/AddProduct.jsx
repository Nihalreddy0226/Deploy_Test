import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const ProductDetailsForm = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    base_price: "",
    category_id: "",
    subcategory_id: "",
    tags: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/product/categories/");
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  // Fetch all subcategories
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const { data } = await api.get("/product/subcategories/");
        setSubcategories(data);
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
        toast.error("Failed to load subcategories.");
      }
    };
    fetchSubcategories();
  }, []);

  // Filter subcategories when a category is selected
  useEffect(() => {
    if (product.category_id) {
      const filtered = subcategories.filter(
        (subcategory) => subcategory.category_id === parseInt(product.category_id)
      );
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [product.category_id, subcategories]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    for (const key in product) {
      formData.append(key, product[key]);
    }

    try {
      const { data } = await api.post("/product/products/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product details added successfully!");
      navigate(`/dashboard/upload-images/${data.id}`);
    } catch (error) {
      console.error("Failed to add product details:", error);
      toast.error("Failed to add product details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Product Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Base Price</label>
          <input
            type="number"
            name="base_price"
            value={product.base_price}
            onChange={handleChange}
            required
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category_id"
            value={product.category_id}
            onChange={handleChange}
            required
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {filteredSubcategories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Subcategory</label>
            <select
              name="subcategory_id"
              value={product.subcategory_id}
              onChange={handleChange}
              required
              className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="">Select a subcategory</option>
              {filteredSubcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <input
            type="text"
            name="tags"
            value={product.tags}
            onChange={handleChange}
            placeholder="Comma-separated tags"
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white ${
            loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
          } focus:ring-2 focus:ring-purple-500 focus:outline-none`}
        >
          {loading ? "Next..." : "Next"}
        </button>
      </form>
    </div>
  );
};

export default ProductDetailsForm;
