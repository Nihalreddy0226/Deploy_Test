import React from "react";

const AddAttributeModal = ({
  onClose,
  onSubmit,
  loading,
  newAttribute,
  onAttributeChange,
  attributeValues,
  onAddValue,
  onRemoveValue,
  onValueChange,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h3 className="text-lg font-bold mb-4">Add Attribute</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Attribute Name</label>
            <input
              type="text"
              value={newAttribute}
              onChange={(e) => onAttributeChange(e.target.value)}
              required
              placeholder="e.g., Color, Size"
              className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Attribute Values</label>
            {attributeValues.map((value, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onValueChange(index, e.target.value)}
                  placeholder="e.g., Red, Blue, Large"
                  className="px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                {attributeValues.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveValue(index)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={onAddValue}
              className="text-blue-500 hover:text-blue-700 focus:outline-none mt-2"
            >
              + Add Value
            </button>
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

export default AddAttributeModal;
