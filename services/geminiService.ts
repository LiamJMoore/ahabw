import { GoogleGenAI } from "@google/genai";

// Safely access process.env.API_KEY or default to empty string to prevent browser crash
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';

// Only initialize AI if key exists to prevent errors
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateAhabWisdom = async (userQuery: string): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key missing.");
    return "ARRR! THE ORACLE IS SILENT (Missing API Key)";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: `You are Captain Ahab, a degenerate crypto trader hunting the White Whale ($1B Market Cap). 
        Speak in a mix of 19th-century sailor slang and crypto degen terminology. 
        Be aggressive, manic, and obsessed. Keep it under 40 words.`,
        temperature: 1.1,
      }
    });

    return response.text || "THE WAVES ARE SILENT!";
  } catch (error) {
    console.error("Oracle text error:", error);
    return "THE KRAKEN ATE THE CONNECTION!";
  }
};

export const generateAhabSpeech = async (text: string): Promise<string | null> => {
    if (!ai) return null;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Puck' } // Rough, pirate-like voice
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;

    } catch (error) {
        console.error("Oracle speech error:", error);
        return null;
    }
}