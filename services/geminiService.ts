// services/geminiService.ts
import { GoogleGenAI } from "@google/genai";

// Use server key on Vercel; VITE_* only for local dev if you truly need client-side calls.
const apiKey =
  (process.env.GOOGLE_API_KEY as string | undefined) ??
  (import.meta.env.VITE_GOOGLE_API_KEY as string | undefined);

if (!apiKey) {
  console.warn(
    "Missing GOOGLE API key. Set GOOGLE_API_KEY (server) or VITE_GOOGLE_API_KEY (client) before calling the model."
  );
}

const ai = new GoogleGenAI({ apiKey });

/** Internal helper */
async function ask(prompt: string) {
  const res = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",    // or "gemini-2.0-flash"
    contents: prompt                  // v1 SDK accepts string or structured contents
  });
  return res.text;                     // note: v1 returns .text
}

/** ✅ Named export expected by App.tsx */
export async function getMorningBriefing(prompt: string) {
  // You can shape the prompt however App.tsx expects; for now pass-through:
  return ask(prompt);
}
