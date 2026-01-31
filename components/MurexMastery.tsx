
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

  const enterprisePortals = [
    { 
      name: "Murex Academy", 
      url: "https://training.murex.com", 
      desc: "The central Murex University platform for e-learning, structured courses, and certification paths.", 
      icon: "fa-graduation-cap", 
      auth: "Customer/Partner Login",
      tags: ["Credentialed", "L1-L3 Certs"]
    },
    { 
      name: "MX.3 Live Learning", 
      url: "https://livelearning.murex.com", 
      desc: "Real-time virtual classrooms and interactive training sessions led by Murex experts.", 
      icon: "fa-chalkboard-user", 
      auth: "Contract Entitlement",
      tags: ["Instructor-Led", "Live Labs"]
    },
    { 
      name: "Murex Client Portal", 
      url: "https://client.murex.com", 
      desc: "Technical documentation repository, PES notifications, and official support nexus.", 
      icon: "fa-database", 
      auth: "Authenticated Users",
      tags: ["Documentation", "PES"]
    },
    { 
      name: "Murex Official Site", 
      url: "https://www.murex.com", 
      desc: "Corporate headquarters for product roadmaps, industry insights, and career opportunities.", 
      icon: "fa-building-columns", 
      auth: "Public Access",
      tags: ["Corporate", "Roadmap"]
    }
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
            Industrial-grade conceptual functional simulator and direct gateway to the official Murex University ecosystem.
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
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Workforce Simulator</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Authorized: Conceptual Engine Online</p>
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

      {/* Official Enterprise Learning Nexus (Requested) */}
      <section className="space-y-10">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl text-blue-600 shadow-sm border border-slate-100">
            <i className="fas fa-shield-halved"></i>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Murex University Nexus</h2>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Credentialed Platforms & Direct Enterprise Access</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {enterprisePortals.map((portal, i) => (
            <a 
              key={i} 
              href={portal.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-600 transition-all group flex flex-col h-full relative"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <i className={`fas ${portal.icon}`}></i>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[7px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-widest border border-blue-100 mb-1">Direct Link</span>
                  <span className="text-[6px] font-black text-slate-400 uppercase tracking-tighter">OFFICIAL_HOST</span>
                </div>
              </div>
              <h3 className="text-2xl font-black mb-3 text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{portal.name}</h3>
              <p className="text-slate-500 text-xs leading-relaxed flex-1 font-medium mb-6 italic">"{portal.desc}"</p>
              
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex flex-wrap gap-2">
                  {portal.tags.map(tag => (
                    <span key={tag} className="text-[8px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-lg uppercase">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <i className="fas fa-lock-open text-[10px] text-amber-500"></i>
                  <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest leading-none">{portal.auth}</span>
                </div>
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  Access Portal <i className="fas fa-arrow-up-right-from-square"></i>
                </div>
              </div>
            </a>
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
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Industrial Curriculum</h2>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">7 Comprehensive Modules Mapping to Murex Academy Standards</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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

          <div className="lg:col-span-8">
            {activeModule ? (
              <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm min-h-[500px] animate-in slide-in-from-right-8 duration-500">
                {curriculumModules.filter(m => m.id === activeModule).map(mod => (
                  <div key={mod.id} className="space-y-8">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Syllabus Details</span>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">{mod.title}</h3>
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
                      <button onClick={() => handleLaunchPractice(mod.id)} className="flex-1 bg-indigo-600 text-white font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                        <i className="fas fa-play"></i> Launch Practice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center text-slate-400 h-full min-h-[500px]">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-3xl">
                  <i className="fas fa-layer-group text-slate-200"></i>
                </div>
                <h3 className="text-xl font-black text-slate-600 mb-2 uppercase tracking-tight">Curriculum View</h3>
                <p className="max-w-xs text-sm font-medium leading-relaxed">Select a module to view technical objectives and launch simulations.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ENROLLMENT FORM */}
      <section id="enrollment" className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black uppercase mb-4 tracking-tight">Murex Workforce Enrollment</h2>
          <p className="text-slate-400 text-lg mb-12">Register for certified technical pathways and sandbox keys.</p>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <input required type="text" placeholder="Full Name" className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="email" placeholder="Email Address" className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input required type="text" placeholder="College/Organization" className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold" value={formData.college} onChange={e => setFormData({...formData, college: e.target.value})} />
              <select className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})}>
                <option className="bg-slate-900">Front Office Specialist</option>
                <option className="bg-slate-900">Market Risk Analyst</option>
                <option className="bg-slate-900">Technical Consultant</option>
              </select>
              <button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 py-5 rounded-2xl font-black uppercase tracking-widest">Confirm Enrollment</button>
            </form>
          ) : (
            <div className="py-12 animate-in zoom-in">
              <i className="fas fa-circle-check text-blue-500 text-6xl mb-6"></i>
              <h3 className="text-3xl font-black mb-4">Request Prepared</h3>
              <p className="text-slate-400 mb-8">Send the generated email to techskylineitsolutions20204@gmail.com for keys.</p>
              <button onClick={() => setSubmitted(false)} className="bg-white/10 px-8 py-3 rounded-xl text-[10px] font-black uppercase">Another Request</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MurexMastery;
