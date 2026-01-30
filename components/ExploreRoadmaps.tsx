
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
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Architect Your Future</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Select a technology domain and your goal role. Our AI Architect will design a precision-engineered learning pathway mapped to industry needs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
              <i className="fas fa-sliders text-blue-600" aria-hidden="true"></i>
              Configuration
            </h3>
            
            <div className="space-y-6">
              <div>
                <label id="domain-label" className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
                  1. Technology Domain
                </label>
                <div 
                  role="radiogroup" 
                  aria-labelledby="domain-label"
                  className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar focus:outline-none"
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
                      className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all group focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none ${
                        selectedDomain === domain 
                          ? 'bg-blue-50 border-blue-500 shadow-sm' 
                          : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          selectedDomain === domain ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50'
                        }`}>
                          {React.cloneElement(DOMAIN_INFO[domain].icon as React.ReactElement, { 
                            className: `${(DOMAIN_INFO[domain].icon as React.ReactElement).props.className} ${selectedDomain === domain ? 'text-white' : ''}`,
                            'aria-hidden': 'true'
                          })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-bold transition-colors ${
                            selectedDomain === domain ? 'text-blue-700' : 'text-slate-900'
                          }`}>
                            {domain}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                            {DOMAIN_INFO[domain].description}
                          </p>
                        </div>
                        {selectedDomain === domain && (
                          <div className="absolute top-4 right-4 text-blue-600 animate-in fade-in zoom-in duration-300">
                            <i className="fas fa-circle-check" aria-hidden="true"></i>
                            <span className="sr-only">Selected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="target-role" className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                  2. Target Career Role
                </label>
                <div className="relative">
                  <i className="fas fa-user-tie absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true"></i>
                  <input 
                    id="target-role"
                    type="text"
                    placeholder="e.g. Senior DevOps Engineer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading || !selectedDomain || !targetRole}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-4 px-4 rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 text-lg group"
                aria-live="polite"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner animate-spin" aria-hidden="true"></i>
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

          {roadmap && (
            <div className="bg-skyline-gradient p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <i className="fas fa-lightbulb text-yellow-400" aria-hidden="true"></i>
                  Enterprise Strategy
                </h4>
                <ul className="space-y-3">
                  {roadmap.enterpriseUseCases.map((useCase, idx) => (
                    <li key={idx} className="text-sm flex gap-3 leading-relaxed">
                      <i className="fas fa-arrow-right mt-1 text-blue-400 text-xs" aria-hidden="true"></i>
                      <span className="text-slate-300">{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <i className="fas fa-briefcase absolute -bottom-8 -right-8 text-8xl text-white/5 pointer-events-none" aria-hidden="true"></i>
            </div>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8">
          {!roadmap && !isLoading ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center text-slate-400 min-h-[600px]">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
                <i className="fas fa-map-marked-alt text-4xl text-slate-300" aria-hidden="true"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-600 mb-3">Architecting Platform Ready</h3>
              <p className="max-w-md text-slate-500 text-lg">
                Select a domain and define your role to generate a custom, production-grade learning journey.
              </p>
            </div>
          ) : isLoading ? (
            <div className="space-y-6" aria-live="assertive">
              <div className="bg-white animate-pulse rounded-[3rem] p-12 border border-slate-100 min-h-[600px] flex flex-col items-center justify-center gap-8">
                <div className="w-full max-w-lg space-y-4">
                  <div className="h-12 bg-slate-100 rounded-2xl w-full"></div>
                  <div className="h-8 bg-slate-100 rounded-2xl w-3/4"></div>
                  <div className="h-8 bg-slate-100 rounded-2xl w-1/2"></div>
                </div>
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-blue-600 font-bold text-lg animate-pulse tracking-wide">
                  AI Architect is compiling massive industry dataset...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">{roadmap!.domain}</span>
                  <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">{roadmap!.role}</span>
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">Career Pathway Design</h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-12 border-l-4 border-blue-600 pl-6 bg-blue-50/50 py-4 rounded-r-2xl">
                  {roadmap!.overview}
                </p>

                <div className="space-y-12" role="list">
                  {roadmap!.steps.map((step, idx) => (
                    <div key={idx} className="relative pl-16 pb-12 last:pb-0" role="listitem">
                      {/* Timeline Line */}
                      <div className="absolute left-[24px] top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-blue-50 z-0 opacity-20" aria-hidden="true"></div>
                      
                      {/* Milestone Marker */}
                      <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shadow-xl z-10 text-xl rotate-3 group-hover:rotate-0 transition-transform">
                        {idx + 1}
                      </div>
                      
                      <div className="bg-white border border-slate-200 rounded-3xl p-8 group hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                          <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{step.title}</h3>
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                            step.level === 'Basic' ? 'bg-emerald-100 text-emerald-700' : 
                            step.level === 'Intermediate' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {step.level}
                          </span>
                        </div>
                        <p className="text-slate-600 text-lg mb-8 leading-relaxed">{step.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <i className="fas fa-flask-vial text-blue-500" aria-hidden="true"></i>
                              Live Practice
                            </h4>
                            <p className="text-base font-semibold text-slate-800 leading-relaxed">{step.labIdea}</p>
                          </div>
                          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <i className="fas fa-toolbox text-blue-500" aria-hidden="true"></i>
                              Stack
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {step.tools.map((tool, tIdx) => (
                                <span key={tIdx} className="bg-white text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100 shadow-sm">{tool}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Industry Certifications:</span>
                          <div className="flex flex-wrap gap-4">
                            {step.certifications.map((cert, cIdx) => (
                              <span key={cIdx} className="text-sm font-bold text-slate-600 flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                                <i className="fas fa-award text-amber-500" aria-hidden="true"></i> {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExploreRoadmaps;
