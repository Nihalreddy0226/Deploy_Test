import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const AddVariantPage = () => {
  const [products, setProducts] = useState([]);
  const [attributesWithValues, setAttributesWithValues] = useState([]);
  const [variant, setVariant] = useState({
    product: "",
    attributes: [], // Store only IDs of selected attribute values
    stock: "",
    discounted_price_v: "",
    original_price_v: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/product/products/");
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch products.");
    }
  };

  const fetchAttributesWithValues = async (productId) => {
    try {
      const response = await api.get(`/product/products/${productId}/`);
      setAttributesWithValues(response.data.required_attributes || []);
    } catch (error) {
      toast.error("Failed to fetch attributes for the selected product.");
    }
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    setVariant({ ...variant, product: productId, attributes: [] });

    if (productId) {
      fetchAttributesWithValues(productId);
    } else {
      setAttributesWithValues([]);
    }
  };

  const handleAttributeValueSelection = (valueId) => {
    setVariant((prevState) => ({
      ...prevState,
      attributes: prevState.attributes.includes(valueId)
        ? prevState.attributes.filter((id) => id !== valueId)
        : [...prevState.attributes, valueId],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVariant({ ...variant, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure required fields are filled
    if (!variant.product || variant.attributes.length === 0 || !variant.stock) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const payload = {
        product: variant.product,
        attributes: variant.attributes, // Send only IDs
        stock: variant.stock,
        discounted_price_v: variant.discounted_price_v,
        original_price_v: variant.original_price_v,
      };

      const response = await api.post("/product/product-variants/", payload);
      toast.success("Variant added successfully!");
      // Reset form
      setVariant({
        product: "",
        attributes: [],
        stock: "",
        discounted_price_v: "",
        original_price_v: "",
      });
      setAttributesWithValues([]);
    } catch (error) {
      console.error(error.response?.data);
      toast.error("Failed to add variant.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Add Product Variant</h1>
      <form className="bg-white p-4 rounded shadow-md" onSubmit={handleSubmit}>
        {/* Product Selection */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Product *</label>
          <select
            name="product"
            className="w-full border border-gray-300 rounded p-2"
            value={variant.product}
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

        {/* Attributes with Values */}
        {attributesWithValues.length > 0 && (
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Attributes *</label>
            {attributesWithValues.map((attribute) => (
              <div key={attribute.id} className="mb-2">
                <h3 className="font-medium text-gray-700">{attribute.name}</h3>
                <div className="flex flex-wrap gap-4">
                  {attribute.values && attribute.values.map((value) => (
                    <label key={value.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`attribute-${attribute.id}`}
                        value={value.id}
                        checked={variant.attributes.includes(value.id)}
                        onChange={() => handleAttributeValueSelection(value.id)}
                      />
                      {value.value}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stock */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Stock *</label>
          <input
            type="number"
            name="stock"
            className="w-full border border-gray-300 rounded p-2"
            value={variant.stock}
            onChange={handleInputChange}
          />
        </div>

        {/* Discounted Price */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Discounted Price</label>
          <input
            type="number"
            name="discounted_price_v"
            className="w-full border border-gray-300 rounded p-2"
            value={variant.discounted_price_v}
            onChange={handleInputChange}
          />
        </div>

        {/* Original Price */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Original Price</label>
          <input
            type="number"
            name="original_price_v"
            className="w-full border border-gray-300 rounded p-2"
            value={variant.original_price_v}
            onChange={handleInputChange}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Add Variant
        </button>
      </form>
    </div>
  );
};

export default AddVariantPage;
