import React, { useState } from 'react';

function ImageSelector({ onImageSelect }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      onImageSelect(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Character Image (Required)</h2>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded-xl"
        />
        {previewUrl && (
          <div className="relative w-20 h-20">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageSelector; 