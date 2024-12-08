import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition">
      <img
        src={product.variantImage || "/placeholder.jpg"} // Use the fetched variant image or a placeholder
        alt={product.name}
        className="h-48 w-full object-cover rounded"
      />
      <h2 className="text-lg font-bold mt-2">{product.name}</h2>
      <p className="text-gray-500 text-sm">{product.description}</p>
      <div className="mt-2">
        {product.discounted_price ? (
          <>
            <span className="text-red-500 font-bold mr-2">
              ${product.discounted_price}
            </span>
            <span className="line-through text-gray-400">
              ${product.default_price}
            </span>
          </>
        ) : (
          <span className="text-gray-700 font-bold">${product.default_price}</span>
        )}
      </div>
      <p className="mt-1 text-sm text-green-500">
        {product.overall_stock > 0 ? "In Stock" : "Out of Stock"}
      </p>
    </div>
  );
};

export default ProductCard;
