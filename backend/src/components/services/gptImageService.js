import * as dotenv from 'dotenv';
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateImageFromScript = async (req, res) => {
    const { script } = req.body;
    console.log("this is script", script)
    if (!script) {
        return res.status(400).json({ error: 'Script is required' });
    }
    
    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: `Given a video script: ${script}, generate an image with detailed visuals based on the script.`,
            n: 1,
            size: "1024x1024",
        });

        // Extract image URL
        console.log("this is response", response)
        const imageUrl = response.data[0].url;
        // const imageUrl = "https://oaidalleapiprodscus.blob.core.windows.net/private/org-WyBRgyjSkdPtQq7N28MvHs7H/user-0a4bdYyX4xAnXkgQw3U5ddRK/img-faolAbzvIJ8e0kbvugiLE2Sg.png?st=2025-02-20T09%3A19%3A14Z&se=2025-02-20T11%3A19%3A14Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-02-20T00%3A24%3A55Z&ske=2025-02-21T00%3A24%3A55Z&sks=b&skv=2024-08-04&sig=x4ar51e1ftT%2BvB9FeuP9I%2BEYwRk75mk9Pj0BFOMdoDo%3D"
        console.log(imageUrl)

        // Send back both the script and the generated image URL
        res.json({ script, imageUrl });

    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'this Failed to generate image' });
    }
}

export default generateImageFromScript;
