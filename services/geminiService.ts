import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAhabWisdom = async (userQuery: string): Promise<string> => {
  if (!apiKey) {
    return "ARRR! Where be my API KEY?! (Check env vars)";
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
    if (!apiKey) return null;

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