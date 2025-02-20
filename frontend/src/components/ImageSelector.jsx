import React, { useState } from 'react';
import { FaImage } from 'react-icons/fa';


function ImageSelector({ setImage, image, script }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleGenerate() {
    try {
      const response = await fetch('http://localhost:5000/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ script }) // Send the script to the backend
      });
      console.log(response)
      if (response.ok) {
        const data = await response.json();
        setImage(data.imageUrl); 
      } else {
        console.error('Failed to generate image');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className="p-12 bg-gray-100">
      {/* Display the generated image */}
      {image ? (
        <img src={`${image}`}  alt="Generated" style={{ width: 200, height: 200, objectFit: "cover", borderRadius:"50%"}} />
      ) : (
        <div className="placeholder">
          <FaImage size={200} color="#ccc" />
        </div>
      )}

      <button className={`bg-black text-white p-2 rounded-xl mt-2 ${
          !isLoading && script ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'
        }`}
       onClick={handleGenerate}
        disabled={ !script ||isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Character'}
      </button>
    </div>
  );
}

export default ImageSelector;
