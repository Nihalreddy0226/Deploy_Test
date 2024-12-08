import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const AttributesPage = () => {
  const [attributes, setAttributes] = useState([]);
  const [newAttribute, setNewAttribute] = useState({ name: "", subcategoryId: "" });
  const [newAttributeValue, setNewAttributeValue] = useState({ attributeId: "", value: "" });
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    fetchAttributes();
    fetchSubcategories();
  }, []);

  const fetchAttributes = async () => {
    try {
      const response = await api.get("/product/attributes/");
      const attributesWithValues = await Promise.all(
        response.data.map(async (attribute) => {
          const valuesResponse = await api.get(`/product/attributevalueByattribute/${attribute.id}/`);
          return { ...attribute, values: valuesResponse.data };
        })
      );
      setAttributes(attributesWithValues);
    } catch (error) {
      toast.error("Failed to fetch attributes.");
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await api.get("/product/subcategories/");
      setSubcategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch subcategories.");
    }
  };

  const handleCreateAttribute = async () => {
    if (!newAttribute.name || !newAttribute.subcategoryId) {
      toast.error("Attribute name and subcategory are required.");
      return;
    }
    try {
      const payload = {
        name: newAttribute.name,
        SubCategory: newAttribute.subcategoryId,
      };
      const response = await api.post("/product/attributes/", payload);
      setAttributes([...attributes, { ...response.data, values: [] }]); // Add new attribute with empty values
      setNewAttribute({ name: "", subcategoryId: "" });
      toast.success("Attribute created successfully!");
    } catch (error) {
      console.error(error.response.data);
      toast.error("Failed to create attribute.");
    }
  };

  const handleCreateAttributeValue = async () => {
    if (!newAttributeValue.attributeId || !newAttributeValue.value) {
      toast.error("Attribute and value are required.");
      return;
    }
    try {
      const payload = {
        value: newAttributeValue.value,
        attribute: newAttributeValue.attributeId,
      };
      const response = await api.post("/product/attribute-values/", payload);

      const updatedAttributes = attributes.map((attr) =>
        attr.id === newAttributeValue.attributeId
          ? {
              ...attr,
              values: [...(attr.values || []), response.data],
            }
          : attr
      );

      setAttributes(updatedAttributes);
      setNewAttributeValue({ attributeId: "", value: "" });
      toast.success("Attribute value created successfully!");
    } catch (error) {
      console.error(error.response.data);
      toast.error("Failed to create attribute value.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Attributes Management</h1>

      {/* Create New Attribute */}
      <div className="bg-white p-4 rounded shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-600">Create Attribute</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Attribute Name"
            value={newAttribute.name}
            onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
          />
          <select
            className="w-full border border-gray-300 rounded p-2"
            value={newAttribute.subcategoryId}
            onChange={(e) => setNewAttribute({ ...newAttribute, subcategoryId: e.target.value })}
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          onClick={handleCreateAttribute}
        >
          Create Attribute
        </button>
      </div>

      {/* Create New Attribute Value */}
      <div className="bg-white p-4 rounded shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-600">Create Attribute Value</h2>
        <div className="flex gap-4 mb-4">
          <select
            className="w-full border border-gray-300 rounded p-2"
            value={newAttributeValue.attributeId}
            onChange={(e) => setNewAttributeValue({ ...newAttributeValue, attributeId: e.target.value })}
          >
            <option value="">Select Attribute</option>
            {attributes.map((attribute) => (
              <option key={attribute.id} value={attribute.id}>
                {attribute.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Attribute Value"
            value={newAttributeValue.value}
            onChange={(e) => setNewAttributeValue({ ...newAttributeValue, value: e.target.value })}
          />
        </div>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          onClick={handleCreateAttributeValue}
        >
          Create Attribute Value
        </button>
      </div>

      {/* List Attributes and Values */}
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-600">Attributes List</h2>
        {attributes.map((attribute) => (
          <div key={attribute.id} className="mb-4">
            <h3 className="text-lg font-bold text-gray-700">{attribute.name}</h3>
            <ul className="list-disc pl-5 text-gray-600">
              {attribute.values?.map((value) => (
                <li key={value.id}>{value.value}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttributesPage;
