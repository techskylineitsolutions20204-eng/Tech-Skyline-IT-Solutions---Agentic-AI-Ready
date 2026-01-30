
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
  product: 'FX_SPOT' | 'FX_FORWARD' | 'FX_SWAP' | 'IRS' | 'OIS' | 'CDS';
  buyCcy: string;
  sellCcy: string;
  notional: number;
  tradeRate: number;
  marketRate: number;
  status: 'NEW' | 'PRICED' | 'VERIFIED' | 'SETTLED' | 'MATURED';
  npv: number;
  dv01: number;
  delta: number;
  timestamp: string;
  counterparty: string;
  book: string;
  tenor: string;
}

const labs: Lab[] = [
  { 
    title: 'Murex Technical Environment (MX.3)', 
    env: 'Unix + SQL + Python + QuantLib', 
    duration: '240 mins', 
    diff: 'Advanced',
    img: 'https://images.unsplash.com/photo-1611974714851-eb6051612342?auto=format&fit=crop&q=80&w=800',
    tasks: [
      'FO: Capture IRS/FX trades in Excel Blotter schema', 
      'MO: Revaluate Portfolio using Yield Curves', 
      'Risk: Calculate DV01 and Monte Carlo VaR',
      'BO: SQL Cashflow Reconciliation (T+1)',
      'Unix: Scripting daily_eod.sh with cron'
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
  const [activeTab, setActiveTab] = useState<'terminal' | 'mx_console' | 'specs' | 'docs' | 'tutor'>('terminal');
  const [mxSubTab, setMxSubTab] = useState<'fo' | 'mo' | 'bo' | 'batch'>('fo');
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  // Murex Simulator State
  const [trades, setTrades] = useState<Trade[]>([]);
  const [marketRates, setMarketRates] = useState<Record<string, number>>({ 
    USDINR_SPOT: 83.45, 
    EURUSD_SPOT: 1.085, 
    SOFR_6M: 0.0525, 
    MIBOR_3M: 0.065,
    CDS_SPREAD: 0.012 
  });
  const [batchStatus, setBatchStatus] = useState<'IDLE' | 'PRICING' | 'RISK' | 'SETTLEMENT' | 'COMPLETE'>('IDLE');
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
    setTerminalLines([
      '# Skyline OS Enterprise Edition',
      '# Booting Murex VM Environment...',
      '# Mounting /opt/murex/mx3_simulator',
      '# Loading QuantLib pricing kernels...',
      '# status: SUCCESS',
      'skyline@murex-consultant:~$ '
    ]);
    setCompletedTasks([]);
    setTrades([]);
    setBatchLogs([]);
    setBatchStatus('IDLE');
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

  const bookTrade = (product: Trade['product'], ccyPair: string, rate: number, notional: number, tenor: string) => {
    const mktKey = product.startsWith('FX') ? `${ccyPair}_SPOT` : 'SOFR_6M';
    const mktRate = marketRates[mktKey] || 0.05;
    
    // Simple MTM Reval
    let npv = 0;
    if (product === 'FX_SPOT') npv = (mktRate - rate) * notional;
    else if (product === 'IRS') npv = (rate - mktRate) * (notional * 0.05); // Simulated IRS value
    else npv = (mktRate - rate) * notional * 0.9;

    const newTrade: Trade = {
      id: `MX_${Math.floor(10000 + Math.random() * 89999)}`,
      product,
      buyCcy: ccyPair.substring(0, 3),
      sellCcy: ccyPair.substring(3, 6) || 'INR',
      notional,
      tradeRate: rate,
      marketRate: mktRate,
      status: 'NEW',
      npv,
      dv01: notional * 0.0001,
      delta: notional,
      timestamp: new Date().toLocaleTimeString(),
      counterparty: 'GS_LDN_DESK',
      book: 'HFT_GLOBAL_01',
      tenor
    };

    setTrades(prev => [newTrade, ...prev]);
    setTerminalLines(p => [...p, `skyline@murex:~$ book ${product} ${ccyPair} ${rate} ${notional} ${tenor}`, `[FO] Trade ${newTrade.id} inserted into MX_TRADE_LEDGER (SQLite3).`]);
  };

  const runBatch = () => {
    if (trades.length === 0) return alert('Front Office: Book trades first!');
    setBatchStatus('PRICING');
    setBatchLogs(['[BATCH] Loading Market Data Curves...', '[PRICING] Running Revaluation Engine...']);
    
    setTimeout(() => {
      setBatchStatus('RISK');
      setBatchLogs(p => [...p, '[RISK] Calculating Greeks (DV01, Gamma)...', '[RISK] Running Monte Carlo VaR (99.9% CI)...']);
      setTimeout(() => {
        setBatchStatus('SETTLEMENT');
        setBatchLogs(p => [...p, '[OPS] Generating MT300 Confirmation XML...', '[OPS] Reconciling cashflows against NOSTRO...']);
        setTimeout(() => {
          setBatchStatus('COMPLETE');
          setBatchLogs(p => [...p, '[SUCCESS] Batch chain finished.', '[EOD] reports/daily_pnl.csv exported.']);
          setTrades(prev => prev.map(t => ({ ...t, status: 'SETTLED' })));
        }, 1500);
      }, 1500);
    }, 1500);
  };

  const handleTerminal = (cmd: string) => {
    const parts = cmd.toLowerCase().trim().split(' ');
    const action = parts[0];
    let output = '';

    if (action === 'ls') output = 'trades.xlsx  market_data.csv  risk_engine/  batch/  daily_eod.sh';
    else if (action === 'grep' && parts[1] === 'irs') output = trades.filter(t => t.product === 'IRS').map(t => `${t.id} IRS ${t.notional}`).join('\n') || 'No matches.';
    else if (action === 'sqlite3') output = 'SQLite version 3.41.0\nsqlite> SELECT * FROM trades;';
    else if (action === 'python' && parts[1]?.includes('pricing')) output = '[QuantLib] Revaluation Complete. Portofolio NPV: $' + trades.reduce((a, b) => a + b.npv, 0).toLocaleString();
    else if (action === 'cat') output = 'CURVE,TENOR,RATE\nSOFR,1M,5.25\nSOFR,3M,5.30\nSOFR,6M,5.35';
    else if (action === 'clear') { setTerminalLines(['skyline@murex-consultant:~$ ']); return; }
    else output = `sh: command not found: ${action}`;

    setTerminalLines(p => [...p, `skyline@murex-consultant:~$ ${cmd}`, output]);
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
      <div className="max-w-7xl mx-auto h-[calc(100vh-12rem)] flex flex-col animate-in fade-in duration-500 bg-slate-950 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
        {/* Lab Header */}
        <div className="bg-slate-900 p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedLab(null)} className="text-white/30 hover:text-white transition-colors">
              <i className="fas fa-power-off"></i>
            </button>
            <div>
              <h2 className="text-white font-black text-xs uppercase tracking-[0.2em]">{selectedLab.title}</h2>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  CONSULTANT_ACCESS: LIVE
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-1">
              <span className="w-6 h-6 rounded-lg bg-blue-600 border border-slate-900 flex items-center justify-center text-[8px] text-white font-bold">FO</span>
              <span className="w-6 h-6 rounded-lg bg-emerald-600 border border-slate-900 flex items-center justify-center text-[8px] text-white font-bold">MO</span>
              <span className="w-6 h-6 rounded-lg bg-amber-600 border border-slate-900 flex items-center justify-center text-[8px] text-white font-bold">BO</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Nav */}
          <aside className="w-64 bg-slate-950 border-r border-white/5 p-6 flex flex-col gap-8">
            <div className="space-y-4">
              <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Lifecycle Desks</h3>
              <nav className="space-y-1">
                {[
                  { id: 'mx_console', label: 'MX.3 Environment', icon: 'fa-desktop' },
                  { id: 'terminal', label: 'Unix Console', icon: 'fa-terminal' },
                  { id: 'specs', label: 'Functional Specs', icon: 'fa-file-signature' },
                  { id: 'docs', label: 'Product Manual', icon: 'fa-book' },
                  { id: 'tutor', label: 'L3 Certification', icon: 'fa-graduation-cap' }
                ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <i className={`fas ${item.icon}`}></i>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-auto space-y-4">
              <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Training Plan</h3>
              <div className="space-y-2">
                {selectedLab.tasks.map((task, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setCompletedTasks(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx])}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      completedTasks.includes(idx) ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-500'
                    }`}
                  >
                    <p className="text-[9px] font-bold leading-tight">{task}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col bg-slate-900/40 relative">
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
              {activeTab === 'mx_console' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex gap-4">
                      {[
                        { id: 'fo', label: 'Front Office', icon: 'fa-money-bill-transfer' },
                        { id: 'mo', label: 'Risk & Pricing', icon: 'fa-chart-area' },
                        { id: 'bo', label: 'Back Office', icon: 'fa-receipt' },
                        { id: 'batch', label: 'Batch Console', icon: 'fa-bolt' }
                      ].map(desk => (
                        <button
                          key={desk.id}
                          onClick={() => setMxSubTab(desk.id as any)}
                          className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                            mxSubTab === desk.id ? 'bg-white text-slate-900' : 'text-slate-500 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <i className={`fas ${desk.icon}`}></i>
                          {desk.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {mxSubTab === 'fo' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-7 space-y-6">
                        <div className="bg-slate-950 border border-white/5 rounded-2xl p-8">
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <i className="fas fa-plus text-blue-500"></i> FO: Capture New Trade
                          </h4>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Instrument</label>
                              <select className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none">
                                <option>FX_SPOT</option>
                                <option>FX_FORWARD</option>
                                <option>IRS</option>
                                <option>OIS</option>
                                <option>CDS</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Asset/Pair</label>
                              <select className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none">
                                <option>USDINR</option>
                                <option>EURUSD</option>
                                <option>GBPUSD</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Trade Rate</label>
                              <input type="number" placeholder="83.20" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Notional</label>
                              <input type="number" placeholder="1000000" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none" />
                            </div>
                          </div>
                          <button 
                            onClick={() => bookTrade('FX_SPOT', 'USDINR', 83.20, 1000000, '6M')}
                            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest transition-all"
                          >
                            Capture to MX_TRADES
                          </button>
                        </div>

                        <div className="bg-slate-950 border border-white/5 rounded-2xl overflow-hidden">
                          <div className="px-6 py-4 bg-white/5 border-b border-white/5">
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Conceptual Trade Repository</h4>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-[10px] font-mono">
                              <thead className="bg-white/5 text-slate-500">
                                <tr>
                                  <th className="px-6 py-3 font-black uppercase">MX_ID</th>
                                  <th className="px-6 py-3 font-black uppercase">Product</th>
                                  <th className="px-6 py-3 font-black uppercase">Notional</th>
                                  <th className="px-6 py-3 font-black uppercase">Status</th>
                                </tr>
                              </thead>
                              <tbody className="text-slate-300">
                                {trades.map(t => (
                                  <tr key={t.id} className="border-b border-white/5">
                                    <td className="px-6 py-3 text-blue-400 font-bold">{t.id}</td>
                                    <td className="px-6 py-3">{t.product} ({t.buyCcy}/{t.sellCcy})</td>
                                    <td className="px-6 py-3">${t.notional.toLocaleString()}</td>
                                    <td className="px-6 py-3">
                                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[8px] font-black uppercase">{t.status}</span>
                                    </td>
                                  </tr>
                                ))}
                                {trades.length === 0 && <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-600 italic">No trades captured. FO Desk empty.</td></tr>}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div className="lg:col-span-5 space-y-6">
                        <div className="bg-slate-950 border border-white/5 rounded-2xl p-6">
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4">Live Curves & Market Feed</h4>
                          <div className="space-y-3">
                            {Object.entries(marketRates).map(([k, v]) => (
                              <div key={k} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-[10px] font-bold text-slate-400">{k}</span>
                                <span className="text-xs font-mono text-emerald-400 font-bold">{(v as number) > 1 ? (v as number).toFixed(2) : ((v as number) * 100).toFixed(2) + '%'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-slate-950 border border-white/5 rounded-2xl p-6">
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-2">QuantLib Snippet</h4>
                          <pre className="text-[9px] font-mono text-slate-500 overflow-x-auto whitespace-pre">
                            {`import QuantLib as ql\n# Bootstrapping SOFR Curve\ncurve = ql.FlatForward(0, ql.TARGET(), \n           0.0525, ql.Actual365Fixed())\nhandle = ql.YieldTermStructureHandle(curve)\n# Pricing IRS001\nengine = ql.DiscountingSwapEngine(handle)`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {mxSubTab === 'mo' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-slate-950 p-6 rounded-2xl border border-white/5">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total NPV</p>
                          <h4 className={`text-2xl font-bold font-mono ${trades.reduce((a, b) => a + b.npv, 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            ${(trades.reduce((a, b) => a + b.npv, 0) / 1000).toFixed(1)}K
                          </h4>
                        </div>
                        <div className="bg-slate-950 p-6 rounded-2xl border border-white/5">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Portfolio DV01</p>
                          <h4 className="text-2xl font-bold font-mono text-white">
                            ${(trades.reduce((a, b) => a + b.dv01, 0)).toFixed(2)}
                          </h4>
                        </div>
                        <div className="bg-slate-950 p-6 rounded-2xl border border-white/5">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">VaR (99.9% MC)</p>
                          <h4 className="text-2xl font-bold font-mono text-rose-400">
                            -${(trades.length * 850).toLocaleString()}
                          </h4>
                        </div>
                        <div className="bg-slate-950 p-6 rounded-2xl border border-white/5">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Greeks Engine</p>
                          <span className="text-[9px] font-black text-emerald-400 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> ACTIVE
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-950 border border-white/5 rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 bg-white/5 border-b border-white/5">
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Risk Reports (MO Analytics)</h4>
                        </div>
                        <table className="w-full text-left text-[10px] font-mono">
                          <thead className="bg-white/5 text-slate-500">
                            <tr>
                              <th className="px-6 py-3 font-black uppercase">MX_ID</th>
                              <th className="px-6 py-3 font-black uppercase text-right">NPV</th>
                              <th className="px-6 py-3 font-black uppercase text-right">DV01</th>
                              <th className="px-6 py-3 font-black uppercase text-right">Gamma</th>
                              <th className="px-6 py-3 font-black uppercase">Book</th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-300">
                            {trades.map(t => (
                              <tr key={t.id} className="border-b border-white/5">
                                <td className="px-6 py-3 text-blue-400 font-bold">{t.id}</td>
                                <td className={`px-6 py-3 text-right font-bold ${t.npv >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>${t.npv.toLocaleString()}</td>
                                <td className="px-6 py-3 text-right">${t.dv01.toLocaleString()}</td>
                                <td className="px-6 py-3 text-right">0.021</td>
                                <td className="px-6 py-3 text-slate-500">{t.book}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {mxSubTab === 'bo' && (
                    <div className="space-y-6">
                      <div className="bg-slate-950 border border-white/5 rounded-2xl p-8">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                          <i className="fas fa-file-invoice-dollar text-amber-500"></i> BO: Settlements & GL Posts
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">Generate SWIFT MT300 Confirmation:</p>
                            <pre className="bg-slate-900 p-4 rounded-xl text-[10px] font-mono text-slate-500 border border-white/5">
                              {`:20:MX-SIM-882\n:22A:NEWT\n:82A:TECH_SKYLINE\n:87A:JP_MORGAN_LDN\n:30T:20260215\n:30V:20260217`}
                            </pre>
                          </div>
                          <div className="space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">Reconcile T+1 Break Management (SQL):</p>
                            <pre className="bg-slate-900 p-4 rounded-xl text-[10px] font-mono text-emerald-400 border border-white/5">
                              {`SELECT trade_id, amt_diff \nFROM recon_breaks \nWHERE status = 'OPEN';`}
                            </pre>
                            <button className="bg-white/5 hover:bg-white/10 text-white font-black py-2 px-6 rounded-lg text-[9px] uppercase tracking-widest border border-white/10 transition-all">
                              Run Recon Query
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {mxSubTab === 'batch' && (
                    <div className="space-y-6">
                      <div className="bg-slate-950 border border-white/5 rounded-[2.5rem] p-12 text-center space-y-10">
                        <div className="max-w-md mx-auto space-y-2">
                          <h3 className="text-2xl font-black text-white uppercase tracking-tight">EOD Processing Console</h3>
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Master Batch Orchestration</p>
                        </div>

                        <div className="flex justify-center items-center gap-12">
                          {[
                            { id: 'PRICING', label: 'Reval', icon: 'fa-tags' },
                            { id: 'RISK', label: 'Greeks', icon: 'fa-chart-pie' },
                            { id: 'SETTLEMENT', label: 'Cashflows', icon: 'fa-money-bill-transfer' }
                          ].map(step => (
                            <div key={step.id} className="flex flex-col items-center gap-4 relative">
                              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-xl transition-all duration-700 ${
                                batchStatus === step.id ? 'bg-blue-600 text-white scale-110 shadow-xl shadow-blue-500/30' : 
                                batchStatus === 'COMPLETE' || (step.id === 'PRICING' && (batchStatus === 'RISK' || batchStatus === 'SETTLEMENT')) || (step.id === 'RISK' && batchStatus === 'SETTLEMENT')
                                ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-600 border border-white/5'
                              }`}>
                                <i className={`fas ${step.icon}`}></i>
                              </div>
                              <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{step.label}</span>
                            </div>
                          ))}
                        </div>

                        <button 
                          onClick={runBatch}
                          disabled={batchStatus !== 'IDLE' && batchStatus !== 'COMPLETE'}
                          className="px-16 py-5 bg-white text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl"
                        >
                          {batchStatus === 'IDLE' ? 'Execute Daily EOD' : 'Rerun Batch Sequence'}
                        </button>
                      </div>

                      <div className="bg-slate-950 border border-white/5 rounded-2xl p-8 font-mono text-[10px] text-slate-500 space-y-1 h-48 overflow-y-auto custom-scrollbar">
                        {batchLogs.map((log, i) => (
                          <div key={i} className={log.includes('SUCCESS') || log.includes('finished') ? 'text-emerald-400' : ''}>
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'terminal' && (
                <div className="font-mono text-[11px] space-y-2 text-emerald-400 flex flex-col h-full animate-in fade-in">
                  <div className="flex-1">
                    {terminalLines.map((line, i) => (
                      <div key={i} className={`py-0.5 ${line.includes('skyline@') ? 'text-white font-bold' : ''}`}>
                        {line}
                      </div>
                    ))}
                    <div className="flex gap-2 items-center">
                      <span className="text-white font-bold whitespace-nowrap">skyline@murex-consultant:~$</span>
                      <input 
                        autoFocus
                        type="text"
                        className="bg-transparent border-none outline-none text-emerald-400 w-full"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value;
                            (e.target as HTMLInputElement).value = '';
                            handleTerminal(val);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Unix Utility Palette</p>
                    <div className="flex flex-wrap gap-2">
                      {['ls', 'grep irs', 'sqlite3', 'python pricing.py', 'cat market_data.csv', 'clear'].map(c => (
                        <button key={c} onClick={() => handleTerminal(c)} className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/5 transition-all text-[9px] font-black uppercase tracking-tighter">
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
                  <h3 className="text-white font-black text-3xl mb-8 tracking-tighter uppercase">Functional Specifications (L2 Training)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="bg-slate-950 p-8 rounded-[2rem] border border-blue-500/20 shadow-xl">
                      <h4 className="text-blue-400 font-black uppercase text-[10px] tracking-widest mb-6 flex items-center gap-3">
                        <i className="fas fa-file-invoice"></i> FO Desk Spec
                      </h4>
                      <ul className="space-y-4 text-[11px] text-slate-400 font-medium">
                        <li className="flex gap-3"><i className="fas fa-check text-blue-500 mt-1"></i> System shall allow traders to book IR Swaps with reset schedules.</li>
                        <li className="flex gap-3"><i className="fas fa-check text-blue-500 mt-1"></i> Curve validation required before pricing trigger.</li>
                        <li className="flex gap-3"><i className="fas fa-check text-blue-500 mt-1"></i> Trade repository must enforce counterparty limits.</li>
                      </ul>
                    </section>

                    <section className="bg-slate-950 p-8 rounded-[2rem] border border-emerald-500/20 shadow-xl">
                      <h4 className="text-emerald-400 font-black uppercase text-[10px] tracking-widest mb-6 flex items-center gap-3">
                        <i className="fas fa-chart-line"></i> MO Risk Spec
                      </h4>
                      <ul className="space-y-4 text-[11px] text-slate-400 font-medium">
                        <li className="flex gap-3"><i className="fas fa-check text-emerald-500 mt-1"></i> DV01 calculation per 1bp shift on yield term handles.</li>
                        <li className="flex gap-3"><i className="fas fa-check text-emerald-500 mt-1"></i> Portfolio VaR computed daily using MC simulation (99%).</li>
                        <li className="flex gap-3"><i className="fas fa-check text-emerald-500 mt-1"></i> Stress test scenario: +100bps parallel shift.</li>
                      </ul>
                    </section>
                  </div>
                </div>
              )}

              {activeTab === 'tutor' && (
                <div className="max-w-2xl mx-auto space-y-8 font-sans">
                  <div className="flex gap-6 items-start bg-blue-600/10 p-8 rounded-[2.5rem] border border-blue-500/20 shadow-2xl shadow-blue-500/10">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl flex-shrink-0">
                      <i className="fas fa-user-tie"></i>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-black text-xl">L3 Support Certification</h4>
                      <p className="text-blue-100 text-sm leading-relaxed italic">
                        "Welcome, Architect. You are analyzing <strong>Trade Lifecycle Automation</strong>. In a Murex role, they test for architectural logic: how data flows from capture to GL. Master the reval logic, and the job is yours."
                      </p>
                    </div>
                  </div>

                  {!activeQuiz ? (
                    <button 
                      onClick={handleGenerateQuiz}
                      disabled={quizLoading}
                      className="w-full bg-slate-950 hover:bg-blue-600 border border-white/10 text-white font-black py-5 rounded-[2rem] transition-all flex items-center justify-center gap-4 text-xs uppercase tracking-[0.2em] group shadow-2xl shadow-blue-500/10"
                    >
                      {quizLoading ? <><i className="fas fa-atom animate-spin"></i> Analyzing Env...</> : <><i className="fas fa-vial"></i> Take L2 Technical Quiz</>}
                    </button>
                  ) : (
                    <div className="bg-slate-950 border border-white/10 rounded-[2.5rem] p-10 space-y-8 animate-in slide-in-from-bottom-8 duration-500">
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
                            placeholder="Explain the technical revaluation or batch logic here..."
                            className="w-full bg-slate-900 border border-white/5 rounded-[2rem] p-6 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all h-40 font-medium custom-scrollbar"
                          />
                          <button 
                            onClick={handleSubmitAnswer}
                            disabled={evaluating || !quizAnswer.trim()}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-3xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20"
                          >
                            {evaluating ? <><i className="fas fa-brain animate-spin"></i> Grading...</> : <><i className="fas fa-paper-plane"></i> Submit Answer</>}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-8 animate-in fade-in duration-700">
                          <div className={`p-8 rounded-[2.5rem] border-2 ${quizResult.score >= 75 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                            <div className="flex items-center justify-between mb-6">
                              <span className={`text-[10px] font-black uppercase tracking-widest ${quizResult.score >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>Score</span>
                              <span className={`text-4xl font-black ${quizResult.score >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>{quizResult.score}%</span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed font-medium italic">"{quizResult.feedback}"</p>
                          </div>
                          <button onClick={handleGenerateQuiz} className="w-full py-4 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/10 hover:bg-white/10 transition-all">Next Certification Question</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom System Bar */}
            <div className="h-10 bg-slate-950 border-t border-white/5 flex items-center justify-between px-8 text-[9px] font-black uppercase tracking-widest text-slate-600">
              <div className="flex gap-4">
                <span>CPU: 4%</span>
                <span>MEM: 1.2GB/16GB</span>
                <span>PROV: ACTIVE</span>
              </div>
              <div className="flex gap-4">
                <span className="text-emerald-400 animate-pulse">● REVAL_ENGINE_READY</span>
                <span>UTC+0</span>
              </div>
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
              <i className="fas fa-microchip absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-blue-500"></i>
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Initializing Virtual Environment</h2>
              <p className="text-slate-400 text-lg font-medium">Provisioning {selectedLab?.title} stack...</p>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10 p-0.5 shadow-inner">
              <div className="bg-blue-600 h-full transition-all duration-700 shadow-[0_0_20px_rgba(37,99,235,0.6)] rounded-full" style={{ width: `${provisioningStep}%` }}></div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Live Sandbox</h1>
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
                  <i className="fas fa-rocket text-blue-500"></i> Workforce Ready
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
                Launch Sandbox
                <i className="fas fa-terminal text-[10px] group-hover/btn:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveLabs;
