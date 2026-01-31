
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MX3Simulator from './MX3Simulator';

const MurexMastery: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    year: 'Final Year',
    specialization: 'Front Office Analyst',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [activeModule, setActiveModule] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Agentic Murex Enrollment: ${formData.name} (${formData.college})`;
    const body = `Full Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0ACollege: ${formData.college}%0D%0AYear: ${formData.year}%0D%0ASpecialization: ${formData.specialization}%0D%0ABackground: ${formData.message}`;
    window.location.href = `mailto:techskylineitsolutions20204@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const trainingVideos = [
    { title: "Murex Technical Foundation (Part 1)", url: "https://www.youtube.com/watch?v=LQc12ogVrK4&list=PLwTD3wzcIspYD78Se3CZAp6_CgbRm-pYg" },
    { title: "Murex Interface & Navigation (Part 3)", url: "https://www.youtube.com/watch?v=UiY2mjpiPAk&list=PLwTD3wzcIspYD78Se3CZAp6_CgbRm-pYg&index=3" },
    { title: "Trade Lifecycle & Booking (Part 5)", url: "https://www.youtube.com/watch?v=Q08PffTNvMU&list=PLwTD3wzcIspYD78Se3CZAp6_CgbRm-pYg&index=5" },
    { title: "Market Data & Curves (Part 9)", url: "https://www.youtube.com/watch?v=FVDuZgds490&list=PLwTD3wzcIspYD78Se3CZAp6_CgbRm-pYg&index=9" },
    { title: "Risk Management & Greeks (Part 10)", url: "https://www.youtube.com/watch?v=Qfnko2S-29s&list=PLwTD3wzcIspYD78Se3CZAp6_CgbRm-pYg&index=10" },
    { title: "Back Office Operations (Part 37)", url: "https://www.youtube.com/watch?v=eT_hCGBUqoE&list=PLwTD3wzcIspYD78Se3CZAp6_CgbRm-pYg&index=37" },
    { title: "Accounting & General Ledger (Part 40)", url: "https://www.youtube.com/watch?v=UaV-2KFD2ks&list=PLwTD3wzcIspYD78Se3CZAp6_CgbRm-pYg&index=40" },
    { title: "EOD Batch Processing (Part 45)", url: "https://www.youtube.com/watch?v=DwZcYwURKS8&list=PLwTD3wzcIspYD78Se3CZAp6_CgbRm-pYg&index=45" }
  ];

  const curriculumModules = [
    {
      id: 1,
      title: "Introduction to Murex",
      icon: "fa-earth-americas",
      color: "blue",
      topics: [
        "Overview of Murex Platform and Architecture",
        "Role of Murex in Capital Markets",
        "Key Modules: Front Office, Risk, Back Office",
        "Product Types and Asset Classes Supported"
      ]
    },
    {
      id: 2,
      title: "Murex Front Office (FO)",
      icon: "fa-landmark",
      color: "indigo",
      topics: [
        "Trade Capture & Deal Input",
        "Instrument Configuration (IR, FX, EQ, Credit)",
        "Market Data Management (Curves, Volatility, Spreads)",
        "Pricing Engines and Simulation"
      ]
    },
    {
      id: 3,
      title: "Risk Management in Murex",
      icon: "fa-chart-area",
      color: "rose",
      topics: [
        "Market Risk and Credit Risk Setup",
        "Value-at-Risk (VaR), Greeks & Sensitivity Analysis",
        "P&L Analysis and Stress Testing",
        "Risk Reports and Audit Controls"
      ]
    },
    {
      id: 4,
      title: "Murex Back Office Operations (BO)",
      icon: "fa-receipt",
      color: "emerald",
      topics: [
        "Trade Lifecycle Management",
        "Settlements, Confirmations & Payments",
        "Static Data: Counterparties, Calendars, Legal Entities",
        "Accounting, General Ledger, and Reporting"
      ]
    },
    {
      id: 5,
      title: "Collateral & Treasury Management",
      icon: "fa-sack-dollar",
      color: "amber",
      topics: [
        "Collateral Optimization and Margining",
        "Liquidity Management",
        "Repo, Securities Lending & Borrowing",
        "Cash Flow Projections"
      ]
    },
    {
      id: 6,
      title: "Murex Technical Track",
      icon: "fa-laptop-code",
      color: "purple",
      topics: [
        "MxML Exchange (Workflows, Templates, Parsing Rules)",
        "Datamart Configuration and Report Building",
        "Integration (SWIFT, Calypso, Reuters, Bloomberg)",
        "Database Schema & Data Extraction (Oracle/SQL)",
        "Batch Scheduling and Job Monitoring"
      ]
    },
    {
      id: 7,
      title: "Regulatory & Compliance Features",
      icon: "fa-clipboard-check",
      color: "slate",
      topics: [
        "EMIR, MiFID II, Dodd-Frank Reporting Capabilities",
        "Regulatory Data Mapping and Submission Workflows",
        "Audit Trails, Logging, and Access Control"
      ]
    }
  ];

  const handleLaunchPractice = (moduleId: number) => {
    setActiveModule(moduleId);
    setShowSimulator(true);
    // Smooth scroll to simulator
    setTimeout(() => {
      document.getElementById('simulator-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-24 animate-in fade-in duration-700">
      {/* Hero Header */}
      <section className="bg-skyline-gradient rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-400/30 mb-6 inline-block">Murex Mastery Authorization</span>
          <h1 className="text-6xl font-black mb-6 leading-tight">Murex (MX.3) <br/><span className="text-blue-400">Complete Full Access.</span></h1>
          <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
            Industrial-grade conceptual functional simulator designed for Front-to-Back mastery. Access granted to all 7 core pillars, algorithm prep, and SQL performance tuning.
          </p>
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => { setActiveModule(null); setShowSimulator(true); }}
              className="bg-white text-slate-900 font-black py-4 px-10 rounded-2xl text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/10"
            >
              Enterprise Sandbox <i className="fas fa-terminal"></i>
            </button>
            <Link to="/murex-assessment" className="bg-blue-500 text-white font-black py-4 px-10 rounded-2xl text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-400 transition-all shadow-xl shadow-blue-600/20">
              Technical Assessment <i className="fas fa-file-signature"></i>
            </Link>
          </div>
        </div>
        <i className="fas fa-building-columns absolute -bottom-10 -right-10 text-[20rem] opacity-5"></i>
      </section>

      {/* Simulator Section */}
      <div id="simulator-anchor">
        {showSimulator && (
          <section className="animate-in slide-in-from-bottom-12 duration-1000">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">High-Fidelity Workforce Sandbox</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Authorized: Full System Concept Access Enabled</p>
                </div>
              </div>
              <button onClick={() => setShowSimulator(false)} className="text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors">
                Terminate Session <i className="fas fa-times"></i>
              </button>
            </div>
            <MX3Simulator initialModule={activeModule || undefined} />
          </section>
        )}
      </div>

      {/* Career Readiness / Tech Mastery Access */}
      <section className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">
            <i className="fas fa-unlock-keyhole"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Tech Mastery Authorized</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Directly practice complex logic required for MX.3 consulting roles. Master dynamic programming for pricing, query optimization for trade extraction, and OOP patterns for robust financial kernels.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => { setActiveModule(6); setShowSimulator(true); }}
              className="inline-flex items-center gap-3 text-blue-600 font-black uppercase tracking-widest text-xs hover:gap-4 transition-all"
            >
              Start Tech Practice <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          {[
            { title: "Algorithm Prep", desc: "DP & Greedy logic.", id: 6 },
            { title: "SQL Mastery", desc: "MX data optimization.", id: 6 },
            { title: "OOP Design", desc: "Scalable patterns.", id: 2 },
            { title: "AI Grading", desc: "Mentor AI Feedback.", id: 0 }
          ].map((item, i) => (
            <div 
              key={i} 
              onClick={() => handleLaunchPractice(item.id)}
              className="bg-slate-50 p-6 rounded-3xl border border-slate-100 cursor-pointer hover:border-blue-500 transition-all group"
            >
              <h4 className="text-[10px] font-black text-blue-600 uppercase mb-2 group-hover:text-blue-500">{item.title}</h4>
              <p className="text-xs text-slate-400 font-bold">{item.desc}</p>
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <span className="text-[8px] font-black text-blue-600 uppercase">Launch</span>
                <i className="fas fa-play text-[6px] text-blue-600"></i>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum Breakdown */}
      <section className="space-y-12">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-xl text-indigo-600 shadow-sm border border-indigo-100">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Murex Training Curriculum</h2>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">7 Modules covering Functional & Technical Streams</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Module Selectors */}
          <div className="lg:col-span-4 space-y-3">
            {curriculumModules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id === activeModule ? null : mod.id)}
                className={`w-full text-left p-6 rounded-3xl border-2 transition-all group relative overflow-hidden ${
                  activeModule === mod.id 
                    ? 'border-indigo-600 bg-indigo-50 shadow-xl shadow-indigo-500/10' 
                    : 'border-slate-100 bg-white hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-all ${
                    activeModule === mod.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                  }`}>
                    <i className={`fas ${mod.icon}`}></i>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Module {mod.id}</span>
                    <h4 className={`text-sm font-black transition-colors ${activeModule === mod.id ? 'text-indigo-900' : 'text-slate-700'}`}>{mod.title}</h4>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Module Details Display */}
          <div className="lg:col-span-8">
            {activeModule ? (
              <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm min-h-[500px] animate-in slide-in-from-right-8 duration-500">
                {curriculumModules.filter(m => m.id === activeModule).map(mod => (
                  <div key={mod.id} className="space-y-8">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">In-Depth Syllabus</span>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">{mod.title}</h3>
                      </div>
                      <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-4xl text-slate-200">
                        <i className={`fas ${mod.icon}`}></i>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {mod.topics.map((topic, i) => (
                        <div key={i} className="flex items-center gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors group">
                          <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            {i + 1}
                          </div>
                          <p className="text-sm font-bold text-slate-700 leading-relaxed">{topic}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-8 flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={() => handleLaunchPractice(mod.id)}
                        className="flex-1 bg-indigo-600 text-white font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                      >
                        <i className="fas fa-play"></i> Launch Practice Session
                      </button>
                      <Link 
                        to="/murex-assessment"
                        className="flex-1 bg-white border-2 border-slate-100 text-slate-900 font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 text-center transition-all flex items-center justify-center gap-3"
                      >
                        <i className="fas fa-file-signature"></i> Take Module Quiz
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center text-slate-400 h-full min-h-[500px]">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-3xl">
                  <i className="fas fa-layer-group text-slate-200"></i>
                </div>
                <h3 className="text-xl font-black text-slate-600 mb-2 uppercase tracking-tight">Industrial Selection</h3>
                <p className="max-w-xs text-sm font-medium leading-relaxed">Choose a curriculum module to view detailed topics and launch relevant authorized practice sessions.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Video Training Library */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-xl text-rose-600 shadow-sm border border-rose-100">
            <i className="fab fa-youtube"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Technical Video Training</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainingVideos.map((video, idx) => (
            <a 
              key={idx} 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-rose-200 transition-all flex flex-col"
            >
              <div className="aspect-video bg-slate-100 rounded-2xl mb-4 overflow-hidden relative flex items-center justify-center">
                <i className="fab fa-youtube text-4xl text-slate-300 group-hover:text-rose-600 transition-colors"></i>
              </div>
              <h3 className="text-sm font-black text-slate-800 leading-tight flex-1 group-hover:text-rose-600 transition-colors">{video.title}</h3>
              <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Free Course Access</span>
                <i className="fas fa-arrow-right-long -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"></i>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Industrial Framework Visualization */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl text-blue-600 shadow-sm border border-slate-100">
            <i className="fas fa-arrows-spin"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Industrial Practice Framework</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black mb-4 uppercase tracking-tight text-blue-600">Conceptual Learning Path</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">
              Real Murex projects prioritize architectural flow over screen-familiarity. Our simulator mirrors these core industrial workflows, preparing you for high-stakes enterprise projects.
            </p>
            <div className="space-y-3">
              <a href="https://corporatefinanceinstitute.com/resources/derivatives/trade-life-cycle/" target="_blank" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 border border-slate-100 transition-all group">
                <span className="text-xs font-black text-slate-700 uppercase">Mastering Trade Lifecycle</span>
                <i className="fas fa-chevron-right text-slate-300 group-hover:text-blue-500 transition-colors"></i>
              </a>
              <a href="https://www.wallstreetmojo.com/front-office-middle-office-back-office/" target="_blank" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 border border-slate-100 transition-all group">
                <span className="text-xs font-black text-slate-700 uppercase">FO/MO/BO Logic Flows</span>
                <i className="fas fa-chevron-right text-slate-300 group-hover:text-blue-500 transition-colors"></i>
              </a>
            </div>
          </div>
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
            <h3 className="text-lg font-black mb-6 uppercase tracking-tight text-blue-400">Interactive Career Tracks</h3>
            <div className="relative space-y-6">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-blue-500/20"></div>
              {[
                { step: "FO", label: "Analyst Practice", desc: "Learn trade capture and revaluation concept." },
                { step: "MO", label: "Risk Practice", desc: "Analyze DV01 and portfolio sensitivities." },
                { step: "BO", label: "Ops Practice", desc: "Master settlement rules and SWIFT triggers." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start relative">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black z-10 shrink-0">{item.step}</div>
                  <div>
                    <h4 className="text-sm font-black mb-1">{item.label}</h4>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ENROLLMENT FORM */}
      <section id="enrollment" className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-black tracking-tight uppercase">Murex Workforce Enrollment</h2>
            <p className="text-slate-400 text-lg font-medium">Join the next cohort of certified Murex specialists. Built for students & professionals.</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Email Address</label>
                <input 
                  required
                  type="email" 
                  placeholder="your@email.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">College/Organization</label>
                <input 
                  required
                  type="text" 
                  placeholder="Institution Name" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                  value={formData.college}
                  onChange={(e) => setFormData({...formData, college: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Practice Intensity</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                >
                  <option className="bg-slate-900">Standard Pathway</option>
                  <option className="bg-slate-900">Intensive Bootcamp</option>
                  <option className="bg-slate-900">Enterprise Training</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Target Murex Role</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-blue-400"
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                >
                  <option className="bg-slate-900">Front Office Specialist</option>
                  <option className="bg-slate-900">Market Risk Analyst</option>
                  <option className="bg-slate-900">Ops & Settlements Expert</option>
                  <option className="bg-slate-900">Technical Murex Consultant</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3 group"
              >
                Confirm Enrollment <i className="fas fa-paper-plane group-hover:translate-x-1 transition-transform"></i>
              </button>
            </form>
          ) : (
            <div className="py-24 text-center space-y-8 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center text-4xl mx-auto border border-blue-500/30">
                <i className="fas fa-check"></i>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black">Authorized Success</h3>
                <p className="text-slate-400 max-w-md mx-auto font-medium">Your request for certified training has been prepared. Please send the generated email to <span className="text-blue-400">techskylineitsolutions20204@gmail.com</span> to receive your practice keys.</p>
              </div>
              <button onClick={() => setSubmitted(false)} className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Submit Another Request</button>
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none"></div>
      </section>
    </div>
  );
};

export default MurexMastery;
