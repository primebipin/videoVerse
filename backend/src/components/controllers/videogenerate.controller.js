import fetch from 'node-fetch';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';
import RunwayML from '@runwayml/sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const client = new RunwayML({
  apiKey: process.env.RUNWAY_API_KEY
});
 
// console.log(client);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
}).single('songFile');

const videoGenerateController = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ error: 'Unknown error during upload' });
    }

    const { script } = req.body;
    const songFile = req.file;
    const imageFile = req.file; // Assuming the image is uploaded as 'file'

    if (!script) {
      return res.status(400).json({ error: 'Script is required' });
    }

    if (!imageFile) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    try {
      // Read the uploaded image file
      const imageBuffer = fs.readFileSync(imageFile.path);

      // Convert to base64
      const base64String = imageBuffer.toString('base64');

      // Create a new image-to-video task using the "gen3a_turbo" model
      const imageToVideo = await client.imageToVideo.create({
        model: 'gen3a_turbo',
        promptImage: `data:image/${path.extname(imageFile.originalname).slice(1)};base64,${base64String}`,
        promptText: script,
        backgroundMusic: songFile ? songFile.path : undefined,
      });

      const taskId = imageToVideo.id;

      // Poll the task until it's complete
      let task;
      do {
        // Wait for ten seconds before polling
        await new Promise(resolve => setTimeout(resolve, 10000));

        task = await client.tasks.retrieve(taskId);
      } while (!['SUCCEEDED', 'FAILED'].includes(task.status));

      console.log('Task complete:', task);

      res.json({ taskId, status: task.status, result: task.result });
    } catch (error) {
      console.error('Error generating video:', error);
      res.status(500).json({ 
        error: 'Failed to generate video',
        details: error.message 
      });
    }
  });
};

export default videoGenerateController;