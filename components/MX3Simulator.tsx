
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
  const [terminalHistory, setTerminalHistory] = useState<string[]>(['[SYSTEM] Skyline Shell v4.4 initialized.', 'Full access to 7 Module Curriculum granted.']);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [auditFeedback, setAuditFeedback] = useState<{ score: number, feedback: string } | null>(null);

  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 1,
      title: "Module 1: Platform & Architecture",
      description: "Explore the Murex platform layout and module interconnectivity.",
      tasks: ["Navigate between FO/MO/BO desks", "Check system status in Status Bar", "Identify the Cluster ID"],
      completed: [false, false, false],
      difficulty: 'Junior'
    },
    {
      id: 2,
      title: "Module 2: Trade Booking (FO)",
      description: "Learn to capture complex instruments in the FO Blotter.",
      tasks: ["Book an FX_FORWARD trade", "Book an IR Swap (IRS)", "Book an Equity Swap (EQ_SWAP)"],
      completed: [false, false, false],
      difficulty: 'Junior'
    },
    {
      id: 3,
      title: "Module 3: Risk Management (MO)",
      description: "Analyze portfolio sensitivities and Greeks.",
      tasks: ["Navigate to MO Risk Desk", "Identify total Portfolio DV01", "Verify Portfolio Gamma impact"],
      completed: [false, false, false],
      difficulty: 'Senior'
    },
    {
      id: 4,
      title: "Module 4: Back Office Operations",
      description: "Manage the settlement lifecycle using live templates.",
      tasks: ["Trigger 'Process MxML' in BO Ops", "Generate MT300 SWIFT Message", "Execute T+0 Cash Settlement"],
      completed: [false, false, false],
      difficulty: 'Senior'
    },
    {
      id: 5,
      title: "Module 5: Collateral & Treasury",
      description: "Manage margins, liquidity, and collateral optimization.",
      tasks: ["Open BO Specs for SSI Identification", "Check Nostro balance in EOD Batch", "Verify collateral valuation"],
      completed: [false, false, false],
      difficulty: 'Senior'
    },
    {
      id: 6,
      title: "Module 6: Technical Track (MxML/SQL)",
      description: "Inject market data and extract trade repo data via SQL.",
      tasks: ["Use 'set_curve SOFR 5.45' in Terminal", "Run 'sql_trades' command", "Verify Pricing kernel health check"],
      completed: [false, false, false],
      difficulty: 'Expert'
    },
    {
      id: 7,
      title: "Module 7: Regulatory & Compliance",
      description: "Ensure audit trails and regulatory reporting compliance.",
      tasks: ["Run 'unix_logs' to check audit trails", "Verify status moves to SETTLED in EOD", "Identify EMIR/MiFID metadata tags"],
      completed: [false, false, false],
      difficulty: 'Expert'
    }
  ]);

  // Contextual Initialization logic
  useEffect(() => {
    if (initialModule) {
      setTerminalHistory(prev => [
        ...prev, 
        `[AUTH] Conceptual Authorization Granted for Module ${initialModule}.`,
        `[INFO] Initializing Industrial Environment for curriculum concept...`
      ]);
      
      switch(initialModule) {
        case 1: setActiveDesk('FO'); break;
        case 2: setActiveDesk('FO'); break;
        case 3: setActiveDesk('MO'); break;
        case 4: setActiveDesk('BO'); break;
        case 5: setActiveDesk('BO_SPECS'); break;
        case 6: setActiveDesk('BATCH'); break;
        case 7: setActiveDesk('BATCH'); break;
        default: setActiveDesk('LABS'); break;
      }
    }
  }, [initialModule]);

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

    if (type === 'FX_FORWARD') updateMissionProgress(2, 0, true);
    if (type === 'IRS') updateMissionProgress(2, 1, true);
    if (type === 'EQ_SWAP') updateMissionProgress(2, 2, true);
  };

  const updateMissionProgress = (missionId: number, taskIdx: number, status: boolean) => {
    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        const newCompleted = [...m.completed];
        newCompleted[taskIdx] = status;
        return { ...m, completed: newCompleted };
      }
      return m;
    }));
  };

  const handleAuditPerformance = async () => {
    setIsEvaluating(true);
    setAuditFeedback(null);
    try {
      const summary = `Trades: ${trades.length}, Desks Explored: ${activeDesk}, Missions: ${missions.filter(m => m.completed.every(c => c)).length}`;
      const result = await evaluateQuiz("Murex Simulator Session Audit", summary);
      setAuditFeedback(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const runEODBatch = () => {
    if (trades.length < 1) {
       setTerminalHistory(prev => [...prev, '[ERROR] Minimum 1 trade required for EOD cycle.']);
       return;
    }
    setIsBatchRunning(true);
    setBatchProgress(0);
    setBatchLog(['[SYSTEM] Initializing EOD Batch...', '[DB] Extracting Sub-ledger postings...']);

    const steps = [
      { p: 25, m: '[REVAL] Computing MTM using Yield Curves...' },
      { p: 50, m: '[ACCOUNTING] Generating GL Entries (Debit/Credit)...' },
      { p: 75, m: '[RECON] Matching cashflows vs External Nostro...' },
      { p: 100, m: '[SUCCESS] Batch complete. Status: SETTLED.' }
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
    const parts = input.split(' ');
    const cmd = parts[0];
    let response = '';

    if (cmd === 'help') {
      response = 'Core commands: set_curve <id> <rate>, sql_trades, run_mxml, audit_performance, clear';
    } else if (cmd === 'set_curve') {
      const rate = parseFloat(parts[2]);
      setMarketFeed(prev => prev.map(m => m.pair === 'SOFR 3M' ? { ...m, bid: rate } : m));
      response = `[MDCS] Curve updated. Pricing kernel reloaded.`;
    } else if (cmd === 'sql_trades') {
      response = trades.length > 0 ? `MX_ID | TYPE | STATUS\n${trades.map(t => `${t.id} | ${t.type} | ${t.status}`).join('\n')}` : 'Table MX_TRADES is empty.';
    } else if (cmd === 'audit_performance') {
      handleAuditPerformance();
      response = '[SYSTEM] AI Performance Audit initiated. Check the Tech Mastery desk.';
    } else if (cmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else {
      response = `Command "${cmd}" not found.`;
    }

    setTerminalHistory(prev => [...prev, `skyline@mx3:~$ ${terminalInput}`, response]);
    setTerminalInput('');
  };

  return (
    <div className="max-w-full h-[calc(100vh-8rem)] flex flex-col bg-slate-950 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl animate-in fade-in duration-700 font-sans">
      {/* Top Navigation */}
      <header className="h-14 bg-slate-900 border-b border-white/5 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-[10px] font-black text-white">MX</div>
            <span className="text-[11px] font-black text-white uppercase tracking-widest italic">Industrial Simulator</span>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <nav className="flex gap-1 overflow-x-auto custom-scrollbar no-scrollbar">
            {(['FO', 'MO', 'BO', 'BO_SPECS', 'BATCH', 'TECH_MASTERY', 'LABS'] as const).map(desk => (
              <button
                key={desk}
                onClick={() => setActiveDesk(desk)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeDesk === desk ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'
                }`}
              >
                {desk.replace('_', ' ')}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
          <span className="hidden sm:flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${initialModule ? 'bg-emerald-500' : 'bg-blue-500'}`}></span> 
            {initialModule ? `MOD_${initialModule}_ACTIVE` : 'FULL_ACCESS'}
          </span>
          <span className="opacity-40">|</span>
          <span>ENV: PROD</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
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
                <p key={i} className={`${line.startsWith('skyline@') ? 'text-blue-400' : line.includes('[AUTH]') ? 'text-emerald-400' : 'text-slate-400'} whitespace-pre-wrap`}>{line}</p>
              ))}
            </div>
            <form onSubmit={handleTerminalCommand} className="flex gap-2">
              <span className="text-blue-500">~$</span>
              <input type="text" value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} placeholder="Type help..." className="bg-transparent border-none outline-none text-emerald-400 w-full" />
            </form>
          </div>
        </aside>

        {/* Workspace */}
        <main className="flex-1 bg-slate-950 p-6 overflow-y-auto custom-scrollbar">
          {activeDesk === 'FO' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <section className="bg-slate-900 border border-white/5 rounded-3xl p-8">
                <h2 className="text-lg font-black text-white mb-6 uppercase tracking-tight">FO: Trade Capture</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Instrument</label>
                    <select id="inst-type" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none">
                      <option value="FX_FORWARD">FX Forward</option>
                      <option value="IRS">IR Swap</option>
                      <option value="EQ_SWAP">Equity Swap</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pair</label>
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
                }} className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-10 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all">Confirm & Book Trade</button>
              </section>

              <section className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden">
                <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Trade Blotter</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead className="bg-slate-950 text-slate-500">
                      <tr>
                        <th className="px-6 py-3 uppercase">MX_ID</th>
                        <th className="px-6 py-3 uppercase">Type</th>
                        <th className="px-6 py-3 uppercase">Status</th>
                        <th className="px-6 py-3 text-right uppercase">Notional</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      {trades.map(t => (
                        <tr key={t.id} className="border-t border-white/5 hover:bg-white/5">
                          <td className="px-6 py-4 text-blue-400 font-bold">{t.id}</td>
                          <td className="px-6 py-4 text-white">{t.type}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black ${t.status === 'NEW' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{t.status}</span>
                          </td>
                          <td className="px-6 py-4 text-right text-white">${t.notional.toLocaleString()}</td>
                        </tr>
                      ))}
                      {trades.length === 0 && <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-600 italic">No trades booked.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {activeDesk === 'MO' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Portfolio Sensitivities</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-slate-950 rounded-2xl">
                      <span className="text-xs font-bold text-slate-400">Portfolio DV01</span>
                      <span className="text-xl font-mono text-white">${stats.dv01.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-950 rounded-2xl">
                      <span className="text-xs font-bold text-slate-400">Portfolio Gamma</span>
                      <span className="text-xl font-mono text-white">${stats.gamma.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">MTM Analysis</h3>
                  <div className="text-center py-12">
                    <p className={`text-4xl font-black ${stats.totalPnL >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>${stats.totalPnL.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black mt-2">Unrealized P&L</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDesk === 'BO' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <section className="bg-slate-900 border border-white/5 rounded-3xl p-8">
                <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">BO: Workflow Console</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 font-mono text-[10px] text-slate-500 space-y-2">
                    <p className="text-blue-400 uppercase font-bold tracking-widest mb-2">MxML Pipeline</p>
                    <p>&lt;TradeMX XML_VERSION="1.1"&gt;</p>
                    <p>&nbsp;&nbsp;&lt;Body Status="VERIFY_PENDING" /&gt;</p>
                    <p>&lt;/TradeMX&gt;</p>
                    <button onClick={() => { setTrades(prev => prev.map(t => ({ ...t, status: 'VERIFIED' }))); setTerminalHistory(p => [...p, '[MxML] Trades moved to VERIFIED.']); }} className="mt-4 w-full bg-white/5 hover:bg-white/10 text-white font-black py-3 rounded-xl border border-white/10 transition-all uppercase tracking-widest text-[9px]">Trigger MxML Process</button>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl flex justify-between items-center">
                      <span className="text-[10px] font-black text-white">SWIFT MT300</span>
                      <button className="text-[8px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">GENERATE</button>
                    </div>
                    <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl flex justify-between items-center">
                      <span className="text-[10px] font-black text-white">T+0 SETTLEMENT</span>
                      <button className="text-[8px] font-black text-blue-400 bg-blue-500/10 px-2 py-1 rounded">EXECUTE</button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeDesk === 'BO_SPECS' && (
            <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
              <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-xl text-white">
                    <i className="fas fa-file-contract"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">BO Functional Specifications</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Settlement & Accounting Blueprint</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-950 rounded-3xl border border-white/5">
                      <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <i className="fas fa-landmark"></i> Settlement Rules
                      </h4>
                      <ul className="space-y-3 text-xs text-slate-400 font-medium">
                        <li className="flex items-start gap-3"><i className="fas fa-check text-blue-500 mt-1"></i> T+2 for FX Spot; T+0 for Overnights.</li>
                        <li className="flex items-start gap-3"><i className="fas fa-check text-blue-500 mt-1"></i> SSIs must be validated vs Global Counterparty Hub.</li>
                        <li className="flex items-start gap-3"><i className="fas fa-check text-blue-500 mt-1"></i> Automatic MT300/MT320 triggers upon Verification.</li>
                      </ul>
                    </div>
                    <div className="p-6 bg-slate-950 rounded-3xl border border-white/5">
                      <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <i className="fas fa-receipt"></i> Accounting GL Rules
                      </h4>
                      <ul className="space-y-3 text-xs text-slate-400 font-medium">
                        <li className="flex items-start gap-3"><i className="fas fa-check text-emerald-500 mt-1"></i> Daily MTM Reval Posting to Sub-ledger.</li>
                        <li className="flex items-start gap-3"><i className="fas fa-check text-emerald-500 mt-1"></i> Cashflow realization vs Cost of Funding offsets.</li>
                        <li className="flex items-start gap-3"><i className="fas fa-check text-emerald-500 mt-1"></i> Dual-posting for Tax vs Operational GLs.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-600/5 border border-blue-500/20 rounded-3xl p-8 flex flex-col justify-center text-center">
                    <i className="fas fa-magnifying-glass-chart text-4xl text-blue-500 mb-4"></i>
                    <h4 className="text-white font-black uppercase text-sm mb-2">Reconciliation Logic</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed mb-6 italic">
                      "System must reconcile external Nostro feeds with internal trade repository records every T+1 cycle. Breaks exceeding $50k trigger auto-escalation."
                    </p>
                    <button className="bg-blue-600 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20">Audit Recon Engine</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDesk === 'BATCH' && (
            <div className="space-y-8 animate-in fade-in duration-500 flex flex-col items-center justify-center py-12">
              <div className="w-full max-w-2xl bg-slate-900 border border-white/5 rounded-[3rem] p-12 text-center space-y-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">EOD Batch Cycle</h3>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div style={{ width: `${batchProgress}%` }} className="h-full bg-blue-600 transition-all duration-500"></div>
                </div>
                <button onClick={runEODBatch} disabled={isBatchRunning} className="w-full bg-white hover:bg-blue-600 hover:text-white disabled:bg-slate-800 text-slate-900 font-black py-5 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all shadow-2xl">
                  {isBatchRunning ? 'Batch running...' : 'Execute Daily EOD Chain'}
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
                <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                  <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">Algorithm Prep</h4>
                  <p className="text-[10px] text-slate-500 font-bold">Dynamic programming & Greedy approaches for financial latency.</p>
                  <div className="space-y-2">
                    <button className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-3 rounded-xl text-[9px] uppercase border border-white/10 transition-all">Solve Max PnL Swing</button>
                    <button className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-3 rounded-xl text-[9px] uppercase border border-white/10 transition-all">Greedy Yield Matching</button>
                  </div>
                </div>
                <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest">SQL Mastery</h4>
                  <p className="text-[10px] text-slate-500 font-bold">Query optimization for massive MX data sets and extraction.</p>
                  <div className="space-y-2">
                    <button className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-3 rounded-xl text-[9px] uppercase border border-white/10 transition-all">Optimize JOIN Performance</button>
                    <button className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-3 rounded-xl text-[9px] uppercase border border-white/10 transition-all">Write Complex Extractor</button>
                  </div>
                </div>
                <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                  <h4 className="text-xs font-black text-purple-400 uppercase tracking-widest">OOP Design</h4>
                  <p className="text-[10px] text-slate-500 font-bold">Design patterns for scalable, robust financial models.</p>
                  <div className="space-y-2">
                    <button className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-3 rounded-xl text-[9px] uppercase border border-white/10 transition-all">Factory for FX Engines</button>
                    <button className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-3 rounded-xl text-[9px] uppercase border border-white/10 transition-all">Singleton Kernel Access</button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] p-12 text-slate-900 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                  <div className="flex-1 space-y-6">
                    <h3 className="text-3xl font-black tracking-tight uppercase">AI Performance Audit</h3>
                    <p className="text-slate-500 font-medium leading-relaxed italic">
                      "Submit your simulator activity for an instant evaluation by our Industry Mentor AI. This audits your workflow logic, capturing efficiency, and technical accuracy."
                    </p>
                    <button onClick={handleAuditPerformance} disabled={isEvaluating} className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-10 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/30 transition-all">
                      {isEvaluating ? 'Auditing Stack...' : 'Initialize Evaluation'}
                    </button>
                  </div>
                  {auditFeedback && (
                    <div className="w-full md:w-80 bg-slate-50 rounded-[2.5rem] border border-slate-100 p-8 space-y-4 animate-in zoom-in duration-500">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Score</span>
                        <span className="text-3xl font-black text-blue-600">{auditFeedback.score}%</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">"{auditFeedback.feedback}"</p>
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
                  <div key={mission.id} className={`bg-slate-900 border rounded-[2.5rem] p-8 space-y-4 flex flex-col transition-all duration-500 ${initialModule === mission.id ? 'border-emerald-500 shadow-xl' : 'border-white/5 hover:border-blue-500'}`}>
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-black text-white uppercase tracking-tight leading-tight">{mission.title}</h3>
                      <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${mission.difficulty === 'Expert' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'}`}>{mission.difficulty}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">{mission.description}</p>
                    <div className="space-y-2 pt-4">
                      {mission.tasks.map((task, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${mission.completed[i] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/10'}`}>
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
      <footer className="h-8 bg-slate-900 border-t border-white/5 px-6 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">
        <div className="flex gap-6">
          <span>CLUSTER: HK_PROD_A</span>
          <span>CURRENCY: USD</span>
        </div>
        <div className="flex gap-6 text-blue-500">
          <span>7 MODULE CURRICULUM: AUTHORIZED</span>
          <span>WORKFORCE_TRANSFORMATION_READY</span>
        </div>
      </footer>
    </div>
  );
};

export default MX3Simulator;
