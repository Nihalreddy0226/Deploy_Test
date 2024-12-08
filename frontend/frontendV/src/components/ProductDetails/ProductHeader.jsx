import React from "react";

const ProductHeader = ({ product, categories, subcategories, onAddAttribute, onAddVariant }) => {
  return (
    <div className="w-2/3 pl-6">
      <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          <strong>Category:</strong> {categories[product.category_id] || "N/A"}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Subcategory:</strong> {subcategories[product.subcategory_id] || "N/A"}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Base Price:</strong> ${product.base_price}
        </p>
        <div className="mt-4 flex gap-4">
          <button
            onClick={onAddAttribute}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none"
          >
            Add Attribute
          </button>
          <button
            onClick={onAddVariant}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
          >
            Add Variant
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
