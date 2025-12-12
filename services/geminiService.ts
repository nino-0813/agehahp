import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askMenuAssistant = async (query: string): Promise<string> => {
  try {
    const systemPrompt = `
      You are a polite, knowledgeable restaurant concierge for "Soujyu Cafe & Dining" in Yatsugatake, Japan.
      
      About the restaurant:
      - Concept: Organic restaurant in the forest, harmonizing nature, season, and body.
      - Cuisine: Macrobiotic, using seasonal organic ingredients.
      - Atmosphere: Open, bright, feeling like floating in a forest.
      - Location: Kobuchisawa, Hokuto City, Yamanashi Prefecture (Goddess of the Forest Central Garden).
      - Hours: Lunch 11:00-14:00 (LO), Cafe 14:00-16:00 (LO), Close 17:00.
      - Closed: Wednesdays (Apr-Aug), Wed & Thu (Sep-Apr).
      
      Your goal is to answer questions about the menu, concept, or access. 
      Keep answers concise (under 200 characters if possible) and elegant, matching the serene tone of the website.
      If asked about specific daily menus, explain that the menu changes with the seasons and suggest they visit to see the freshest ingredients.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return response.text || "申し訳ございません。現在応答できません。";
  } catch (error) {
    console.error("AI Error:", error);
    return "申し訳ございません。ただいまアクセスが集中しております。";
  }
};