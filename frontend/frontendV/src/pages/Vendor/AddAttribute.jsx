import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const AddAttribute = () => {
  const { productId } = useParams(); // Get product ID from URL params
  const navigate = useNavigate();
  const [attributes, setAttributes] = useState([]);
  const [newAttribute, setNewAttribute] = useState("");
  const [attributeValues, setAttributeValues] = useState([""]);
  const [loading, setLoading] = useState(false);

  // Fetch existing attributes for the product
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const { data } = await api.get(`/product/products/${productId}/attributes2/`);
        const attributesWithValues = await Promise.all(
          data.map(async (attribute) => {
            try {
              const valuesResponse = await api.get(
                `/product/attributes/${attribute.id}/values/`
              );
              return { ...attribute, values: valuesResponse.data };
            } catch {
              return { ...attribute, values: [] }; // Handle case when fetching values fails
            }
          })
        );
        setAttributes(attributesWithValues);
      } catch (error) {
        console.error("Failed to fetch attributes:", error);
        toast.error("Failed to load attributes.");
      }
    };
    fetchAttributes();
  }, [productId]);

  // Handle adding a new value field
  const handleAddValue = () => {
    setAttributeValues([...attributeValues, ""]);
  };

  // Handle removing a value field
  const handleRemoveValue = (index) => {
    setAttributeValues(attributeValues.filter((_, i) => i !== index));
  };

  // Handle input change for values
  const handleValueChange = (index, value) => {
    const updatedValues = [...attributeValues];
    updatedValues[index] = value;
    setAttributeValues(updatedValues);
  };

  // Handle form submission to add a new attribute
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: newAttribute,
        product_id: productId,
      };
      const { data: attribute } = await api.post(`/product/products/${productId}/attributes2/`, payload);

      const valuePayloads = attributeValues
        .filter((value) => value.trim() !== "") // Remove empty values
        .map((value) => ({ value, attribute_id: attribute.id }));

      if (valuePayloads.length > 0) {
        await Promise.all(
          valuePayloads.map((valuePayload) =>
            api.post(`/product/attributes/${attribute.id}/values/`, valuePayload)
          )
        );
      }

      toast.success("Attribute and values added successfully!");
      setNewAttribute("");
      setAttributeValues([""]);

      const updatedValuesResponse = await api.get(`/product/attributes/${attribute.id}/values/`);
      setAttributes([...attributes, { ...attribute, values: updatedValuesResponse.data }]);
    } catch (error) {
      console.error("Failed to save attribute:", error);
      toast.error("Failed to add attribute.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttribute = async (attributeId) => {
    if (!window.confirm("Are you sure you want to delete this attribute?")) {
      return;
    }

    try {
      await api.delete(`/product/attributes/${attributeId}/`);
      setAttributes(attributes.filter((attr) => attr.id !== attributeId));
      toast.success("Attribute deleted successfully.");
    } catch (error) {
      console.error("Failed to delete attribute:", error);
      toast.error("Failed to delete attribute.");
    }
  };

  const handleDeleteValue = async (valueId, attributeId) => {
    if (!window.confirm("Are you sure you want to delete this value?")) {
      return;
    }

    try {
      await api.delete(`/values/${valueId}/`);
      setAttributes((prevAttributes) =>
        prevAttributes.map((attr) =>
          attr.id === attributeId
            ? {
                ...attr,
                values: attr.values.filter((val) => val.id !== valueId),
              }
            : attr
        )
      );
      toast.success("Value deleted successfully.");
    } catch (error) {
      console.error("Failed to delete value:", error);
      toast.error("Failed to delete value.");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Attribute</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Attribute Name
          </label>
          <input
            type="text"
            value={newAttribute}
            onChange={(e) => setNewAttribute(e.target.value)}
            required
            placeholder="e.g., Color, Size"
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Attribute Values
          </label>
          {attributeValues.map((value, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={value}
                onChange={(e) => handleValueChange(index, e.target.value)}
                placeholder="e.g., Red, Blue, Large"
                className="px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              {attributeValues.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveValue(index)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddValue}
            className="text-blue-500 hover:text-blue-700 focus:outline-none mt-2"
          >
            + Add Value
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white ${
            loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
          } focus:ring-2 focus:ring-purple-500 focus:outline-none`}
        >
          {loading ? "Adding..." : "Add Attribute"}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Existing Attributes</h3>
        {attributes.length > 0 ? (
          <ul className="space-y-2">
            {attributes.map((attribute) => (
              <li key={attribute.id} className="p-4 bg-gray-100 rounded-md">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold">{attribute.name}</h4>
                  <button
                    onClick={() => handleDeleteAttribute(attribute.id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    Delete Attribute
                  </button>
                </div>
                <p className="text-sm text-gray-700">
                  Values:{" "}
                  {attribute.values && attribute.values.length > 0 ? (
                    attribute.values.map((val) => (
                      <span
                        key={val.id}
                        className="mr-2 inline-flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-800"
                      >
                        {val.value}
                        <button
                          onClick={() => handleDeleteValue(val.id, attribute.id)}
                          className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          ✕
                        </button>
                      </span>
                    ))
                  ) : (
                    "None"
                  )}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No attributes found for this product.</p>
        )}
      </div>
    </div>
  );
};

export default AddAttribute;
