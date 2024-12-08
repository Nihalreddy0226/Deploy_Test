import React from "react";

const ProductImages = ({ images, selectedImage, onThumbnailClick }) => {
  if (!images || images.length === 0) return <p>No images available</p>;

  return (
    <div className="w-1/3">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Images</h3>
      <div className="flex flex-col items-center">
        {/* Main Image */}
        <img
          src={selectedImage}
          alt="Selected product"
          className="mb-4 w-60 h-60 object-cover border rounded-md"
        />
        {/* Thumbnails */}
        <div className="flex space-x-2">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img.image}
              alt={img.alt_text || "Thumbnail"}
              onClick={() => onThumbnailClick(img.image)}
              className={`w-16 h-16 object-cover cursor-pointer border rounded-md ${
                selectedImage === img.image ? "border-purple-500" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductImages;
