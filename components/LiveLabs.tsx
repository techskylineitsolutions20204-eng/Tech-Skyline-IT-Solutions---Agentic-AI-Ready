
import React, { useState, useEffect } from 'react';

interface Lab {
  title: string;
  env: string;
  duration: string;
  diff: 'Basic' | 'Intermediate' | 'Advanced';
  img: string;
  tasks: string[];
}

const labs: Lab[] = [
  { 
    title: 'Agentic Workflow Automation', 
    env: 'LangGraph + AWS Bedrock', 
    duration: '120 mins', 
    diff: 'Intermediate',
    img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    tasks: ['Initialize LangGraph state', 'Configure AWS Bedrock LLM nodes', 'Implement tool-calling for DB search', 'Deploy as API']
  },
  { 
    title: 'Zero Trust Network Architect', 
    env: 'Azure Security + Kubernetes', 
    duration: '180 mins', 
    diff: 'Advanced',
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    tasks: ['Configure Azure AD Identity Protection', 'Setup K8s Network Policies', 'Implement mTLS with Istio', 'Audit logs with Sentinel']
  },
  { 
    title: 'Full Stack Deployment CI/CD', 
    env: 'GitHub Actions + Docker + EKS', 
    duration: '90 mins', 
    diff: 'Basic',
    img: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=800',
    tasks: ['Containerize React app', 'Write GitHub Actions workflow', 'Push to ECR', 'Update EKS deployment']
  },
  { 
    title: 'Advanced SAP IBP Integration', 
    env: 'SAP S/4HANA Sandbox', 
    duration: '240 mins', 
    diff: 'Advanced',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    tasks: ['Load demand history', 'Configure IBP planning area', 'Run supply optimizer', 'Verify S/4HANA sync']
  },
  { 
    title: 'AI Data Pipe Visualization', 
    env: 'Power BI + Databricks', 
    duration: '120 mins', 
    diff: 'Intermediate',
    img: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800',
    tasks: ['Setup Databricks cluster', 'Ingest Kaggle dataset', 'Perform Spark SQL cleaning', 'Create Power BI dashboard']
  },
  { 
    title: 'Murex Development Basics', 
    env: 'Murex Binary Env', 
    duration: '150 mins', 
    diff: 'Intermediate',
    img: 'https://images.unsplash.com/photo-1611974714851-eb6051612342?auto=format&fit=crop&q=80&w=800',
    tasks: ['Initialize Murex session', 'Configure contract definitions', 'Test trade workflow', 'Audit reporting engine']
  },
];

const LiveLabs: React.FC = () => {
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisioningStep, setProvisioningStep] = useState(0);
  const [activeTab, setActiveTab] = useState<'terminal' | 'docs' | 'tutor'>('terminal');
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  const handleStartLab = (lab: Lab) => {
    setSelectedLab(lab);
    setIsProvisioning(true);
    setProvisioningStep(0);
    setTerminalLines(['# Initializing virtual environment...', `# Targeted stack: ${lab.env}`]);
    setCompletedTasks([]);
  };

  useEffect(() => {
    if (isProvisioning) {
      const timer = setInterval(() => {
        setProvisioningStep(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => setIsProvisioning(false), 500);
            return 100;
          }
          return prev + 20;
        });
      }, 600);
      return () => clearInterval(timer);
    }
  }, [isProvisioning]);

  const runCommand = (cmd: string, output: string) => {
    setTerminalLines(prev => [...prev, `skyline@lab:~$ ${cmd}`, output]);
  };

  if (selectedLab && !isProvisioning) {
    return (
      <div className="max-w-7xl mx-auto h-[calc(100vh-12rem)] flex flex-col animate-in fade-in duration-500">
        {/* Lab Header */}
        <div className="bg-slate-900 p-6 flex items-center justify-between border-b border-white/5 rounded-t-[2.5rem]">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedLab(null)} className="text-white/50 hover:text-white transition-colors">
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h2 className="text-white font-bold">{selectedLab.title}</h2>
              <div className="flex items-center gap-2 text-[10px] text-blue-400 font-black uppercase tracking-widest">
                <i className="fas fa-bolt"></i> Live Sandbox: {selectedLab.env}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-white/50 text-xs">
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> CPU: 12%</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> RAM: 4.2GB</div>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all" onClick={() => setSelectedLab(null)}>
              Terminate Session
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar: Tasks */}
          <aside className="w-80 bg-white border-r border-slate-200 p-6 overflow-y-auto">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Lab Roadmap</h3>
            <div className="space-y-4">
              {selectedLab.tasks.map((task, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setCompletedTasks(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx])}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    completedTasks.includes(idx) 
                      ? 'bg-emerald-50 border-emerald-500' 
                      : 'bg-white border-slate-100 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      completedTasks.includes(idx) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                    }`}>
                      {completedTasks.includes(idx) && <i className="fas fa-check text-[10px]"></i>}
                    </div>
                    <span className={`text-sm font-bold leading-tight ${completedTasks.includes(idx) ? 'text-emerald-700' : 'text-slate-800'}`}>
                      {task}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-xs font-bold text-slate-500 mb-2">Completion Status</p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500" 
                  style={{ width: `${(completedTasks.length / selectedLab.tasks.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-right text-[10px] font-black text-slate-400 mt-1 uppercase">
                {completedTasks.length} / {selectedLab.tasks.length} Modules
              </p>
            </div>
          </aside>

          {/* Main Area: Terminal/Editor */}
          <main className="flex-1 bg-slate-950 flex flex-col">
            <div className="flex bg-slate-900 border-b border-white/5">
              {['terminal', 'docs', 'tutor'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-8 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                    activeTab === tab ? 'text-white border-b-2 border-blue-500 bg-white/5' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 p-8 font-mono text-sm overflow-y-auto">
              {activeTab === 'terminal' && (
                <div className="space-y-2 text-slate-300">
                  {terminalLines.map((line, i) => (
                    <div key={i} className={line.startsWith('skyline') ? 'text-emerald-400' : ''}>{line}</div>
                  ))}
                  <div className="flex gap-2">
                    <span className="text-emerald-400">skyline@lab:~$</span>
                    <input 
                      autoFocus
                      type="text"
                      className="bg-transparent border-none outline-none text-white w-full"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value;
                          (e.target as HTMLInputElement).value = '';
                          if (val === 'ls') runCommand(val, 'src/  configs/  scripts/  requirements.txt');
                          else if (val.includes('deploy')) runCommand(val, '[INFO] Initiating deployment sequence... 100% SUCCESS');
                          else if (val.includes('clear')) setTerminalLines([]);
                          else runCommand(val, `Command not recognized: ${val}. Try 'deploy' or 'ls'`);
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'docs' && (
                <div className="prose prose-invert max-w-none text-slate-400">
                  <h3 className="text-white">Environment Details</h3>
                  <p>This production sandbox provides pre-configured access to the {selectedLab.env} stack. Your workspace is persistent for the duration of this session.</p>
                  <ul className="space-y-2">
                    <li><strong>API Endpoint:</strong> https://lab-api.skyline-it.com</li>
                    <li><strong>Region:</strong> us-east-1 (Simulated)</li>
                    <li><strong>Secrets:</strong> Access keys are automatically injected into ENV vars.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'tutor' && (
                <div className="space-y-6">
                  <div className="flex gap-4 items-start bg-blue-600/10 p-6 rounded-3xl border border-blue-500/20">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-chalkboard-user"></i>
                    </div>
                    <div className="space-y-3">
                      <p className="text-blue-200 text-sm leading-relaxed">
                        I'm your **Agentic Sidekick**. It looks like you're working on the <strong>{selectedLab.tasks[completedTasks.length] || 'final module'}</strong>. 
                      </p>
                      <p className="text-white text-xs font-bold uppercase tracking-widest">Logic Hint:</p>
                      <p className="text-slate-400 text-xs italic">
                        "Ensure your state variables are immutable before passing them to the next node in the graph. Check your indentation in the logic file."
                      </p>
                    </div>
                  </div>
                  <button className="w-full py-4 border border-blue-500/30 text-blue-400 text-xs font-black uppercase rounded-2xl hover:bg-blue-600/10 transition-all">
                    Generate Quiz for this module
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {isProvisioning && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-xl flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
              <div 
                className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin" 
                style={{ animationDuration: '0.8s' }}
              ></div>
              <i className="fas fa-cloud-arrow-up absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-blue-500"></i>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Provisioning Lab Environment</h2>
              <p className="text-slate-400">Orchestrating production stack for {selectedLab?.title}...</p>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
              <div 
                className="bg-blue-600 h-full transition-all duration-500 shadow-[0_0_15px_rgba(37,99,235,0.5)]" 
                style={{ width: `${provisioningStep}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-left">
              {[
                { label: 'Security Context', status: provisioningStep > 20 ? 'OK' : '...' },
                { label: 'Cloud Storage', status: provisioningStep > 40 ? 'OK' : '...' },
                { label: 'Worker Nodes', status: provisioningStep > 60 ? 'OK' : '...' },
                { label: 'Binary Injector', status: provisioningStep > 80 ? 'OK' : '...' }
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</span>
                  <span className={`text-[10px] font-black ${s.status === 'OK' ? 'text-emerald-500' : 'text-slate-600'}`}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Live Cloud Labs</h1>
          <p className="text-slate-500">Practice on production-grade environments. 100% setup-free practice.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input type="text" placeholder="Search labs..." className="pl-12 pr-6 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm w-full md:w-64" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {labs.map((lab, idx) => (
          <div key={idx} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 group hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col">
            <div className="relative h-56 overflow-hidden">
              <img src={lab.img} alt={lab.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <div className="absolute top-6 right-6">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl ${
                  lab.diff === 'Basic' ? 'bg-emerald-500 text-white' : 
                  lab.diff === 'Intermediate' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {lab.diff}
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
                  <i className="fas fa-microchip"></i>
                  {lab.env}
                </div>
                <h3 className="text-xl font-black text-white leading-tight">{lab.title}</h3>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-8">
                <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <i className="far fa-clock text-blue-500"></i> {lab.duration}
                </span>
                <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <i className="fas fa-users text-blue-500"></i> 1.2k Active
                </span>
              </div>
              
              <div className="space-y-2 mb-8 flex-1">
                {lab.tasks.slice(0, 3).map((task, tIdx) => (
                  <div key={tIdx} className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                    <i className="fas fa-check-circle text-emerald-500/40"></i>
                    {task}
                  </div>
                ))}
                {lab.tasks.length > 3 && <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest pl-6">+ {lab.tasks.length - 3} more modules</div>}
              </div>
              
              <button 
                onClick={() => handleStartLab(lab)}
                className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 group/btn shadow-xl shadow-slate-200 hover:shadow-blue-500/20"
              >
                Spin Up Sandbox
                <i className="fas fa-arrow-right text-[10px] group-hover/btn:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveLabs;
