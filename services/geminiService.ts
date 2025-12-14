import { GoogleGenAI, Type } from "@google/genai";
import { Automation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAutomationFromPrompt = async (userPrompt: string): Promise<Partial<Automation> | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a structured automation rule for a teleportation portal system based on this user request: "${userPrompt}". 
      The system can handle triggers like time, weather, location, calendar events. 
      The actions involve queuing portals, notifying contacts, or changing permission settings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "A short, elegant title for this automation" },
            trigger: { type: Type.STRING, description: "The condition that triggers the rule (e.g., 'When rain starts')" },
            action: { type: Type.STRING, description: "The action to take (e.g., 'Route to Covered Portal')" },
            isActive: { type: Type.BOOLEAN, description: "Always true for new creations" }
          },
          required: ["name", "trigger", "action", "isActive"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as Partial<Automation>;
    }
    return null;
  } catch (error) {
    console.error("Gemini Automation Error:", error);
    return null;
  }
};
