import React, { useState } from 'react';
import axios from 'axios';
import ImageSelector from './ImageSelector';
import SongSelector from './SongSelector';


function VideoGenerator({ script, image }) {
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
 

  // const handleImageSelect = (image) => {
  //   setSelectedImage(image);
  // };

  // const handleSongSelect = (song) => {
  //   setSelectedSong(song);
  // };


  // const checkVideoStatus = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:5000/api/video-status/${taskId}`);
  //     if (response.data.status === 'completed') {
  //       setVideoUrl(response.data.videoUrl);
  //       setShowVideo(true);
  //       setLoading(false);
  //     } else if (response.data.status === 'processing') {
  //       setGenerationProgress(response.data.progress || 0);
  //       setTimeout(() => checkVideoStatus(taskId), 5000); // Poll every 5 seconds
  //     }
  //   } catch (error) {
  //     setError('Failed to check video status');
  //     setLoading(false);
  //   }
  // };

  const handleGenerateVideo = async () => {
    if (!script || !image) {
      setError('Both script and image are required to generate a video.');
      return;
    }

    setLoading(true);
    setError('');
    setGenerationProgress(0);

    const response = await fetch('http://localhost:5000/api/generate-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ script, image })
    });
    console.log(response)
    if (response.ok) {
      const data = await response.json();
      setVideoUrl(data.videoUrl);
      setShowVideo(true);
      setLoading(false);
    } else {
      setError('Failed to generate video');
      setLoading(false);
    }
    
  };

  return (
    <div className="p-12 bg-gray-100">
     <button
        className={`w-full p-2 mt-4 text-white rounded-xl transition-colors ${
          script  && !loading ? 'bg-black hover:bg-gray-800 cursor-allowed' : 'bg-gray-400 cursor-not-allowed'
        }`}
        onClick={handleGenerateVideo}
        disabled={!script || loading}
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