
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ExploreRoadmaps from './components/ExploreRoadmaps';
import LiveLabs from './components/LiveLabs';
import LiveAudioMentor from './components/LiveAudioMentor';
import VideoGenerator from './components/VideoGenerator';
import AIAssistant from './components/AIAssistant';
import FreeResources from './components/FreeResources';
import AgenticTutorStack from './components/AgenticTutorStack';
import OrchestrationHub from './components/OrchestrationHub';

const App: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'fa-house' },
    { path: '/explore', label: 'Roadmap Architect', icon: 'fa-map' },
    { path: '/automation-hub', label: 'Automation Hub', icon: 'fa-gears' },
    { path: '/tutor-stack', label: 'Tutor Blueprint', icon: 'fa-microchip' },
    { path: '/labs', label: 'Live Sandbox', icon: 'fa-flask-vial' },
    { path: '/resources', label: 'Resource Hub', icon: 'fa-book-open' },
    { path: '/mentor', label: 'Voice Mentor', icon: 'fa-microphone' },
    { path: '/video', label: 'Visualizer', icon: 'fa-video' },
    { path: '/assistant', label: 'AI Support', icon: 'fa-robot' },
  ];

  return (
    <div className="flex h-screen overflow-hidden text-slate-900">
      {/* Sidebar */}
      <aside className={`bg-skyline-gradient text-white w-64 flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center shadow-lg">
            <i className="fas fa-bolt text-xl"></i>
          </div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">Tech Skyline</span>}
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'hover:bg-white/5 text-slate-400'
              }`}
            >
              <i className={`fas ${item.icon} w-6 text-center text-lg`}></i>
              {isSidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className={`bg-white/5 rounded-2xl p-4 border border-white/10 ${!isSidebarOpen && 'hidden'}`}>
            <p className="text-xs text-slate-400 mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Agentic AI Ready</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 z-10">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
          >
            <i className="fas fa-bars"></i>
          </button>
          <div className="hidden lg:block text-slate-500 font-medium">
            Welcome back, <span className="text-slate-900 font-bold">Learning Architect</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 uppercase tracking-widest">
              Enterprise Tier
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
              <img src="https://picsum.photos/40/40?seed=tech" alt="User" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/explore" element={<ExploreRoadmaps />} />
            <Route path="/automation-hub" element={<OrchestrationHub />} />
            <Route path="/tutor-stack" element={<AgenticTutorStack />} />
            <Route path="/labs" element={<LiveLabs />} />
            <Route path="/resources" element={<FreeResources />} />
            <Route path="/mentor" element={<LiveAudioMentor />} />
            <Route path="/video" element={<VideoGenerator />} />
            <Route path="/assistant" element={<AIAssistant />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;
