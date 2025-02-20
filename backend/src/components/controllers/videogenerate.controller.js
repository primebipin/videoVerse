import fetch from 'node-fetch';
import RunwayML from '@runwayml/sdk';
import generateImageFromScript from '../services/gptImageService.js';

const client = new RunwayML({
  apiKey: process.env.RUNWAY_API_KEY,
});

// Video Generation Controller
async function createVideo(req, res) {
  const { script, image } = req.body;

  // Validate Inputs
  if (!script || !image) {
    return res.status(400).json({ error: 'Both script and image are required' });
  }

  try {
    const videoResponse = await client.imageToVideo.create({
      model: 'gen3a_turbo',
      promptImage: image,
      promptText: script,
    });

    console.log('RunwayML Response:', videoResponse);

    if (!videoResponse || !videoResponse.data || !videoResponse.data.videoUrl) {
      return res.status(500).json({ error: 'Failed to generate video' });
    }

    res.status(200).json({ videoUrl: videoResponse.data.videoUrl });

  } catch (error) {
    console.error('Video Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate video' });
  }
}

export default createVideo;
