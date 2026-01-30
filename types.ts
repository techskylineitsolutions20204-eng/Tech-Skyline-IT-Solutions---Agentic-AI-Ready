
export enum TechDomain {
  AGENTIC_AI = 'Agentic AI',
  CLOUD_DEVOPS = 'Cloud & DevOps',
  CYBER_GOVERNANCE = 'Cyber & Governance',
  ENTERPRISE_ERP = 'Enterprise & ERP',
  SOFTWARE_DEV = 'Software Development',
  DATA_ANALYTICS = 'Data & BI',
  MANAGEMENT = 'Management & Leadership'
}

export interface RoadmapStep {
  title: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  description: string;
  tools: string[];
  labIdea: string;
  certifications: string[];
}

export interface LearningRoadmap {
  domain: TechDomain;
  role: string;
  overview: string;
  steps: RoadmapStep[];
  enterpriseUseCases: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}
