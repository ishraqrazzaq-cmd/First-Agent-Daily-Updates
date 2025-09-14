
import { GoogleGenAI } from "@google/genai";
import { BriefingData, Source } from '../types';

export const getMorningBriefing = async (coords?: { latitude: number; longitude: number; }): Promise<BriefingData> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const locationPrompt = coords 
    ? `for the location at latitude ${coords.latitude} and longitude ${coords.longitude}.`
    : `for Dhaka, Bangladesh.`;

  const prompt = `
Provide a morning briefing for today, ${locationPrompt}
Respond with ONLY a single, raw JSON object. Do not use markdown, backticks, or any other text outside of the JSON object.
The JSON object must have two keys: "weather" and "news".
- The "weather" value must be an object with "temperature" (string, in Celsius), "condition" (string), and "location" (string).
- The "news" value must be an array of exactly 3 objects, where each object has "headline" (string) and "summary" (string).
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2, // Lower temperature for more predictable, structured output
      },
    });

    const text = response.text.trim();
    // In case the model still includes markdown, we'll strip it.
    const cleanText = text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    const parsedContent: { weather: BriefingData['weather']; news: BriefingData['news'] } = JSON.parse(cleanText);
    
    const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources: Source[] = rawSources.map((s: any) => ({
      uri: s.web?.uri ?? '#',
      title: s.web?.title ?? 'Unknown Source',
    })).filter((s: Source) => s.uri !== '#');

    // Basic validation
    if (!parsedContent.weather || !parsedContent.news || !Array.isArray(parsedContent.news) || parsedContent.news.length === 0) {
      throw new Error("Invalid data structure received from AI.");
    }

    return {
      ...parsedContent,
      sources,
    };
  } catch (error) {
    console.error("Error fetching or parsing briefing:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse the AI's response. The format was not valid JSON.");
    }
    throw new Error("Failed to get morning briefing from the AI. Please try again later.");
  }
};
