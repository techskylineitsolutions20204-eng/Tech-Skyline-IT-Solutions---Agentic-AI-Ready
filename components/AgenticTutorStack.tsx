
import React, { useState } from 'react';

const AgenticTutorStack: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'repo' | 'notebooks' | 'readme'>('blueprint');

  const notebooks = [
    { id: '01', title: "AI Data Science Tutor", desc: "Teaches + tests + explains Pandas, NumPy, ML algorithms, and Visualization.", url: "https://colab.research.google.com" },
    { id: '02', title: "ML Interview Trainer", desc: "Asks real interview questions like 'Explain bias vs variance' and evaluates student answers.", url: "https://colab.research.google.com" },
    { id: '03', title: "Coding Coach", desc: "Provides debugging support and logic hints (e.g., 'Check indentation and data types').", url: "https://colab.research.google.com" },
    { id: '04', title: "Assignment Evaluator", desc: "Auto-grading notebooks using NBGrader logic with scores, feedback, and plagiarism checks.", url: "https://colab.research.google.com" },
    { id: '05', title: "Personalized Learning Agent", desc: "Adaptive roadmap generator that adjusts curriculum based on user level (Beginner/Advanced).", url: "https://colab.research.google.com" }
  ];

  const agents = [
    { name: 'Teacher Agent', role: 'Explains concepts with examples', icon: 'fa-chalkboard-user', color: 'blue' },
    { name: 'Evaluator Agent', role: 'Grades answers and provides scores', icon: 'fa-check-double', color: 'emerald' },
    { name: 'Coach Agent', role: 'Gives hints without giving away answers', icon: 'fa-lightbulb', color: 'amber' },
    { name: 'Planner Agent', role: 'Creates and adapts the roadmap', icon: 'fa-route', color: 'purple' },
    { name: 'Memory Agent', role: 'Tracks progress and learner history', icon: 'fa-brain', color: 'rose' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Repository</span>
            <h1 className="text-sm font-mono text-slate-500">agentic-ai-tutor-free /</h1>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Agentic AI Tutor (Free Stack)</h2>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {['blueprint', 'repo', 'notebooks', 'readme'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize whitespace-nowrap ${
                activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab === 'repo' ? 'File Structure' : tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'blueprint' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
              <h3 className="text-2xl font-black mb-8">🧠 Multi-Agent Architecture</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agents.map(agent => (
                  <div key={agent.name} className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-all">
                    <div className={`w-12 h-12 rounded-2xl bg-${agent.color}-100 text-${agent.color}-600 flex items-center justify-center text-xl`}>
                      <i className={`fas ${agent.icon}`}></i>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 leading-none mb-1">{agent.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{agent.role}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-8 bg-blue-600 rounded-[2.5rem] text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="font-black text-xl mb-4">Final Architecture (Zero Cost)</h4>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase opacity-60 mb-1">UI</p>
                      <p className="font-bold">Streamlit</p>
                    </div>
                    <i className="fas fa-chevron-right opacity-30 hidden md:block"></i>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase opacity-60 mb-1">Framework</p>
                      <p className="font-bold">LangGraph</p>
                    </div>
                    <i className="fas fa-chevron-right opacity-30 hidden md:block"></i>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase opacity-60 mb-1">LLM</p>
                      <p className="font-bold">Gemini API</p>
                    </div>
                    <i className="fas fa-chevron-right opacity-30 hidden md:block"></i>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase opacity-60 mb-1">Vector DB</p>
                      <p className="font-bold">Chroma / FAISS</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 text-[10rem] opacity-5 rotate-12">
                  <i className="fas fa-diagram-project"></i>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-10 text-white">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <i className="fas fa-code text-blue-400"></i>
                🧩 Core Agent Code (FREE)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-xs font-mono text-slate-400"># agents/teacher_agent.py</p>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 font-mono text-xs text-blue-300">
                    <pre>{`from langchain.llms import Ollama
llm = Ollama(model="llama3")

def teacher_agent(topic):
    return llm(f"Teach {topic}...")`}</pre>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-mono text-slate-400"># agents/evaluator_agent.py</p>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 font-mono text-xs text-emerald-300">
                    <pre>{`def evaluator_agent(q, a):
    if len(a) < 20:
        return "Too short."
    return "Score: 8/10"`}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">🔹 FREE TECHNOLOGY STACK</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-2">LLM Layer</p>
                  <p className="text-sm font-bold text-slate-800">Ollama, Hugging Face, Gemini (Free)</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-2">Agent Brain</p>
                  <p className="text-sm font-bold text-slate-800">LangChain, LangGraph, CrewAI</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-2">Vector Memory</p>
                  <p className="text-sm font-bold text-slate-800">FAISS, Chroma</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-2">Interface</p>
                  <p className="text-sm font-bold text-slate-800">Streamlit, Gradio</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-2">Lab Sandbox</p>
                  <p className="text-sm font-bold text-slate-800">Google Colab, Kaggle</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Free Practice Datasets</h4>
              <div className="space-y-2">
                <a href="https://www.kaggle.com/datasets" target="_blank" className="flex items-center justify-between p-3 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition-all">
                  <span className="text-sm font-bold text-slate-700">Kaggle</span>
                  <i className="fas fa-external-link-alt text-[10px] text-slate-300"></i>
                </a>
                <a href="https://huggingface.co/datasets" target="_blank" className="flex items-center justify-between p-3 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition-all">
                  <span className="text-sm font-bold text-slate-700">Hugging Face</span>
                  <i className="fas fa-external-link-alt text-[10px] text-slate-300"></i>
                </a>
                <a href="https://archive.ics.uci.edu" target="_blank" className="flex items-center justify-between p-3 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition-all">
                  <span className="text-sm font-bold text-slate-700">UCI Machine Learning</span>
                  <i className="fas fa-external-link-alt text-[10px] text-slate-300"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'repo' && (
        <div className="bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden min-h-[600px] flex flex-col md:flex-row border border-white/5">
          <div className="w-full md:w-80 bg-slate-800/40 p-10 border-r border-white/5">
            <div className="flex items-center gap-2 mb-8 text-white/30">
              <i className="fas fa-folder-tree text-xs"></i>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Agentic-AI-Tutor-Free</span>
            </div>
            
            <div className="space-y-1 font-mono text-sm">
              <div className="flex items-center gap-2 text-white font-bold py-1">
                <i className="fas fa-folder text-blue-400"></i> notebooks/
              </div>
              <div className="pl-6 space-y-1 text-slate-400 text-xs">
                <div>01_data_science_tutor.ipynb</div>
                <div>02_ml_interview_trainer.ipynb</div>
                <div>03_coding_coach.ipynb</div>
                <div>04_assignment_evaluator.ipynb</div>
                <div>05_personalized_learning_agent.ipynb</div>
              </div>
              
              <div className="flex items-center gap-2 text-white font-bold py-1 mt-4">
                <i className="fas fa-folder text-blue-400"></i> agents/
              </div>
              <div className="pl-6 space-y-1 text-slate-400 text-xs">
                <div>teacher_agent.py</div>
                <div>evaluator_agent.py</div>
                <div>coach_agent.py</div>
                <div>planner_agent.py</div>
                <div>memory_agent.py</div>
              </div>

              <div className="flex items-center gap-2 text-white font-bold py-1 mt-4">
                <i className="fas fa-folder text-emerald-400"></i> rag/
              </div>
              <div className="pl-6 space-y-1 text-slate-400 text-xs">
                <div>ingest_docs.py</div>
                <div>vector_store.py</div>
                <div>retriever.py</div>
              </div>

              <div className="flex items-center gap-2 text-white font-bold py-1 mt-4">
                <i className="fas fa-folder text-purple-400"></i> ui/
              </div>
              <div className="pl-6 space-y-1 text-slate-400 text-xs">
                <div>streamlit_app.py</div>
                <div>gradio_app.py</div>
              </div>

              <div className="flex items-center gap-2 text-slate-300 py-1 mt-4">
                <i className="fas fa-file-code text-blue-400"></i> requirements.txt
              </div>
              <div className="flex items-center gap-2 text-slate-300 py-1">
                <i className="fas fa-file-lines text-slate-500"></i> README.md
              </div>
              <div className="flex items-center gap-2 text-slate-300 py-1">
                <i className="fas fa-scale-balanced text-slate-500"></i> LICENSE
              </div>
            </div>
          </div>

          <div className="flex-1 bg-slate-900 p-12 flex flex-col justify-center">
            <div className="max-w-2xl">
              <h3 className="text-3xl font-black text-white mb-6">📁 Production-Grade Repo</h3>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Clone this structure to deploy a multi-agent tutoring system. Organized into modular components for LLM reasoning, RAG memory, and adaptive learning logic.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <h4 className="text-blue-400 font-bold mb-2">Option 1: Google Colab</h4>
                  <p className="text-xs text-slate-400">Upload notebooks and run with zero setup. Ideal for quick experimentation.</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <h4 className="text-emerald-400 font-bold mb-2">Option 2: Local Dev</h4>
                  <p className="text-xs text-slate-400">Install via requirements.txt and run Streamlit UI for a full web application experience.</p>
                </div>
              </div>

              <button className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-10 rounded-2xl flex items-center gap-3 shadow-xl shadow-blue-500/20 transition-all">
                <i className="fab fa-github"></i>
                Deploy from GitHub
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notebooks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notebooks.map((nb) => (
            <div key={nb.id} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <i className="fas fa-book"></i>
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Notebook {nb.id}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">{nb.title}</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed flex-1">{nb.desc}</p>
              <a 
                href={nb.url} 
                target="_blank" 
                className="bg-slate-900 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 group-hover:bg-blue-600 transition-colors"
              >
                Launch in Colab
                <i className="fas fa-arrow-right text-[10px]"></i>
              </a>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'readme' && (
        <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm max-w-4xl mx-auto">
          <div className="prose prose-slate max-w-none">
            <h1 className="text-4xl font-black text-slate-900 mb-8"># Agentic AI Tutor (Free)</h1>
            <p className="text-lg text-slate-600 mb-8">Open-source multi-agent AI tutor for Data Science & ML. Built with a focus on affordability and workforce transformation.</p>
            
            <h2 className="text-2xl font-black text-slate-900 mb-4">## Key Features</h2>
            <ul className="space-y-4 mb-10">
              {[
                { title: 'Teacher + Evaluator Agents', desc: 'Specialized reasoning paths for concept explanation and grading.' },
                { title: 'Interview Trainer', desc: 'Mock interview cycles with real-time technical feedback.' },
                { title: 'Coding Coach', desc: 'Intelligent debugging hints using autonomous code analysis.' },
                { title: 'Auto-Grading', desc: 'Seamless evaluation of notebooks and project submissions.' },
                { title: 'Personalized Learning', desc: 'Dynamically adjusted roadmaps that grow with the learner.' }
              ].map((f, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] mt-1">
                    <i className="fas fa-check"></i>
                  </div>
                  <div>
                    <strong className="block text-slate-900">{f.title}</strong>
                    <span className="text-sm text-slate-500">{f.desc}</span>
                  </div>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-black text-slate-900 mb-4">## License</h2>
            <p className="text-slate-600 bg-slate-50 p-6 rounded-2xl border border-slate-100 font-mono text-sm">
              MIT License - Copyright (c) 2025 Tech Skyline IT Solutions
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgenticTutorStack;
