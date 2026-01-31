
import React, { useState, useEffect, useMemo } from 'react';
import { evaluateQuiz } from '../services/geminiService';

interface Trade {
  id: string;
  type: 'FX_SPOT' | 'FX_FORWARD' | 'IRS' | 'OIS' | 'EQ_SWAP';
  pair: string;
  notional: number;
  rate: number;
  marketRate: number;
  pnl: number;
  status: 'NEW' | 'PRICED' | 'VERIFIED' | 'SETTLED';
  timestamp: string;
  book: string;
}

interface MarketData {
  pair: string;
  bid: number;
  ask: number;
  change: number;
}

interface Mission {
  id: number;
  title: string;
  description: string;
  tasks: string[];
  completed: boolean[];
  difficulty: 'Junior' | 'Senior' | 'Expert';
  targetDesk: 'FO' | 'MO' | 'BO' | 'BO_SPECS' | 'BATCH' | 'TECH_MASTERY';
  roleLabel: string;
}

interface MX3SimulatorProps {
  initialModule?: number;
}

const MX3Simulator: React.FC<MX3SimulatorProps> = ({ initialModule }) => {
  const [activeDesk, setActiveDesk] = useState<'FO' | 'MO' | 'BO' | 'BATCH' | 'BO_SPECS' | 'LABS' | 'TECH_MASTERY'>('FO');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [marketFeed, setMarketFeed] = useState<MarketData[]>([
    { pair: 'USD/INR', bid: 83.42, ask: 83.45, change: 0.02 },
    { pair: 'EUR/USD', bid: 1.0852, ask: 1.0855, change: -0.01 },
    { pair: 'GBP/USD', bid: 1.2640, ask: 1.2644, change: 0.05 },
    { pair: 'SOFR 3M', bid: 5.32, ask: 5.35, change: 0.01 },
    { pair: 'NIFTY 50', bid: 22450, ask: 22460, change: 0.12 },
  ]);
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchLog, setBatchLog] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>(['[SYSTEM] Skyline Shell v4.6 initialized.', 'Full module access granted. Waiting for session initialization...']);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [auditFeedback, setAuditFeedback] = useState<{ score: number, feedback: string } | null>(null);

  const missions = useMemo<Mission[]>(() => [
    {
      id: 1,
      title: "Module 1: Introduction to Murex",
      description: "Explore the platform architecture and desk connectivity.",
      tasks: ["Identify Cluster ID in footer", "Navigate to all 6 desks", "Check system status"],
      completed: [false, false, false],
      difficulty: 'Junior',
      targetDesk: 'FO',
      roleLabel: 'Platform Architect'
    },
    {
      id: 2,
      title: "Module 2: Analyst Practice (FO)",
      description: "Learn the trade capture and revaluation concept.",
      tasks: ["Book an FX_FORWARD trade", "Verify Trade Rate vs Market Rate", "Check FO Blotter for Pricing status"],
      completed: [false, false, false],
      difficulty: 'Junior',
      targetDesk: 'FO',
      roleLabel: 'Analyst Practice'
    },
    {
      id: 3,
      title: "Module 3: Risk Practice (MO)",
      description: "Analyze DV01 and portfolio sensitivities.",
      tasks: ["Identify Portfolio DV01", "Check Gamma sensitivity", "Run MTM Revaluation"],
      completed: [false, false, false],
      difficulty: 'Senior',
      targetDesk: 'MO',
      roleLabel: 'MO Risk Practice'
    },
    {
      id: 4,
      title: "Module 4: Ops Practice (BO)",
      description: "Master settlement rules and SWIFT triggers.",
      tasks: ["Trigger MxML processing", "Generate MT300 SWIFT Message", "Verify settlement rules"],
      completed: [false, false, false],
      difficulty: 'Senior',
      targetDesk: 'BO',
      roleLabel: 'BO Ops Practice'
    },
    {
      id: 5,
      title: "Module 5: Collateral & Treasury",
      description: "Manage liquidity and optimization strategies.",
      tasks: ["Check Book-specific SSI mapping", "Analyze funding cost offsets", "Verify Nostro reconciliation"],
      completed: [false, false, false],
      difficulty: 'Senior',
      targetDesk: 'BO_SPECS',
      roleLabel: 'Treasury Expert'
    },
    {
      id: 6,
      title: "Module 6: Murex Technical Track",
      description: "Data extraction, SQL mastery, and batch orchestration.",
      tasks: ["Run 'sql_trades' in terminal", "Execute EOD Batch Cycle", "Solve Algorithm Prep challenge"],
      completed: [false, false, false],
      difficulty: 'Expert',
      targetDesk: 'TECH_MASTERY',
      roleLabel: 'Technical Consultant'
    },
    {
      id: 7,
      title: "Module 7: Regulatory & Compliance",
      description: "Audit trails, Unix logs, and reporting requirements.",
      tasks: ["Analyze trade audit trail", "Verify EMIR/MiFID fields", "Check Batch status success"],
      completed: [false, false, false],
      difficulty: 'Expert',
      targetDesk: 'BATCH',
      roleLabel: 'Compliance Lead'
    }
  ], []);

  // Contextual Initialization
  useEffect(() => {
    if (initialModule) {
      const mod = missions.find(m => m.id === initialModule);
      if (mod) {
        setTerminalHistory(prev => [
          ...prev, 
          `[AUTH] Contextual Authorization for Module ${initialModule} detected.`,
          `[INFO] Career Role: ${mod.roleLabel}. Loading relevant practice data...`,
          `[INFO] Access Level: FULL_PRACTICE_READY.`
        ]);
        setActiveDesk(mod.targetDesk);
      }
    } else {
      setTerminalHistory(prev => [...prev, `[SYSTEM] General Sandbox Mode Active. All desks accessible.`]);
    }
  }, [initialModule, missions]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketFeed(prev => prev.map(m => ({
        ...m,
        bid: m.bid + (Math.random() - 0.5) * 0.01,
        ask: m.ask + (Math.random() - 0.5) * 0.01,
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
    const totalNotional = trades.reduce((sum, t) => sum + t.notional, 0);
    const portfolioGreeks = {
      dv01: trades.length * 12.5,
      gamma: trades.length * 0.042
    };
    return { totalPnL, totalNotional, count: trades.length, ...portfolioGreeks };
  }, [trades]);

  const bookTrade = (type: Trade['type'], pair: string, notional: number, rate: number) => {
    const mkt = marketFeed.find(f => f.pair === pair);
    const mktRate = mkt ? (mkt.bid + mkt.ask) / 2 : rate;
    const pnl = (mktRate - rate) * (notional / 100); 

    const newTrade: Trade = {
      id: `MX${Math.floor(100000 + Math.random() * 900000)}`,
      type,
      pair,
      notional,
      rate,
      marketRate: mktRate,
      pnl,
      status: 'NEW',
      timestamp: new Date().toLocaleTimeString(),
      book: 'HFT_PROPRIETARY_01'
    };
    setTrades([newTrade, ...trades]);
    setTerminalHistory(prev => [...prev, `[FO] Trade ${newTrade.id} (${type}) booked at ${rate} for ${notional}. Status: NEW.`]);
  };

  const handleAuditPerformance = async () => {
    setIsEvaluating(true);
    setAuditFeedback(null);
    try {
      const summary = `Session Metrics: 
      Trades: ${trades.length}, 
      Last Desk: ${activeDesk}, 
      Environment: ${initialModule ? 'Contextual (Mod ' + initialModule + ')' : 'Full Sandbox'}`;
      const result = await evaluateQuiz("Simulator Performance Audit", summary);
      setAuditFeedback(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const runEODBatch = () => {
    if (trades.length < 1) {
       setTerminalHistory(prev => [...prev, '[ERROR] Batch requires at least 1 FO Trade. Capture trades in FO desk first.']);
       return;
    }
    setIsBatchRunning(true);
    setBatchProgress(0);
    setBatchLog(['[BATCH] Initializing EOD chain...', '[DB] Snapshotting Trade Repository...']);

    const steps = [
      { p: 25, m: '[PRICING] Running conceptual revaluation kernels...' },
      { p: 50, m: '[GL] Generating sub-ledger debit/credit posts...' },
      { p: 75, m: '[RECON] Matching MT300 SWIFT messages...' },
      { p: 100, m: '[SUCCESS] Daily cycle complete. Status: SETTLED.' }
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setBatchProgress(step.p);
        setBatchLog(prev => [...prev, step.m]);
        if (step.p === 100) {
          setIsBatchRunning(false);
          setTrades(prev => prev.map(t => ({ ...t, status: 'SETTLED' })));
        }
      }, (i + 1) * 1200);
    });
  };

  const handleTerminalCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const input = terminalInput.trim().toLowerCase();
    const cmd = input.split(' ')[0];
    let response = '';

    if (cmd === 'help') {
      response = 'Commands: set_curve <rate>, sql_trades, run_mxml, audit_mentor, clear';
    } else if (cmd === 'sql_trades') {
      response = trades.length > 0 ? `MX_ID | TYPE | STATUS\n${trades.map(t => `${t.id} | ${t.type} | ${t.status}`).join('\n')}` : 'No records in MX_TRADE_LEDGER.';
    } else if (cmd === 'run_mxml') {
      response = '[MxML] Internal Status: SUCCESS. Trades migrated to VERIFIED.';
      setTrades(prev => prev.map(t => ({ ...t, status: 'VERIFIED' })));
    } else if (cmd === 'audit_mentor') {
      handleAuditPerformance();
      response = 'Mentor evaluation initialized. Check Tech Mastery desk.';
    } else if (cmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else {
      response = `sh: command not found: ${cmd}`;
    }

    setTerminalHistory(prev => [...prev, `skyline@mx3:~$ ${terminalInput}`, response]);
    setTerminalInput('');
  };

  const currentMission = initialModule ? missions.find(m => m.id === initialModule) : null;

  return (
    <div className="max-w-full h-[calc(100vh-8rem)] flex flex-col bg-slate-950 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl animate-in fade-in duration-700 font-sans">
      {/* Dynamic Header */}
      <header className="h-14 bg-slate-900 border-b border-white/5 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-[10px] font-black text-white">MX</div>
            <span className="text-[11px] font-black text-white uppercase tracking-widest italic tracking-tighter">Industrial Simulator</span>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <nav className="flex gap-1 overflow-x-auto no-scrollbar">
            {(['FO', 'MO', 'BO', 'BO_SPECS', 'BATCH', 'TECH_MASTERY', 'LABS'] as const).map(desk => (
              <button
                key={desk}
                onClick={() => setActiveDesk(desk)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeDesk === desk ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'
                }`}
              >
                {desk === 'FO' ? 'Front Office' : desk === 'MO' ? 'MO Risk' : desk === 'BO' ? 'BO Ops' : desk === 'BO_SPECS' ? 'BO Specs' : desk === 'BATCH' ? 'EOD Batch' : desk === 'TECH_MASTERY' ? 'Tech Mastery' : 'Practice Labs'}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
          {currentMission && (
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-emerald-400 font-black uppercase">{currentMission.roleLabel} ACTIVE</span>
            </div>
          )}
          <span className="hidden sm:inline opacity-30">|</span>
          <span className="hidden sm:inline">CLUSTER: HK_PROD_A</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Shell & Data */}
        <aside className="w-80 hidden lg:flex bg-slate-900/50 border-r border-white/5 flex-col p-4 space-y-6 overflow-hidden">
          <div className="space-y-4">
            <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Market Feed</h3>
            <div className="space-y-2">
              {marketFeed.map(m => (
                <div key={m.pair} className="bg-slate-950/50 p-3 rounded-xl border border-white/5 flex justify-between items-center group">
                  <p className="text-[10px] font-black text-white">{m.pair}</p>
                  <p className="text-xs font-mono font-bold text-emerald-400">{m.ask.toFixed(4)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden bg-black/40 rounded-2xl border border-white/5 p-4 font-mono text-[10px]">
            <div className="flex-1 overflow-y-auto space-y-1 mb-4 custom-scrollbar">
              {terminalHistory.map((line, i) => (
                <p key={i} className={`${line.startsWith('skyline@') ? 'text-blue-400' : line.includes('[AUTH]') ? 'text-emerald-400 font-black' : line.includes('[ERROR]') ? 'text-rose-400' : 'text-slate-400'} whitespace-pre-wrap`}>{line}</p>
              ))}
            </div>
            <form onSubmit={handleTerminalCommand} className="flex gap-2">
              <span className="text-blue-500">~$</span>
              <input type="text" value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} placeholder="..." className="bg-transparent border-none outline-none text-emerald-400 w-full" />
            </form>
          </div>
        </aside>

        {/* Center Main */}
        <main className="flex-1 bg-slate-950 p-6 overflow-y-auto custom-scrollbar">
          {activeDesk === 'FO' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <section className="bg-slate-900 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-blue-600/10 text-blue-400 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-blue-500/20">Authorized Analyst Practice</span>
                </div>
                <h2 className="text-lg font-black text-white mb-6 uppercase tracking-tight">FO: Trade Capture & Revaluation</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Instrument</label>
                    <select id="inst-type" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none">
                      <option value="FX_FORWARD">FX Forward</option>
                      <option value="IRS">IR Swap (IRS)</option>
                      <option value="EQ_SWAP">Equity Swap</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Asset Pair</label>
                    <select id="asset-pair" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none">
                      {marketFeed.map(m => <option key={m.pair} value={m.pair}>{m.pair}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Notional</label>
                    <input id="notional" type="number" placeholder="1000000" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Rate</label>
                    <input id="trade-rate" type="number" step="0.0001" placeholder="0.05" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none" />
                  </div>
                </div>
                <button onClick={() => {
                  const type = (document.getElementById('inst-type') as HTMLSelectElement).value as any;
                  const pair = (document.getElementById('asset-pair') as HTMLSelectElement).value;
                  const notional = Number((document.getElementById('notional') as HTMLInputElement).value);
                  const rate = Number((document.getElementById('trade-rate') as HTMLInputElement).value);
                  if (notional && rate) bookTrade(type, pair, notional, rate);
                }} className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-10 rounded-xl text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all">Capture & Revaluate</button>
              </section>

              <section className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Trade Repository Blotter</h3>
                  <span className="text-[9px] font-mono text-slate-500">COUNT: {trades.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead className="bg-slate-950 text-slate-500">
                      <tr>
                        <th className="px-6 py-3 uppercase tracking-widest">MX_ID</th>
                        <th className="px-6 py-3 uppercase tracking-widest">Type</th>
                        <th className="px-6 py-3 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-3 text-right uppercase tracking-widest">Notional</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      {trades.map(t => (
                        <tr key={t.id} className="border-t border-white/5 hover:bg-white/5">
                          <td className="px-6 py-4 text-blue-400 font-bold">{t.id}</td>
                          <td className="px-6 py-4 text-white">{t.type}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                              t.status === 'NEW' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}>{t.status}</span>
                          </td>
                          <td className="px-6 py-4 text-right text-white">${t.notional.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {activeDesk === 'MO' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <section className="bg-slate-900 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-emerald-600/10 text-emerald-400 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">Authorized Risk Practice</span>
                </div>
                <h2 className="text-lg font-black text-white mb-6 uppercase tracking-tight">MO: Greeks & Portfolio Sensitivity</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-950 rounded-3xl border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Portfolio DV01</p>
                        <h4 className="text-3xl font-black text-white font-mono">${stats.dv01.toFixed(2)}</h4>
                      </div>
                      <i className="fas fa-chart-line text-blue-500 text-3xl opacity-20"></i>
                    </div>
                    <div className="p-6 bg-slate-950 rounded-3xl border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Gamma</p>
                        <h4 className="text-3xl font-black text-white font-mono">${stats.gamma.toFixed(3)}</h4>
                      </div>
                      <i className="fas fa-chart-area text-emerald-500 text-3xl opacity-20"></i>
                    </div>
                  </div>
                  <div className="bg-slate-950 rounded-3xl border border-white/5 p-8 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Live Unrealized P&L</p>
                    <h4 className={`text-5xl font-black font-mono ${stats.totalPnL >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      ${stats.totalPnL.toLocaleString()}
                    </h4>
                    <button onClick={() => setTerminalHistory(p => [...p, '[RISK] Recalculating sensitivities... SUCCESS.'])} className="mt-8 bg-white/5 hover:bg-white/10 text-white font-black py-3 px-8 rounded-xl border border-white/10 text-[10px] uppercase tracking-widest transition-all">Re-analyze Portfolio</button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeDesk === 'BO' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <section className="bg-slate-900 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-amber-600/10 text-amber-400 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-amber-500/20">Authorized Ops Practice</span>
                </div>
                <h2 className="text-lg font-black text-white mb-6 uppercase tracking-tight">BO: Settlements & Workflow Lifecycle</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-950 p-6 rounded-3xl border border-white/5">
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">MxML Engine</h4>
                    <div className="font-mono text-[10px] text-slate-500 space-y-2 bg-black/40 p-4 rounded-xl border border-white/5">
                      <p className="text-emerald-400 animate-pulse font-black">SYSTEM_ONLINE</p>
                      <p>&lt;TradeMX MSG_ID="9932"&gt;</p>
                      <p>&nbsp;&nbsp;&lt;Status&gt;VERIFY_PENDING&lt;/Status&gt;</p>
                      <p>&lt;/TradeMX&gt;</p>
                    </div>
                    <button onClick={() => { setTrades(prev => prev.map(t => ({ ...t, status: 'VERIFIED' }))); setTerminalHistory(p => [...p, '[MxML] Status triggered: VERIFIED.'])} } className="mt-6 w-full bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-xl border border-white/10 text-[10px] uppercase tracking-widest transition-all">Execute Workflow Path</button>
                  </div>
                  <div className="space-y-4">
                    <div className="p-6 bg-slate-950 border border-white/5 rounded-3xl flex justify-between items-center group">
                      <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">MT300 SWIFT</p>
                        <p className="text-[9px] text-slate-500 mt-1">Confirmation Trigger</p>
                      </div>
                      <button className="bg-emerald-600/10 text-emerald-400 font-black px-4 py-2 rounded-lg text-[9px] uppercase tracking-widest border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all">Generate</button>
                    </div>
                    <div className="p-6 bg-slate-950 border border-white/5 rounded-3xl flex justify-between items-center group">
                      <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">T+0 SETTLEMENT</p>
                        <p className="text-[9px] text-slate-500 mt-1">Nostro Cashflow</p>
                      </div>
                      <button className="bg-blue-600/10 text-blue-400 font-black px-4 py-2 rounded-lg text-[9px] uppercase tracking-widest border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">Execute</button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeDesk === 'BO_SPECS' && (
            <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
              <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-12 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-xl text-white">
                    <i className="fas fa-file-invoice"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">Functional Specifications</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Industrial Settlement Blueprint</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-slate-950 rounded-3xl border border-white/5">
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Settlement Rules</h4>
                    <ul className="space-y-4 text-[11px] text-slate-400 font-medium">
                      <li className="flex items-start gap-3"><i className="fas fa-check text-blue-500 mt-1"></i> T+2 for FX Spot; T+0 for Overnights.</li>
                      <li className="flex items-start gap-3"><i className="fas fa-check text-blue-500 mt-1"></i> SSIs must be validated vs Global Counterparty Hub.</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-slate-950 rounded-3xl border border-white/5">
                    <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Accounting GL</h4>
                    <ul className="space-y-4 text-[11px] text-slate-400 font-medium">
                      <li className="flex items-start gap-3"><i className="fas fa-check text-emerald-500 mt-1"></i> Daily MTM Reval Posting to Sub-ledger.</li>
                      <li className="flex items-start gap-3"><i className="fas fa-check text-emerald-500 mt-1"></i> Cashflow realization protocol.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDesk === 'BATCH' && (
            <div className="space-y-8 animate-in fade-in duration-500 flex flex-col items-center justify-center py-12">
              <div className="w-full max-w-2xl bg-slate-900 border border-white/5 rounded-[3rem] p-12 text-center space-y-10 shadow-2xl">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">EOD Batch Cycle Orchestration</h3>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner">
                  <div style={{ width: `${batchProgress}%` }} className="h-full bg-blue-600 transition-all duration-500"></div>
                </div>
                <button onClick={runEODBatch} disabled={isBatchRunning} className="w-full bg-white hover:bg-blue-600 hover:text-white disabled:bg-slate-800 text-slate-900 font-black py-5 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all shadow-2xl">
                  {isBatchRunning ? 'Executing Batch sequence...' : 'Execute Daily EOD sequence'}
                </button>
                <div className="bg-slate-950 border border-white/5 rounded-2xl p-6 h-48 overflow-y-auto font-mono text-[9px] text-slate-500 text-left custom-scrollbar">
                  {batchLog.map((l, i) => <p key={i}>{l}</p>)}
                </div>
              </div>
            </div>
          )}

          {activeDesk === 'TECH_MASTERY' && (
            <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Algorithm Prep', 'SQL Mastery', 'OOP Design'].map((item, i) => (
                  <div key={i} className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 space-y-6 group hover:border-blue-500 transition-colors">
                    <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">{item}</h4>
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed">Advanced industrial practice for technical consultancies.</p>
                    <button className="w-full bg-white/5 hover:bg-blue-600 text-white font-black py-3 rounded-xl text-[9px] uppercase border border-white/10 transition-all">Launch Challenge</button>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-[3rem] p-12 text-slate-900 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                  <div className="flex-1 space-y-6">
                    <h3 className="text-3xl font-black tracking-tight uppercase">AI Performance Audit</h3>
                    <p className="text-slate-500 font-medium leading-relaxed italic">
                      "Instant feedback from our Industry Mentor AI. This audits your simulator interactions and captured workflows."
                    </p>
                    <button onClick={handleAuditPerformance} disabled={isEvaluating} className="bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-12 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/30 transition-all">
                      {isEvaluating ? 'Analyzing Sessions...' : 'Initialize Evaluation'}
                    </button>
                  </div>
                  {auditFeedback && (
                    <div className="w-full md:w-80 bg-slate-50 rounded-[2.5rem] border border-slate-100 p-8 space-y-4 animate-in zoom-in duration-500">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Score</span>
                        <span className="text-4xl font-black text-blue-600">{auditFeedback.score}%</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed italic">"{auditFeedback.feedback}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeDesk === 'LABS' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {missions.map(mission => (
                  <div 
                    key={mission.id} 
                    className={`bg-slate-900 border rounded-[2.5rem] p-8 space-y-4 flex flex-col transition-all duration-500 ${
                      initialModule === mission.id ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.15)] scale-[1.02]' : 'border-white/5 hover:border-blue-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className={`text-sm font-black uppercase tracking-tight leading-tight ${initialModule === mission.id ? 'text-emerald-400' : 'text-white'}`}>{mission.title}</h3>
                      <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${mission.difficulty === 'Expert' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'}`}>{mission.difficulty}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed flex-1">{mission.description}</p>
                    <div className="space-y-2 pt-4">
                      {mission.tasks.map((task, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                            mission.completed[i] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/10'
                          }`}>
                            {mission.completed[i] && <i className="fas fa-check text-[7px]"></i>}
                          </div>
                          <span className={`text-[9px] font-bold ${mission.completed[i] ? 'text-slate-300' : 'text-slate-600'}`}>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="h-10 bg-slate-900 border-t border-white/5 px-8 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-600 shrink-0">
        <div className="flex gap-6">
          <span>PORT: 9090</span>
          <span>CURRENCY: USD</span>
          <span className="text-blue-500">PROV: ACTIVE</span>
        </div>
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-emerald-400 font-black">7_MOD_CURRICULUM_READY</span>
          </div>
          <span className="opacity-30">|</span>
          <span className="font-bold">TECH_SKYLINE_IT_SOLUTIONS</span>
        </div>
      </footer>
    </div>
  );
};

export default MX3Simulator;
