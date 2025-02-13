import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'song', maxCount: 1 }
]);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const scriptGenerateController = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ error: 'Unknown error during upload' });
    }

    const { description, length } = req.body;

    if (!description || !length) {
      return res.status(400).json({ error: 'Description and length are required' });
    }

    let prompt = `Create a script for a ${length} video: ${description}`;
   

    try {
      // Generate content with Google Generative AI based on the prompt
      const result = await model.generateContent(prompt);

      // Log the AI response for debugging
      console.log('AI Response:', result);

      // Check if the response has the generated text
      const generatedScript = result.response && typeof result.response.text === 'function' ? result.response.text() : null;

      if (generatedScript) {
        res.json({ 
          script: generatedScript
        });
      } else {
        res.status(400).json({ error: 'No script returned from the AI model' });
      }
    } catch (error) {
      console.error('Error generating script:', error.message);
      res.status(500).json({ error: 'Failed to generate script' });
    }
  });
};

export default scriptGenerateController; 