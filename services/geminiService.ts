import { GoogleGenerativeAI } from "@google/genai";
import type { BriefingData, Source } from '../types';
import type { FunctionDeclarationsTool } from "@google/genai";
import { GoogleGenerativeAI } from "@google/genai";
const genai = new GoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });
export const model = genai.getGenerativeModel({ model: "gemini-2.0-flash" });



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
    Do not make up any data. Use the provided tools to get real-time information. Also provide the source URLs for the news.
  `;

  const chat = model.startChat();
  const result = await chat.sendMessage(prompt);
  const response = result.response;
  
  if (response.text) {
    try {
      const cleanJsonString = response.text.replace(/```json|```/g, '').trim();
      const parsedData = JSON.parse(cleanJsonString);
      
      if (parsedData.weather && parsedData.news && parsedData.sources) {
        return parsedData;
      }
    } catch (e) {
      console.error("Could not parse the model's text response as JSON:", e);
      throw new Error("The AI model returned an invalid response. Please try again.");
    }
  }
  
  throw new Error("Failed to get a valid briefing from the AI model. No response text was generated.");
}
