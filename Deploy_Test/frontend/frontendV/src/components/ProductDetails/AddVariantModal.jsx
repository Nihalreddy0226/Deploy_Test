import React from "react";

const AddVariantModal = ({
  onClose,
  onSubmit,
  loading,
  sku,
  stock,
  price,
  attributesForVariants,
  selectedAttributes,
  onSkuChange,
  onStockChange,
  onPriceChange,
  onAttributeChange,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h3 className="text-lg font-bold mb-4">Add Variant</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              value={sku}
              onChange={onSkuChange}
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
              onChange={onStockChange}
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
              onChange={onPriceChange}
              required
              placeholder="e.g., 19.99"
              className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Attributes</label>
            {attributesForVariants.length > 0 ? (
              attributesForVariants.map((attribute) => (
                <div key={attribute.id} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {attribute.name}
                  </label>
                  <select
                    value={selectedAttributes[attribute.id] || ""}
                    onChange={(e) => onAttributeChange(attribute.id, e.target.value)}
                    className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="">Select {attribute.name}</option>
                    {attribute.values.map((value) => (
                      <option key={value.id} value={value.id}>
                        {value.value}
                      </option>
                    ))}
                  </select>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No attributes found.</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white ${
                loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVariantModal;
