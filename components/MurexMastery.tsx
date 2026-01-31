
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

  const enterprisePortals = [
    { 
      name: "Murex Academy", 
      url: "https://training.murex.com", 
      desc: "Central platform for official L1-L3 certifications.", 
      icon: "fa-graduation-cap", 
      auth: "Customer/Partner Login",
      tags: ["Credentialed", "Certifications"]
    },
    { 
      name: "MX.3 Live Learning", 
      url: "https://livelearning.murex.com", 
      desc: "Interactive virtual classrooms and expert-led labs.", 
      icon: "fa-chalkboard-user", 
      auth: "Contract Entitlement",
      tags: ["Instructor-Led", "Live Labs"]
    },
    { 
      name: "Murex Client Portal", 
      url: "https://client.murex.com", 
      desc: "Technical documentation and official support nexus.", 
      icon: "fa-database", 
      auth: "Authenticated Users",
      tags: ["Docs", "PES Support"]
    },
    { 
      name: "Murex Official Site", 
      url: "https://www.murex.com", 
      desc: "Enterprise HQ for product roadmaps and industry news.", 
      icon: "fa-building-columns", 
      auth: "Public Access",
      tags: ["Corporate", "Roadmap"]
    }
  ];

  const industrialHighlights = [
    { title: "FX Ecosystem", desc: "Real-time Spot, Forward, and Swap capture and settlement flows.", icon: "fa-money-bill-transfer", color: "blue" },
    { title: "Derivatives Grid", desc: "Complex IRS/OIS pricing kernels and sensitivity (Greeks) calculations.", icon: "fa-chart-area", color: "indigo" },
    { title: "Risk Engine", desc: "Intraday Monte Carlo VaR and portfolio revaluation at high scale.", icon: "fa-shield-halved", color: "emerald" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-24 animate-in fade-in duration-700">
      {/* Hero Header */}
      <section className="bg-skyline-gradient rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-400/30 mb-6 inline-block">Industrial Authorization</span>
          <h1 className="text-6xl font-black mb-6 leading-tight">Murex (MX.3) <br/><span className="text-blue-400">Live Architecture Lab.</span></h1>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">
            Master the "One Brain, Many Organs" architecture. Explore the complete Front-to-Back-to-Risk lifecycle with our high-fidelity enterprise command center.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => { setShowSimulator(true); }}
              className="bg-white text-slate-900 font-black py-4 px-10 rounded-2xl text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/10"
            >
              Enter Live Command Center <i className="fas fa-terminal"></i>
            </button>
            <Link to="/murex-assessment" className="bg-blue-500 text-white font-black py-4 px-10 rounded-2xl text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-400 transition-all shadow-xl shadow-blue-600/20">
              Take Professional Exam <i className="fas fa-file-signature"></i>
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
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Industrial Command Center</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Authorized Session: MX_ENTERPRISE_LIVE</p>
                </div>
              </div>
              <button onClick={() => setShowSimulator(false)} className="text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors">
                Terminate Session <i className="fas fa-times"></i>
              </button>
            </div>
            <MX3Simulator />
          </section>
        )}
      </div>

      {/* Key Modules Highlights */}
      {!showSimulator && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {industrialHighlights.map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
              <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center text-2xl group-hover:bg-${item.color}-600 group-hover:text-white transition-all mb-8 shadow-inner`}>
                <i className={`fas ${item.icon}`}></i>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8">"{item.desc}"</p>
              <button onClick={() => setShowSimulator(true)} className={`text-[10px] font-black text-${item.color}-600 uppercase tracking-[0.2em] flex items-center gap-2 group-hover:translate-x-1 transition-transform`}>
                Explore Desk <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          ))}
        </section>
      )}

      {/* Enterprise Nexus Grid */}
      <section className="space-y-10">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl text-blue-600 shadow-sm border border-slate-100">
            <i className="fas fa-building-shield"></i>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Murex Enterprise Nexus</h2>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Official Credentialed Training & Product Access</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {enterprisePortals.map((portal, i) => (
            <a 
              key={i} 
              href={portal.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-500 transition-all group flex flex-col h-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all mb-6">
                <i className={`fas ${portal.icon}`}></i>
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{portal.name}</h3>
              <p className="text-slate-500 text-xs leading-relaxed flex-1 font-medium italic mb-6">"{portal.desc}"</p>
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <i className="fas fa-lock text-[10px] text-amber-500"></i>
                  <span className="text-[9px] font-black text-amber-700 uppercase">{portal.auth}</span>
                </div>
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                  Access Portal <i className="fas fa-arrow-up-right-from-square"></i>
                </div>
              </div>
            </a>
          ))}
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
