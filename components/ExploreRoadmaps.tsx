
import React, { useState } from 'react';
import { TechDomain, LearningRoadmap } from '../types';
import { generateRoadmap } from '../services/geminiService';
import { DOMAIN_INFO } from '../constants';

const ExploreRoadmaps: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<TechDomain | null>(null);
  const [targetRole, setTargetRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);

  const handleGenerate = async () => {
    if (!selectedDomain || !targetRole) return;
    setIsLoading(true);
    setRoadmap(null);
    try {
      const result = await generateRoadmap(selectedDomain, targetRole);
      setRoadmap(result);
    } catch (error) {
      console.error('Generation failed', error);
      alert('Failed to architect roadmap. Please check your API configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Architect Your Future</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Select a technology domain and your goal role. Our AI Architect will design a precision-engineered learning pathway mapped to industry needs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 sticky top-8">
            <h3 className="font-black text-xl mb-8 flex items-center gap-3">
              <i className="fas fa-microchip text-blue-600" aria-hidden="true"></i>
              Configuration
            </h3>
            
            <div className="space-y-8">
              <div>
                <label id="domain-label" className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">
                  1. Technology Domain
                </label>
                <div 
                  role="radiogroup" 
                  aria-labelledby="domain-label"
                  className="space-y-3"
                >
                  {Object.values(TechDomain).map((domain) => (
                    <div
                      key={domain}
                      role="radio"
                      aria-checked={selectedDomain === domain}
                      tabIndex={0}
                      onClick={() => setSelectedDomain(domain)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedDomain(domain);
                        }
                      }}
                      className={`relative p-5 rounded-3xl border-2 cursor-pointer transition-all group outline-none ${
                        selectedDomain === domain 
                          ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-500/20' 
                          : 'bg-white border-slate-100 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${
                          selectedDomain === domain ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400'
                        }`}>
                          {React.cloneElement(DOMAIN_INFO[domain].icon as React.ReactElement, { 
                            className: `${(DOMAIN_INFO[domain].icon as React.ReactElement).props.className} ${selectedDomain === domain ? 'text-white' : ''}`,
                            'aria-hidden': 'true'
                          })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-black transition-colors ${
                            selectedDomain === domain ? 'text-white' : 'text-slate-900'
                          }`}>
                            {domain}
                          </h4>
                          <p className={`text-[10px] uppercase font-bold tracking-widest mt-1 opacity-60 ${
                            selectedDomain === domain ? 'text-white' : 'text-slate-400'
                          }`}>
                            {DOMAIN_INFO[domain].description.split(',')[0]}
                          </p>
                        </div>
                        {selectedDomain === domain && (
                          <i className="fas fa-check-circle text-white animate-in zoom-in duration-300" aria-hidden="true"></i>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="target-role" className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">
                  2. Target Career Role
                </label>
                <div className="relative">
                  <i className="fas fa-briefcase absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true"></i>
                  <input 
                    id="target-role"
                    type="text"
                    placeholder="e.g. Senior DevOps Engineer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 rounded-3xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-bold bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading || !selectedDomain || !targetRole}
                className="w-full bg-slate-900 hover:bg-blue-600 disabled:bg-slate-100 disabled:text-slate-300 text-white font-black py-5 px-6 rounded-3xl shadow-2xl transition-all flex items-center justify-center gap-3 text-lg group"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-atom animate-spin" aria-hidden="true"></i>
                    Architecting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-wand-magic-sparkles group-hover:rotate-12 transition-transform" aria-hidden="true"></i>
                    Generate Pathway
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8">
          {!roadmap && !isLoading ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3.5rem] p-24 flex flex-col items-center justify-center text-center text-slate-400 min-h-[700px]">
              <div className="w-28 h-28 bg-slate-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
                <i className="fas fa-terminal text-5xl text-slate-200" aria-hidden="true"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-600 mb-4">Architecting Platform Ready</h3>
              <p className="max-w-md text-slate-400 text-lg leading-relaxed">
                Select your domain and target role to initialize our agentic learning engine. We map real-time industry needs to your roadmap.
              </p>
            </div>
          ) : isLoading ? (
            <div className="bg-white rounded-[3.5rem] p-16 border border-slate-100 min-h-[700px] flex flex-col items-center justify-center gap-10 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50">
                <div className="h-full bg-blue-600 animate-[loading_2s_infinite]"></div>
              </div>
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-8 border-blue-50 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-t-blue-600 rounded-full animate-spin"></div>
                <i className="fas fa-brain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-blue-600"></i>
              </div>
              <div className="text-center space-y-4">
                <p className="text-2xl font-black text-slate-900">Consulting Industry Mentor API...</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Mapping Certifications
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Orchestrating Live Labs
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Aligning Enterprise Cases
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <div className="bg-white rounded-[3.5rem] p-12 md:p-16 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12">
                  <i className="fas fa-award text-[15rem]"></i>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <span className="bg-blue-600 text-white px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest">{roadmap!.domain}</span>
                  <span className="bg-slate-900 text-white px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest">{roadmap!.role}</span>
                </div>

                <h2 className="text-5xl font-black text-slate-900 mb-8 leading-tight tracking-tight">Pathway Design Blueprint</h2>
                <div className="bg-slate-50 rounded-[2.5rem] p-8 mb-12 border border-slate-200">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4">Executive Overview</h4>
                  <p className="text-slate-600 text-xl leading-relaxed italic">
                    "{roadmap!.overview}"
                  </p>
                </div>

                <div className="space-y-16 relative">
                  {/* Vertical line through milestones */}
                  <div className="absolute left-[31px] top-8 bottom-8 w-1 bg-slate-100 hidden md:block"></div>

                  {roadmap!.steps.map((step, idx) => (
                    <div key={idx} className="relative md:pl-24">
                      {/* Milestone Badge */}
                      <div className="absolute left-0 top-0 hidden md:flex w-16 h-16 rounded-3xl bg-slate-900 text-white items-center justify-center text-2xl font-black z-10 shadow-xl shadow-slate-900/20">
                        {idx + 1}
                      </div>

                      <div className="bg-white border border-slate-100 rounded-[3rem] p-10 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                          <div>
                            <h3 className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2">{step.title}</h3>
                            <div className="flex items-center gap-3">
                              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                step.level === 'Beginner' ? 'bg-emerald-100 text-emerald-700' : 
                                step.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                              }`}>
                                {step.level}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-500 text-lg mb-10 leading-relaxed">{step.description}</p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                          <div className="space-y-6">
                            <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100">
                              <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-4 flex items-center gap-2">
                                <i className="fas fa-flask"></i> Production Lab
                              </h4>
                              <p className="text-sm font-bold text-slate-800 leading-relaxed">{step.labIdea}</p>
                            </div>
                            <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100">
                              <h4 className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-4 flex items-center gap-2">
                                <i className="fas fa-list-check"></i> Skill Outcomes
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {step.skillOutcomes.map((skill, si) => (
                                  <span key={si} className="text-[10px] font-black bg-white text-emerald-700 px-3 py-1 rounded-lg border border-emerald-100 uppercase tracking-wider">{skill}</span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="bg-amber-50/50 rounded-3xl p-6 border border-amber-100">
                              <h4 className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-4 flex items-center gap-2">
                                <i className="fas fa-screwdriver-wrench"></i> Stack
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {step.tools.map((tool, ti) => (
                                  <span key={ti} className="text-[10px] font-black bg-white text-amber-700 px-3 py-1 rounded-lg border border-amber-100 uppercase tracking-wider">{tool}</span>
                                ))}
                              </div>
                            </div>
                            <div className="bg-purple-50/50 rounded-3xl p-6 border border-purple-100">
                              <h4 className="text-[10px] font-black uppercase text-purple-600 tracking-widest mb-4 flex items-center gap-2">
                                <i className="fas fa-microscope"></i> Assessment
                              </h4>
                              <p className="text-xs font-bold text-slate-600 leading-relaxed">{step.assessmentStrategy}</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-8 border-t border-slate-50 flex flex-wrap items-center gap-6">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Partner Certifications</span>
                          <div className="flex flex-wrap gap-3">
                            {step.certifications.map((cert, ci) => (
                              <span key={ci} className="text-xs font-black text-slate-700 flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                                <i className="fas fa-award text-blue-500"></i> {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="bg-skyline-gradient rounded-[3rem] p-10 text-white relative overflow-hidden">
                    <h4 className="text-2xl font-black mb-6">Enterprise Context</h4>
                    <ul className="space-y-4">
                      {roadmap!.enterpriseUseCases.map((uc, i) => (
                        <li key={i} className="flex gap-4 items-start text-slate-300 text-sm">
                          <i className="fas fa-check-circle text-blue-400 mt-1"></i>
                          {uc}
                        </li>
                      ))}
                    </ul>
                    <i className="fas fa-building absolute -bottom-10 -right-10 text-9xl opacity-5"></i>
                  </div>
                  <div className="bg-blue-600 rounded-[3rem] p-10 text-white relative overflow-hidden">
                    <h4 className="text-2xl font-black mb-4">Market Alignment</h4>
                    <p className="text-blue-50 leading-relaxed">
                      {roadmap!.careerAlignment}
                    </p>
                    <div className="mt-8">
                      <button className="bg-white text-blue-600 font-black py-4 px-8 rounded-2xl shadow-xl hover:bg-slate-50 transition-all">
                        Find Matching Roles
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ExploreRoadmaps;
