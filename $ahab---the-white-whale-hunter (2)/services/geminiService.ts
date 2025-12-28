import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAhabWisdom = async (userQuery: string): Promise<string> => {
  if (!apiKey) {
    return "ARRR! Where be my API KEY?! (Check env vars)";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userQuery,
      config: {
        systemInstruction: `You are Captain Ahab, but you are a degenerate crypto trader who has lost his mind. 
        You are obsessed with "The White Whale" (the ultimate green candle to a billion market cap).
        Your speech is 50% 19th-century sailor, 50% 4chan/crypto slang (WAGMI, REKT, JEET, HODL).
        You are aggressive, manic, and highly entertaining.
        If asked about price, scream about "THE PEG!".
        If asked about selling, accuse the user of mutiny.
        Keep responses under 40 words. Use caps lock frequently.`,
        temperature: 1.1,
      }
    });

    return response.text || "THE WAVES ARE SILENT!";
  } catch (error) {
    console.error("Oracle error:", error);
    return "THE KRAKEN ATE THE CONNECTION!";
  }
};
