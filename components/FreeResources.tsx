
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Resource {
  name: string;
  url: string;
  type: 'Learn' | 'Practice' | 'Sandbox' | 'Docs';
  isOfficial?: boolean;
}

interface ResourceCategory {
  title: string;
  icon: string;
  color: string;
  resources: Resource[];
}

const categories: ResourceCategory[] = [
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
    title: "Agent Frameworks",
    icon: "fa-network-wired",
    color: "indigo",
    resources: [
      { name: "LangChain Docs", url: "https://python.langchain.com", type: "Docs", isOfficial: true },
      { name: "LangGraph (Multi-Agent)", url: "https://github.com/langchain-ai/langgraph", type: "Practice" },
      { name: "CrewAI Framework", url: "https://github.com/joaomdmoura/crewAI", type: "Practice" },
      { name: "AutoGen (Microsoft)", url: "https://microsoft.github.io/autogen/", type: "Practice", isOfficial: true },
      { name: "Haystack RAG", url: "https://haystack.deepset.ai/", type: "Learn" }
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
      { name: "R Project Docs", url: "https://cran.r-project.org", type: "Docs" },
      { name: "Power BI Training", url: "https://learn.microsoft.com/power-bi/", type: "Learn", isOfficial: true }
    ]
  },
  {
    title: "ML & Deep Learning",
    icon: "fa-microchip",
    color: "cyan",
    resources: [
      { name: "TensorFlow Tutorials", url: "https://www.tensorflow.org/tutorials", type: "Learn", isOfficial: true },
      { name: "PyTorch Tutorials", url: "https://pytorch.org/tutorials", type: "Learn", isOfficial: true },
      { name: "Fast.ai Courses", url: "https://www.fast.ai/", type: "Learn" },
      { name: "CS50 AI (Harvard)", url: "https://cs50.harvard.edu/ai", type: "Learn" },
      { name: "Scikit-Learn Docs", url: "https://scikit-learn.org/", type: "Docs" }
    ]
  },
  {
    title: "Vector DBs & RAG",
    icon: "fa-database",
    color: "emerald",
    resources: [
      { name: "Chroma DB", url: "https://docs.trychroma.com", type: "Practice" },
      { name: "Qdrant Vector Search", url: "https://qdrant.tech", type: "Practice" },
      { name: "FAISS (Meta)", url: "https://github.com/facebookresearch/faiss", type: "Sandbox" },
      { name: "Weaviate Cloud (Free)", url: "https://weaviate.io/", type: "Sandbox" }
    ]
  },
  {
    title: "Coding Environments",
    icon: "fa-code",
    color: "slate",
    resources: [
      { name: "Google Colab (Free GPU)", url: "https://colab.research.google.com", type: "Sandbox", isOfficial: true },
      { name: "Kaggle Code", url: "https://www.kaggle.com/code", type: "Sandbox", isOfficial: true },
      { name: "Replit Workspace", url: "https://replit.com", type: "Sandbox" },
      { name: "VS Code (Offline)", url: "https://code.visualstudio.com/", type: "Sandbox" }
    ]
  },
  {
    title: "Cyber & Infrastructure",
    icon: "fa-shield-halved",
    color: "red",
    resources: [
      { name: "AWS Skill Builder", url: "https://skillbuilder.aws/", type: "Learn", isOfficial: true },
      { name: "Azure MS Learn", url: "https://learn.microsoft.com/", type: "Learn", isOfficial: true },
      { name: "OWASP Foundation", url: "https://owasp.org/", type: "Docs" },
      { name: "TryHackMe Free", url: "https://tryhackme.com/", type: "Practice" },
      { name: "Kubernetes Labs", url: "https://labs.play-with-k8s.com/", type: "Sandbox" }
    ]
  },
  {
    title: "UI & App Frameworks",
    icon: "fa-window-maximize",
    color: "amber",
    resources: [
      { name: "Streamlit (AI Dashboards)", url: "https://streamlit.io/", type: "Practice" },
      { name: "Gradio (Chat UI)", url: "https://gradio.app/", type: "Practice" },
      { name: "FastAPI Backend", url: "https://fastapi.tiangolo.com/", type: "Docs" },
      { name: "Flask Web Dev", url: "https://flask.palletsprojects.com/", type: "Docs" }
    ]
  },
  {
    title: "Enterprise Systems",
    icon: "fa-building",
    color: "orange",
    resources: [
      { name: "SAP Learning Hub", url: "https://learning.sap.com/", type: "Learn", isOfficial: true },
      { name: "Oracle Learning", url: "https://education.oracle.com/", type: "Learn", isOfficial: true },
      { name: "UiPath Community", url: "https://www.uipath.com/developers/", type: "Sandbox" },
      { name: "Open edX (LMS)", url: "https://openedx.org/", type: "Practice" }
    ]
  }
];

const FreeResources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.map(cat => ({
    ...cat,
    resources: cat.resources.filter(res => 
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cat.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.resources.length > 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Free Resource Hub</h1>
          <p className="text-slate-500">Curated directory of the world's best zero-cost technical learning and practice tools.</p>
        </div>
        <div className="relative w-full md:w-96">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true"></i>
          <input 
            type="text" 
            placeholder="Search LLMs, Frameworks, DBs..." 
            aria-label="Search resources"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
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
            
            <div className="p-4 flex-1 space-y-1.5 overflow-y-auto max-h-[350px] custom-scrollbar">
              {cat.resources.map((res, rIdx) => (
                <a 
                  key={rIdx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group/item"
                  aria-label={`Open ${res.name} ${res.type}`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-2 group-hover/item:text-blue-600 transition-colors">
                      {res.name}
                      {res.isOfficial && (
                        <i className="fas fa-circle-check text-blue-500 text-[10px]" title="Official/Partner Resource" aria-hidden="true"></i>
                      )}
                    </span>
                    <span className={`text-[9px] uppercase font-black tracking-widest ${
                      res.type === 'Sandbox' ? 'text-emerald-500' : 
                      res.type === 'Learn' ? 'text-blue-500' : 'text-slate-400'
                    }`}>
                      {res.type}
                    </span>
                  </div>
                  <i className="fas fa-arrow-up-right-from-square text-slate-200 group-hover/item:text-blue-400 transition-colors text-xs"></i>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-skyline-gradient rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center gap-8 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none"></div>
        <div className="flex-1 relative z-10">
          <h3 className="text-2xl font-black mb-3">Build an Agentic AI Tutor</h3>
          <p className="text-slate-400 leading-relaxed max-w-xl">
            Use the stack above (LangGraph + Gemini + Chroma + Streamlit) to build an autonomous tutor that adapts to learner mistakes in real-time. Start with Google Colab for zero-cost GPU labs.
          </p>
        </div>
        <Link to="/tutor-stack" className="bg-white text-slate-900 hover:bg-blue-50 font-black py-4 px-10 rounded-2xl shadow-xl transition-all relative z-10 whitespace-nowrap">
          View Demo Architecture
        </Link>
      </div>
    </div>
  );
};

export default FreeResources;
