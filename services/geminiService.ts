
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
  
  INDUSTRY CONTEXT (MANDATORY ALIGNMENT):
  1. If domain is Enterprise/ERP and role relates to Murex: Focus on Trade Lifecycle, Market Data (QuantLib/Python), Risk & PnL, SQL performance tuning, and Unix Batch Orchestration.
  2. If domain is Agentic AI: Focus on Multi-agent systems, Agentic Orchestration (Maestro/LangGraph), Healing Agents, and Autopilot integration.
  3. If domain is Cloud: Focus on SRE, Kubernetes, and Zero-trust security.
  
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
        "labIdea": "string (Concrete project or live lab scenario using open tools to replicate enterprise features)",
        "assessmentStrategy": "string (How to measure competence)",
        "skillOutcomes": ["string"],
        "certifications": ["string"]
      }
    ],
    "enterpriseUseCases": ["string"],
    "careerAlignment": "string (Summary of market demand and roles)"
  }
  
  Ensure the tools and labs are specific to the domain provided. For Murex specialists, recommend open equivalents like QuantLib or OpenGamma for conceptual mastery.`;

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

export const generateQuiz = async (labTitle: string, currentTask: string): Promise<{ question: string; context: string }> => {
  const ai = getGeminiClient();
  const prompt = `You are the Evaluator Agent for Tech Skyline IT Solutions. 
  The student is currently working on a Lab titled "${labTitle}", specifically the module: "${currentTask}".
  Generate a challenging, open-ended technical question that tests deep understanding of this specific module.
  
  Return JSON:
  {
    "question": "The technical question",
    "context": "Short hint or context for the question"
  }`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          context: { type: Type.STRING }
        },
        required: ["question", "context"]
      }
    }
  });

  return JSON.parse(response.text || '{"question": "What is the primary goal of this module?", "context": "Lab module check"}');
};

export const evaluateQuiz = async (question: string, answer: string): Promise<{ score: number; feedback: string }> => {
  const ai = getGeminiClient();
  const prompt = `You are the Senior Industry Evaluator. 
  Question: "${question}"
  Student Answer: "${answer}"
  
  Evaluate the answer for technical accuracy, professional terminology, and completeness.
  Return JSON:
  {
    "score": number (0-100),
    "feedback": "Constructive feedback and correct explanation if needed"
  }`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          feedback: { type: Type.STRING }
        },
        required: ["score", "feedback"]
      }
    }
  });

  return JSON.parse(response.text || '{"score": 0, "feedback": "Evaluation failed. Please try again."}');
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
