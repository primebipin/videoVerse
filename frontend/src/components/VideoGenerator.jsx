import React, { useState } from 'react';
import axios from 'axios';
import ImageSelector from './ImageSelector';
import SongSelector from './SongSelector';

function VideoGenerator({ script, image, audio }) {
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  const checkVideoStatus = async (taskId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/video-status/${taskId}`);
      if (response.data.status === 'completed') {
        setVideoUrl(response.data.videoUrl);
        setShowVideo(true);
        setLoading(false);
      } else if (response.data.status === 'processing') {
        setGenerationProgress(response.data.progress || 0);
        setTimeout(() => checkVideoStatus(taskId), 5000); // Poll every 5 seconds
      }
    } catch (error) {
      setError('Failed to check video status');
      setLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!script || !selectedImage) {
      setError('Both script and image are required to generate a video.');
      return;
    }

    setLoading(true);
    setError('');
    setGenerationProgress(0);

    try {
      const formData = new FormData();
      formData.append('script', script);
      formData.append('image', image);
      if (audio) {
        formData.append('audio', audio);
      }

      const response = await axios.post('http://localhost:5000/api/generate-video', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.taskId) {
        checkVideoStatus(response.data.taskId);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to generate video');
      setLoading(false);
    }
  };

  return (
    <div className="p-12 bg-gray-100">
      <h2 className="text-lg font-semibold">Generated Script</h2>
      <textarea
        className="w-full h-32 p-2 mt-2 border rounded-xl"
        value={script}
        readOnly={!script}
        placeholder="Your generated script will appear here..."
      />
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <ImageSelector onImageSelect={handleImageSelect} />
        <SongSelector onSongSelect={handleSongSelect} />
      </div>
      
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        className={`w-full p-2 mt-4 text-white rounded-xl transition-colors ${
          script &&  selectedImage && !loading ? 'bg-black hover:bg-gray-800 cursor-allowed' : 'bg-gray-400 cursor-not-allowed'
        }`}
        onClick={handleGenerateVideo}
        disabled={!script || !selectedImage || loading}
      >
        {loading ? 'Generating Video...' : 'Generate Video'}
      </button>
      
      {showVideo && videoUrl && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Generated Video</h3>
          <video controls className="w-full mt-2 border rounded-xl">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <a
            href={videoUrl}
            download
            className="w-full p-2 mt-4 text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors block text-center"
          >
            Download Video
          </a>
        </div>
      )}
      
      {loading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${generationProgress}%` }}
            ></div>
          </div>
          <p className="text-center mt-2">Generating video: {generationProgress}%</p>
        </div>
      )}
    </div>
  );
}

export default VideoGenerator; 