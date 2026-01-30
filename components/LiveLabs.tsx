
import React, { useState, useEffect, useRef } from 'react';
import { generateQuiz, evaluateQuiz } from '../services/geminiService';

interface Lab {
  title: string;
  env: string;
  duration: string;
  diff: 'Basic' | 'Intermediate' | 'Advanced';
  img: string;
  tasks: string[];
}

interface Trade {
  id: string;
  type: 'FX_SPOT' | 'IRS';
  asset: string;
  notional: number;
  tradeRate: number;
  marketRate: number;
  status: 'NEW' | 'VERIFIED' | 'SETTLED' | 'MATURED';
  npv: number;
  dv01: number;
  timestamp: string;
}

const labs: Lab[] = [
  { 
    title: 'Murex Financial Architecture', 
    env: 'MX.3 Simulator + Python + PostgreSQL', 
    duration: '150 mins', 
    diff: 'Advanced',
    img: 'https://images.unsplash.com/photo-1611974714851-eb6051612342?auto=format&fit=crop&q=80&w=800',
    tasks: [
      'Front Office: Book FX Spot & IRS Trades', 
      'Market Data: Calibrate Yield Curves & FX Rates', 
      'Risk Management: Analyze DV01 & NPV Sensitivities', 
      'Operations: Execute 4-Stage EOD Batch Sequence',
      'Integration: Export GL Postings (SAP/Oracle format)'
    ]
  },
  { 
    title: 'Agentic Workflow Automation', 
    env: 'LangGraph + Gemini 3 Pro', 
    duration: '120 mins', 
    diff: 'Intermediate',
    img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    tasks: ['Initialize LangGraph state', 'Configure Tool-Calling nodes', 'Implement Healing Agent logic', 'Deploy as Multi-Agent API']
  },
  { 
    title: 'Zero Trust Network Architect', 
    env: 'Azure Security + Kubernetes', 
    duration: '180 mins', 
    diff: 'Advanced',
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    tasks: ['Configure Entra ID IAM', 'Setup K8s Network Policies', 'Implement mTLS with Istio', 'Audit logs with Sentinel']
  }
];

const LiveLabs: React.FC = () => {
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisioningStep, setProvisioningStep] = useState(0);
  const [activeTab, setActiveTab] = useState<'terminal' | 'mx_console' | 'docs' | 'tutor'>('terminal');
  const [mxSubTab, setMxSubTab] = useState<'trading' | 'risk' | 'ops'>('trading');
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  // Murex Sim State
  const [trades, setTrades] = useState<Trade[]>([]);
  const [marketRates, setMarketRates] = useState<Record<string, number>>({ USDINR: 83.45, EURUSD: 1.085, MIBOR: 0.065 });
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchStatus, setBatchStatus] = useState<'IDLE' | 'PRICING' | 'RISK' | 'ACCOUNTING' | 'COMPLETE'>('IDLE');
  const [batchLogs, setBatchLogs] = useState<string[]>([]);

  // Quiz State
  const [quizLoading, setQuizLoading] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<{ question: string; context: string } | null>(null);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; feedback: string } | null>(null);

  const handleStartLab = (lab: Lab) => {
    setSelectedLab(lab);
    setIsProvisioning(true);
    setProvisioningStep(0);
    setTerminalLines(['# Booting Tech Skyline Agentic Cloud...', '# Injecting Murex Simulation Engine...', '# Loading market_data.sql...']);
    setCompletedTasks([]);
    setTrades([]);
    setBatchLogs([]);
    setBatchStatus('IDLE');
    setBatchProgress(0);
    setActiveQuiz(null);
    setQuizResult(null);
    if (lab.title.includes('Murex')) setActiveTab('mx_console');
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
          return prev + 25;
        });
      }, 400);
      return () => clearInterval(timer);
    }
  }, [isProvisioning]);

  const bookTrade = (type: 'FX_SPOT' | 'IRS', asset: string, rate: number, notional: number) => {
    const mktRate = type === 'FX_SPOT' ? marketRates.USDINR : marketRates.MIBOR;
    const npv = type === 'FX_SPOT' ? (mktRate - rate) * notional : (rate - mktRate) * (notional * 0.05); // Simplified IRS NPV
    const dv01 = notional * 0.0001;

    const newTrade: Trade = {
      id: `MX_${Math.floor(100000 + Math.random() * 900000)}`,
      type,
      asset,
      notional,
      tradeRate: rate,
      marketRate: mktRate,
      status: 'NEW',
      npv,
      dv01,
      timestamp: new Date().toLocaleTimeString()
    };

    setTrades(prev => [newTrade, ...prev]);
    setTerminalLines(p => [...p, `skyline@murex:~$ book ${type.toLowerCase()} ${asset} ${rate} ${notional}`, `[FO] Trade ${newTrade.id} injected into MX_TRADES table.`]);
  };

  const runEOD = () => {
    if (trades.length === 0) {
      setTerminalLines(p => [...p, "skyline@murex:~$ run eod", "[ERROR] No trades found in repository. Front Office must book trades first."]);
      return;
    }

    setBatchStatus('PRICING');
    setBatchProgress(10);
    setBatchLogs(['[EOD] Initializing Batch Cycle...', '[EOD] Loading revaluation curves...']);
    
    setTimeout(() => {
      setBatchStatus('RISK');
      setBatchProgress(40);
      setBatchLogs(prev => [...prev, '[EOD] Calculating Sensitivities (DV01)...', '[EOD] Running VaR Stress Tests...']);
      
      setTimeout(() => {
        setBatchStatus('ACCOUNTING');
        setBatchProgress(75);
        setBatchLogs(prev => [...prev, '[EOD] Generating GL Postings...', '[EOD] Preparing settlement instructions...']);
        
        setTimeout(() => {
          setBatchStatus('COMPLETE');
          setBatchProgress(100);
          setBatchLogs(prev => [...prev, '[EOD] Cycle Finished Successfully.', '[EOD] Output: pnl_report.csv generated.']);
          setTrades(prev => prev.map(t => ({ ...t, status: 'VERIFIED' })));
          setTerminalLines(p => [...p, "skyline@murex:~$ run eod", "[SUCCESS] EOD Batch sequence complete."]);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  const handleGenerateQuiz = async () => {
    if (!selectedLab) return;
    setQuizLoading(true);
    setQuizResult(null);
    setQuizAnswer('');
    const currentTask = selectedLab.tasks[completedTasks.length] || selectedLab.tasks[selectedLab.tasks.length - 1];
    try {
      const quiz = await generateQuiz(selectedLab.title, currentTask);
      setActiveQuiz(quiz);
    } catch (err) {
      console.error(err);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!activeQuiz) return;
    setEvaluating(true);
    try {
      const result = await evaluateQuiz(activeQuiz.question, quizAnswer);
      setQuizResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  if (selectedLab && !isProvisioning) {
    return (
      <div className="max-w-7xl mx-auto h-[calc(100vh-12rem)] flex flex-col animate-in fade-in duration-500 bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedLab(null)} className="text-white/50 hover:text-white transition-colors">
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h2 className="text-white font-black text-lg uppercase tracking-tight">{selectedLab.title}</h2>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-400/10 px-2 py-0.5 rounded">
                  <i className="fas fa-server mr-1"></i> {selectedLab.env}
                </span>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-0.5 rounded">
                  <i className="fas fa-circle animate-pulse mr-1"></i> Env Active
                </span>
              </div>
            </div>
          </div>
          <button onClick={() => setSelectedLab(null)} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-black px-4 py-2 rounded-xl transition-all uppercase tracking-widest">
            Terminate Session
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <aside className="w-80 bg-white border-r border-slate-200 p-8 flex flex-col">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Lab Modules</h3>
            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {selectedLab.tasks.map((task, idx) => (
                <div 
                  key={idx}
                  onClick={() => setCompletedTasks(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx])}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    completedTasks.includes(idx) ? 'bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-500/10' : 'bg-white border-slate-100 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      completedTasks.includes(idx) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                    }`}>
                      {completedTasks.includes(idx) && <i className="fas fa-check text-[8px]"></i>}
                    </div>
                    <span className={`text-xs font-black leading-tight ${completedTasks.includes(idx) ? 'text-emerald-700' : 'text-slate-800'}`}>
                      {task}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                <span className="text-[10px] font-black text-slate-900">{Math.round((completedTasks.length / selectedLab.tasks.length) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-500 shadow-[0_0_10px_rgba(37,99,235,0.4)]" style={{ width: `${(completedTasks.length / selectedLab.tasks.length) * 100}%` }}></div>
              </div>
            </div>
          </aside>

          {/* Main Area */}
          <main className="flex-1 flex flex-col bg-slate-950">
            <div className="flex bg-slate-900 border-b border-white/5 px-4 overflow-x-auto whitespace-nowrap">
              {[
                { id: 'mx_console', label: 'MX.3 Environment', icon: 'fa-building-columns' },
                { id: 'terminal', label: 'Unix Console', icon: 'fa-terminal' },
                { id: 'docs', label: 'Architecture Docs', icon: 'fa-book' },
                { id: 'tutor', label: 'Expert Mentor', icon: 'fa-user-tie' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    activeTab === tab.id ? 'text-blue-400 border-b-2 border-blue-400 bg-white/5' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  <i className={`fas ${tab.icon}`}></i>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
              {activeTab === 'mx_console' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  {/* MX Sub Tabs */}
                  <div className="flex gap-2 bg-slate-900 p-1.5 rounded-2xl border border-white/10 w-fit">
                    {[
                      { id: 'trading', label: 'Trading Desk', icon: 'fa-money-bill-trend-up' },
                      { id: 'risk', label: 'Risk & Analytics', icon: 'fa-chart-area' },
                      { id: 'ops', label: 'Operations & Batch', icon: 'fa-gears' }
                    ].map(sub => (
                      <button 
                        key={sub.id}
                        onClick={() => setMxSubTab(sub.id as any)}
                        className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                          mxSubTab === sub.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <i className={`fas ${sub.icon}`}></i>
                        {sub.label}
                      </button>
                    ))}
                  </div>

                  {mxSubTab === 'trading' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-slate-900 border border-white/10 rounded-[2rem] p-8">
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <i className="fas fa-plus text-blue-500"></i> Capture New Trade
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Product</label>
                              <select className="w-full bg-slate-800 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500">
                                <option>FX_SPOT</option>
                                <option>IRS</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Asset/Pair</label>
                              <select className="w-full bg-slate-800 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500">
                                <option>USDINR</option>
                                <option>EURUSD</option>
                                <option>MIBOR_6M</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Rate (%)</label>
                              <input type="number" placeholder="83.20" className="w-full bg-slate-800 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Notional</label>
                              <input type="number" placeholder="1000000" className="w-full bg-slate-800 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500" />
                            </div>
                          </div>
                          <button 
                            onClick={() => bookTrade('FX_SPOT', 'USDINR', 83.20, 1000000)}
                            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20"
                          >
                            Book Trade (FO Capture)
                          </button>
                        </div>
                        <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-8">
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Market Data (Quotes)</h4>
                          <div className="space-y-4">
                            {Object.entries(marketRates).map(([k, v]) => (
                              <div key={k} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{k}</span>
                                {/* Fix: cast 'v' to number for calculations */}
                                <span className="text-xs font-mono text-emerald-400 font-bold">{(v as number) > 1 ? (v as number).toFixed(2) : ((v as number) * 100).toFixed(2) + '%'}</span>
                              </div>
                            ))}
                            <button className="w-full py-2 border border-white/10 rounded-xl text-[9px] font-black text-slate-500 uppercase hover:text-white transition-colors">
                              Refresh Market Feed
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-white/10 rounded-[2rem] overflow-hidden">
                        <div className="px-8 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Active Trade Repository</h4>
                          <span className="text-[9px] font-black text-slate-500 uppercase">{trades.length} Active Records</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs font-mono">
                            <thead>
                              <tr className="border-b border-white/5 text-slate-500">
                                <th className="px-8 py-4 font-black uppercase tracking-tighter">ID</th>
                                <th className="px-8 py-4 font-black uppercase tracking-tighter">Instrument</th>
                                <th className="px-8 py-4 font-black uppercase tracking-tighter text-right">Notional</th>
                                <th className="px-8 py-4 font-black uppercase tracking-tighter text-right">T-Rate</th>
                                <th className="px-8 py-4 font-black uppercase tracking-tighter">Status</th>
                                <th className="px-8 py-4 font-black uppercase tracking-tighter text-right">Time</th>
                              </tr>
                            </thead>
                            <tbody className="text-slate-300">
                              {trades.length === 0 ? (
                                <tr>
                                  <td colSpan={6} className="px-8 py-16 text-center text-slate-600 font-sans font-bold">
                                    No records found. Initialize Front Office booking.
                                  </td>
                                </tr>
                              ) : (
                                trades.map(t => (
                                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-4 text-blue-400 font-bold">{t.id}</td>
                                    <td className="px-8 py-4">{t.type} <span className="text-[10px] text-slate-500">({t.asset})</span></td>
                                    <td className="px-8 py-4 text-right">${t.notional.toLocaleString()}</td>
                                    <td className="px-8 py-4 text-right">{t.tradeRate}</td>
                                    <td className="px-8 py-4">
                                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                        t.status === 'NEW' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                                      }`}>{t.status}</span>
                                    </td>
                                    <td className="px-8 py-4 text-right text-slate-500">{t.timestamp}</td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {mxSubTab === 'risk' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-8">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total NPV</p>
                          <h4 className={`text-2xl font-bold font-mono ${trades.reduce((a, t) => a + t.npv, 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            ${(trades.reduce((a, t) => a + t.npv, 0) / 1000).toFixed(1)}K
                          </h4>
                        </div>
                        <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-8">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Risk Weight (DV01)</p>
                          <h4 className="text-2xl font-bold font-mono text-white">
                            ${(trades.reduce((a, t) => a + t.dv01, 0) / 1000).toFixed(2)}K
                          </h4>
                        </div>
                        <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-8">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Exposure Limit</p>
                          <h4 className="text-2xl font-bold font-mono text-blue-400">14.2%</h4>
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-white/10 rounded-[2rem] overflow-hidden">
                        <div className="px-8 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Sensitivities & Greeks</h4>
                          <span className="text-[9px] font-black text-slate-500 uppercase">Live Analytics</span>
                        </div>
                        <table className="w-full text-left text-xs font-mono">
                          <thead>
                            <tr className="border-b border-white/5 text-slate-500">
                              <th className="px-8 py-4 font-black uppercase tracking-tighter">Trade ID</th>
                              <th className="px-8 py-4 font-black uppercase tracking-tighter text-right">NPV (Valuation)</th>
                              <th className="px-8 py-4 font-black uppercase tracking-tighter text-right">DV01 (Delta)</th>
                              <th className="px-8 py-4 font-black uppercase tracking-tighter text-right">Current Market</th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-300">
                            {trades.map(t => (
                              <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="px-8 py-4 text-blue-400 font-bold">{t.id}</td>
                                <td className={`px-8 py-4 text-right font-bold ${t.npv >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  ${t.npv.toLocaleString()}
                                </td>
                                <td className="px-8 py-4 text-right text-white">${t.dv01.toLocaleString()}</td>
                                <td className="px-8 py-4 text-right text-slate-500">{t.marketRate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {mxSubTab === 'ops' && (
                    <div className="space-y-6">
                      <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-10 text-center space-y-6">
                        <div className="max-w-md mx-auto space-y-2">
                          <h3 className="text-xl font-black text-white uppercase tracking-tight">End-of-Day Batch Console</h3>
                          <p className="text-slate-500 text-xs font-medium">Orchestrate the 4-stage revaluation and accounting sequence.</p>
                        </div>

                        <div className="flex justify-center items-center gap-12 py-8">
                          {[
                            { id: 'PRICING', label: 'Pricing', icon: 'fa-tags' },
                            { id: 'RISK', label: 'Risk', icon: 'fa-triangle-exclamation' },
                            { id: 'ACCOUNTING', label: 'Accounting', icon: 'fa-file-invoice-dollar' }
                          ].map(step => (
                            <div key={step.id} className="flex flex-col items-center gap-4 relative">
                              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-xl transition-all duration-500 ${
                                batchStatus === step.id ? 'bg-blue-600 text-white scale-110 shadow-xl shadow-blue-500/20' : 
                                batchStatus === 'COMPLETE' || (step.id === 'PRICING' && batchStatus === 'RISK') || (step.id === 'RISK' && batchStatus === 'ACCOUNTING')
                                ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-600 border border-white/5'
                              }`}>
                                <i className={`fas ${step.icon}`}></i>
                              </div>
                              <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{step.label}</span>
                            </div>
                          ))}
                        </div>

                        <div className="max-w-xl mx-auto space-y-4">
                          <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-blue-600 transition-all duration-700 shadow-[0_0_15px_rgba(37,99,235,0.4)]" style={{ width: `${batchProgress}%` }}></div>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span>{batchStatus} CYCLE</span>
                            <span>{batchProgress}% READY</span>
                          </div>
                        </div>

                        <button 
                          onClick={runEOD}
                          disabled={batchStatus !== 'IDLE' && batchStatus !== 'COMPLETE'}
                          className="px-12 py-4 bg-white text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5 disabled:bg-slate-800 disabled:text-slate-600"
                        >
                          {batchStatus === 'IDLE' ? 'Execute Batch Cycle' : batchStatus === 'COMPLETE' ? 'Rerun Batch' : 'Batch Running...'}
                        </button>
                      </div>

                      <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-8 font-mono text-[11px] text-slate-400 space-y-1 h-64 overflow-y-auto custom-scrollbar">
                        {batchLogs.map((log, i) => (
                          <div key={i} className={log.includes('SUCCESS') || log.includes('Finished') ? 'text-emerald-400 font-bold' : ''}>
                            {log}
                          </div>
                        ))}
                        {batchLogs.length === 0 && <div className="text-slate-700 italic">No batch logs available. Run the EOD sequence.</div>}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'terminal' && (
                <div className="font-mono text-xs space-y-2 text-slate-300 flex flex-col h-full animate-in fade-in duration-500">
                  <div className="flex-1">
                    {terminalLines.map((line, i) => (
                      <div key={i} className={`py-0.5 ${line.startsWith('skyline') ? 'text-emerald-400 font-bold' : ''}`}>
                        {line}
                      </div>
                    ))}
                    <div className="flex gap-2 items-center">
                      <span className="text-emerald-400 font-bold whitespace-nowrap">skyline@murex:~$</span>
                      <input 
                        autoFocus
                        type="text"
                        className="bg-transparent border-none outline-none text-white w-full"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value;
                            (e.target as HTMLInputElement).value = '';
                            if (val === 'ls') setTerminalLines(p => [...p, `skyline@murex:~$ ${val}`, 'mx_config.xml  trade_repo.sql  batch_job.sh  pnl_report.py  risk_engine.py']);
                            else if (val === 'clear') setTerminalLines([]);
                            else if (val.startsWith('book')) {
                              const parts = val.split(' ');
                              if (parts.length >= 5) bookTrade(parts[1].toUpperCase() as any, parts[2].toUpperCase(), parseFloat(parts[3]), parseFloat(parts[4]));
                              else setTerminalLines(p => [...p, `skyline@murex:~$ ${val}`, "[ERROR] Invalid syntax. book [fx_spot|irs] [asset] [rate] [notional]"]);
                            }
                            else if (val === 'run eod') runEOD();
                            else if (val === 'market') setTerminalLines(p => [...p, `skyline@murex:~$ ${val}`, ...Object.entries(marketRates).map(([k,v]) => `${k}: ${v}`)]);
                            else setTerminalLines(p => [...p, `skyline@murex:~$ ${val}`, `Unknown command: ${val}. Try 'ls', 'book fx_spot USDINR 83.2 100000', 'market', or 'run eod'`]);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl mt-8 border border-white/5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Enterprise Shell Shortcuts</p>
                    <div className="flex flex-wrap gap-2">
                      {['book fx_spot USDINR 83.2 500000', 'market', 'run eod', 'ls', 'clear'].map(c => (
                        <button key={c} onClick={() => {
                          if (c.startsWith('book')) bookTrade('FX_SPOT', 'USDINR', 83.2, 500000);
                          else if (c === 'run eod') runEOD();
                          else if (c === 'market') setTerminalLines(p => [...p, "skyline@murex:~$ market", ...Object.entries(marketRates).map(([k,v]) => `${k}: ${v}`)]);
                          else if (c === 'ls') setTerminalLines(p => [...p, "skyline@murex:~$ ls", 'mx_config.xml  trade_repo.sql  batch_job.sh  pnl_report.py  risk_engine.py']);
                          else setTerminalLines([]);
                        }} className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-3 py-1 rounded-lg border border-white/5 transition-all text-[9px] font-black uppercase tracking-tighter">
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'docs' && (
                <div className="max-w-4xl mx-auto prose prose-invert font-sans text-slate-400 animate-in fade-in duration-500">
                  <h3 className="text-white font-black text-3xl mb-8 tracking-tighter uppercase">MX.3 Architectural Blueprint</h3>
                  <div className="space-y-10">
                    <section className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                      <h4 className="text-blue-400 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-3">
                        <i className="fas fa-layer-group"></i> Front Office (Trading)
                      </h4>
                      <p className="leading-relaxed font-medium text-sm">Traders capture instruments (FX, IRS, Equities) into the Trade Repository. Murex links these to specific Portfolios and Counterparties. Our simulator's <strong>Trading Desk</strong> replicates the SQL capture logic into the <code>MX_TRADES</code> ledger.</p>
                    </section>
                    <section className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                      <h4 className="text-amber-400 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-3">
                        <i className="fas fa-chart-line"></i> Risk & Market Data
                      </h4>
                      <p className="leading-relaxed font-medium text-sm">Market Data is calibrated to create Yield Curves and Volatility Surfaces. Any delta between the <strong>Trade Rate</strong> and <strong>Market Rate</strong> generates unrealized P&L (MTM). We calculate <strong>DV01</strong> to measure interest rate sensitivity.</p>
                    </section>
                    <section className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                      <h4 className="text-emerald-400 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-3">
                        <i className="fas fa-arrows-spin"></i> Operations (Batch Processing)
                      </h4>
                      <p className="leading-relaxed font-medium text-sm">The <strong>End-of-Day (EOD)</strong> cycle reconciles the day's activity. It involves Valuation (Pricing), Sensitivity Analysis (Risk), and Ledger Postings (Accounting). In the simulator, the <strong>Operations Desk</strong> triggers this automated sequence.</p>
                    </section>
                  </div>
                  <div className="mt-12 p-8 bg-slate-900 border border-blue-500/20 rounded-[2.5rem]">
                    <h5 className="text-blue-400 font-black text-[10px] uppercase tracking-widest mb-4">Professional Tip</h5>
                    <p className="text-xs italic leading-relaxed font-medium">
                      "Real industry value in capital markets engineering lies in the architectural trade lifecycle logic—from capture to settlement—not just vendor-specific UI menus. Master the data flow, and you master the platform."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'tutor' && (
                <div className="max-w-2xl mx-auto space-y-8 font-sans animate-in fade-in duration-500">
                  <div className="flex gap-6 items-start bg-blue-600/10 p-8 rounded-[2.5rem] border border-blue-500/20 shadow-2xl shadow-blue-500/10">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl flex-shrink-0 shadow-xl shadow-blue-500/20">
                      <i className="fas fa-user-tie"></i>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-black text-xl leading-none">Murex Expert Mentor</h4>
                      <p className="text-blue-100 text-sm leading-relaxed font-medium italic">
                        "Welcome to the high-frequency world of capital markets. You're analyzing <strong>{selectedLab.tasks[completedTasks.length] || 'advanced risk reports'}</strong>. Remember: 90% of Murex issues are solved by understanding the SQL trade states and batch log diagnostics."
                      </p>
                    </div>
                  </div>

                  {!activeQuiz ? (
                    <button 
                      onClick={handleGenerateQuiz}
                      disabled={quizLoading}
                      className="w-full bg-slate-900 hover:bg-blue-600 border border-white/10 text-white font-black py-5 rounded-[2.5rem] transition-all flex items-center justify-center gap-4 text-xs uppercase tracking-[0.2em] group shadow-2xl"
                    >
                      {quizLoading ? (
                        <>
                          <i className="fas fa-atom animate-spin"></i>
                          Generating Assessment...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-vial group-hover:rotate-12 transition-transform"></i>
                          Launch Technical Quiz
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 space-y-8 animate-in slide-in-from-bottom-8 duration-500 shadow-2xl">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Knowledge Check: {activeQuiz.context}</span>
                        <button onClick={() => setActiveQuiz(null)} className="text-white/20 hover:text-white"><i className="fas fa-times"></i></button>
                      </div>
                      <h4 className="text-white text-2xl font-black leading-tight tracking-tight">{activeQuiz.question}</h4>
                      
                      {!quizResult ? (
                        <div className="space-y-6">
                          <textarea 
                            value={quizAnswer}
                            onChange={(e) => setQuizAnswer(e.target.value)}
                            placeholder="Type your professional technical explanation here..."
                            className="w-full bg-slate-800 border border-white/5 rounded-[2rem] p-6 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all h-40 font-medium custom-scrollbar"
                          />
                          <button 
                            onClick={handleSubmitAnswer}
                            disabled={evaluating || !quizAnswer.trim()}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-3xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20"
                          >
                            {evaluating ? <><i className="fas fa-brain animate-spin"></i> Analyzing Solution...</> : <><i className="fas fa-paper-plane"></i> Evaluate Answer</>}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-8 animate-in fade-in duration-700">
                          <div className={`p-8 rounded-[2.5rem] border-2 ${quizResult.score >= 75 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                            <div className="flex items-center justify-between mb-6">
                              <span className={`text-[10px] font-black uppercase tracking-widest ${quizResult.score >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>Assessment Result</span>
                              <span className={`text-4xl font-black ${quizResult.score >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>{quizResult.score}%</span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed font-medium italic">"{quizResult.feedback}"</p>
                          </div>
                          <button 
                            onClick={handleGenerateQuiz}
                            className="w-full py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
                          >
                            Next Challenge
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
      {isProvisioning && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-2xl flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-md space-y-10 text-center">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin" style={{ animationDuration: '0.6s' }}></div>
              <i className="fas fa-terminal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-blue-500"></i>
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Initializing Virtual Stack</h2>
              <p className="text-slate-400 text-lg font-medium">Provisioning {selectedLab?.title} simulation...</p>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10 p-0.5 shadow-inner">
              <div 
                className="bg-blue-600 h-full transition-all duration-700 shadow-[0_0_20px_rgba(37,99,235,0.6)] rounded-full" 
                style={{ width: `${provisioningStep}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span>Cloud Resources</span>
              <span>{provisioningStep}% Active</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Live Cloud Labs</h1>
          <p className="text-slate-500 text-xl font-medium">Practice on industrial-grade conceptual simulations. No licenses required.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {labs.map((lab, idx) => (
          <div key={idx} className="bg-white rounded-[3.5rem] overflow-hidden shadow-sm border border-slate-100 group hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col">
            <div className="relative h-64 overflow-hidden">
              <img src={lab.img} alt={lab.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
              <div className="absolute top-8 right-8">
                <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl border border-white/20 ${
                  lab.diff === 'Basic' ? 'bg-emerald-500 text-white' : 
                  lab.diff === 'Intermediate' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {lab.diff}
                </span>
              </div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2 bg-blue-400/10 px-3 py-1 rounded-full w-fit backdrop-blur-sm">
                  <i className="fas fa-microchip"></i>
                  {lab.env}
                </div>
                <h3 className="text-2xl font-black text-white leading-tight tracking-tight uppercase">{lab.title}</h3>
              </div>
            </div>
            <div className="p-10 flex-1 flex flex-col">
              <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">
                <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <i className="far fa-clock text-blue-500"></i> {lab.duration}
                </span>
                <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <i className="fas fa-rocket text-blue-500"></i> Enterprise Stack
                </span>
              </div>
              
              <div className="space-y-3 mb-12 flex-1">
                {lab.tasks.slice(0, 3).map((task, tIdx) => (
                  <div key={tIdx} className="flex items-start gap-4 text-sm text-slate-600 font-bold group/task">
                    <i className="fas fa-circle-check text-emerald-500/30 group-hover/task:text-emerald-500 transition-colors mt-0.5"></i>
                    {task}
                  </div>
                ))}
                {lab.tasks.length > 3 && <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] pl-8">+ {lab.tasks.length - 3} Advance Modules</div>}
              </div>
              
              <button 
                onClick={() => handleStartLab(lab)}
                className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-5 rounded-[2.5rem] transition-all flex items-center justify-center gap-4 group/btn shadow-xl shadow-slate-200 hover:shadow-blue-500/30 text-xs uppercase tracking-widest"
              >
                Launch Simulation
                <i className="fas fa-play text-[10px] group-hover/btn:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveLabs;
