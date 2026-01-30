
import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";
import { TechDomain, LearningRoadmap } from "../types";

const API_KEY = process.env.API_KEY || '';

export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: API_KEY });
};

export const generateRoadmap = async (domain: TechDomain, role: string): Promise<LearningRoadmap> => {
  const ai = getGeminiClient();
  const prompt = `Act as an Advanced Agentic AI Learning Architect for Tech Skyline IT Solutions. 
  Design a complete, job-ready learning roadmap for the role of "${role}" in the domain of "${domain}". 
  Include exactly 6 steps ranging from Basic to Advanced. 
  Focus on hands-on labs and real-world enterprise use cases.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          domain: { type: Type.STRING },
          role: { type: Type.STRING },
          overview: { type: Type.STRING },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                level: { type: Type.STRING },
                description: { type: Type.STRING },
                tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                labIdea: { type: Type.STRING },
                certifications: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "level", "description", "tools", "labIdea", "certifications"]
            }
          },
          enterpriseUseCases: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["domain", "role", "overview", "steps", "enterpriseUseCases"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as LearningRoadmap;
};

export const createAIChat = (systemInstruction: string): Chat => {
  const ai = getGeminiClient();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction,
    },
  });
};

export const generateSpeech = async (text: string): Promise<string> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio || '';
};
