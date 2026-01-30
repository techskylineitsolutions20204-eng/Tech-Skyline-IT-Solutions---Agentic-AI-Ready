
import React from 'react';
import { TechDomain } from './types';

export const DOMAIN_INFO = {
  [TechDomain.AGENTIC_AI]: {
    icon: <i className="fas fa-robot text-blue-500"></i>,
    color: 'blue',
    description: 'Master autonomous AI agents and generative architectures.'
  },
  [TechDomain.CLOUD_DEVOPS]: {
    icon: <i className="fas fa-cloud text-cyan-500"></i>,
    color: 'cyan',
    description: 'AWS, Azure, Kubernetes, and modern SRE practices.'
  },
  [TechDomain.CYBER_GOVERNANCE]: {
    icon: <i className="fas fa-shield-halved text-red-500"></i>,
    color: 'red',
    description: 'Cloud security, SOC, IAM, and compliance frameworks.'
  },
  [TechDomain.ENTERPRISE_ERP]: {
    icon: <i className="fas fa-building text-indigo-500"></i>,
    color: 'indigo',
    description: 'SAP IBP, Oracle Primavera, and Murex systems.'
  },
  [TechDomain.SOFTWARE_DEV]: {
    icon: <i className="fas fa-code text-green-500"></i>,
    color: 'green',
    description: 'Full stack, Python, and iOS development mastery.'
  },
  [TechDomain.DATA_ANALYTICS]: {
    icon: <i className="fas fa-chart-line text-purple-500"></i>,
    color: 'purple',
    description: 'Data Science, Power BI, and advanced reporting.'
  },
  [TechDomain.MANAGEMENT]: {
    icon: <i className="fas fa-users-gear text-orange-500"></i>,
    color: 'orange',
    description: 'Agile, Scrum, and Product Management leadership.'
  }
};
