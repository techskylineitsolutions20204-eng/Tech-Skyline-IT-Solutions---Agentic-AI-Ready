
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Resource {
  name: string;
  url: string;
  type: 'Learn' | 'Practice' | 'Sandbox' | 'Docs';
  isOfficial?: boolean;
  murexArea?: string;
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
    title: "Murex Practice Stack (Open)",
    icon: "fa-building-columns",
    color: "amber",
    description: "Replicate Murex MX.3 logic using zero-cost enterprise tools. Focus on IR/FX lifecycle, Risk logic, and Unix/SQL mastery.",
    resources: [
      { name: "QuantLib (Pricing & Curves)", url: "https://www.quantlib.org/", type: "Practice", isOfficial: true, murexArea: "FO Pricing" },
      { name: "OpenGamma (Risk Framework)", url: "https://opengamma.com", type: "Practice", isOfficial: true, murexArea: "MO Risk" },
      { name: "FRED Data (Yield Curves)", url: "https://fred.stlouisfed.org/", type: "Sandbox", murexArea: "Market Data" },
      { name: "SQLite (Trade Repository)", url: "https://www.sqlite.org/", type: "Sandbox", murexArea: "SQL/Database" },
      { name: "Ubuntu (Unix Context)", url: "https://ubuntu.com/", type: "Sandbox", isOfficial: true, murexArea: "Unix Shell" },
      { name: "Yahoo Finance (FX/IR Feed)", url: "https://finance.yahoo.com/", type: "Sandbox", murexArea: "Market Data" },
      { name: "Apache Airflow (Batch Jobs)", url: "https://airflow.apache.org/", type: "Practice", murexArea: "EOD Batch" },
      { name: "NumPy/SciPy (VaR & Greeks)", url: "https://numpy.org/", type: "Learn", murexArea: "Risk Engine" },
      { name: "Pandas (PnL Reporting)", url: "https://pandas.pydata.org/", type: "Practice", murexArea: "Middle Office" },
      { name: "SWIFT Standards (Settlement)", url: "https://www.swift.com/", type: "Docs", murexArea: "Back Office" },
      { name: "grep/awk/sed (Log Analysis)", url: "https://www.gnu.org/software/grep/", type: "Learn", murexArea: "MX Support" },
      { name: "Trade Lifecycle Explained", url: "https://corporatefinanceinstitute.com/resources/derivatives/trade-life-cycle/", type: "Docs", murexArea: "Conceptual" }
    ]
  },
  {
    title: "Agentic AI & LLMs",
    icon: "fa-brain",
    color: "blue",
    resources: [
      { name: "Google AI Studio (Gemini)", url: "https://ai.google.dev", type: "Sandbox", isOfficial: true },
      { name: "Hugging Face Models", url: "https://huggingface.co/models", type: "Practice" },
      { name: "Ollama (Local LLMs)", url: "https://ollama.com", type: "Sandbox" },
      { name: "LangChain Academy", url: "https://github.com/langchain-ai/langchain-academy", type: "Learn" },
      { name: "OpenAI Cookbook", url: "https://github.com/openai/openai-cookbook", type: "Learn" },
      { name: "Hugging Face Learn", url: "https://huggingface.co/learn", type: "Learn" }
    ]
  },
  {
    title: "Data Science & BI",
    icon: "fa-chart-pie",
    color: "purple",
    resources: [
      { name: "Python Official", url: "https://www.python.org", type: "Docs", isOfficial: true },
      { name: "Kaggle Learn", url: "https://www.kaggle.com/learn", type: "Learn", isOfficial: true },
      { name: "Kaggle Datasets", url: "https://www.kaggle.com/datasets", type: "Practice" },
      { name: "Power BI Training", url: "https://learn.microsoft.com/power-bi/", type: "Learn", isOfficial: true }
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 uppercase tracking-tighter">Resource Hub</h1>
          <p className="text-slate-500 font-medium">Curated zero-cost technical mastery stack for industry specialists.</p>
        </div>
        <div className="relative w-full md:w-96">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true"></i>
          <input 
            type="text" 
            placeholder="Search Murex, LLMs, SQL Areas..." 
            aria-label="Search resources"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-sm font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCategories.map((cat, idx) => (
          <div key={idx} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <div className={`p-6 bg-${cat.color}-500 text-white flex items-center gap-4`}>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl shadow-inner">
                <i className={`fas ${cat.icon}`} aria-hidden="true"></i>
              </div>
              <h2 className="text-xl font-bold tracking-tight">{cat.title}</h2>
            </div>
            
            <div className="p-4 flex-1 space-y-1.5 overflow-y-auto max-h-[450px] custom-scrollbar">
              {cat.resources.map((res, rIdx) => (
                <a 
                  key={rIdx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group/item"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-2 group-hover/item:text-blue-600 transition-colors">
                      {res.name}
                      {res.isOfficial && (
                        <i className="fas fa-circle-check text-blue-500 text-[10px]" title="Official/Partner Resource"></i>
                      )}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] uppercase font-black tracking-widest ${
                        res.type === 'Sandbox' ? 'text-emerald-500' : 
                        res.type === 'Learn' ? 'text-blue-500' : 'text-slate-400'
                      }`}>
                        {res.type}
                      </span>
                      {res.murexArea && (
                        <span className="text-[8px] bg-amber-100 text-amber-700 font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                          {res.murexArea}
                        </span>
                      )}
                    </div>
                  </div>
                  <i className="fas fa-arrow-up-right-from-square text-slate-200 group-hover/item:text-blue-400 transition-colors text-xs"></i>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-skyline-gradient rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center gap-8 border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none"></div>
        <div className="flex-1 relative z-10">
          <h3 className="text-2xl font-black mb-3">Master Murex (MX.3) Concepts</h3>
          <p className="text-slate-400 leading-relaxed max-w-2xl font-medium">
            Murex consultants are trained on front-to-back architecture. Master the logic of Trade Lifecycle, Market Data Ingestion, Risk Sensitivity (DV01), and Batch Orchestration using our open stack simulation.
            <br/><br/>
            Real industry value lies in the data flow, not just the vendor screens.
          </p>
        </div>
        <Link to="/labs" className="bg-blue-600 text-white hover:bg-blue-700 font-black py-4 px-10 rounded-2xl shadow-xl transition-all relative z-10 whitespace-nowrap">
          Launch Sandbox
        </Link>
      </div>
    </div>
  );
};

export default FreeResources;
