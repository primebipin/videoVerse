import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const scriptGenerateController = async (req, res) => {
  const { description, length } = req.body;

  if (!description || !length) {
    return res.status(400).json({ error: 'Description and length are required' });
  }

  let prompt = `Create a video script for ${description} within 600 characters. Provide detailed descriptions of the characters appearance, personality, and actions, as well as the background setting to enhance the scene.`;

  try {
    // Generate content with Google Generative AI based on the prompt
    const result = await model.generateContent(prompt);

    

    // Check if the response has the generated text
    const generatedScript = result.response && typeof result.response.text === 'function' ? result.response.text() : null;

    if (generatedScript) {
      res.json({ 
         generatedScript
      });
    } else {
      res.status(400).json({ error: 'No script returned from the AI model' });
    }
  } catch (error) {
    console.error('Error generating script:', error.message);
    res.status(500).json({ error: 'Failed to generate script' });
  }
};

export default scriptGenerateController; 