import React from "react";

const AttributesList = ({ attributes, onDelete }) => {
  if (!attributes || attributes.length === 0) return <p className="text-gray-600">No attributes found.</p>;

  return (
    <ul className="space-y-2">
      {attributes.map((attribute) => (
        <li key={attribute.id} className="p-4 bg-gray-100 rounded-md flex justify-between items-center">
          <div>
            <h4 className="font-bold">{attribute.name}</h4>
            <p className="text-sm text-gray-700">
              Values: {attribute.values?.map((val) => val.value).join(", ") || "None"}
            </p>
          </div>
          <button
            onClick={() => onDelete(attribute.id)}
            className="text-red-500 hover:text-red-700 focus:outline-none"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default AttributesList;
