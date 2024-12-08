import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const AddProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    tags: "",
    category: "",
    subcategory: "",
    default_price: "",
    discounted_price: "",
    required_attributes: [],
  });

  useEffect(() => {
    fetchCategories();
    fetchAttributes();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/product/categories/");
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories.");
    }
  };

  const fetchAttributes = async () => {
    try {
      const response = await api.get("/product/attributes/");
      setAttributes(response.data);
    } catch (error) {
      toast.error("Failed to fetch attributes.");
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setProduct({ ...product, category: categoryId, subcategory: "" });

    // Fetch subcategories based on selected category
    if (categoryId) {
      fetchSubcategories(categoryId);
    } else {
      setSubcategories([]);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await api.get(`/product/subcategoriesByCategory/${categoryId}/`);
      setSubcategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch subcategories.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleAttributeSelection = (attributeId) => {
    setProduct((prevState) => ({
      ...prevState,
      required_attributes: prevState.required_attributes.includes(attributeId)
        ? prevState.required_attributes.filter((id) => id !== attributeId)
        : [...prevState.required_attributes, attributeId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure required fields are filled
    if (
      !product.name ||
      !product.description ||
      !product.category ||
      !product.subcategory ||
      !product.default_price
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const response = await api.post("/product/products/", product);
      toast.success("Product added successfully!");
      // Reset form
      setProduct({
        name: "",
        description: "",
        tags: "",
        category: "",
        subcategory: "",
        default_price: "",
        discounted_price: "",
        required_attributes: [],
      });
    } catch (error) {
      console.error(error.response?.data);
      toast.error("Failed to add product.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Add Product</h1>
      <form className="bg-white p-4 rounded shadow-md" onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Product Name *</label>
          <input
            type="text"
            name="name"
            className="w-full border border-gray-300 rounded p-2"
            value={product.name}
            onChange={handleInputChange}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Description *</label>
          <textarea
            name="description"
            className="w-full border border-gray-300 rounded p-2"
            value={product.description}
            onChange={handleInputChange}
          />
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            className="w-full border border-gray-300 rounded p-2"
            value={product.tags}
            onChange={handleInputChange}
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Category *</label>
          <select
            name="category"
            className="w-full border border-gray-300 rounded p-2"
            value={product.category}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Subcategory *</label>
          <select
            name="subcategory"
            className="w-full border border-gray-300 rounded p-2"
            value={product.subcategory}
            onChange={handleInputChange}
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>

        {/* Default Price */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Default Price *</label>
          <input
            type="number"
            name="default_price"
            className="w-full border border-gray-300 rounded p-2"
            value={product.default_price}
            onChange={handleInputChange}
          />
        </div>

        {/* Discounted Price */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Discounted Price</label>
          <input
            type="number"
            name="discounted_price"
            className="w-full border border-gray-300 rounded p-2"
            value={product.discounted_price}
            onChange={handleInputChange}
          />
        </div>

        {/* Required Attributes */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Required Attributes</label>
          <div className="grid grid-cols-3 gap-2">
            {attributes.map((attribute) => (
              <div key={attribute.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`attribute-${attribute.id}`}
                  className="mr-2"
                  checked={product.required_attributes.includes(attribute.id)}
                  onChange={() => handleAttributeSelection(attribute.id)}
                />
                <label htmlFor={`attribute-${attribute.id}`} className="text-gray-600">
                  {attribute.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
