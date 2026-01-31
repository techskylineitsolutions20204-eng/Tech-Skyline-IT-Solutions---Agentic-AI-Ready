
import React, { useState, useEffect, useMemo } from 'react';

interface Trade {
  id: string;
  type: 'FX_SPOT' | 'FX_FORWARD' | 'IRS' | 'OIS';
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

const MX3Simulator: React.FC = () => {
  const [activeDesk, setActiveDesk] = useState<'FO' | 'MO' | 'BO' | 'BATCH' | 'BO_SPECS'>('FO');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [marketFeed, setMarketFeed] = useState<MarketData[]>([
    { pair: 'USD/INR', bid: 83.42, ask: 83.45, change: 0.02 },
    { pair: 'EUR/USD', bid: 1.0852, ask: 1.0855, change: -0.01 },
    { pair: 'GBP/USD', bid: 1.2640, ask: 1.2644, change: 0.05 },
    { pair: 'SOFR 3M', bid: 5.32, ask: 5.35, change: 0.01 },
  ]);
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchLog, setBatchLog] = useState<string[]>([]);

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

  // Calculate Portfolio Stats
  const stats = useMemo(() => {
    const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
    const totalNotional = trades.reduce((sum, t) => sum + t.notional, 0);
    return { totalPnL, totalNotional, count: trades.length };
  }, [trades]);

  const bookTrade = (type: Trade['type'], pair: string, notional: number, rate: number) => {
    const mkt = marketFeed.find(f => f.pair === pair);
    const mktRate = mkt ? (mkt.bid + mkt.ask) / 2 : rate;
    const pnl = (mktRate - rate) * (notional / 100); // Simple reval logic

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
  };

  const runEODBatch = () => {
    setIsBatchRunning(true);
    setBatchProgress(0);
    setBatchLog(['[SYSTEM] Initializing EOD Batch Sequence...', '[DB] Connecting to Murex SQL Repo...']);

    const steps = [
      { p: 25, m: '[MDCS] Importing Real-time Market Data Curves...' },
      { p: 50, m: '[REVAL] Running QuantLib Revaluation Engine...' },
      { p: 75, m: '[RISK] Computing Portfolio VaR (99% CI)...' },
      { p: 100, m: '[BO] Generating Settlement Instructions (XML)...' }
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setBatchProgress(step.p);
        setBatchLog(prev => [...prev, step.m]);
        if (step.p === 100) {
          setIsBatchRunning(false);
          setTrades(prev => prev.map(t => ({ ...t, status: 'SETTLED' })));
          setBatchLog(prev => [...prev, '[SUCCESS] Daily cycle completed. Report ready.']);
        }
      }, (i + 1) * 1500);
    });
  };

  return (
    <div className="max-w-full h-[calc(100vh-8rem)] flex flex-col bg-slate-950 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl animate-in fade-in duration-700">
      {/* Top Navigation / Terminal Header */}
      <header className="h-14 bg-slate-900 border-b border-white/5 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-[10px] font-black text-white">MX</div>
            <span className="text-[11px] font-black text-white uppercase tracking-widest">MX.3 Platform <span className="text-blue-500">v4.2.10</span></span>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <nav className="flex gap-1">
            {(['FO', 'MO', 'BO', 'BO_SPECS', 'BATCH'] as const).map(desk => (
              <button
                key={desk}
                onClick={() => setActiveDesk(desk)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeDesk === desk ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'
                }`}
              >
                {desk === 'FO' ? 'Front Office' : desk === 'MO' ? 'Middle Office' : desk === 'BO' ? 'Back Office' : desk === 'BO_SPECS' ? 'BO Specs' : 'EOD Batch'}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> SYSTEM_LIVE</span>
          <span>USER: SKYLINE_ADMIN</span>
          <span>REGION: GLOBAL_HK</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Market Monitor */}
        <aside className="w-72 bg-slate-900/50 border-r border-white/5 flex flex-col p-4 space-y-6">
          <div className="space-y-4">
            <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Live Market Feed</h3>
            <div className="space-y-2">
              {marketFeed.map(m => (
                <div key={m.pair} className="bg-slate-950/50 p-3 rounded-xl border border-white/5 flex justify-between items-center group hover:border-blue-500/30 transition-all">
                  <div>
                    <p className="text-[10px] font-black text-white">{m.pair}</p>
                    <p className="text-[9px] text-slate-500 font-mono">MDCS_FEED_01</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-emerald-400">{m.ask.toFixed(4)}</p>
                    <p className={`text-[8px] font-mono ${m.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {m.change >= 0 ? '+' : ''}{m.change.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-600/5 border border-blue-500/10 rounded-2xl">
            <h4 className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-3">Portfolio Snapshot</h4>
            <div className="space-y-3">
              <div>
                <p className="text-[8px] text-slate-500 font-black uppercase">Active Trades</p>
                <p className="text-xl font-black text-white">{stats.count}</p>
              </div>
              <div>
                <p className="text-[8px] text-slate-500 font-black uppercase">Unrealized P&L</p>
                <p className={`text-xl font-black ${stats.totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${stats.totalPnL.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Workspace */}
        <main className="flex-1 bg-slate-950 p-6 overflow-y-auto custom-scrollbar">
          {activeDesk === 'FO' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <section className="bg-slate-900 border border-white/5 rounded-3xl p-8">
                <h2 className="text-lg font-black text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                  <i className="fas fa-plus-circle text-blue-500"></i> Trade Booking Desk
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Instrument</label>
                    <select id="inst-type" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500">
                      <option value="FX_SPOT">FX Spot</option>
                      <option value="FX_FORWARD">FX Forward</option>
                      <option value="IRS">Interest Rate Swap</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Asset Pair</label>
                    <select id="asset-pair" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500">
                      {marketFeed.map(m => <option key={m.pair} value={m.pair}>{m.pair}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Notional</label>
                    <input id="notional" type="number" placeholder="1000000" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Trade Rate</label>
                    <input id="trade-rate" type="number" step="0.0001" placeholder="0.0000" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500" />
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
                  className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-10 rounded-xl text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20"
                >
                  Confirm & Capture Trade
                </button>
              </section>

              <section className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden">
                <div className="px-6 py-4 bg-white/5 flex justify-between items-center">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Trade Blotter (Intra-day)</h3>
                  <span className="text-[9px] font-mono text-slate-500">TOTAL_RECORDS: {trades.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-950 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-3">MX_ID</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Pair</th>
                        <th className="px-6 py-3 text-right">Notional</th>
                        <th className="px-6 py-3 text-right">Rate</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px] font-mono">
                      {trades.map(t => (
                        <tr key={t.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-blue-400 font-bold">{t.id}</td>
                          <td className="px-6 py-4 text-white font-bold">{t.type}</td>
                          <td className="px-6 py-4 text-slate-400">{t.pair}</td>
                          <td className="px-6 py-4 text-right text-white">${t.notional.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right text-emerald-500">{t.rate.toFixed(4)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                              t.status === 'NEW' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {t.status}
                            </span>
                          </td>
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
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Risk Sensitivities (PV01/DV01)</h3>
                  <div className="space-y-6">
                    {trades.slice(0, 3).map(t => (
                      <div key={t.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{t.id}</p>
                          <p className="text-[9px] text-slate-500 uppercase">{t.pair} | {t.type}</p>
                        </div>
                        <div className="flex gap-4">
                          <div className="text-right">
                            <p className="text-[8px] font-black text-slate-500 uppercase">PV01</p>
                            <p className="text-xs font-mono text-white">$124.50</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] font-black text-slate-500 uppercase">Reval P&L</p>
                            <p className={`text-xs font-mono ${t.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              ${t.pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Value at Risk (99% Monte Carlo)</h3>
                  <div className="h-40 flex items-end gap-2 mb-4">
                    {[40, 60, 45, 80, 55, 90, 70, 85].map((h, i) => (
                      <div key={i} className="flex-1 bg-blue-600/20 border-t-2 border-blue-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase">Portfolio VaR (1D)</p>
                    <p className="text-xl font-black text-rose-500">-$24,150.00</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDesk === 'BO' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <section className="bg-slate-900 border border-white/5 rounded-3xl p-8">
                <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Settlement & Operations Console</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">Reconcile trade instructions against SWIFT network confirmation status.</p>
                    <div className="bg-slate-950 p-6 rounded-2xl font-mono text-[10px] text-slate-500 space-y-2">
                      <p className="text-emerald-400"># SQL Query: RECON_ENGINE_01</p>
                      <p>SELECT trade_id, amt, status FROM mx_trades</p>
                      <p>WHERE value_date = '2025-02-15'</p>
                      <p>AND counterparty = 'GS_LDN_DESK'</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-950 border border-white/5 rounded-2xl">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">MT300 Message</span>
                      <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">GENERATED</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-950 border border-white/5 rounded-2xl">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Cashflow Recon</span>
                      <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">T+1 PENDING</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeDesk === 'BO_SPECS' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Settlement Specs */}
                <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 space-y-6">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                    <i className="fas fa-file-signature text-blue-500"></i> Settlement Rules (SSI)
                  </h3>
                  <div className="space-y-4 text-slate-400 text-[11px] leading-relaxed">
                    <p className="font-bold text-white underline">SSI Identification Strategy:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>SSI must be uniquely identified by <span className="text-blue-400">Currency</span>, <span className="text-blue-400">Counterparty</span>, and <span className="text-blue-400">Event</span>.</li>
                      <li>Priority lookup: Custom Account > Global SSI > Default Nostro.</li>
                      <li>Settlement Method: CLS (Continuous Linked Settlement) for eligible pairs (e.g., USD/EUR).</li>
                    </ul>
                    <div className="bg-slate-950 p-4 rounded-xl border border-white/5 font-mono">
                      <p className="text-slate-500 text-[9px]"># SSI XML Structure</p>
                      <pre className="text-blue-300">{`<Settlement>\n  <Agent>JPM_CHASE_NY</Agent>\n  <Nostro>NOSTRO_USD_01</Nostro>\n  <Swift>JPMCNY33</Swift>\n</Settlement>`}</pre>
                    </div>
                  </div>
                </div>

                {/* Confirmation Specs */}
                <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 space-y-6">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                    <i className="fas fa-envelope-open-text text-amber-500"></i> SWIFT MT300 Mapping
                  </h3>
                  <div className="space-y-3">
                    <table className="w-full text-left text-[10px] font-mono border-collapse">
                      <thead className="text-slate-500 border-b border-white/10">
                        <tr>
                          <th className="py-2">Field Tag</th>
                          <th className="py-2">Murex Extraction Rule</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        <tr className="border-b border-white/5"><td className="py-2 text-amber-400">:20:</td><td className="py-2">INTERNAL_TRADE_ID (MX_ID)</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 text-amber-400">:22A:</td><td className="py-2">IF TRADE_STATUS = NEW THEN 'NEWT'</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 text-amber-400">:82A:</td><td className="py-2">SENDER_SWIFT (OWN_NOSTRO)</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 text-amber-400">:87A:</td><td className="py-2">RECEIVER_SWIFT (CPTY_SSI)</td></tr>
                        <tr><td className="py-2 text-amber-400">:30V:</td><td className="py-2">VALUE_DATE (YYYYMMDD)</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Accounting Specs */}
                <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 space-y-6 lg:col-span-2">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                    <i className="fas fa-calculator text-emerald-500"></i> Accounting & General Ledger Specs
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 bg-slate-950 rounded-2xl border border-white/5">
                      <h4 className="text-[10px] font-black text-white mb-3 uppercase">Trigger: Trade Booking</h4>
                      <p className="text-[9px] text-slate-500 mb-2">DR: Cpty_Receivable</p>
                      <p className="text-[9px] text-slate-500">CR: Portfolio_Unrealized_PnL</p>
                    </div>
                    <div className="p-5 bg-slate-950 rounded-2xl border border-white/5">
                      <h4 className="text-[10px] font-black text-white mb-3 uppercase">Trigger: EOD Revaluation</h4>
                      <p className="text-[9px] text-slate-500 mb-2">DR/CR: MTM_Adjustment</p>
                      <p className="text-[9px] text-slate-500">OFFSET: PnL_GL_Code_4401</p>
                    </div>
                    <div className="p-5 bg-slate-950 rounded-2xl border border-white/5">
                      <h4 className="text-[10px] font-black text-white mb-3 uppercase">Trigger: Settlement</h4>
                      <p className="text-[9px] text-slate-500 mb-2">DR: Nostro_Cash_Account</p>
                      <p className="text-[9px] text-slate-500">CR: Cpty_Receivable</p>
                    </div>
                  </div>
                  <div className="pt-4 flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Functional Validation:</span>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">Accounting Rules must be multi-currency aware (ISO 4217)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDesk === 'BATCH' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="max-w-3xl mx-auto space-y-12">
                <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-12 text-center space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">EOD Batch Orchestration</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Lifecycle State Machine v2.0</p>
                  </div>

                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase inline-block py-1 px-2 rounded-full text-blue-600 bg-blue-100">
                          {isBatchRunning ? 'Processing Batch Sequence' : 'Batch Engine Standby'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-blue-600">
                          {batchProgress}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-800">
                      <div style={{ width: `${batchProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"></div>
                    </div>
                  </div>

                  <button 
                    onClick={runEODBatch}
                    disabled={isBatchRunning}
                    className="w-full bg-white text-slate-900 hover:bg-blue-600 hover:text-white disabled:bg-slate-800 disabled:text-slate-600 font-black py-5 rounded-2xl shadow-2xl transition-all uppercase tracking-widest text-sm"
                  >
                    {isBatchRunning ? 'Batch Execution in Progress...' : 'Start Daily EOD Cycle'}
                  </button>
                </div>

                <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 h-64 overflow-y-auto custom-scrollbar font-mono text-[10px]">
                  {batchLog.map((log, i) => (
                    <p key={i} className={`mb-1 ${log.includes('SUCCESS') ? 'text-emerald-400' : 'text-slate-500'}`}>{log}</p>
                  ))}
                  {batchLog.length === 0 && <p className="text-slate-700 italic">No batch logs available. Execution history purged.</p>}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer / Status Bar */}
      <footer className="h-8 bg-slate-900 border-t border-white/5 px-6 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">
        <div className="flex gap-6">
          <span>PORT: 9090</span>
          <span>CLUSTER: HK_PROD_A</span>
          <span>LATENCY: 12ms</span>
        </div>
        <div className="flex gap-6">
          <span className="text-blue-500">SYNC_STATUS: 100%</span>
          <span>CURRENCY: USD</span>
        </div>
      </footer>
    </div>
  );
};

export default MX3Simulator;
