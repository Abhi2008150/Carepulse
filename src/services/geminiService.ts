import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

const getAIInstance = () => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. AI features will be disabled.");
      return null;
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const getFastAIResponse = async (prompt: string, context?: string) => {
  try {
    const ai = getAIInstance();
    if (!ai) {
      return "I'm sorry, the AI assistant is currently unavailable as the API key is not configured. Please contact support.";
    }

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
