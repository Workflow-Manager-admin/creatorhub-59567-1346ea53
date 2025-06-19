// You can put this in a temporary file like checkModels.js and run with node
// Or integrate a simpler version into your app's component for debugging if needed

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = 'AIzaSyDfR-hi5UrN9BD4olYleIT-ELn0wXh0g4g'; // Replace with your actual key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function listModels() {
  try {
    const { models } = await genAI.listModels();
    console.log("Available Models:");
    for (const model of models) {
      console.log(`- ${model.name}`);
      console.log(`  Supported Methods: ${model.supportedGenerationMethods.join(', ')}`);
      console.log(`  Description: ${model.description}`);
      console.log('---');
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();