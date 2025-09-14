// services/geminiService.ts

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  FunctionDeclarationsTool,
} from "@google/genai";
import { BriefingData } from '../types';

// IMPORTANT: Access the API key with the VITE_ prefix
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set. Please add it to your .env.local file and Vercel environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const tools: FunctionDeclarationsTool[] = [
  {
    function_declarations: [
      {
        name: "get_weather",
        description: "Get the current weather for a specified location.",
        parameters: {
          type: "OBJECT",
          properties: {
            location: {
              type: "STRING",
              description: "The city and state, e.g., San Francisco, CA",
            },
          },
          required: ["location"],
        },
      },
      {
        name: "get_top_headlines",
        description: "Get the top news headlines for a specified location or topic.",
        parameters: {
          type: "OBJECT",
          properties: {
            query: {
              type: "STRING",
              description: "The topic or location for the news, e.g., 'world news' or 'local news for London'",
            },
          },
          required: ["query"],
        },
      },
    ],
  },
];

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  tools: tools,
});

export async function getMorningBriefing(coords?: { latitude: number; longitude: number }): Promise<BriefingData> {
  const locationPrompt = coords
    ? `for the current location (latitude: ${coords.latitude}, longitude: ${coords.longitude})`
    : "for San Francisco, CA (as a default)";

  const prompt = `
    Provide a morning briefing. It should include:
    1. The current weather ${locationPrompt}.
    2. The top 3 news headlines ${locationPrompt}. Summarize each headline in one sentence.
    Do not make up any data. Use the provided tools to get real-time information.
  `;

  const chat = model.startChat();
  const result = await chat.sendMessage(prompt);
  const response = result.response;
  
  if (response.text) {
    // Attempt to parse the text response as a fallback
    try {
      const parsedText = JSON.parse(response.text.replace(/```json|```/g, ''));
      if (parsedText.weather && parsedText.news) {
        return parsedText;
      }
    } catch (e) {
        console.error("Could not parse text response from model:", response.text);
    }
  }
  
  // This is a fallback structure if the model doesn't return a clean JSON object.
  // In a real-world app, you'd want more robust parsing logic.
  throw new Error("Failed to get a valid briefing from the AI model. The model did not return the expected structured data.");
}
