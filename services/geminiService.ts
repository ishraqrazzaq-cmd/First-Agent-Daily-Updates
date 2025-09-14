// src/services/genai.ts
import { GoogleGenerativeAI } from "@google/genai";

// Prefer server-side usage; for local dev you can also use VITE_GOOGLE_API_KEY.
const apiKey =
  (process.env.GOOGLE_API_KEY as string | undefined) ??
  (import.meta.env.VITE_GOOGLE_API_KEY as string | undefined);

if (!apiKey) {
  console.warn("Missing GOOGLE API key. Set GOOGLE_API_KEY (server) or VITE_GOOGLE_API_KEY (client) before calling the model.");
}

export const genai = new GoogleGenerativeAI({ apiKey });
export const textModel = genai.getGenerativeModel({ model: "gemini-2.0-flash" });

// Convenience helper
export async function ask(prompt: string) {
  const res = await textModel.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }]}]
  });
  return res.response.text();
}
