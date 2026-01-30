
import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";
import { TechDomain, LearningRoadmap } from "../types";

const API_KEY = process.env.API_KEY || '';

export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: API_KEY });
};

export const generateRoadmap = async (domain: TechDomain, role: string): Promise<LearningRoadmap> => {
  const ai = getGeminiClient();
  const prompt = `Act as an Advanced Agentic AI Learning Architect and Industry Mentor for Tech Skyline IT Solutions. 
  Design a complete, job-ready workforce transformation learning pathway for the role of "${role}" within the "${domain}" domain.
  
  CORE OBJECTIVES:
  - Deliver a journey from Beginner to Advanced levels.
  - Emphasize real-time practice, live cloud labs, and production-grade scenarios.
  - Align with industry certifications and enterprise use cases.
  
  The response must be a JSON object matching this schema:
  {
    "domain": "string",
    "role": "string",
    "overview": "string (Executive summary of the career path)",
    "steps": [
      {
        "title": "string",
        "level": "Beginner | Intermediate | Advanced",
        "description": "string",
        "tools": ["string"],
        "labIdea": "string (Concrete project or live lab scenario)",
        "assessmentStrategy": "string (How to measure competence)",
        "skillOutcomes": ["string"],
        "certifications": ["string"]
      }
    ],
    "enterpriseUseCases": ["string"],
    "careerAlignment": "string (Summary of market demand and roles)"
  }
  
  Ensure the tools and labs are specific to the domain provided (e.g., if SAP, mention IBP/S4HANA; if Agentic AI, mention LangGraph/Bedrock).`;

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
                assessmentStrategy: { type: Type.STRING },
                skillOutcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
                certifications: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "level", "description", "tools", "labIdea", "assessmentStrategy", "skillOutcomes", "certifications"]
            }
          },
          enterpriseUseCases: { type: Type.ARRAY, items: { type: Type.STRING } },
          careerAlignment: { type: Type.STRING }
        },
        required: ["domain", "role", "overview", "steps", "enterpriseUseCases", "careerAlignment"]
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
