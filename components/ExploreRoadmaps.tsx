
import React, { useState, useEffect } from 'react';
import { TechDomain, LearningRoadmap } from '../types';
import { generateRoadmap } from '../services/geminiService';
import { DOMAIN_INFO } from '../constants';

interface SavedRoadmapEntry {
  id: string;
  timestamp: string;
  roadmap: LearningRoadmap;
}

const ExploreRoadmaps: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<TechDomain | null>(null);
  const [targetRole, setTargetRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [savedRoadmaps, setSavedRoadmaps] = useState<SavedRoadmapEntry[]>([]);

  // Load saved roadmaps from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem('skyline_saved_roadmaps');
    if (stored) {
      try {
        setSavedRoadmaps(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse saved roadmaps', e);
      }
    }
  }, []);

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

  const handleSaveRoadmap = () => {
    if (!roadmap) return;
    
    const newEntry: SavedRoadmapEntry = {
      id: `${roadmap.domain}-${roadmap.role}-${Date.now()}`,
      timestamp: new Date().toLocaleDateString(),
      roadmap: roadmap
    };

    const updated = [newEntry, ...savedRoadmaps];
    setSavedRoadmaps(updated);
    localStorage.setItem('skyline_saved_roadmaps', JSON.stringify(updated));
  };

  const handleLoadSaved = (entry: SavedRoadmapEntry) => {
    setRoadmap(entry.roadmap);
    setSelectedDomain(entry.roadmap.domain);
    setTargetRole(entry.roadmap.role);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSaved = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = savedRoadmaps.filter(r => r.id !== id);
    setSavedRoadmaps(updated);
    localStorage.setItem('skyline_saved_roadmaps', JSON.stringify(updated));
  };

  const domainData = selectedDomain ? DOMAIN_INFO[selectedDomain] : null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-24">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Architect Your Future</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Select a technology domain and your goal role. Our AI Architect will design a precision-engineered learning pathway mapped to industry needs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Configuration & Library */}
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
                        </div>
                        {selectedDomain === domain && (
                          <i className="fas fa-check-circle text-white animate-in zoom-in duration-300" aria-hidden="true"></i>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedDomain && domainData && (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  {domainData.prerequisites.length > 0 && (
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                        <i className="fas fa-layer-group text-amber-500"></i> Foundations
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {domainData.prerequisites.map((prereq) => (
                          <button
                            key={prereq}
                            onClick={() => setSelectedDomain(prereq)}
                            className="px-3 py-2 bg-white hover:bg-amber-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 transition-all uppercase"
                          >
                            {prereq}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="target-role" className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">
                  2. Target Career Role
                </label>
                <input 
                  id="target-role"
                  type="text"
                  placeholder="e.g. Senior DevOps Engineer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-6 py-5 rounded-3xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold bg-slate-50"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading || !selectedDomain || !targetRole}
                className="w-full bg-slate-900 hover:bg-blue-600 disabled:bg-slate-100 disabled:text-slate-300 text-white font-black py-5 rounded-3xl transition-all flex items-center justify-center gap-3 text-lg group"
              >
                {isLoading ? <i className="fas fa-atom animate-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                {isLoading ? 'Architecting...' : 'Generate Pathway'}
              </button>
            </div>
          </div>

          {/* Library Section */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
            <h3 className="font-black text-xl mb-6 flex items-center gap-3">
              <i className="fas fa-bookmark text-amber-500" aria-hidden="true"></i>
              Saved Pathways
            </h3>
            <div className="space-y-3">
              {savedRoadmaps.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Library Empty</p>
                </div>
              ) : (
                savedRoadmaps.map((entry) => (
                  <div 
                    key={entry.id}
                    onClick={() => handleLoadSaved(entry)}
                    className="group relative p-4 bg-white border border-slate-100 hover:border-blue-500 rounded-2xl cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/10"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{entry.roadmap.domain}</span>
                      <button 
                        onClick={(e) => handleDeleteSaved(e, entry.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1"
                      >
                        <i className="fas fa-trash-can text-[10px]"></i>
                      </button>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{entry.roadmap.role}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tighter">Saved on {entry.timestamp}</p>
                  </div>
                ))
              )}
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
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <div className="bg-white rounded-[3.5rem] p-12 md:p-16 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12">
                  <i className="fas fa-award text-[15rem]"></i>
                </div>
                
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="bg-blue-600 text-white px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest">{roadmap!.domain}</span>
                    <span className="bg-slate-900 text-white px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest">{roadmap!.role}</span>
                  </div>
                  <button 
                    onClick={handleSaveRoadmap}
                    className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-sm hover:shadow-md"
                  >
                    <i className="fas fa-star"></i>
                    Save to Library
                  </button>
                </div>

                <h2 className="text-5xl font-black text-slate-900 mb-8 leading-tight tracking-tight">Pathway Design Blueprint</h2>
                <div className="bg-slate-50 rounded-[2.5rem] p-8 mb-12 border border-slate-200">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4">Executive Overview</h4>
                  <p className="text-slate-600 text-xl leading-relaxed italic">
                    "{roadmap!.overview}"
                  </p>
                </div>

                <div className="space-y-16 relative">
                  <div className="absolute left-[31px] top-8 bottom-8 w-1 bg-slate-100 hidden md:block"></div>

                  {roadmap!.steps.map((step, idx) => (
                    <div key={idx} className="relative md:pl-24">
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
