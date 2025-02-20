import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function ScriptGenerator({ setScript, script }) {
  const [description, setDescription] = useState('');
  const [length, setLength] = useState('');
  const [warning, setWarning] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerateScript = async () => {
    if (!description || !length) {
      console.log('Please fill in all required fields.');
      setWarning('Please fill in all required fields.');
      return;
    }
    
    setIsLoading(true);
    setWarning('');

    try {
      const response = await fetch('http://localhost:5000/api/generate-script', 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description: description, length: length }),
        }
      );

      const data = await response.json();
      const generatedScript = data.generatedScript;
      console.log(data)
      setScript(generatedScript);
    } catch (error) {
      console.error('Error generating script:', error);
      setWarning('Failed to generate script. Please try again.');
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
      <h2 className="text-lg font-semibold">Generated Script</h2>
      <div className="w-full h-40 p-5 mt-2 border border-gray-600 rounded-xl overflow-auto whitespace-pre-wrap break-words"
       contentEditable={!!script} // Editable only when script is present
       suppressContentEditableWarning={true} // Suppress React warning
      >
        {script ? (
          <ReactMarkdown>{script}</ReactMarkdown>
        ) : (
          <span className="placeholder">See the output here...</span>
        )}
      </div>

      
    </div>
  );
}

export default ScriptGenerator; 