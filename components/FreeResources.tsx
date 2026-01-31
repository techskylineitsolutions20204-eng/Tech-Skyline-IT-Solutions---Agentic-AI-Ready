
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Resource {
  name: string;
  url: string;
  type: 'Learn' | 'Practice' | 'Sandbox' | 'Docs' | 'Portal';
  isOfficial?: boolean;
  murexArea?: string;
  authRequired?: string;
}

interface ResourceCategory {
  title: string;
  icon: string;
  color: string;
  description?: string;
  resources: Resource[];
}

const categories: ResourceCategory[] = [
  {
    title: "Official Murex Enterprise",
    icon: "fa-building-shield",
    color: "blue",
    description: "Authenticated enterprise gateways for official Murex University certifications and live learning.",
    resources: [
      { name: "Murex Academy", url: "https://training.murex.com/", type: "Portal", isOfficial: true, murexArea: "L1-L3 Learning", authRequired: "Customer/Partner Login" },
      { name: "MX.3 Live Learning", url: "https://livelearning.murex.com/", type: "Portal", isOfficial: true, murexArea: "Virtual Classroom", authRequired: "Contract Entitlement" },
      { name: "Murex Client Portal", url: "https://client.murex.com/", type: "Portal", isOfficial: true, murexArea: "Tech Docs", authRequired: "Company SSO" },
      { name: "Murex Official Home", url: "https://www.murex.com/", type: "Docs", isOfficial: true, murexArea: "Corporate Site", authRequired: "Public Access" }
    ]
  },
  {
    title: "Broader EdTech Landscape",
    icon: "fa-network-wired",
    color: "indigo",
    description: "Leading educational platforms for technical mastery, financial engineering, and career acceleration.",
    resources: [
      { name: "CFI (Trade Lifecycle)", url: "https://corporatefinanceinstitute.com/", type: "Learn", murexArea: "Finance Domain" },
      { name: "Coursera (Fintech)", url: "https://www.coursera.org/", type: "Learn", murexArea: "Certifications" },
      { name: "LinkedIn Learning", url: "https://www.linkedin.com/learning/", type: "Learn", murexArea: "Workforce Prep" },
      { name: "Cloud Academy", url: "https://cloudacademy.com/", type: "Practice", murexArea: "SRE & Cloud" },
      { name: "Udacity (AI & Data)", url: "https://www.udacity.com/", type: "Learn", murexArea: "Agentic AI" }
    ]
  },
  {
    title: "Murex Practice Stack (Open)",
    icon: "fa-building-columns",
    color: "amber",
    description: "Replicate Murex logic using open-source tools. Focus on IR/FX lifecycle and technical performance.",
    resources: [
      { name: "QuantLib (Pricing)", url: "https://www.quantlib.org/", type: "Practice", isOfficial: true, murexArea: "FO Pricing" },
      { name: "OpenGamma (Risk)", url: "https://opengamma.com", type: "Practice", murexArea: "MO Risk" },
      { name: "SQLite (Repo)", url: "https://www.sqlite.org/", type: "Sandbox", murexArea: "SQL/Database" },
      { name: "Ubuntu (Unix)", url: "https://ubuntu.com/", type: "Sandbox", murexArea: "Unix Shell" },
      { name: "Apache Airflow", url: "https://airflow.apache.org/", type: "Practice", murexArea: "EOD Batch" },
      { name: "SWIFT Standards", url: "https://www.swift.com/", type: "Docs", murexArea: "Back Office" }
    ]
  }
];

const FreeResources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.map(cat => ({
    ...cat,
    resources: cat.resources.filter(res => 
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.murexArea?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.resources.length > 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Resource Hub</h1>
          <p className="text-slate-500 font-medium text-lg">Direct links to official enterprise portals and the broader edtech ecosystem.</p>
        </div>
        <div className="relative w-full md:w-96">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search Academy, Live Learning, EdTech..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 shadow-sm outline-none text-sm font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCategories.map((cat, idx) => (
          <div key={idx} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
            <div className={`p-6 bg-${cat.color}-600 text-white flex items-center gap-4`}>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl shadow-inner">
                <i className={`fas ${cat.icon}`}></i>
              </div>
              <h2 className="text-xl font-bold tracking-tight">{cat.title}</h2>
            </div>
            
            <div className="p-4 flex-1 space-y-1.5 overflow-y-auto max-h-[550px] custom-scrollbar">
              {cat.resources.map((res, rIdx) => (
                <a 
                  key={rIdx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group/item"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-2 group-hover/item:text-blue-600 transition-colors">
                      {res.name}
                      {res.isOfficial && <i className="fas fa-circle-check text-blue-500 text-[10px]"></i>}
                    </span>
                    <i className="fas fa-arrow-up-right-from-square text-slate-200 group-hover/item:text-blue-400 transition-colors text-xs"></i>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`text-[9px] uppercase font-black tracking-widest ${
                      res.type === 'Portal' ? 'text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded' : 'text-slate-400'
                    }`}>
                      {res.type}
                    </span>
                    {res.murexArea && (
                      <span className="text-[8px] bg-slate-100 text-slate-600 font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                        {res.murexArea}
                      </span>
                    )}
                  </div>
                  {res.authRequired && (
                    <div className="mt-2 flex items-center gap-1.5">
                       <i className="fas fa-lock text-[8px] text-amber-500"></i>
                       <span className="text-[8px] font-bold text-amber-600 uppercase tracking-widest">{res.authRequired}</span>
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreeResources;
