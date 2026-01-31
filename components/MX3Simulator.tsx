
import React, { useState, useEffect, useMemo } from 'react';

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

const MX3Simulator: React.FC = () => {
  const [activeDesk, setActiveDesk] = useState<'FO' | 'MO' | 'BO' | 'BATCH' | 'BO_SPECS' | 'LABS'>('FO');
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
  const [terminalHistory, setTerminalHistory] = useState<string[]>(['[SYSTEM] Skyline Shell v4.2 initialized.', 'Type "help" to see practice lab commands.']);

  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 1,
      title: "1. Trade Booking (IR, FX, EQ Derivatives)",
      description: "Learn to capture complex instruments in the FO Blotter.",
      tasks: ["Book an FX_FORWARD trade", "Book an IR Swap (IRS)", "Book an Equity Swap (EQ_SWAP)"],
      completed: [false, false, false],
      difficulty: 'Junior'
    },
    {
      id: 2,
      title: "2. Market Data Curve Configuration",
      description: "Inject and verify market data curves into the pricing kernel.",
      tasks: ["Use 'set_curve SOFR 5.45' in Terminal", "Verify SOFR 3M bid reflects the update", "Pricing kernel health check green"],
      completed: [false, false, false],
      difficulty: 'Senior'
    },
    {
      id: 3,
      title: "3. Risk Reports & Dashboards",
      description: "Analyze portfolio sensitivities and Greeks.",
      tasks: ["Navigate to MO Risk Desk", "Identify total Portfolio DV01", "Generate PnL attribution report"],
      completed: [false, false, false],
      difficulty: 'Senior'
    },
    {
      id: 4,
      title: "4. MxML Workflows & Reconciliation",
      description: "Trace trade messages through the integration layer.",
      tasks: ["Trigger 'Process MxML' in BO Ops", "Verify trade status moves to VERIFIED", "Identify any reconciliation breaks"],
      completed: [false, false, false],
      difficulty: 'Expert'
    },
    {
      id: 5,
      title: "5. Trade Settlement Simulation",
      description: "Manage the settlement lifecycle using live templates.",
      tasks: ["Ensure trade is VERIFIED", "Generate MT300 SWIFT Message", "Execute T+0 Cash Settlement"],
      completed: [false, false, false],
      difficulty: 'Senior'
    },
    {
      id: 6,
      title: "6. Back Office Accounting Project",
      description: "Finalize the sub-ledger and post to General Ledger.",
      tasks: ["Run EOD Batch Cycle", "Export GL Postings to CSV", "Validate Sub-ledger vs Nostro balance"],
      completed: [false, false, false],
      difficulty: 'Expert'
    }
  ]);

  // Simulation Logic: Market Fluctuations
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

    // Mission 1 logic
    if (type === 'FX_FORWARD') updateMissionProgress(1, 0, true);
    if (type === 'IRS') updateMissionProgress(1, 1, true);
    if (type === 'EQ_SWAP') updateMissionProgress(1, 2, true);
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

  const runEODBatch = () => {
    if (trades.length < 3) {
       setTerminalHistory(prev => [...prev, '[ERROR] Minimum 3 trades required for EOD cycle. (Mission 6 requirement)']);
       return;
    }
    setIsBatchRunning(true);
    setBatchProgress(0);
    setBatchLog(['[SYSTEM] Initializing EOD Batch...', '[DB] Extracting Sub-ledger postings...']);

    const steps = [
      { p: 25, m: '[REVAL] Computing MTM using Yield Curves...' },
      { p: 50, m: '[ACCOUNTING] Generating GL Entries (Debit/Credit)...' },
      { p: 75, m: '[RECON] Matching cashflows vs External Nostro...' },
      { p: 100, m: '[SUCCESS] Batch complete. GL Exported to sub_ledger.csv' }
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setBatchProgress(step.p);
        setBatchLog(prev => [...prev, step.m]);
        if (step.p === 100) {
          setIsBatchRunning(false);
          setTrades(prev => prev.map(t => ({ ...t, status: 'SETTLED' })));
          updateMissionProgress(6, 0, true);
          updateMissionProgress(6, 1, true);
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
      response = 'Core commands: set_curve <id> <rate>, sql_trades, get_greeks, run_mxml, clear';
    } else if (cmd === 'set_curve') {
      const rate = parseFloat(parts[2]);
      setMarketFeed(prev => prev.map(m => m.pair === 'SOFR 3M' ? { ...m, bid: rate } : m));
      response = `[MDCS] Curve ${parts[1]} updated to ${rate}. Pricing kernel reloaded.`;
      updateMissionProgress(2, 0, true);
      updateMissionProgress(2, 1, true);
    } else if (cmd === 'sql_trades') {
      response = trades.length > 0 ? `MX_ID | TYPE | NOTIONAL | STATUS\n${trades.map(t => `${t.id} | ${t.type} | ${t.notional} | ${t.status}`).join('\n')}` : 'No trades found in MX_TRADE_LEDGER.';
    } else if (cmd === 'run_mxml') {
      response = '[MxML] Processing trade XMLs through workflow engine...\n[MxML] Status: Trade status updated to VERIFIED.';
      setTrades(prev => prev.map(t => ({ ...t, status: 'VERIFIED' })));
      updateMissionProgress(4, 0, true);
      updateMissionProgress(4, 1, true);
    } else if (cmd === 'get_greeks') {
      response = `DV01: ${stats.dv01}\nGamma: ${stats.gamma}\nVega: 0.124`;
      updateMissionProgress(3, 1, true);
    } else if (cmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else {
      response = `Command "${cmd}" not found. Type "help" for a list of valid commands.`;
    }

    setTerminalHistory(prev => [...prev, `skyline@mx3:~$ ${terminalInput}`, response]);
    setTerminalInput('');
  };

  return (
    <div className="max-w-full h-[calc(100vh-8rem)] flex flex-col bg-slate-950 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl animate-in fade-in duration-700">
      {/* Top Navigation */}
      <header className="h-14 bg-slate-900 border-b border-white/5 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-[10px] font-black text-white">MX</div>
            <span className="text-[11px] font-black text-white uppercase tracking-widest italic">Industrial Simulator</span>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <nav className="flex gap-1">
            {(['FO', 'MO', 'BO', 'BO_SPECS', 'BATCH', 'LABS'] as const).map(desk => (
              <button
                key={desk}
                onClick={() => setActiveDesk(desk)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeDesk === desk ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'
                }`}
              >
                {desk === 'FO' ? 'FO Desk' : desk === 'MO' ? 'MO Risk' : desk === 'BO' ? 'BO Ops' : desk === 'BO_SPECS' ? 'BO Specs' : desk === 'BATCH' ? 'EOD Batch' : 'Practice Labs'}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> ENV: PRODUCTION_SIM</span>
          <span>CURRENCY: USD</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Market Feed & Shell */}
        <aside className="w-80 bg-slate-900/50 border-r border-white/5 flex flex-col p-4 space-y-6 overflow-hidden">
          <div className="space-y-4">
            <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Market Feed (Real-time)</h3>
            <div className="space-y-2">
              {marketFeed.map(m => (
                <div key={m.pair} className="bg-slate-950/50 p-3 rounded-xl border border-white/5 flex justify-between items-center group hover:border-blue-500/30 transition-all">
                  <div>
                    <p className="text-[10px] font-black text-white">{m.pair}</p>
                    <p className="text-[8px] text-slate-500 font-mono">TICKER: {m.pair.replace('/', '_')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-emerald-400">{m.ask.toFixed(m.pair.includes('NIFTY') ? 0 : 4)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden bg-black/40 rounded-2xl border border-white/5 p-4 font-mono text-[10px]">
            <div className="flex-1 overflow-y-auto space-y-1 mb-4 custom-scrollbar">
              {terminalHistory.map((line, i) => (
                <p key={i} className={`${line.startsWith('skyline@') ? 'text-blue-400' : 'text-slate-400'} whitespace-pre-wrap`}>{line}</p>
              ))}
            </div>
            <form onSubmit={handleTerminalCommand} className="flex gap-2">
              <span className="text-blue-500">~$</span>
              <input 
                type="text" 
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Type command..."
                className="bg-transparent border-none outline-none text-emerald-400 w-full"
              />
            </form>
          </div>
        </aside>

        {/* Center Workspace */}
        <main className="flex-1 bg-slate-950 p-6 overflow-y-auto custom-scrollbar">
          {activeDesk === 'FO' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <section className="bg-slate-900 border border-white/5 rounded-3xl p-8">
                <h2 className="text-lg font-black text-white mb-6 uppercase tracking-tight">FO: Trade Capture Console</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Instrument</label>
                    <select id="inst-type" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none">
                      <option value="FX_FORWARD">FX Forward</option>
                      <option value="IRS">Interest Rate Swap</option>
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
                    <input id="trade-rate" type="number" step="0.0001" placeholder="0.0000" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none" />
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const type = (document.getElementById('inst-type') as HTMLSelectElement).value as any;
                    const pair = (document.getElementById('asset-pair') as HTMLSelectElement).value;
                    const notional = Number((document.getElementById('notional') as HTMLInputElement).value);
                    const rate = Number((document.getElementById('trade-rate') as HTMLInputElement).value);
                    if (notional && rate) bookTrade(type, pair, notional, rate);
                  }}
                  className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-10 rounded-xl text-[10px] uppercase tracking-widest transition-all"
                >
                  Confirm & Book Trade
                </button>
              </section>

              <section className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden">
                <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Trade Blotter</h3>
                  <span className="text-[9px] font-mono text-slate-500">COUNT: {trades.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-950 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-3">MX_ID</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Notional</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px] font-mono">
                      {trades.map(t => (
                        <tr key={t.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-blue-400 font-bold">{t.id}</td>
                          <td className="px-6 py-4 text-white">{t.type}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                              t.status === 'NEW' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {t.status}
                            </span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Portfolio Sensitivities</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-slate-950 rounded-2xl">
                      <span className="text-xs font-bold text-slate-400">Total Portfolio DV01</span>
                      <span className="text-xl font-mono text-white">${stats.dv01.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-950 rounded-2xl">
                      <span className="text-xs font-bold text-slate-400">Total Portfolio Gamma</span>
                      <span className="text-xl font-mono text-white">${stats.gamma.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Unrealized P&L Attribution</h3>
                  <div className="text-center py-12">
                    <p className={`text-4xl font-black ${stats.totalPnL >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      ${stats.totalPnL.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase font-black mt-2">Current Market MTM</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDesk === 'LABS' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {missions.map(mission => (
                  <div key={mission.id} className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4 flex flex-col">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-black text-white uppercase tracking-tight leading-tight">{mission.title}</h3>
                      <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${
                        mission.difficulty === 'Expert' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {mission.difficulty}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed flex-1">{mission.description}</p>
                    <div className="space-y-2 pt-4">
                      {mission.tasks.map((task, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                            mission.completed[i] ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'border-white/10'
                          }`}>
                            {mission.completed[i] && <i className="fas fa-check text-[7px]"></i>}
                          </div>
                          <span className={`text-[9px] font-bold ${mission.completed[i] ? 'text-slate-300' : 'text-slate-600'}`}>
                            {task}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeDesk === 'BO' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <section className="bg-slate-900 border border-white/5 rounded-3xl p-8">
                <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">BO: Ops & Integration Console</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-[9px] font-black text-slate-500 uppercase">MxML Workflow Simulator</h4>
                    <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 font-mono text-[10px] text-slate-500 space-y-2">
                      <p className="text-blue-400">Processing Trade Pipeline...</p>
                      <p>&lt;TradeMX XML_VERSION="1.1"&gt;</p>
                      <p>&nbsp;&nbsp;&lt;Header Desk="FX_PROD" /&gt;</p>
                      <p>&nbsp;&nbsp;&lt;Body Status="VERIFY_PENDING" /&gt;</p>
                      <p>&lt;/TradeMX&gt;</p>
                    </div>
                    <button 
                      onClick={() => handleTerminalCommand({ preventDefault: () => {} } as any)} 
                      className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-3 rounded-xl text-[9px] uppercase tracking-widest border border-white/5 transition-all"
                    >
                      Trigger MxML Process (Mission 4)
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-950 border border-white/5 rounded-2xl">
                      <span className="text-[10px] font-black text-white uppercase">MT300 SWIFT</span>
                      <button onClick={() => updateMissionProgress(5, 1, true)} className="text-[8px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">GENERATE (Mission 5)</button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-950 border border-white/5 rounded-2xl">
                      <span className="text-[10px] font-black text-white uppercase">Cash Settlement</span>
                      <button onClick={() => updateMissionProgress(5, 2, true)} className="text-[8px] font-black text-blue-400 bg-blue-500/10 px-2 py-1 rounded">EXECUTE T+0</button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeDesk === 'BATCH' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="max-w-2xl mx-auto space-y-8">
                <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-12 text-center space-y-6">
                  <h3 className="text-xl font-black text-white uppercase">EOD Batch Cycle</h3>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-800">
                      <div style={{ width: `${batchProgress}%` }} className="bg-blue-600 transition-all duration-500"></div>
                    </div>
                  </div>
                  <button 
                    onClick={runEODBatch}
                    disabled={isBatchRunning}
                    className="w-full bg-white text-slate-900 hover:bg-blue-600 hover:text-white disabled:bg-slate-800 font-black py-4 rounded-xl text-[10px] uppercase tracking-widest transition-all"
                  >
                    {isBatchRunning ? 'Batch in Progress...' : 'Start EOD Batch (Mission 6)'}
                  </button>
                </div>
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 h-48 overflow-y-auto font-mono text-[9px] text-slate-500 custom-scrollbar">
                  {batchLog.map((log, i) => <p key={i}>{log}</p>)}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="h-8 bg-slate-900 border-t border-white/5 px-6 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">
        <div className="flex gap-6">
          <span>PORT: 9090</span>
          <span>CLUSTER: HK_PROD_A</span>
        </div>
        <div className="flex gap-6">
          <span className="text-blue-500">SYNC: READY</span>
          <span>TECH_SKYLINE_PLATFORM</span>
        </div>
      </footer>
    </div>
  );
};

export default MX3Simulator;
