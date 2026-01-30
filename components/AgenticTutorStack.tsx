
import React, { useState } from 'react';

const AgenticTutorStack: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'repo' | 'notebooks'>('blueprint');

  const notebooks = [
    { title: "AI Data Science Tutor", desc: "Teaches + tests + explains (Pandas, NumPy, ML)", url: "https://colab.research.google.com" },
    { title: "ML Interview Trainer", desc: "Asks real interview questions + evaluative feedback", url: "https://colab.research.google.com" },
    { title: "Coding Coach", desc: "Debugging support + logic hints for Python", url: "https://colab.research.google.com" },
    { title: "Assignment Evaluator", desc: "Auto-grading notebooks with NBGrader logic", url: "https://colab.research.google.com" },
    { title: "Personalized Learning Agent", desc: "Adaptive roadmap generator based on level", url: "https://colab.research.google.com" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Agentic AI Tutor Blueprint</h1>
          <p className="text-slate-500">A 100% Free Stack Architecture for Autonomous Technical Learning.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          {['blueprint', 'repo', 'notebooks'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${
                activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'blueprint' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <h3 className="text-2xl font-black mb-8 relative">Zero-Cost Multi-Agent Flow</h3>
              
              <div className="flex flex-col items-center gap-6 relative">
                {/* Visual Architecture Flow */}
                <div className="w-full grid grid-cols-1 md:grid-cols-5 items-center gap-4 text-center">
                  <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl">
                    <i className="fas fa-window-maximize mb-2 block text-blue-400"></i>
                    <span className="text-xs font-bold">UI (Streamlit)</span>
                  </div>
                  <div className="hidden md:block text-slate-300"><i className="fas fa-arrow-right"></i></div>
                  <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl">
                    <i className="fas fa-network-wired mb-2 block"></i>
                    <span className="text-xs font-bold">LangGraph</span>
                  </div>
                  <div className="hidden md:block text-slate-300"><i className="fas fa-arrow-right"></i></div>
                  <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl">
                    <i className="fas fa-robot mb-2 block text-blue-400"></i>
                    <span className="text-xs font-bold">Gemini API</span>
                  </div>
                </div>

                <div className="w-1 h-12 bg-slate-100"></div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  {[
                    { name: 'Teacher', role: 'Explains', icon: 'fa-chalkboard-user', color: 'blue' },
                    { name: 'Evaluator', role: 'Grades', icon: 'fa-check-double', color: 'emerald' },
                    { name: 'Coach', role: 'Hints', icon: 'fa-lightbulb', color: 'amber' },
                    { name: 'Planner', role: 'Roadmap', icon: 'fa-route', color: 'purple' }
                  ].map(agent => (
                    <div key={agent.name} className={`p-6 rounded-[2rem] border-2 border-${agent.color}-100 bg-${agent.color}-50 flex flex-col items-center text-center group hover:bg-${agent.color}-100 transition-colors`}>
                      <i className={`fas ${agent.icon} text-2xl text-${agent.color}-600 mb-3`}></i>
                      <h4 className="font-black text-slate-900 text-sm">{agent.name}</h4>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{agent.role}</p>
                    </div>
                  ))}
                </div>

                <div className="w-1 h-12 bg-slate-100"></div>

                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200 w-full flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                      <i className="fas fa-database"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Vector Memory</h4>
                      <p className="text-xs text-slate-500">Chroma / FAISS Knowledge Base</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                      <i className="fas fa-flask-vial"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Practice Labs</h4>
                      <p className="text-xs text-slate-500">Google Colab / Kaggle</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-10 text-white">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <i className="fas fa-code text-blue-400"></i>
                Core Logic Implementation
              </h3>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <p className="text-blue-400 text-xs font-mono mb-2"># agents/teacher_agent.py</p>
                  <pre className="text-sm font-mono text-slate-300 overflow-x-auto">
{`from langchain.llms import Ollama
llm = Ollama(model="llama3")

def teacher_agent(topic):
    return llm(f"Teach {topic} with examples and exercises")`}
                  </pre>
                </div>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <p className="text-emerald-400 text-xs font-mono mb-2"># agents/evaluator_agent.py</p>
                  <pre className="text-sm font-mono text-slate-300 overflow-x-auto">
{`def evaluator_agent(question, answer):
    if len(answer) < 20:
        return "Answer is too short. Try again."
    return "Good explanation. Score: 8/10"`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Free Tech Stack</h4>
              <div className="space-y-4">
                {[
                  { label: 'LLM', value: 'Gemini / LLaMA / Ollama' },
                  { label: 'Agents', value: 'LangGraph / CrewAI' },
                  { label: 'Vector DB', value: 'Chroma / FAISS' },
                  { label: 'UI', value: 'Streamlit / Gradio' },
                  { label: 'Labs', value: 'Google Colab / Kaggle' }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                    <span className="text-sm font-bold text-slate-600">{item.label}</span>
                    <span className="text-sm font-black text-blue-600">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-skyline-gradient rounded-3xl p-8 text-white shadow-xl">
              <h4 className="font-black text-lg mb-4">Practice Datasets</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Kaggle Datasets', url: 'https://www.kaggle.com/datasets' },
                  { name: 'Hugging Face Hub', url: 'https://huggingface.co/datasets' },
                  { name: 'UCI Repository', url: 'https://archive.ics.uci.edu' }
                ].map((link, idx) => (
                  <li key={idx}>
                    <a href={link.url} target="_blank" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                      <span className="text-sm font-bold">{link.name}</span>
                      <i className="fas fa-external-link-alt text-[10px] text-blue-400"></i>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'repo' && (
        <div className="bg-slate-900 rounded-[3rem] p-1 shadow-2xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">
          {/* File Tree Sidebar */}
          <div className="w-full md:w-80 bg-slate-800/50 p-8 border-r border-white/5">
            <div className="flex items-center gap-2 mb-8 text-white/50">
              <i className="fas fa-folder-open text-xs"></i>
              <span className="text-xs font-black uppercase tracking-widest">Explorer</span>
            </div>
            
            <div className="space-y-1 text-slate-400 font-mono text-sm">
              <div className="flex items-center gap-2 text-white font-bold py-1">
                <i className="fas fa-chevron-down text-[10px]"></i>
                <i className="fas fa-folder text-blue-400"></i>
                agentic-ai-tutor-free
              </div>
              <div className="pl-6 space-y-1">
                <div className="flex items-center gap-2 py-1"><i className="fas fa-folder text-amber-400"></i> notebooks/</div>
                <div className="pl-6 py-0.5 opacity-60">01_data_science_tutor.ipynb</div>
                <div className="pl-6 py-0.5 opacity-60">02_ml_interview_trainer.ipynb</div>
                <div className="flex items-center gap-2 py-1"><i className="fas fa-folder text-blue-400"></i> agents/</div>
                <div className="pl-6 py-0.5 opacity-60">teacher_agent.py</div>
                <div className="pl-6 py-0.5 opacity-60">evaluator_agent.py</div>
                <div className="flex items-center gap-2 py-1"><i className="fas fa-folder text-emerald-400"></i> rag/</div>
                <div className="pl-6 py-0.5 opacity-60">vector_store.py</div>
                <div className="flex items-center gap-2 py-1"><i className="fas fa-folder text-purple-400"></i> ui/</div>
                <div className="pl-6 py-0.5 opacity-60">streamlit_app.py</div>
                <div className="flex items-center gap-2 py-1"><i className="fas fa-file-lines text-slate-500"></i> requirements.txt</div>
                <div className="flex items-center gap-2 py-1"><i className="fas fa-file-code text-blue-500"></i> README.md</div>
              </div>
            </div>
          </div>

          {/* Code Viewer Area */}
          <div className="flex-1 bg-slate-900 p-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black text-white mb-4">Production-Grade Structure</h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                We've modularized the tutor into specialized agents, RAG components, and clean UI logic. This structure is ready to be cloned into your local dev environment or Google Drive.
              </p>
              
              <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                <h4 className="text-blue-400 font-bold mb-4">Deployment Instructions</h4>
                <div className="space-y-4 font-mono text-sm text-slate-300">
                  <div className="flex gap-4">
                    <span className="text-white/20">01</span>
                    <span>pip install -r requirements.txt</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-white/20">02</span>
                    <span># Configure Gemini API Key</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-white/20">03</span>
                    <span>streamlit run ui/streamlit_app.py</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl flex items-center gap-3 transition-all">
                  <i className="fab fa-github"></i>
                  Clone Repository
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white font-black py-4 px-8 rounded-2xl border border-white/20 transition-all">
                  Download ZIP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notebooks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notebooks.map((nb, idx) => (
            <div key={idx} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <i className="fas fa-book"></i>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">{nb.title}</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed flex-1">{nb.desc}</p>
              <a 
                href={nb.url} 
                target="_blank" 
                className="bg-slate-900 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 group-hover:bg-blue-600 transition-colors"
              >
                Launch in Colab
                <i className="fas fa-external-link-alt text-[10px]"></i>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgenticTutorStack;
