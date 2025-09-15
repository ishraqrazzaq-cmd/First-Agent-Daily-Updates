// services/geminiService.ts
import { GoogleGenAI } from "@google/genai";

// Prefer server-side usage; for local dev you can also use VITE_GOOGLE_API_KEY.
const apiKey =
  (process.env.GOOGLE_API_KEY as string | undefined) ??
  (import.meta.env.VITE_GOOGLE_API_KEY as string | undefined);

if (!apiKey) {
  console.warn(
    "Missing GOOGLE API key. Set GOOGLE_API_KEY (server) or VITE_GOOGLE_API_KEY (client) before calling the model."
  );
}

export const ai = new GoogleGenAI({ apiKey });

/** One-shot text generation helper */
export async function ask(prompt: string) {
  const res = await ai.models.generateContent({
    model: "gemini-2.0-flash-001", // or gemini-2.0-flash
    contents: prompt,              // string or structured contents
  });
  return res.text;                 // note: .text (not response.text())
}
