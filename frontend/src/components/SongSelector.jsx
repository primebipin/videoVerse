import React, { useState } from 'react';

function SongSelector({ onSongSelect }) {
  const [selectedSong, setSelectedSong] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);

  const handleSongUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedSong(file);
      onSongSelect(file);
      // Create audio preview URL
      setAudioPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveSong = () => {
    setSelectedSong(null);
    setAudioPreview(null);
    onSongSelect(null);
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Background Music (Optional)</h2>
      <div className="space-y-2">
        <input
          type="file"
          accept="audio/*"
          onChange={handleSongUpload}
          className="w-full p-2 border rounded-xl"
        />
        {audioPreview && (
          <div className="space-y-2">
            <audio controls className="w-full">
              <source src={audioPreview} type="audio/*" />
              Your browser does not support the audio element.
            </audio>
            <button
              onClick={handleRemoveSong}
              className="text-red-500 text-sm hover:text-red-700"
            >
              Remove Song
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SongSelector; 