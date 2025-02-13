import React, { useState } from 'react';
import axios from 'axios';
// import SongSelector from './SongSelector';
// import ImageSelector from './ImageSelector';

function ScriptGenerator({ onScriptGenerated }) {
  const [description, setDescription] = useState('');
  const [length, setLength] = useState('');
  const [warning, setWarning] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [selectedImage, setSelectedImage] = useState(null);
  // const [selectedSong, setSelectedSong] = useState(null);

  // const handleImageSelect = (image) => {
  //   setSelectedImage(image);
  // };

  // const handleSongSelect = (song) => {
  //   setSelectedSong(song);
  // };

  const handleGenerateScript = async () => {
    if (!description || !length) {
      setWarning('Please fill in all required fields.');
      return;
    }
    
    setIsLoading(true);
    setWarning('');

    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('length', length);
      

      const response = await axios.post('http://localhost:5000/api/generate-script', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.script) {
        onScriptGenerated(response.data.script);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.details || 
                          'Failed to generate script';
      setWarning(errorMessage);
      
      if (error.response?.data?.details === 'API key validation failed') {
        console.error('API key configuration error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-12 bg-gray-100">
      <h2 className="text-lg font-semibold">Video Description</h2>
      <textarea
        className="w-full h-32 p-2 mt-3 border rounded-xl"
        placeholder="Share your idea about video content in your language..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <ImageSelector onImageSelect={handleImageSelect} />
        <SongSelector onSongSelect={handleSongSelect} />
      </div> */}

      <h2 className="mt-4 text-lg font-semibold">Video Length</h2>
      <select
        className="w-full p-2 mt-2 border rounded-xl"
        value={length}
        onChange={(e) => setLength(e.target.value)}
      >
        <option value="">Select video length</option>
        <option value="10 seconds">10 seconds</option>
        <option value="30 seconds">30 seconds</option>
        <option value="1 minute">1 minute</option>
        <option value="2 minutes">2 minutes</option>
        <option value="5 minutes">5 minutes</option>
        <option value="10 minutes">10 minutes</option>
      </select>

      {warning && <p className="text-red-500 mt-2">{warning}</p>}
      <button
        className={`w-full p-2 mt-4 text-white rounded-xl transition-colors ${
          !isLoading && description && length ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'
        }`}
        onClick={handleGenerateScript}
        disabled={isLoading || !description || !length}
      >
        {isLoading ? 'Generating...' : 'Generate Script'}
      </button>
    </div>
  );
}

export default ScriptGenerator; 