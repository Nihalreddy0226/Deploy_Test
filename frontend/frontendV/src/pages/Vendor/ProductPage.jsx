import React, { useState, useEffect } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch product variant image
  const fetchVariantImage = async (variantId) => {
    try {
      const response = await api.get(`/product/variant-images/${variantId}/`);
      return response.data.image_v; // Return the image path
    } catch (err) {
      console.error(`Error fetching variant image for variant ${variantId}:`, err);
      return null; // Return null if there's an error
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/product/products/");
        const productsData = response.data;

        // For each product, fetch its variant image
        const updatedProducts = await Promise.all(
          productsData.map(async (product) => {
            if (product.variants && product.variants.length > 0) {
              const variantImage = await fetchVariantImage(product.variants[0].id);
              return { ...product, variantImage }; // Add the fetched image URL to the product
            }
            return { ...product, variantImage: null }; // Default to null if no variants
          })
        );

        setProducts(updatedProducts); // Update products with images
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
