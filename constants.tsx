
import React from 'react';
import { TechDomain } from './types';

export interface DomainDetail {
  icon: React.ReactNode;
  color: string;
  description: string;
  prerequisites: TechDomain[];
  related: TechDomain[];
}

export const DOMAIN_INFO: Record<TechDomain, DomainDetail> = {
  [TechDomain.AGENTIC_AI]: {
    icon: <i className="fas fa-robot text-blue-500"></i>,
    color: 'blue',
    description: 'Master autonomous AI agents and generative architectures.',
    prerequisites: [TechDomain.SOFTWARE_DEV],
    related: [TechDomain.DATA_ANALYTICS, TechDomain.CLOUD_DEVOPS]
  },
  [TechDomain.CLOUD_DEVOPS]: {
    icon: <i className="fas fa-cloud text-cyan-500"></i>,
    color: 'cyan',
    description: 'AWS, Azure, Kubernetes, and modern SRE practices.',
    prerequisites: [TechDomain.SOFTWARE_DEV],
    related: [TechDomain.CYBER_GOVERNANCE, TechDomain.MANAGEMENT]
  },
  [TechDomain.CYBER_GOVERNANCE]: {
    icon: <i className="fas fa-shield-halved text-red-500"></i>,
    color: 'red',
    description: 'Cloud security, SOC, IAM, and compliance frameworks.',
    prerequisites: [TechDomain.CLOUD_DEVOPS],
    related: [TechDomain.MANAGEMENT, TechDomain.SOFTWARE_DEV]
  },
  [TechDomain.ENTERPRISE_ERP]: {
    icon: <i className="fas fa-building text-indigo-500"></i>,
    color: 'indigo',
    description: 'SAP IBP, Oracle Primavera, and Murex systems.',
    prerequisites: [TechDomain.MANAGEMENT],
    related: [TechDomain.DATA_ANALYTICS, TechDomain.SOFTWARE_DEV]
  },
  [TechDomain.SOFTWARE_DEV]: {
    icon: <i className="fas fa-code text-green-500"></i>,
    color: 'green',
    description: 'Full stack, Python, and iOS development mastery.',
    prerequisites: [],
    related: [TechDomain.CLOUD_DEVOPS, TechDomain.AGENTIC_AI]
  },
  [TechDomain.DATA_ANALYTICS]: {
    icon: <i className="fas fa-chart-line text-purple-500"></i>,
    color: 'purple',
    description: 'Data Science, Power BI, and advanced reporting.',
    prerequisites: [TechDomain.SOFTWARE_DEV],
    related: [TechDomain.AGENTIC_AI, TechDomain.MANAGEMENT]
  },
  [TechDomain.MANAGEMENT]: {
    icon: <i className="fas fa-users-gear text-orange-500"></i>,
    color: 'orange',
    description: 'Agile, Scrum, and Product Management leadership.',
    prerequisites: [TechDomain.SOFTWARE_DEV],
    related: [TechDomain.ENTERPRISE_ERP, TechDomain.CYBER_GOVERNANCE]
  }
};
