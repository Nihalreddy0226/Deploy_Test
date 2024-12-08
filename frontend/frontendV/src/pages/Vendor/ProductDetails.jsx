import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

import ProductHeader from "../../components/ProductDetails/ProductHeader";
import ProductImages from "../../components/ProductDetails/ProductImages";
import AttributesList from "../../components/ProductDetails/AttributesList";
import AddAttributeModal from "../../components/ProductDetails/AddAttributeModal";
import VariantsList from "../../components/ProductDetails/VariantsList";
import AddVariantModal from "../../components/ProductDetails/AddVariantModal";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState({});
  const [subcategories, setSubcategories] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAddAttributeModal, setShowAddAttributeModal] = useState(false);
  const [showAddVariantModal, setShowAddVariantModal] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [attributeValues, setAttributeValues] = useState([""]);
  const [newAttribute, setNewAttribute] = useState("");
  const [loadingAttribute, setLoadingAttribute] = useState(false);
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState("");
  const [attributesForVariants, setAttributesForVariants] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [loadingVariant, setLoadingVariant] = useState(false);

  // Implement all the useEffect, handlers, and API calls here...
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
        toast.error("Failed to load subcategories.");
      }
    };

    const fetchProductDetails = async () => {
      try {
        const { data } = await api.get(`/product/products/${productId}/`);
        setProduct(data);
        setSelectedImage(data.images && data.images[0]?.image);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load product details.");
      }
    };

    const fetchAttributes = async () => {
      try {
        const { data } = await api.get(`/product/products/${productId}/attributes2/`);
        const attributesWithValues = await Promise.all(
          data.map(async (attribute) => {
            const valuesResponse = await api.get(`/product/attributes/${attribute.id}/values/`);
            return { ...attribute, values: valuesResponse.data || [] };
          })
        );
        setAttributes(attributesWithValues);
        setAttributesForVariants(attributesWithValues);
      } catch (error) {
        toast.error("Failed to load attributes.");
      }
    };

    const fetchVariants = async () => {
      try {
        const { data } = await api.get(`/product/variants/list/${productId}/`);
        const variantsWithImages = await Promise.all(
          data.map(async (variant) => {
            const imagesResponse = await api.get(`/product/product-variant-images/`);
            const filteredImages = imagesResponse.data.filter(
              (image) => image.variant_id === variant.id
            );
            return { ...variant, images: filteredImages || [] };
          })
        );
        setVariants(variantsWithImages);
      } catch (error) {
        toast.error("Failed to load variants.");
      }
    };

    const fetchData = async () => {
      await fetchCategories();
      await fetchSubcategories();
      await fetchProductDetails();
      await fetchAttributes();
      await fetchVariants();
    };

    fetchData();
  }, [productId]);

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  const handleAddValue = () => {
    setAttributeValues([...attributeValues, ""]);
  };

  const handleRemoveValue = (index) => {
    setAttributeValues(attributeValues.filter((_, i) => i !== index));
  };

  const handleValueChange = (index, value) => {
    const updatedValues = [...attributeValues];
    updatedValues[index] = value;
    setAttributeValues(updatedValues);
  };

  const handleSubmitAttribute = async (e) => {
    e.preventDefault();
    setLoadingAttribute(true);

    try {
      const payload = {
        name: newAttribute,
        product_id: productId,
      };
      const { data: attribute } = await api.post(`/product/products/${productId}/attributes2/`, payload);

      const valuePayloads = attributeValues
        .filter((value) => value.trim() !== "")
        .map((value) => ({ value, attribute_id: attribute.id }));

      if (valuePayloads.length > 0) {
        await Promise.all(
          valuePayloads.map((valuePayload) =>
            api.post(`/product/attributes/${attribute.id}/values/`, valuePayload)
          )
        );
      }

      toast.success("Attribute and values added successfully!");
      setAttributes([...attributes, { ...attribute, values: valuePayloads }]);
      setNewAttribute("");
      setAttributeValues([""]);
      setShowAddAttributeModal(false);
    } catch (error) {
      toast.error("Failed to add attribute.");
    } finally {
      setLoadingAttribute(false);
    }
  };

  const handleDeleteAttribute = async (attributeId) => {
    if (!window.confirm("Are you sure you want to delete this attribute?")) return;
  
    try {
      await api.delete(`/product/attributes/${attributeId}/`);
      setAttributes(attributes.filter((attr) => attr.id !== attributeId));
      toast.success("Attribute deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete attribute.");
    }
  };

  const handleUploadImage = async (variantId, files) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));
  
    try {
      const { data: uploadedImages } = await api.post(
        `/product/variants/${variantId}/images/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Images uploaded successfully.");
      setVariants((prevVariants) =>
        prevVariants.map((variant) =>
          variant.id === variantId
            ? { ...variant, images: [...variant.images, ...uploadedImages] }
            : variant
        )
      );
    } catch (error) {
      toast.error("Failed to upload images.");
    }
  };
  

  const handleAttributeChange = (attributeId, valueId) => {
    setSelectedAttributes((prev) => ({ ...prev, [attributeId]: valueId }));
  };

  const handleDeleteImage = async (variantId, imageId) => {
    try {
      await api.delete(`/product/variants/${variantId}/images/${imageId}/`);
      setVariants((prevVariants) =>
        prevVariants.map((variant) =>
          variant.id === variantId
            ? { ...variant, images: variant.images.filter((img) => img.id !== imageId) }
            : variant
        )
      );
      toast.success("Image deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete image.");
    }
  };
  

  const handleSubmitVariant = async (e) => {
    e.preventDefault();
    setLoadingVariant(true);

    try {
      const payload = {
        product_id: productId,
        sku,
        stock,
        price,
        attributes: Object.values(selectedAttributes),
      };

      const { data } = await api.post(`/product/products/${productId}/variants/`, payload);
      setVariants([...variants, data]);
      toast.success("Variant added successfully!");
      setSku("");
      setStock(0);
      setPrice("");
      setSelectedAttributes({});
      setShowAddVariantModal(false);
    } catch (error) {
      toast.error("Failed to add variant.");
    } finally {
      setLoadingVariant(false);
    }
  };

  const handleDeleteVariant = async (variantId) => {
  if (!window.confirm("Are you sure you want to delete this variant?")) return;

  try {
    await api.delete(`/product/variants/${variantId}/`);
    setVariants(variants.filter((variant) => variant.id !== variantId));
    toast.success("Variant deleted successfully.");
  } catch (error) {
    toast.error("Failed to delete variant.");
  }
};


  const resolveAttributes = (attributeIds) => {
    return attributeIds
      .map((id) => {
        const attribute = attributesForVariants.find((attr) =>
          attr.values.some((val) => val.id === id)
        );
        if (attribute) {
          const value = attribute.values.find((val) => val.id === id);
          return `${attribute.name}: ${value.value}`;
        }
        return null;
      })
      .filter(Boolean)
      .join(", ");
  };

  if (loading) return <p>Loading...</p>;

  if (!product) return <p>Product not found.</p>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex">
        <ProductImages
          images={product?.images}
          selectedImage={selectedImage}
          onThumbnailClick={setSelectedImage}
        />
        <ProductHeader
          product={product}
          categories={categories}
          subcategories={subcategories}
          onAddAttribute={() => setShowAddAttributeModal(true)}
          onAddVariant={() => setShowAddVariantModal(true)}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Attributes</h3>
        <AttributesList attributes={attributes} onDelete={handleDeleteAttribute} />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Variants</h3>
        <VariantsList
          variants={variants}
          resolveAttributes={resolveAttributes}
          onDeleteVariant={handleDeleteVariant}
          onDeleteImage={handleDeleteImage}
          onUploadImage={handleUploadImage}
        />
      </div>

      {showAddAttributeModal && (
        <AddAttributeModal
          onClose={() => setShowAddAttributeModal(false)}
          onSubmit={handleSubmitAttribute}
          loading={loadingAttribute}
          newAttribute={newAttribute}
          onAttributeChange={setNewAttribute}
          attributeValues={attributeValues}
          onAddValue={handleAddValue}
          onRemoveValue={handleRemoveValue}
          onValueChange={handleValueChange}
        />
      )}

      {showAddVariantModal && (
        <AddVariantModal
          onClose={() => setShowAddVariantModal(false)}
          onSubmit={handleSubmitVariant}
          loading={loadingVariant}
          sku={sku}
          stock={stock}
          price={price}
          attributesForVariants={attributesForVariants}
          selectedAttributes={selectedAttributes}
          onSkuChange={(e) => setSku(e.target.value)}
          onStockChange={(e) => setStock(Number(e.target.value))}
          onPriceChange={(e) => setPrice(e.target.value)}
          onAttributeChange={handleAttributeChange}
        />
      )}
    </div>
  );
};

export default ProductDetails;
