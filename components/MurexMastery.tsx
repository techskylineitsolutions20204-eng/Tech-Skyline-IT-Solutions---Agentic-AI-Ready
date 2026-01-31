
import React, { useState } from 'react';
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

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-24 animate-in fade-in duration-700">
      {/* Hero Header */}
      <section className="bg-skyline-gradient rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-400/30 mb-6 inline-block">Murex Technical Column</span>
          <h1 className="text-6xl font-black mb-6 leading-tight">Master Murex (MX.3) <br/><span className="text-blue-400">From Your Browser.</span></h1>
          <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
            Murex consultants are trained on internal systems. We provide a 100% conceptual functional clone for students to master Trade Lifecycle, Risk, and Operations.
          </p>
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => setShowSimulator(true)}
              className="bg-white text-slate-900 font-black py-4 px-10 rounded-2xl text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/10"
            >
              Launch MX.3 Simulator <i className="fas fa-terminal"></i>
            </button>
            <a href="https://www.youtube.com/@murexgroup" target="_blank" className="bg-rose-600 text-white font-black py-4 px-10 rounded-2xl text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20">
              Architecture Demos <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
        <i className="fas fa-building-columns absolute -bottom-10 -right-10 text-[20rem] opacity-5"></i>
      </section>

      {/* Interactive Simulator Section */}
      {showSimulator && (
        <section className="animate-in slide-in-from-bottom-12 duration-1000">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Functional Sandbox (V-MX3)</h2>
            <button onClick={() => setShowSimulator(false)} className="text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors">
              Close Simulator <i className="fas fa-times"></i>
            </button>
          </div>
          <MX3Simulator />
        </section>
      )}

      {/* Video Training Library */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-xl text-rose-600 shadow-sm border border-rose-100">
            <i className="fab fa-youtube"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Murex Technical Video Training</h2>
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
                <div className="absolute inset-0 bg-rose-600/0 group-hover:bg-rose-600/5 transition-all"></div>
              </div>
              <h3 className="text-sm font-black text-slate-800 leading-tight flex-1 group-hover:text-rose-600 transition-colors">{video.title}</h3>
              <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Free Course</span>
                <i className="fas fa-arrow-right-long -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"></i>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 1. Trade Lifecycle Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl text-blue-600 shadow-sm border border-slate-100">
            <i className="fas fa-arrows-spin"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Trade Lifecycle & Operations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black mb-4 uppercase tracking-tight text-blue-600">Lifecycle Masterclass</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">
              Understand how a trade flows from a Trader's terminal to the General Ledger. This is the most critical conceptual hurdle for any Murex role.
            </p>
            <div className="space-y-3">
              <a href="https://corporatefinanceinstitute.com/resources/derivatives/trade-life-cycle/" target="_blank" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 border border-slate-100 transition-all group">
                <span className="text-xs font-black text-slate-700 uppercase">CFI Lifecycle Guide</span>
                <i className="fas fa-chevron-right text-slate-300 group-hover:text-blue-500 transition-colors"></i>
              </a>
              <a href="https://www.wallstreetmojo.com/front-office-middle-office-back-office/" target="_blank" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 border border-slate-100 transition-all group">
                <span className="text-xs font-black text-slate-700 uppercase">FO/MO/BO Explained</span>
                <i className="fas fa-chevron-right text-slate-300 group-hover:text-blue-500 transition-colors"></i>
              </a>
            </div>
          </div>
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
            <h3 className="text-lg font-black mb-6 uppercase tracking-tight text-blue-400">Conceptual Flow (MX Equivalent)</h3>
            <div className="relative space-y-6">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-blue-500/20"></div>
              {[
                { step: "FO", label: "Trade Capture & Validation", desc: "Pricing IRS/FX with market curves." },
                { step: "MO", label: "Risk, PnL & Revaluation", desc: "Greeks (DV01) and VaR computation." },
                { step: "BO", label: "Settlement & Accounting", desc: "SWIFT messages and GL postings." }
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

      {/* 2. Product Mastery */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl text-emerald-600 shadow-sm border border-slate-100">
            <i className="fas fa-box-open"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Products You MUST Learn</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl mb-6">
              <i className="fas fa-coins"></i>
            </div>
            <h3 className="text-lg font-black mb-2">FX Mastery</h3>
            <p className="text-xs text-slate-500 font-medium mb-6 flex-1">Forwards, Swaps, Value Dates, and Forward Points. Murex's bread and butter.</p>
            <a href="https://www.investopedia.com/terms/f/forwardexchangecontract.asp" target="_blank" className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-100 pb-1 w-fit">Investopedia Ref →</a>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl mb-6">
              <i className="fas fa-percent"></i>
            </div>
            <h3 className="text-lg font-black mb-2">Interest Rates</h3>
            <p className="text-xs text-slate-500 font-medium mb-6 flex-1">Swaps, Yield Curves, and Discounting. Master OIS/LIBOR bootstrapping.</p>
            <a href="https://www.investopedia.com/terms/i/interestrateswap.asp" target="_blank" className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-1 w-fit">Investopedia Ref →</a>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl mb-6">
              <i className="fas fa-shield-virus"></i>
            </div>
            <h3 className="text-lg font-black mb-2">Credit (CDS)</h3>
            <p className="text-xs text-slate-500 font-medium mb-6 flex-1">Credit Default Swaps: Premium legs vs Protection legs. High-value desk skill.</p>
            <a href="https://www.investopedia.com/terms/c/creditdefaultswap.asp" target="_blank" className="text-[10px] font-black text-purple-600 uppercase tracking-widest border-b border-purple-100 pb-1 w-fit">Investopedia Ref →</a>
          </div>
        </div>
      </section>

      {/* 3. Risk & Analytics Table */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl text-rose-600 shadow-sm border border-slate-100">
            <i className="fas fa-chart-line"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Risk, PnL & Analytics</h2>
        </div>
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Metric</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Functional Meaning</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Learn More</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-700">
              {[
                { m: "NPV", d: "Net Present Value / MTM Revaluation", link: "https://www.investopedia.com/terms/n/npv.asp" },
                { m: "DV01", d: "Interest Rate Sensitivity per 1bp shift", link: "https://www.investopedia.com/terms/v/var.asp" },
                { m: "Greeks", d: "Delta, Gamma, Vega, Theta sensitivities", link: "https://www.investopedia.com/terms/g/greeks.asp" },
                { m: "VaR", d: "Value at Risk (99% CI Historical/MC)", link: "https://www.investopedia.com/terms/v/var.asp" }
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-none">
                  <td className="px-8 py-5 font-black text-slate-900">{row.m}</td>
                  <td className="px-8 py-5 text-slate-500">{row.d}</td>
                  <td className="px-8 py-5"><a href={row.link} target="_blank" className="text-blue-600 hover:underline">Investopedia Guide</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Practical Labs */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl text-blue-600 shadow-sm border border-slate-100">
            <i className="fas fa-vial"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Hands-On Practice Labs (FREE)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white border border-white/5 flex flex-col h-full shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <i className="fab fa-python text-blue-400 text-2xl"></i>
              <h3 className="text-xl font-black uppercase tracking-tight">FX Forward Pricing Lab</h3>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex gap-3 text-sm text-slate-400"><i className="fas fa-check-circle text-blue-500 mt-1"></i> Build Excel Trade Blotter</li>
              <li className="flex gap-3 text-sm text-slate-400"><i className="fas fa-check-circle text-blue-500 mt-1"></i> Script Forward Pricing in Python</li>
              <li className="flex gap-3 text-sm text-slate-400"><i className="fas fa-check-circle text-blue-500 mt-1"></i> Formula: Forward = Spot × (DF_base / DF_quote)</li>
            </ul>
            <div className="flex gap-3">
              <a href="https://github.com/quantlib/QuantLib-SWIG" target="_blank" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">QuantLib SWIG</a>
              <a href="https://github.com/quantopian/research_public" target="_blank" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Quantopian Repo</a>
            </div>
          </div>
          <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white flex flex-col h-full shadow-2xl shadow-blue-500/30">
            <div className="flex items-center gap-3 mb-6">
              <i className="fas fa-terminal text-white text-2xl"></i>
              <h3 className="text-xl font-black uppercase tracking-tight">Yield Curve & IR Swap Lab</h3>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex gap-3 text-sm text-blue-100"><i className="fas fa-check-circle text-white mt-1"></i> Curve Bootstrapping from SOFR/LIBOR</li>
              <li className="flex gap-3 text-sm text-blue-100"><i className="fas fa-check-circle text-white mt-1"></i> Swap Revaluation Logic</li>
              <li className="flex gap-3 text-sm text-blue-100"><i className="fas fa-check-circle text-white mt-1"></i> Calculate DV01 per Book</li>
            </ul>
            <a href="https://quantlib-python-docs.readthedocs.io/" target="_blank" className="px-6 py-3 bg-white text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest text-center shadow-xl">QuantLib Python Docs</a>
          </div>
        </div>
      </section>

      {/* 5. SQL & Unix */}
      <section className="bg-slate-50 rounded-[3rem] p-12 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
            <i className="fas fa-database text-blue-600"></i> SQL Mastery
          </h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">Mandatory for Murex integration and reporting. Practice joins, aggregations, and trade aging queries.</p>
          <div className="flex gap-3">
            <a href="https://www.postgresqltutorial.com/" target="_blank" className="text-[10px] font-black text-blue-600 border-b-2 border-blue-200 pb-1 uppercase">PostgreSQL Guide</a>
            <a href="https://sqlbolt.com/" target="_blank" className="text-[10px] font-black text-blue-600 border-b-2 border-blue-200 pb-1 uppercase">SQL Bolt</a>
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
            <i className="fas fa-terminal text-slate-900"></i> Unix / Linux
          </h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">L1/L2 Support must master grep, awk, and sed for parsing MX.3 logs and managing batch sessions.</p>
          <a href="https://linuxjourney.com/" target="_blank" className="text-[10px] font-black text-slate-900 border-b-2 border-slate-300 pb-1 uppercase inline-block">Linux Journey</a>
        </div>
      </section>

      {/* ENROLLMENT FORM (College Students) */}
      <section id="enrollment" className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-black tracking-tight">College Student Enrollment</h2>
            <p className="text-slate-400 text-lg font-medium">Apply for our Industry-Linked Agentic Murex Training Program.</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="John Doe" 
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
                  placeholder="john@college.edu" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">College Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="Global Institute of Finance" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                  value={formData.college}
                  onChange={(e) => setFormData({...formData, college: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Current Year</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                >
                  <option className="bg-slate-900">1st Year</option>
                  <option className="bg-slate-900">2nd Year</option>
                  <option className="bg-slate-900">3rd Year</option>
                  <option className="bg-slate-900">Final Year</option>
                  <option className="bg-slate-900">Post-Grad</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Preferred Specialization</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-blue-400"
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                >
                  <option className="bg-slate-900">Front Office Analyst</option>
                  <option className="bg-slate-900">Risk Analyst (MO)</option>
                  <option className="bg-slate-900">Back Office / Operations</option>
                  <option className="bg-slate-900">Business Analyst (BA)</option>
                  <option className="bg-slate-900">Technical Consultant (Dev/SQL)</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Why Murex? (Optional)</label>
                <textarea 
                  rows={3}
                  placeholder="Share your interest in financial technology..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3 group"
              >
                Submit Application <i className="fas fa-paper-plane group-hover:translate-x-1 transition-transform"></i>
              </button>
            </form>
          ) : (
            <div className="py-24 text-center space-y-8 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center text-4xl mx-auto border border-blue-500/30">
                <i className="fas fa-check"></i>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black">Application Received</h3>
                <p className="text-slate-400 max-w-md mx-auto font-medium">We've received your enrollment details. Please send the generated email to <span className="text-blue-400">techskylineitsolutions20204@gmail.com</span> to finalize the process.</p>
              </div>
              <button onClick={() => setSubmitted(false)} className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Apply for another track</button>
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none"></div>
      </section>
    </div>
  );
};

export default MurexMastery;
