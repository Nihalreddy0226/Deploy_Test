import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [subcategories, setSubcategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/product/categories/");
        const categoryMap = data.reduce((acc, category) => {
          acc[category.id] = category.name;
          return acc;
        }, {});
        setCategories(categoryMap);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories.");
      }
    };

    const fetchSubcategories = async () => {
      try {
        const { data } = await api.get("/product/subcategories/");
        const subcategoryMap = data.reduce((acc, subcategory) => {
          acc[subcategory.id] = subcategory.name;
          return acc;
        }, {});
        setSubcategories(subcategoryMap);
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
        toast.error("Failed to load subcategories.");
      }
    };

    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/product/products/");
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products.");
      }
    };

    const fetchData = async () => {
      await fetchCategories();
      await fetchSubcategories();
      await fetchProducts();
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        <Link
          to="/dashboard/add-product"
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none"
        >
          Add Product
        </Link>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b-2 p-4 text-gray-600 font-medium">Image</th>
            <th className="border-b-2 p-4 text-gray-600 font-medium">Name</th>
            <th className="border-b-2 p-4 text-gray-600 font-medium">Category</th>
            <th className="border-b-2 p-4 text-gray-600 font-medium">Subcategory</th>
            <th className="border-b-2 p-4 text-gray-600 font-medium">Price</th>
            <th className="border-b-2 p-4 text-gray-600 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border-b p-4">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].image} // Assuming the `images` field contains URLs
                    alt={product.images[0].alt_text || product.name}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td className="border-b p-4">{product.name}</td>
              <td className="border-b p-4">
                {categories[product.category_id] || "N/A"}
              </td>
              <td className="border-b p-4">
                {subcategories[product.subcategory_id] || "N/A"}
              </td>
              <td className="border-b p-4">${product.base_price}</td>
              <td className="border-b p-4">
                <Link
                  to={`/dashboard/products/${product.id}`}
                  className="text-blue-500 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
