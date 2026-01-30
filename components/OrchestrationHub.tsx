
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
  },
  {
    sectionTitle: "RPA Fundamentals & Scaling",
    sectionDesc: "Traditional automation meeting the cognitive capabilities of modern AI.",
    colorTheme: "emerald",
    items: [
      { title: "What is RPA", description: "Software robots that mimic human interactions with digital systems", icon: "fa-window-restore", tag: "Basics" },
      { title: "AI and RPA", description: "Blend intelligent AI capabilities with traditional RPA automation", icon: "fa-handshake", tag: "Hybrid" },
      { title: "What is citizen development", description: "No-code tools that let business users create their own automations", icon: "fa-users-gear", tag: "No-Code" },
      { title: "What is process mining", description: "Find hidden problems by watching how work actually gets done", icon: "fa-magnifying-glass-chart", tag: "Analysis" },
      { title: "No-code automation", description: "Drag-and-drop automation builder requiring zero programming skills", icon: "fa-wand-magic-sparkles", tag: "Accessibility" },
      { title: "Business process automation", description: "Transform entire workflows from start to finish", icon: "fa-briefcase", tag: "Business" },
      { title: "Process orchestration", description: "Coordinate complex business processes across enterprise systems", icon: "fa-arrows-split-up-and-left", tag: "Advanced" }
    ]
  },
  {
    sectionTitle: "Agentic Testing & QA",
    sectionDesc: "Autonomous test agents that generate, execute, and adapt QA strategies.",
    colorTheme: "rose",
    items: [
      { title: "Agentic testing", description: "Autonomous test agents that generate, execute, and adapt QA strategies", icon: "fa-vial-circle-check", tag: "Testing" },
      { title: "Software testing", description: "Traditional QA automation enhanced with AI-powered capabilities", icon: "fa-code-compare", tag: "QA" },
      { title: "Test automation", description: "Scripted test execution for regression and functional testing", icon: "fa-terminal", tag: "Standard" }
    ]
  },
  {
    sectionTitle: "Ways to Automate",
    sectionDesc: "Step-by-step frameworks and specialized ecosystem integrations.",
    colorTheme: "indigo",
    items: [
      { title: "SAP automation", description: "Automate SAP workflows without changing core system configuration", icon: "fa-server", tag: "ERP" },
      { title: "Web automation", description: "Control browsers, fill forms, and extract web data automatically", icon: "fa-globe", tag: "Web" },
      { title: "Desktop automation", description: "Automate Windows, Mac, and Linux desktop application interactions", icon: "fa-desktop", tag: "OS" },
      { title: "Email automation", description: "Auto-sort, process, and respond to emails using AI understanding", icon: "fa-envelope-open-text", tag: "Communication" },
      { title: "API automation", description: "Integrate systems by automating REST, SOAP, and GraphQL API calls", icon: "fa-link", tag: "Dev" },
      { title: "UI automation", description: "Interact with any app interface using clicks, keystrokes, and OCR", icon: "fa-mouse-pointer", tag: "UI" },
      { title: "Document automation", description: "Process invoices, contracts, and forms with structured automation", icon: "fa-file-lines", tag: "Docs" },
      { title: "Excel automation", description: "Automate Excel formulas, macros, and data manipulation tasks", icon: "fa-file-excel", tag: "Office" }
    ]
  }
];

const OrchestrationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agentpath' | 'concepts'>('agentpath');
  const [searchTerm, setSearchTerm] = useState("");

  const renderAgentPath = () => (
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24">
      {/* Hero AgentPath */}
      <section className="bg-skyline-gradient rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-400/30 shadow-lg shadow-blue-600/20">AgentPath</span>
          </div>
          <h1 className="text-6xl font-black mb-6 leading-tight">The developer’s path to <br/><span className="text-blue-400">agentic automation</span></h1>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
            Build your next agentic automation project with the Tech Skyline Platform™. Move from simple scripts to autonomous digital workers that see, think, and act.
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

      {/* Featured Agent Suite */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Specialized Agent Suite</h2>
          <p className="text-slate-500">Autonomous capabilities tailored for the enterprise lifecycle.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              title: "Agent Builder", 
              desc: "Build, test, and launch agents from within the familiar Studio environment. Use prebuilt agents from the Catalog.", 
              icon: "fa-hammer", 
              color: "blue",
              detail: "Discover Agent Builder"
            },
            { 
              title: "Skyline Maestro", 
              desc: "Agentic orchestration to manage Skyline Agents, third-party agents, robots, and people across complex workflows.", 
              icon: "fa-wand-sparkles", 
              color: "indigo",
              detail: "Try Maestro"
            },
            { 
              title: "Healing Agent", 
              desc: "Ensure your automations remain resilient despite application changes. Includes intelligent self-healing and fixing.", 
              icon: "fa-heart-pulse", 
              color: "rose",
              detail: "Enable Self-Healing"
            },
            { 
              title: "Autopilot™", 
              desc: "AI-powered experiences across the platform, tailored for developers, analysts, testers, or business users.", 
              icon: "fa-plane-up", 
              color: "cyan",
              detail: "Discover Autopilot"
            }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
              <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                <i className={`fas ${item.icon}`}></i>
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-900">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-6">{item.desc}</p>
              <button className={`text-xs font-black text-${item.color}-600 uppercase tracking-widest flex items-center gap-2 group/btn`}>
                {item.detail} <i className="fas fa-arrow-right-long transition-transform group-hover/btn:translate-x-1"></i>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Learning & Tutorials Row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900">Developer Tutorials</h2>
            <button className="text-xs font-black text-blue-600 uppercase tracking-widest">View Catalog</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "First AI Agent from Scratch", mentor: "Nisarg Kadam", role: "Skyline MVP 2025", type: "Watch Tutorial" },
              { title: "Browse Agent Catalog", mentor: "Marketplace Team", role: "Official Templates", type: "Get Catalog" },
              { title: "Set up Autopilot for Everyone", mentor: "Lahiru Fernando", role: "Skyline MVP 2025", type: "Watch Tutorial" },
              { title: "Try Autopilot Automations", mentor: "Community Experts", role: "Role-Tailored", type: "Get Collection" }
            ].map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4 hover:border-blue-200 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <i className="fas fa-video"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-900 text-sm leading-tight mb-1">{t.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.mentor} • {t.role}</p>
                </div>
                <i className="fas fa-chevron-right text-slate-200"></i>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-4 block">Academy Hub</span>
            <h3 className="text-2xl font-black mb-4">Enroll in the agentic discovery framework</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Learn to apply our framework to uncover opportunities for agentic automation in your organization. Master fundamentals of autonomous system design.
            </p>
          </div>
          <button className="mt-8 bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all">
            Enroll Now
          </button>
        </div>
      </section>

      {/* Community Section */}
      <section className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { title: "Skyline Community", desc: "Connect with experts and peers on the latest trends.", icon: "fa-users", action: "Join Community" },
          { title: "Skyline Forum", desc: "Get support from peers and learn about latest releases.", icon: "fa-comments", action: "Sign up" },
          { title: "Community Newsletter", desc: "Latest on automation development to your inbox.", icon: "fa-envelope-open-text", action: "Subscribe" },
          { title: "Skyline Documentation", desc: "Explore guides to support your journey.", icon: "fa-book", action: "Search Docs" }
        ].map((c, i) => (
          <div key={i} className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center">
              <i className={`fas ${c.icon}`}></i>
            </div>
            <h4 className="font-black text-slate-900">{c.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{c.desc}</p>
            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 group">
              {c.action} <i className="fas fa-arrow-right-long transition-transform group-hover:translate-x-1"></i>
            </button>
          </div>
        ))}
      </section>

      {/* Insider CTA */}
      <section className="text-center bg-blue-600 rounded-[3rem] p-16 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
          <i className="fas fa-bolt text-[15rem]"></i>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-black">Be the first to try our new agentic capabilities</h2>
          <p className="text-lg text-blue-100 max-w-xl mx-auto opacity-80 font-medium">
            Become a Skyline Insider to participate in the new previews of our agentic orchestration platform.
          </p>
          <button className="bg-slate-900 text-white font-black py-5 px-14 rounded-2xl shadow-xl hover:bg-slate-800 transition-all text-lg">
            Become an Insider
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
