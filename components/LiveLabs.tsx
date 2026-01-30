
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
  product: 'FX_SPOT' | 'FX_FORWARD' | 'IRS' | 'OIS' | 'CDS';
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
}

const labs: Lab[] = [
  { 
    title: 'Murex Technical Environment (MX.3)', 
    env: 'Unix + SQLite3 + QuantLib + Python', 
    duration: '240 mins', 
    diff: 'Advanced',
    img: 'https://images.unsplash.com/photo-1611974714851-eb6051612342?auto=format&fit=crop&q=80&w=800',
    tasks: [
      'FO: Capture IRS/FX trades in JSON/Excel schema', 
      'MO: Revaluate Portfolio using QuantLib curves', 
      'Risk: Compute DV01, Gamma, and Monte Carlo VaR',
      'BO: SQL reconciliation of T+1 cashflows',
      'Unix: Execute daily_eod.sh via simulated cron'
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

  // Murex Sim State
  const [trades, setTrades] = useState<Trade[]>([]);
  const [marketRates, setMarketRates] = useState<Record<string, number>>({ USDINR: 83.45, EURUSD: 1.085, MIBOR: 0.065, SOFR: 0.052 });
  const [batchStatus, setBatchStatus] = useState<'IDLE' | 'PRICING' | 'RISK' | 'SETTLEMENT' | 'COMPLETE'>('IDLE');
  const [batchLogs, setBatchLogs] = useState<string[]>([]);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);

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
      '# Skyline OS v4.2 (Agentic Edition)',
      '# Initializing Murex VM Environment...',
      '# Mounting trades/, market_data/, risk_engine/, reports/',
      '# Access Level: ROOT_CONSULTANT_ACCESS_GRANTED',
      '# skyline@murex-mx3:~$ '
    ]);
    setCompletedTasks([]);
    setTrades([]);
    setBatchLogs([]);
    setBatchStatus('IDLE');
    setSystemLogs(['[SYSTEM] Kernel loaded.', '[MX3] Services started on port 9090.']);
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

  const bookTrade = (product: Trade['product'], asset: string, rate: number, notional: number) => {
    const mktRate = product.startsWith('FX') ? marketRates.USDINR : marketRates.SOFR;
    const npv = product.startsWith('FX') ? (mktRate - rate) * notional : (rate - mktRate) * (notional * 0.05);
    const dv01 = notional * 0.0001;

    const newTrade: Trade = {
      id: `MX_${Math.floor(1000 + Math.random() * 8999)}`,
      product,
      buyCcy: asset.substring(0, 3),
      sellCcy: asset.substring(3, 6) || 'INR',
      notional,
      tradeRate: rate,
      marketRate: mktRate,
      status: 'NEW',
      npv,
      dv01,
      delta: notional,
      timestamp: new Date().toLocaleTimeString(),
      counterparty: 'JP_MORGAN_NY',
      book: 'TRADING_HFT_01'
    };

    setTrades(prev => [newTrade, ...prev]);
    setSystemLogs(prev => [...prev, `[FO] Trade ${newTrade.id} captured successfully.`]);
  };

  const executeBatch = () => {
    if (trades.length === 0) return alert('Book trades in Front Office first!');
    setBatchStatus('PRICING');
    setBatchLogs(['[BATCH] Triggering EOD cycle...', '[PRICING] Running reval on 24 curves...']);
    
    setTimeout(() => {
      setBatchStatus('RISK');
      setBatchLogs(prev => [...prev, '[RISK] Computing portfolio VaR (Monte Carlo 10k)...', '[RISK] Calculating Greeks...']);
      setTimeout(() => {
        setBatchStatus('SETTLEMENT');
        setBatchLogs(prev => [...prev, '[OPS] Generating SWIFT MT300 messages...', '[OPS] Reconciling cash accounts...']);
        setTimeout(() => {
          setBatchStatus('COMPLETE');
          setBatchLogs(prev => [...prev, '[SYSTEM] Batch sequence successful.', '[SUCCESS] reports/daily_pnl.csv exported.']);
          setTrades(prev => prev.map(t => ({ ...t, status: 'SETTLED' })));
        }, 1500);
      }, 1500);
    }, 1500);
  };

  const handleTerminalCommand = (cmd: string) => {
    const parts = cmd.toLowerCase().trim().split(' ');
    const action = parts[0];

    let output = '';
    if (action === 'ls') {
      output = 'trades/  market_data/  risk_engine/  batch/  reports/  daily_eod.sh';
    } else if (action === 'grep' && parts[1] === 'irs') {
      output = trades.filter(t => t.product === 'IRS').map(t => `${t.id},${t.product},${t.notional},${t.tradeRate}`).join('\n') || 'No IRS trades found.';
    } else if (action === 'awk') {
      output = '1,000,000\n5,000,000\n250,000';
    } else if (action === 'sqlite3') {
      output = 'SQLite version 3.40.1\nEnter ".help" for usage hints.\nsqlite> ';
    } else if (action === 'python' && parts[1]?.includes('pricing')) {
      output = '[QuantLib] Revaluation complete. Portfolio NPV: $' + trades.reduce((a, b) => a + b.npv, 0).toLocaleString();
    } else if (action === 'clear') {
      setTerminalLines(['skyline@murex-mx3:~$ ']);
      return;
    } else {
      output = `sh: command not found: ${action}`;
    }

    setTerminalLines(p => [...p, `skyline@murex-mx3:~$ ${cmd}`, output]);
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
      <div className="max-w-7xl mx-auto h-[calc(100vh-12rem)] flex flex-col animate-in fade-in duration-500 bg-slate-900 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
        {/* Lab Header */}
        <div className="bg-slate-950 p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedLab(null)} className="text-white/30 hover:text-white">
              <i className="fas fa-power-off"></i>
            </button>
            <div>
              <h2 className="text-white font-black text-xs uppercase tracking-[0.2em]">{selectedLab.title}</h2>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  CONNECTED: ROOT_NODE_01
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 border border-slate-900 flex items-center justify-center text-[8px] text-white font-bold">FO</div>
              <div className="w-6 h-6 rounded-full bg-emerald-600 border border-slate-900 flex items-center justify-center text-[8px] text-white font-bold">MO</div>
              <div className="w-6 h-6 rounded-full bg-amber-600 border border-slate-900 flex items-center justify-center text-[8px] text-white font-bold">BO</div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Nav Sidebar */}
          <aside className="w-64 bg-slate-950 border-r border-white/5 p-6 flex flex-col gap-8">
            <div className="space-y-4">
              <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Lifecycle Desks</h3>
              <nav className="space-y-1">
                {[
                  { id: 'mx_console', label: 'MX.3 Simulator', icon: 'fa-desktop' },
                  { id: 'terminal', label: 'Unix Console', icon: 'fa-terminal' },
                  { id: 'specs', label: 'Functional Specs', icon: 'fa-file-signature' },
                  { id: 'docs', label: 'Murex Manual', icon: 'fa-book-open' },
                  { id: 'tutor', label: 'Mentor Hub', icon: 'fa-headset' }
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
              <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Task Backlog</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
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

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col bg-slate-900/50 relative">
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
              {activeTab === 'mx_console' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex gap-4">
                      {[
                        { id: 'fo', label: 'Front Office', icon: 'fa-money-bill-transfer' },
                        { id: 'mo', label: 'Middle Office (Risk)', icon: 'fa-chart-line' },
                        { id: 'bo', label: 'Back Office (Ops)', icon: 'fa-vault' },
                        { id: 'batch', label: 'Batch/EOD', icon: 'fa-bolt' }
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
                      <div className="lg:col-span-8 space-y-6">
                        <div className="bg-slate-950 border border-white/5 rounded-2xl p-8">
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <i className="fas fa-plus-circle text-blue-500"></i> New Trade Capture (JSON Mapping)
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Instrument</label>
                              <select className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none">
                                <option>IRS</option>
                                <option>FX_SPOT</option>
                                <option>FX_FORWARD</option>
                                <option>OIS</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Buy/Sell Pair</label>
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
                            onClick={() => bookTrade('IRS', 'USDINR', 83.20, 1000000)}
                            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest transition-all"
                          >
                            Capture into trade_repo.sql
                          </button>
                        </div>

                        <div className="bg-slate-950 border border-white/5 rounded-2xl overflow-hidden">
                          <div className="px-6 py-4 bg-white/5 flex justify-between items-center">
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Trade Ledger (Front Office)</h4>
                          </div>
                          <table className="w-full text-left text-[10px] font-mono">
                            <thead className="bg-white/5 text-slate-500">
                              <tr>
                                <th className="px-6 py-3 font-black uppercase">ID</th>
                                <th className="px-6 py-3 font-black uppercase">Asset</th>
                                <th className="px-6 py-3 font-black uppercase text-right">Notional</th>
                                <th className="px-6 py-3 font-black uppercase">Status</th>
                              </tr>
                            </thead>
                            <tbody className="text-slate-300">
                              {trades.map(t => (
                                <tr key={t.id} className="border-b border-white/5">
                                  <td className="px-6 py-3 text-blue-400 font-bold">{t.id}</td>
                                  <td className="px-6 py-3">{t.product} ({t.buyCcy}/{t.sellCcy})</td>
                                  <td className="px-6 py-3 text-right">${t.notional.toLocaleString()}</td>
                                  <td className="px-6 py-3">
                                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[8px] font-black uppercase">{t.status}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="lg:col-span-4 space-y-6">
                        <div className="bg-slate-950 border border-white/5 rounded-2xl p-6">
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4">Market Data Curves</h4>
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
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4">Pricing Skeleton (QuantLib)</h4>
                          <pre className="text-[9px] font-mono text-slate-500 overflow-x-auto whitespace-pre-wrap">
                            {`import QuantLib as ql
# Constructing Discount Curve
curve = ql.FlatForward(0, ql.TARGET(), 0.05, ql.Actual365Fixed())
handle = ql.RelinkableYieldTermStructureHandle(curve)
# Pricing IRS001...
engine = ql.DiscountingSwapEngine(handle)
swap.setPricingEngine(engine)`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {mxSubTab === 'mo' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-slate-950 p-6 rounded-2xl border border-white/5">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Portfolio NPV</p>
                          <h4 className={`text-xl font-bold font-mono ${trades.reduce((a, b) => a + b.npv, 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            ${(trades.reduce((a, b) => a + b.npv, 0) / 1000).toFixed(1)}K
                          </h4>
                        </div>
                        <div className="bg-slate-950 p-6 rounded-2xl border border-white/5">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total DV01</p>
                          <h4 className="text-xl font-bold font-mono text-white">
                            ${(trades.reduce((a, b) => a + b.dv01, 0) / 1).toFixed(2)}
                          </h4>
                        </div>
                        <div className="bg-slate-950 p-6 rounded-2xl border border-white/5">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">99% VaR (1D)</p>
                          <h4 className="text-xl font-bold font-mono text-rose-400">
                            -${(trades.length * 450).toLocaleString()}
                          </h4>
                        </div>
                        <div className="bg-slate-950 p-6 rounded-2xl border border-white/5">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Risk Engine</p>
                          <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">ACTIVE</span>
                        </div>
                      </div>

                      <div className="bg-slate-950 border border-white/5 rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 bg-white/5">
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Risk Sensitivities (Greeks)</h4>
                        </div>
                        <table className="w-full text-left text-[10px] font-mono">
                          <thead className="bg-white/5 text-slate-500">
                            <tr>
                              <th className="px-6 py-3 font-black uppercase">Trade ID</th>
                              <th className="px-6 py-3 font-black uppercase text-right">NPV</th>
                              <th className="px-6 py-3 font-black uppercase text-right">DV01</th>
                              <th className="px-6 py-3 font-black uppercase text-right">Delta</th>
                              <th className="px-6 py-3 font-black uppercase text-right">Gamma</th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-300">
                            {trades.map(t => (
                              <tr key={t.id} className="border-b border-white/5">
                                <td className="px-6 py-3 text-blue-400 font-bold">{t.id}</td>
                                <td className={`px-6 py-3 text-right ${t.npv >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>${t.npv.toLocaleString()}</td>
                                <td className="px-6 py-3 text-right text-white">${t.dv01.toLocaleString()}</td>
                                <td className="px-6 py-3 text-right">{t.delta.toLocaleString()}</td>
                                <td className="px-6 py-3 text-right">0.024</td>
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
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Operations & Settlement (SQLite)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">Reconcile trade repository against settlement cache:</p>
                            <pre className="bg-slate-900 p-4 rounded-xl text-[10px] font-mono text-emerald-400">
                              {`SELECT trade_id, status, notional 
FROM mx_trades 
WHERE status = 'PRICED';`}
                            </pre>
                            <button className="bg-white/5 hover:bg-white/10 text-white font-black py-2 px-4 rounded-lg text-[9px] uppercase tracking-widest border border-white/10 transition-all">
                              Run Query
                            </button>
                          </div>
                          <div className="space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">Generate SWIFT MT300 Confirmation:</p>
                            <div className="bg-slate-900 p-4 rounded-xl text-[10px] font-mono text-slate-500 border border-white/5">
                              {`:20:MX-CONF-001\n:22A:NEWT\n:82A:TECHSKYLINE\n:87A:JPMORGAN\n:30T:20260130`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {mxSubTab === 'batch' && (
                    <div className="space-y-6">
                      <div className="bg-slate-950 border border-white/5 rounded-[2rem] p-12 text-center space-y-8">
                        <div className="max-w-md mx-auto space-y-2">
                          <h3 className="text-xl font-black text-white uppercase tracking-tight">EOD Batch Orchestrator</h3>
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Execute daily_eod.sh sequence</p>
                        </div>

                        <div className="flex justify-center items-center gap-12 py-4">
                          {[
                            { id: 'PRICING', label: 'Reval', icon: 'fa-calculator' },
                            { id: 'RISK', label: 'Greeks', icon: 'fa-chart-pie' },
                            { id: 'SETTLEMENT', label: 'Settlement', icon: 'fa-envelope-open-text' }
                          ].map(step => (
                            <div key={step.id} className="flex flex-col items-center gap-4 relative">
                              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-xl transition-all duration-700 ${
                                batchStatus === step.id ? 'bg-blue-600 text-white scale-110 shadow-xl shadow-blue-500/20' : 
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
                          onClick={executeBatch}
                          disabled={batchStatus !== 'IDLE' && batchStatus !== 'COMPLETE'}
                          className="px-16 py-5 bg-white text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/10"
                        >
                          {batchStatus === 'IDLE' ? 'Execute Batch Chain' : 'Restart Batch Cycle'}
                        </button>
                      </div>

                      <div className="bg-slate-950 border border-white/5 rounded-2xl p-8 font-mono text-[10px] text-slate-500 space-y-1 h-48 overflow-y-auto custom-scrollbar">
                        {batchLogs.map((log, i) => (
                          <div key={i} className={log.includes('SUCCESS') || log.includes('Successful') ? 'text-emerald-400' : ''}>
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
                      <span className="text-white font-bold whitespace-nowrap">skyline@murex-mx3:~$</span>
                      <input 
                        autoFocus
                        type="text"
                        className="bg-transparent border-none outline-none text-emerald-400 w-full"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value;
                            (e.target as HTMLInputElement).value = '';
                            handleTerminalCommand(val);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Unix Utility Palette</p>
                    <div className="flex flex-wrap gap-2">
                      {['ls', 'grep irs', 'awk', 'sqlite3', 'python pricing.py', 'clear'].map(c => (
                        <button key={c} onClick={() => handleTerminalCommand(c)} className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/5 transition-all text-[9px] font-black uppercase tracking-tighter">
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
                  <h3 className="text-white font-black text-3xl mb-8 tracking-tighter uppercase">Functional Specifications (L2/L3 Training)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="bg-slate-950 p-8 rounded-[2rem] border border-blue-500/20 shadow-xl">
                      <h4 className="text-blue-400 font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-3">
                        <i className="fas fa-file-invoice"></i> FO Desk Specification
                      </h4>
                      <ul className="space-y-4 text-xs text-slate-400 font-medium">
                        <li className="flex gap-3"><i className="fas fa-check text-blue-500 mt-1"></i> System shall allow traders to book IRS/OIS trades.</li>
                        <li className="flex gap-3"><i className="fas fa-check text-blue-500 mt-1"></i> System shall validate market curves before revaluation.</li>
                        <li className="flex gap-3"><i className="fas fa-check text-blue-500 mt-1"></i> Trade repository must store JSON attributes for audit.</li>
                      </ul>
                    </section>

                    <section className="bg-slate-950 p-8 rounded-[2rem] border border-emerald-500/20 shadow-xl">
                      <h4 className="text-emerald-400 font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-3">
                        <i className="fas fa-file-contract"></i> MO Desk Specification
                      </h4>
                      <ul className="space-y-4 text-xs text-slate-400 font-medium">
                        <li className="flex gap-3"><i className="fas fa-check text-emerald-500 mt-1"></i> System shall calculate DV01/PV01 daily per book.</li>
                        <li className="flex gap-3"><i className="fas fa-check text-emerald-500 mt-1"></i> VaR calculation must use Monte Carlo at 99% CI.</li>
                        <li className="flex gap-3"><i className="fas fa-check text-emerald-500 mt-1"></i> Stress scenarios (+100bps) must trigger alerts.</li>
                      </ul>
                    </section>

                    <section className="bg-slate-950 p-8 rounded-[2rem] border border-amber-500/20 shadow-xl">
                      <h4 className="text-amber-400 font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-3">
                        <i className="fas fa-file-medical"></i> BO Desk Specification
                      </h4>
                      <ul className="space-y-4 text-xs text-slate-400 font-medium">
                        <li className="flex gap-3"><i className="fas fa-check text-amber-500 mt-1"></i> Generate settlement instructions for T+2 cycles.</li>
                        <li className="flex gap-3"><i className="fas fa-check text-amber-500 mt-1"></i> MT300/MT320 message generation for HFT books.</li>
                        <li className="flex gap-3"><i className="fas fa-check text-amber-500 mt-1"></i> Reconcile trade repo vs payment break cache.</li>
                      </ul>
                    </section>

                    <section className="bg-slate-950 p-8 rounded-[2rem] border border-slate-500/20 shadow-xl">
                      <h4 className="text-slate-400 font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-3">
                        <i className="fas fa-file-code"></i> Technical Specification
                      </h4>
                      <ul className="space-y-4 text-xs text-slate-400 font-medium">
                        <li className="flex gap-3"><i className="fas fa-check text-slate-500 mt-1"></i> Batch engine must support cron orchestration.</li>
                        <li className="flex gap-3"><i className="fas fa-check text-slate-500 mt-1"></i> Logs must be parsed using standard Unix (awk/sed).</li>
                        <li className="flex gap-3"><i className="fas fa-check text-slate-500 mt-1"></i> SQL schema must enforce referential integrity.</li>
                      </ul>
                    </section>
                  </div>
                </div>
              )}

              {activeTab === 'tutor' && (
                <div className="max-w-2xl mx-auto space-y-8 font-sans">
                  <div className="flex gap-6 items-start bg-blue-600/10 p-8 rounded-[2.5rem] border border-blue-500/20">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl flex-shrink-0">
                      <i className="fas fa-user-tie"></i>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-black text-xl">Senior Murex Consultant (L3)</h4>
                      <p className="text-blue-100 text-sm leading-relaxed italic">
                        "In an interview for a Murex role, they test for architectural data flow. When you explain this simulator, tell them: 'I've built a conceptual MX.3 front-to-back engine using QuantLib for reval and SQL for the trade repository.' That's what cracks the job."
                      </p>
                    </div>
                  </div>

                  {!activeQuiz ? (
                    <button 
                      onClick={handleGenerateQuiz}
                      disabled={quizLoading}
                      className="w-full bg-slate-950 hover:bg-blue-600 border border-white/10 text-white font-black py-5 rounded-[2rem] transition-all flex items-center justify-center gap-4 text-xs uppercase tracking-[0.2em] group"
                    >
                      {quizLoading ? <><i className="fas fa-atom animate-spin"></i> Generating Tech Question...</> : <><i className="fas fa-vial"></i> Take L2 Certification Quiz</>}
                    </button>
                  ) : (
                    <div className="bg-slate-950 border border-white/10 rounded-[2.5rem] p-10 space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Module: {activeQuiz.context}</span>
                        <button onClick={() => setActiveQuiz(null)} className="text-white/20 hover:text-white"><i className="fas fa-times"></i></button>
                      </div>
                      <h4 className="text-white text-2xl font-black leading-tight tracking-tight">{activeQuiz.question}</h4>
                      
                      {!quizResult ? (
                        <div className="space-y-6">
                          <textarea 
                            value={quizAnswer}
                            onChange={(e) => setQuizAnswer(e.target.value)}
                            placeholder="Explain the technical solution based on the simulator logic..."
                            className="w-full bg-slate-900 border border-white/5 rounded-[2rem] p-6 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all h-40 font-medium"
                          />
                          <button 
                            onClick={handleSubmitAnswer}
                            disabled={evaluating || !quizAnswer.trim()}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-3xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"
                          >
                            {evaluating ? <><i className="fas fa-brain animate-spin"></i> Analyzing Accuracy...</> : <><i className="fas fa-paper-plane"></i> Submit Answer</>}
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
                <span>PID: 9029</span>
              </div>
              <div className="flex gap-4">
                <span className="text-emerald-400 animate-pulse">● SERVICE_READY</span>
                <span>TZ: UTC+0</span>
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
          <p className="text-slate-500 text-xl font-medium">Simulated enterprise environments for industrial-grade technical practice.</p>
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
