import { GoogleGenerativeAI } from "@google/generative-ai";

const googleApiKey = process.env.GOOGLE_API_KEY || ""; // Set a default value if the environment variable is undefined
const genAI = new GoogleGenerativeAI(googleApiKey);


export  async function generateImagePrompt(name: string) {
  try {
    const prompt = `You are a creative and helpful AI assistant capable of generating interesting thumbnail descriptions for my notes. Your output will be fed into an image generation system. The description should be minimalistic and flat styled. Please generate a thumbnail description for my notebook title: ${name}`;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const data = await result.response;
    const image_description = data.text()
    return image_description as string;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
