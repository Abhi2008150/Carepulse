import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getFastAIResponse = async (prompt: string, context?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: context ? `${context}\n\nUser Question: ${prompt}` : prompt,
      config: {
        systemInstruction: "You are a helpful medical assistant for CarePulse Hospital. Provide quick, accurate, and empathetic responses. Use bullet points for lists and keep information well-structured and easy to read. Always advise consulting a doctor for serious concerns.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
  }
};
