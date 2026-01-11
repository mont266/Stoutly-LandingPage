import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateToast = async (occasion: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, witty, and traditional-sounding Irish toast for the following occasion: "${occasion}". Keep it under 40 words. Focus on friendship, stout, or good luck.`,
      config: {
        systemInstruction: "You are a charismatic Irish pub landlord. You are witty, warm, and brief.",
        temperature: 0.8,
      }
    });

    return response.text || "May your glass be ever full. (AI is taking a nap)";
  } catch (error) {
    console.error("Error generating toast:", error);
    return "Here's to a long life and a merry one. (Offline Toast)";
  }
};