
import React from 'react';
import { Link } from 'react-router-dom';
import { TechDomain } from '../types';
import { DOMAIN_INFO } from '../constants';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Active Learners', value: '12,480', icon: 'fa-user-graduate', color: 'blue' },
    { label: 'Cloud Labs', value: '850+', icon: 'fa-server', color: 'cyan' },
    { label: 'Free Resources', value: '150+', icon: 'fa-book', color: 'green' },
    { label: 'Agentic Bots', value: '2,100', icon: 'fa-microchip', color: 'purple' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <section className="relative overflow-hidden rounded-3xl bg-skyline-gradient p-8 md:p-12 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Accelerate Your <span className="text-blue-400">AI-Ready</span> Workforce
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            Deploy production-grade learning pathways with Tech Skyline IT Solutions. 
            Access our specialized Agentic AI Tutor blueprint for 100% free technical mastery.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/tutor-stack" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all">
              View Tutor Blueprint
            </Link>
            <Link to="/explore" className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-xl border border-white/20 transition-all">
              Launch Architect
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <i className="fas fa-network-wired text-[20rem] -mr-20 -mt-20"></i>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center`}>
              <i className={`fas ${stat.icon} text-${stat.color}-600 text-xl`}></i>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">100% Free Stack</h2>
            <p className="text-emerald-50 mb-4 opacity-90">Build your own Agentic AI Tutor with LangGraph, Gemini, and Chroma at zero cost.</p>
          </div>
          <Link to="/tutor-stack" className="inline-flex items-center gap-2 bg-white text-emerald-600 font-bold py-2 px-6 rounded-xl self-start hover:bg-slate-50 transition-all">
            See Free Stack <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </div>

        <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Live Audio Mentorship</h2>
            <p className="text-blue-100 mb-4 opacity-90">Talk to our AI Mentor for real-time guidance on roadmaps and technical labs.</p>
          </div>
          <Link to="/mentor" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold py-2 px-6 rounded-xl self-start hover:bg-slate-50 transition-all">
            Talk to Mentor <i className="fas fa-microphone text-xs"></i>
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Industry Domains</h2>
          <Link to="/explore" className="text-blue-600 font-semibold hover:underline">See all paths</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(DOMAIN_INFO).slice(0, 3).map(([domain, info]) => (
            <div key={domain} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="mb-4">{info.icon}</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{domain}</h3>
              <p className="text-slate-500 text-sm mb-6">{info.description}</p>
              <Link 
                to="/explore" 
                state={{ initialDomain: domain }}
                className="inline-flex items-center text-sm font-bold text-blue-600 hover:gap-2 transition-all"
              >
                Explore Roadmap <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
