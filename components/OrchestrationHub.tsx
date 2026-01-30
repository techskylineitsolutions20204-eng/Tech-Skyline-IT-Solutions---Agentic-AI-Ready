
import React, { useState } from 'react';

interface CardItem {
  title: string;
  description: string;
  icon: string;
  tag?: string;
  link?: string;
}

interface HubCategory {
  sectionTitle: string;
  sectionDesc: string;
  items: CardItem[];
  colorTheme: string;
}

const orchestrationData: HubCategory[] = [
  {
    sectionTitle: "AI Orchestration & Agentic Automation",
    sectionDesc: "Connect AI models, agents, and workflows to unlock enterprise-scale impact.",
    colorTheme: "blue",
    items: [
      { title: "AI agents", description: "Digital workers that can see, think, and act autonomously to complete tasks", icon: "fa-robot", tag: "Agentic AI" },
      { title: "AI automation", description: "Automation enhanced with AI for cognitive tasks and decision making", icon: "fa-brain-circuit", tag: "Innovation" },
      { title: "Agentic AI", description: "AI that acts independently to pursue your goals and adapt to changing conditions", icon: "fa-microchip", tag: "Next-Gen" },
      { title: "Agentic automation", description: "Autonomous agents that reason, plan, and execute complex end-to-end processes", icon: "fa-network-wired", tag: "Core" },
      { title: "Enterprise AI", description: "Enterprise-grade AI deployment with governance and security controls", icon: "fa-building-shield", tag: "Enterprise" },
      { title: "Generative AI", description: "Create content, images, code, and more using large language models", icon: "fa-sparkles", tag: "Generative" },
      { title: "Intelligent automation", description: "RPA enhanced with smart AI features like ML, NLP, OCR, and computer vision", icon: "fa-gears", tag: "Integration" },
      { title: "Specialized AI", description: "Domain-specific AI models trained for industry use cases", icon: "fa-industry", tag: "Verticals" },
      { title: "AI Assistant", description: "Conversational AI assistants understand natural language requests", icon: "fa-comments", tag: "User Interaction" },
      { title: "Agentic workflows", description: "Multi-agent systems that coordinate tasks across business processes", icon: "fa-diagram-project", tag: "Workflow" },
      { title: "Agentic orchestration", description: "Manage distributed AI agents, robots, and people in unified workflows", icon: "fa-sitemap", tag: "Management" },
      { title: "Intelligent document processing", description: "Extract data from unstructured docs using OCR, NLP, and ML models", icon: "fa-file-invoice", tag: "IDP" }
    ]
  }
];

const OrchestrationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agentpath' | 'concepts'>('agentpath');
  const [searchTerm, setSearchTerm] = useState("");

  const renderAgentPath = () => (
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Hero AgentPath */}
      <section className="bg-skyline-gradient rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-400/30 shadow-lg shadow-blue-600/20">AgentPath</span>
          </div>
          <h1 className="text-6xl font-black mb-6 leading-tight">The developer’s path to <br/><span className="text-blue-400">agentic automation</span></h1>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
            Build your next agentic automation project with the Tech Skyline Platform™. Move from simple scripts to autonomous digital workers.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-slate-900 font-black py-4 px-10 rounded-2xl shadow-xl hover:bg-slate-100 transition-all flex items-center gap-2">
              Try Skyline Maestro <i className="fas fa-play text-[10px]"></i>
            </button>
            <button className="bg-white/10 text-white font-black py-4 px-10 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
              Catch up on Devcon
            </button>
          </div>
        </div>
      </section>

      {/* Core Agents Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Agent Builder", desc: "Build, test, and launch agents within a familiar environment.", icon: "fa-hammer", color: "blue" },
          { title: "Skyline Maestro", desc: "Orchestrate third-party agents and robots across complex workflows.", icon: "fa-wand-sparkles", color: "indigo" },
          { title: "Healing Agent", desc: "Ensure resilient automations with intelligent self-healing UI capabilities.", icon: "fa-heart-pulse", color: "rose" },
          { title: "Autopilot™", desc: "AI-powered experiences tailored for developers and analysts.", icon: "fa-plane-up", color: "cyan" }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
              <i className={`fas ${item.icon}`}></i>
            </div>
            <h3 className="text-xl font-black mb-3 text-slate-900">{item.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Featured Tutorial Section */}
      <section className="bg-slate-50 rounded-[4rem] p-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center border border-slate-200">
        <div className="space-y-8">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">How to build your first AI agent from scratch</h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            Discover a step-by-step tutorial on building your first autonomous agent. Learn about context grounding, multi-agent coordination, and deployment governance.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                <img src="https://picsum.photos/48/48?seed=nisarg" alt="Mentor" />
              </div>
              <div>
                <p className="font-black text-slate-900 leading-none">Nisarg Kadam</p>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Skyline MVP 2025</p>
              </div>
              <button className="ml-auto bg-slate-900 text-white text-[10px] font-black py-2 px-4 rounded-xl uppercase tracking-widest hover:bg-blue-600 transition-all">
                Watch Tutorial
              </button>
            </div>
          </div>
        </div>
        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-video bg-slate-900 group">
          <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800" alt="Tutorial Preview" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl shadow-2xl shadow-blue-500/50 group-hover:scale-110 transition-transform cursor-pointer">
              <i className="fas fa-play ml-1"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Events & Learning */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <i className="fas fa-calendar-star text-blue-600"></i>
            Agentic Community Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Skyline DevCon", desc: "Signature AI and automation event with 30+ technical sessions.", icon: "fa-terminal", badge: "Watch Replay" },
              { title: "Community Days", desc: "In-person workshops in your city. Hands-on agentic practice.", icon: "fa-users", badge: "Explore Events" },
              { title: "Dev Dives", desc: "Monthly webinars led by product managers and evangelists.", icon: "fa-video", badge: "Join Live" },
              { title: "Discovery Framework", desc: "Fundamentals of uncovering opportunities for agentic AI.", icon: "fa-microscope", badge: "Enroll Now" }
            ].map((ev, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-all">
                <i className={`fas ${ev.icon} text-blue-600 text-xl mb-6`}></i>
                <h3 className="text-lg font-black mb-2 text-slate-900">{ev.title}</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">{ev.desc}</p>
                <button className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 group">
                  {ev.badge} <i className="fas fa-arrow-right-long transition-transform group-hover:translate-x-1"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-3xl font-black text-slate-900">Knowledge Hub</h2>
          <div className="bg-slate-900 rounded-[3rem] p-8 text-white space-y-8">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Recent Deep Dives</p>
              <div className="space-y-6">
                {[
                  "AI agent development made simple",
                  "UI vs LLM-based automation",
                  "Context Grounding in Healthcare",
                  "Getting started with Agentic AI"
                ].map((blog, i) => (
                  <div key={i} className="group cursor-pointer">
                    <p className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors leading-snug">{blog}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">
                      READ BLOG <i className="fas fa-arrow-right text-[8px]"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 items-center justify-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                <i className="fab fa-discord text-xl text-indigo-400"></i>
                <span className="text-[10px] font-black uppercase">Discord</span>
              </div>
              <div className="flex flex-col gap-1 items-center justify-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                <i className="fas fa-comments text-xl text-emerald-400"></i>
                <span className="text-[10px] font-black uppercase">Forum</span>
              </div>
              <div className="flex flex-col gap-1 items-center justify-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                <i className="fas fa-book text-xl text-blue-400"></i>
                <span className="text-[10px] font-black uppercase">Docs</span>
              </div>
              <div className="flex flex-col gap-1 items-center justify-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                <i className="fas fa-newspaper text-xl text-amber-400"></i>
                <span className="text-[10px] font-black uppercase">News</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center bg-blue-600 rounded-[4rem] p-20 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="relative z-10 space-y-8">
          <h2 className="text-5xl font-black max-w-2xl mx-auto">Be the first to try our new agentic capabilities</h2>
          <p className="text-xl text-blue-100 max-w-xl mx-auto opacity-80">
            Become a Skyline Insider to participate in the new previews of our agentic orchestration platform.
          </p>
          <button className="bg-slate-900 text-white font-black py-5 px-14 rounded-3xl shadow-2xl hover:bg-slate-800 transition-all text-xl">
            Join Insider Program
          </button>
        </div>
      </section>
    </div>
  );

  const renderConcepts = () => (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {orchestrationData.map((category, catIdx) => {
        const filteredItems = category.items.filter(item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tag?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredItems.length === 0) return null;

        return (
          <div key={catIdx} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                  <span className={`w-3 h-8 bg-${category.colorTheme}-600 rounded-full`}></span>
                  {category.sectionTitle}
                </h2>
                <p className="text-slate-500 mt-2">{category.sectionDesc}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, itemIdx) => (
                <div 
                  key={itemIdx} 
                  className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-100 transition-all group cursor-default flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-${category.colorTheme}-50 text-${category.colorTheme}-600 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform`}>
                      <i className={`fas ${item.icon}`}></i>
                    </div>
                    {item.tag && (
                      <span className={`text-[10px] font-black uppercase tracking-widest bg-${category.colorTheme}-50 text-${category.colorTheme}-700 px-3 py-1 rounded-full border border-${category.colorTheme}-100`}>
                        {item.tag}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1">
                    {item.description}
                  </p>
                  
                  <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-blue-500 transition-colors">
                    <span>EXPLORE ARCHITECTURE</span>
                    <i className="fas fa-arrow-right-long opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Automation Hub</h1>
          <p className="text-slate-500 font-medium">Orchestrate the future of cognitive workflows.</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-3xl shadow-inner border border-slate-100">
          <button 
            onClick={() => setActiveTab('agentpath')}
            className={`px-10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'agentpath' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            AgentPath
          </button>
          <button 
            onClick={() => setActiveTab('concepts')}
            className={`px-10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'concepts' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            Concepts
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search hub..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-3xl border border-slate-200 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all outline-none text-sm font-bold bg-white"
          />
        </div>
      </div>

      {/* Dynamic Content */}
      {activeTab === 'agentpath' ? renderAgentPath() : renderConcepts()}
    </div>
  );
};

export default OrchestrationHub;
