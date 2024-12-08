import React from "react";

const VariantsList = ({ variants, resolveAttributes, onDeleteVariant, onDeleteImage, onUploadImage }) => {
  if (!variants || variants.length === 0) return <p className="text-gray-600">No variants found.</p>;

  return (
    <ul className="space-y-4">
      {variants.map((variant) => (
        <li key={variant.id} className="p-4 bg-gray-100 rounded-md">
          <p>
            <strong>SKU:</strong> {variant.sku}
          </p>
          <p>
            <strong>Price:</strong> ${variant.price}
          </p>
          <p>
            <strong>Stock:</strong> {variant.stock}
          </p>
          <p>
            <strong>Attributes:</strong> {resolveAttributes(variant.attributes)}
          </p>

          {variant.images && variant.images.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-bold text-gray-800">Images:</p>
              <div className="flex space-x-2">
                {variant.images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img.image}
                      alt={img.alt_text || "Variant"}
                      className="w-16 h-16 object-cover border rounded-md"
                    />
                    <button
                      onClick={() => onDeleteImage(variant.id, img.id)}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={() => document.getElementById(`upload-${variant.id}`).click()}
              className="text-blue-500 hover:text-blue-700 focus:outline-none mr-4"
            >
              Upload Images
            </button>
            <input
              id={`upload-${variant.id}`}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => onUploadImage(variant.id, e.target.files)}
            />
          </div>
          <div className="mt-4">
            <button
              onClick={() => onDeleteVariant(variant.id)}
              className="text-red-500 hover:text-red-700 focus:outline-none"
            >
              Delete Variant
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default VariantsList;
