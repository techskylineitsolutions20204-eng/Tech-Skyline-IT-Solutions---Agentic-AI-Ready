
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MX3Simulator from './MX3Simulator';

const MurexMastery: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    specialization: 'Technical Consultant',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Agentic Murex Enrollment: ${formData.name}`;
    const body = `Full Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0ASpecialization: ${formData.specialization}`;
    window.location.href = `mailto:techskylineitsolutions20204@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const technicalPillars = [
    {
      title: "1. Installation & Setup",
      icon: "fa-server",
      color: "blue",
      desc: "Architectural deployment of MX.3 core binary files and services.",
      items: [
        "Deployment: Native SaaS, On-Prem (Bank DC), or Public Cloud (AWS/Azure).",
        "Isolation: Separate Dev, Testing (UAT), and Production environment sets.",
        "Tiering: 3-tier setup (App Server, Grid Nodes, DB Persistence).",
        "License Management: Node-locked or Cloud-based subscription licensing."
      ]
    },
    {
      title: "2. Connectivity to Market Data",
      icon: "fa-network-wired",
      color: "emerald",
      desc: "Real-time ingestion pipeline for high-frequency pricing and risk.",
      items: [
        "MDCS Layer: Dedicated Market Data Control System for real-time feeds.",
        "Ingestion: Continuous streaming from Bloomberg, Refinitiv, or Exchange APIs.",
        "Processing: Data ingested both on-prem and in cloud for unified pricing.",
        "Automation: Instant curve bootstrapping based on incoming market ticks."
      ]
    },
    {
      title: "3. Execution & Trading Flow",
      icon: "fa-bolt-lightning",
      color: "amber",
      desc: "End-to-end lifecycle orchestration from capture to settlement.",
      items: [
        "Trade Capture: Real-time deal capture from UI, FIX bridge, or FpML API.",
        "Instant Recalc: Pricing models and analytics re-evaluate on every trade/tick.",
        "Risk Monitoring: Continuous limit checks and intraday Greeks updates.",
        "Back-Office: Straight-through processing (STP) to settlement & SWIFT."
      ]
    }
  ];

  const saasEssentials = [
    { icon: "fa-microchip", label: "Core Platform Engine (MX.3 Architecture)" },
    { icon: "fa-chart-area", label: "Front-office Trading & Risk Modules" },
    { icon: "fa-receipt", label: "Back-office & Settlement Functions" },
    { icon: "fa-database", label: "Data Feeds & Real-time Analytics Integration" },
    { icon: "fa-network-wired", label: "Connectivity to Market Infrastructure" },
    { icon: "fa-headset", label: "Support & Maintenance Services" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-24 animate-in fade-in duration-700">
      {/* Hero Header */}
      <section className="bg-skyline-gradient rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-400/30 mb-6 inline-block">Enterprise Sandbox Access</span>
          <h1 className="text-6xl font-black mb-6 leading-tight">Murex (MX.3) <br/><span className="text-blue-400">Deep Technical Mastery.</span></h1>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed font-medium">
            Deploy, integrate, and master the world's leading capital markets engine. A production-ready environment for technical consultants and financial engineers.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => { setShowSimulator(true); }}
              className="bg-white text-slate-900 font-black py-4 px-10 rounded-2xl text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/10"
            >
              Initialize Command Center <i className="fas fa-terminal"></i>
            </button>
            <Link to="/murex-assessment" className="bg-blue-500 text-white font-black py-4 px-10 rounded-2xl text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-400 transition-all shadow-xl shadow-blue-600/20">
              Technical Assessment <i className="fas fa-file-signature"></i>
            </Link>
          </div>
        </div>
        <i className="fas fa-network-wired absolute -bottom-10 -right-10 text-[20rem] opacity-5"></i>
      </section>

      {/* Simulator Portal */}
      <div id="simulator-anchor">
        {showSimulator && (
          <section className="animate-in slide-in-from-bottom-12 duration-1000">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">SaaS Production Sandbox</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Authorized Session: PRD_CLOUD_LIVE</p>
                </div>
              </div>
              <button onClick={() => setShowSimulator(false)} className="text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors">
                Terminate Link <i className="fas fa-times"></i>
              </button>
            </div>
            <MX3Simulator />
          </section>
        )}
      </div>

      {/* Deep Technical Pillars */}
      <section className="space-y-12">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-8">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-2xl text-blue-400 shadow-xl border border-slate-800">
            <i className="fas fa-gears"></i>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Murex Technical Ecosystem</h2>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Core Industrial Working Model</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {technicalPillars.map((pillar, i) => (
            <div key={i} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl transition-all group border-b-4 border-b-transparent hover:border-b-blue-600">
              <div className={`w-16 h-16 rounded-2xl bg-${pillar.color}-50 text-${pillar.color}-600 flex items-center justify-center text-3xl mb-8 shadow-inner group-hover:scale-110 transition-transform`}>
                <i className={`fas ${pillar.icon}`}></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">{pillar.title}</h3>
              <p className="text-slate-500 text-sm mb-8 font-medium italic">"{pillar.desc}"</p>
              <ul className="space-y-4">
                {pillar.items.map((item, idx) => (
                  <li key={idx} className="flex gap-4 items-start group/li">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-600/20 group-hover/li:bg-blue-600 transition-colors shrink-0"></div>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* SaaS & Cloud Hosting Section */}
      <section className="bg-slate-950 rounded-[3.5rem] p-16 text-white relative overflow-hidden border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
          <i className="fas fa-cloud-bolt text-[20rem]"></i>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <div className="space-y-8">
            <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-block">Cloud Environments</span>
            <h2 className="text-5xl font-black leading-tight tracking-tight uppercase">Murex SaaS & <br/><span className="text-blue-500">Cloud Hosting.</span></h2>
            <p className="text-lg text-slate-400 leading-relaxed font-medium italic">
              Experience the unified core engine where real-time Front-Office pricing integrates seamlessly with Back-Office settlements and Cloud-native risk analytics.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <i className="fas fa-shield-halved text-blue-500 mb-4 text-2xl"></i>
                <h4 className="text-sm font-black uppercase mb-2">Secure SaaS</h4>
                <p className="text-xs text-slate-500 font-medium">Managed instances for Treasury and Risk Analytics.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <i className="fas fa-building-columns text-emerald-500 mb-4 text-2xl"></i>
                <h4 className="text-sm font-black uppercase mb-2">Global Access</h4>
                <p className="text-xs text-slate-500 font-medium">Direct connectivity to CCPs and Market Infra.</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-[3rem] p-10 border border-white/10 flex flex-col justify-center space-y-8">
            <h4 className="text-xl font-black uppercase tracking-tight text-blue-400">Platform Environment Essentials</h4>
            <div className="space-y-4">
              {saasEssentials.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-blue-500/50 transition-all cursor-default group">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <i className={`fas ${item.icon} text-sm`}></i>
                  </div>
                  <span className="text-sm font-black text-slate-300 uppercase tracking-widest">{item.label}</span>
                  <i className="fas fa-check text-emerald-500 ml-auto opacity-50"></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ENROLLMENT FORM */}
      <section id="enrollment" className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black uppercase mb-4 tracking-tight">Enterprise Pathway Enrollment</h2>
          <p className="text-slate-400 text-lg mb-12">Register for certified technical pathways and workforce mentorship.</p>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <input required type="text" placeholder="Full Name" className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="email" placeholder="Email Address" className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <select className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})}>
                <option className="bg-slate-900">Technical Consultant</option>
                <option className="bg-slate-900">Front Office Analyst</option>
                <option className="bg-slate-900">Risk Manager</option>
              </select>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all">Confirm Enrollment</button>
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
