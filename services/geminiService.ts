
import { GoogleGenAI } from "@google/genai";
import { BriefingData, Weather, NewsArticle, Source } from '../types';

const parseBriefingText = (text: string): { weather: Weather; news: NewsArticle[] } => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  let weather: Weather = { temperature: 'N/A', condition: 'N/A', location: 'N/A' };
  const news: NewsArticle[] = [];

  const weatherLine = lines.find(line => line.startsWith('WEATHER:'));
  if (weatherLine) {
    const weatherMatch = weatherLine.match(/WEATHER: (.*?)°[CF], (.*?), (.*)/);
    if (weatherMatch) {
      weather = {
        temperature: `${weatherMatch[1]}°C`, // Assuming Celsius for consistency
        condition: weatherMatch[2].trim(),
        location: weatherMatch[3].trim().replace(/\.$/, ''),
      };
    }
  }

  const headlineLines = lines.filter(line => line.startsWith('HEADLINE:'));
  headlineLines.forEach(line => {
    const headlineMatch = line.match(/HEADLINE: (.*?) - SUMMARY: (.*)/);
    if (headlineMatch) {
      news.push({
        headline: headlineMatch[1].trim(),
        summary: headlineMatch[2].trim(),
      });
    }
  });

  if (!weatherLine && news.length === 0) {
    throw new Error("Could not parse the briefing from the AI's response. The format might have changed.");
  }
  
  return { weather, news };
};

export const getMorningBriefing = async (): Promise<BriefingData> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
Provide a morning briefing for today.
First, give the current weather for New York City. Include temperature in Celsius and a brief description of the conditions. Format it exactly as: WEATHER: [Temperature]°C, [Condition], [City].
Second, list the top 3 world news headlines. For each headline, provide a brief one-sentence summary. Format each exactly as: HEADLINE: [Headline] - SUMMARY: [Summary].
Do not include any other text, greetings, or explanations.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const parsedContent = parseBriefingText(response.text);
    
    const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources: Source[] = rawSources.map((s: any) => ({
      uri: s.web?.uri ?? '#',
      title: s.web?.title ?? 'Unknown Source',
    })).filter((s: Source) => s.uri !== '#');

    return {
      ...parsedContent,
      sources,
    };
  } catch (error) {
    console.error("Error fetching or parsing briefing:", error);
    throw new Error("Failed to get morning briefing from the AI. Please try again later.");
  }
};
