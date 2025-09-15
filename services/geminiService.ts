// services/geminiService.ts
import { GoogleGenAI } from "@google/genai";

// Use server key on Vercel; VITE_* for local dev only if truly needed client-side.
const apiKey =
  (process.env.GOOGLE_API_KEY as string | undefined) ??
  (import.meta.env.VITE_GOOGLE_API_KEY as string | undefined);

if (!apiKey) {
  console.warn(
    "Missing GOOGLE API key. Set GOOGLE_API_KEY (server) or VITE_GOOGLE_API_KEY (client) before calling the model."
  );
}

const ai = new GoogleGenAI({ apiKey });

/** One-shot text generation helper (returns a plain string). */
export async function ask(prompt: string): Promise<string> {
  const res = await ai.models.generateContent({
    model: "gemini-2.0-flash-001", // or "gemini-2.0-flash"
    contents: prompt               // v1 SDK accepts a string or structured contents
  });
  return res.text;                  // v1 SDK returns .text
}

/**
 * Keep backward compatibility with App.tsx that expects `getMorningBriefing`.
 * If your model returns JSON, we try to parse it; otherwise we wrap the text.
 */
export async function getMorningBriefing(prompt: string): Promise<any> {
  const text = await ask(prompt);
  try {
    return JSON.parse(text);
  } catch {
    return { text };
  }
}
