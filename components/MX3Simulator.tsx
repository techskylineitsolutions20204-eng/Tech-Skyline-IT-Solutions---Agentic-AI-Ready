
import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- INDUSTRIAL TYPES & INTERFACES ---
type AssetClass = 'FX' | 'DERIVATIVES' | 'FIXED_INCOME';
type TradeStatus = 'NEW' | 'PRICED' | 'VERIFIED' | 'SETTLED' | 'MATURED' | 'REJECTED';

interface MXTrade {
  id: string;
  assetClass: AssetClass;
  product: string;
  notional: number;
  rate: number;
  marketRate: number;
  pnl: number;
  status: TradeStatus;
  timestamp: string;
  book: string;
  counterparty: string;
  details: Record<string, any>;
}

interface MessageBusEvent {
  id: string;
  time: string;
  protocol: 'FIX' | 'FpML' | 'SWIFT' | 'JMS';
  direction: 'INBOUND' | 'OUTBOUND';
  content: string;
}

interface ServerMetric {
  id: string;
  label: string;
  load: number;
  status: 'HEALTHY' | 'WARN' | 'CRITICAL';
}

const MX3Simulator: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [activeDesk, setActiveDesk] = useState<'INFRA' | 'FO' | 'MO' | 'BO' | 'TREASURY' | 'REGULATORY'>('INFRA');
  const [trades, setTrades] = useState<MXTrade[]>([]);
  const [messageBus, setMessageBus] = useState<MessageBusEvent[]>([]);
  const [marketFeed, setMarketFeed] = useState({
    'USD/INR': 83.452,
    'EUR/USD': 1.0854,
    'GBP/USD': 1.2642,
    'SOFR_5Y': 0.0512,
    'US_10Y_BOND': 4.25
  });
  const [metrics, setMetrics] = useState<ServerMetric[]>([
    { id: 'app_srv', label: 'SaaS App Node', load: 15, status: 'HEALTHY' },
    { id: 'grid_p', label: 'Cloud Pricing Grid', load: 8, status: 'HEALTHY' },
    { id: 'db_prd', label: 'Oracle SaaS PRD', load: 22, status: 'HEALTHY' }
  ]);
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchLogs, setBatchLogs] = useState<string[]>([]);

  // --- REVALUATION ENGINE (Real-Time Brain) ---
  useEffect(() => {
    const ticker = setInterval(() => {
      // 1. Tick Market Data
      setMarketFeed(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(k => {
          (next as any)[k] += (Math.random() - 0.5) * 0.002;
        });
        return next;
      });

      // 2. Tick Server Load
      setMetrics(prev => prev.map(m => ({
        ...m,
        load: Math.max(5, Math.min(98, m.load + (Math.random() - 0.5) * 5))
      })));

      // 3. Revaluate Portfolio
      setTrades(prev => prev.map(t => {
        let mktVal = 0;
        if (t.product.includes('USD/INR')) mktVal = marketFeed['USD/INR'];
        else if (t.product.includes('EUR/USD')) mktVal = marketFeed['EUR/USD'];
        else if (t.product.includes('IRS')) mktVal = marketFeed['SOFR_5Y'];
        else mktVal = marketFeed['US_10Y_BOND'];

        return {
          ...t,
          marketRate: mktVal,
          pnl: (mktVal - t.rate) * (t.notional / 100)
        };
      }));
    }, 3000);
    return () => clearInterval(ticker);
  }, [marketFeed]);

  // --- LIFECYCLE HELPERS ---
  const logMessage = (protocol: MessageBusEvent['protocol'], dir: MessageBusEvent['direction'], content: string) => {
    const evt: MessageBusEvent = {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString(),
      protocol,
      direction: dir,
      content
    };
    setMessageBus(prev => [evt, ...prev].slice(0, 50));
  };

  const bookTrade = (asset: AssetClass, product: string, rate: number, notional: number) => {
    const id = `MX${Math.floor(100000 + Math.random() * 899999)}`;
    const newTrade: MXTrade = {
      id,
      assetClass: asset,
      product,
      notional,
      rate,
      marketRate: rate,
      pnl: 0,
      status: 'NEW',
      timestamp: new Date().toLocaleTimeString(),
      book: 'HFT_GLOBAL_PROD',
      counterparty: 'GS_LDN_DESK',
      details: { tenor: '5Y', currency: product.split('/')[0] || 'USD' }
    };

    // Simulate Integration Flow
    logMessage('FIX', 'INBOUND', `35=D|55=${product}|44=${rate}|38=${notional}|11=${id}`);
    
    setTimeout(() => {
      setTrades(prev => [newTrade, ...prev]);
      logMessage('JMS', 'OUTBOUND', `TRADE_PERSISTED: ${id} | STATUS: NEW`);
    }, 500);

    setTimeout(() => {
      setTrades(p => p.map(t => t.id === id ? { ...t, status: 'PRICED' } : t));
      logMessage('FpML', 'OUTBOUND', `<valuationReport tradeId="${id}"><pv value="0"/></valuationReport>`);
    }, 1500);
  };

  const executeBatch = () => {
    if (trades.length === 0) return alert("System requires FO Trades to initialize Batch.");
    setIsBatchRunning(true);
    setBatchProgress(0);
    setBatchLogs(['[BATCH] Starting Cloud EOD Cycle...', '[DB] Creating SaaS persistent snapshot...']);

    const steps = [
      { p: 25, m: '[PRICING] Running Cloud Monte Carlo VaR runs...' },
      { p: 50, m: '[GL] Generating multi-GAAP General Ledger entries...' },
      { p: 75, m: '[OPS] Matching SWIFT MT300 instructions...' },
      { p: 100, m: '[SUCCESS] Batch chain complete. Cloud state locked.' }
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setBatchProgress(step.p);
        setBatchLogs(l => [...l, step.m]);
        if (step.p === 100) {
          setIsBatchRunning(false);
          setTrades(p => p.map(t => ({ ...t, status: 'SETTLED' })));
          logMessage('SWIFT', 'OUTBOUND', '{1:F01TKSKYIN0AXXX}{4:\n:20:MX-EOD-SETTLE\n:22A:NEWT}');
        }
      }, (i + 1) * 1500);
    });
  };

  return (
    <div className="max-w-full h-[calc(100vh-8rem)] flex flex-col bg-slate-950 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl font-sans text-slate-300">
      {/* GLOBAL SYSTEM HEADER */}
      <header className="h-14 bg-slate-900 border-b border-white/10 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">MX</div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white italic">Cloud SaaS Live</span>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <nav className="flex gap-1">
            {(['INFRA', 'FO', 'MO', 'BO', 'TREASURY', 'REGULATORY'] as const).map(desk => (
              <button
                key={desk}
                onClick={() => setActiveDesk(desk)}
                className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${
                  activeDesk === desk ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'
                }`}
              >
                {desk === 'INFRA' ? 'Architecture' : desk === 'FO' ? 'Front Office' : desk === 'MO' ? 'Risk' : desk === 'BO' ? 'Ops' : desk}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono">
          <div className="flex gap-2">
            {metrics.map(m => (
              <div key={m.id} className="flex flex-col items-end">
                <span className="text-slate-600 tracking-tighter uppercase">{m.id}</span>
                <div className="w-10 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${m.load > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${m.load}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-4 w-px bg-white/10 mx-2"></div>
          <span className="text-emerald-400">MARKET_INFRA_LINK_UP</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT BAR: INTEGRATION MESSAGE BUS */}
        <aside className="w-80 hidden lg:flex flex-col bg-slate-900/50 border-r border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Analytics Feed (Live)</h3>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[9px] custom-scrollbar">
            {messageBus.map(msg => (
              <div key={msg.id} className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                <div className="flex justify-between items-center text-slate-600">
                  <span>{msg.time}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase ${
                    msg.protocol === 'FIX' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>{msg.protocol}</span>
                </div>
                <p className="text-slate-400 break-all">{msg.content}</p>
              </div>
            ))}
            {messageBus.length === 0 && (
              <div className="h-full flex items-center justify-center text-slate-600 italic text-center p-8">
                Listening for Market Infrastructure events...
              </div>
            )}
          </div>
        </aside>

        {/* MAIN WORKSPACE: CONTEXTUAL DESKS */}
        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-slate-950">
          
          {activeDesk === 'INFRA' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 space-y-4">
                  <h4 className="text-blue-400 font-black uppercase text-[10px] tracking-widest">SaaS App Cluster</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Unified Core Logic. Hosts Trade Lifecycle, Workflow Orchestration, and Pricing Services.</p>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-black"><i className="fas fa-check-circle"></i> AWS_US_EAST_1_ACTIVE</div>
                </div>
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 space-y-4">
                  <h4 className="text-emerald-400 font-black uppercase text-[10px] tracking-widest">Global Risk Grid</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">High-performance parallel computation for Monte Carlo, XVA, and VaR sensis.</p>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-black"><i className="fas fa-check-circle"></i> AUTO_SCALING_READY</div>
                </div>
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 space-y-4">
                  <h4 className="text-amber-400 font-black uppercase text-[10px] tracking-widest">Managed Persistence</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Oracle SaaS Instance. 100% durability and T+0 reconciliation snapshots.</p>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-black"><i className="fas fa-check-circle"></i> DB_REGION_SYNCED</div>
                </div>
              </div>

              <section className="bg-slate-900 rounded-[3rem] p-12 text-center border border-white/5 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><i className="fas fa-cloud-bolt text-[15rem]"></i></div>
                <div className="max-w-lg mx-auto space-y-4">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Cloud Batch Orchestrator</h2>
                  <p className="text-slate-500 text-sm font-medium">Coordinate EOD Revaluation, Accounting (multi-GAAP), and Regulatory reports.</p>
                </div>
                <div className="w-full max-w-xl mx-auto h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-500 shadow-xl" style={{ width: `${batchProgress}%` }}></div>
                </div>
                <button 
                  onClick={executeBatch}
                  disabled={isBatchRunning}
                  className="bg-white text-slate-950 font-black px-12 py-5 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                >
                  {isBatchRunning ? 'Running Cloud Batch...' : 'Trigger Daily Cloud Sequence'}
                </button>
                <div className="bg-black/40 p-6 rounded-2xl text-left font-mono text-[9px] text-slate-500 h-32 overflow-y-auto custom-scrollbar max-w-xl mx-auto border border-white/5">
                  {batchLogs.map((log, i) => <div key={i}>{log}</div>)}
                </div>
              </section>
            </div>
          )}

          {activeDesk === 'FO' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <section className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5">
                <h3 className="text-lg font-black text-white mb-8 uppercase tracking-tight">Real-Time Trade Entry</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase">Product</label>
                    <select id="f-asset" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none">
                      <option value="FX">FX (Spot/Fwd)</option>
                      <option value="DERIVATIVES">Derivatives (IRS)</option>
                      <option value="FIXED_INCOME">Fixed Income (Bonds)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase">Pair / ID</label>
                    <select id="f-prod" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none">
                      <option>USD/INR</option>
                      <option>EUR/USD</option>
                      <option>SOFR_5Y_IRS</option>
                      <option>UST_10Y_BOND</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase">Notional (M)</label>
                    <input id="f-notional" type="number" placeholder="10.0" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase">Price / Rate</label>
                    <input id="f-rate" type="number" placeholder="83.50" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none" />
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const asset = (document.getElementById('f-asset') as HTMLSelectElement).value as any;
                    const prod = (document.getElementById('f-prod') as HTMLSelectElement).value;
                    const rate = Number((document.getElementById('f-rate') as HTMLInputElement).value);
                    const notional = Number((document.getElementById('f-notional') as HTMLInputElement).value) * 1000000;
                    if(rate && notional) bookTrade(asset, prod, rate, notional);
                  }}
                  className="mt-8 bg-blue-600 text-white font-black px-10 py-4 rounded-xl uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20"
                >
                  Capture & Price Live
                </button>
              </section>

              <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Cloud Trade Blotter</h4>
                  <div className="flex gap-4">
                    <span className="text-[9px] font-mono text-emerald-400">Total P&L: ${trades.reduce((a,b)=>a+b.pnl, 0).toLocaleString()}</span>
                  </div>
                </div>
                <table className="w-full text-left text-[11px] font-mono">
                  <thead className="bg-white/5 text-slate-500">
                    <tr>
                      <th className="px-6 py-4 uppercase">MX_ID</th>
                      <th className="px-6 py-4 uppercase">Product</th>
                      <th className="px-6 py-4 uppercase text-right">Notional</th>
                      <th className="px-6 py-4 uppercase text-right">Market Rate</th>
                      <th className="px-6 py-4 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    {trades.map(t => (
                      <tr key={t.id} className="border-t border-white/5 hover:bg-white/5">
                        <td className="px-6 py-4 text-blue-400 font-bold">{t.id}</td>
                        <td className="px-6 py-4">{t.product}</td>
                        <td className="px-6 py-4 text-right">${t.notional.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">{t.marketRate.toFixed(4)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                            t.status === 'SETTLED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>{t.status}</span>
                        </td>
                      </tr>
                    ))}
                    {trades.length === 0 && <tr><td colSpan={5} className="px-6 py-20 text-center text-slate-600 italic">Listening for SaaS trade events...</td></tr>}
                  </tbody>
                </table>
              </section>
            </div>
          )}

          {activeDesk === 'MO' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Continuous Risk Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-6 rounded-2xl border border-white/5">
                      <span className="text-[8px] font-black text-slate-500 uppercase mb-1 block">Portfolio Delta</span>
                      <span className="text-xl font-black text-white font-mono">${(trades.length * 12.5).toFixed(2)}</span>
                    </div>
                    <div className="bg-slate-950 p-6 rounded-2xl border border-white/5">
                      <span className="text-[8px] font-black text-slate-500 uppercase mb-1 block">Exposure Limit</span>
                      <span className="text-xl font-black text-emerald-400 font-mono">OK</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-center items-center text-center space-y-2">
                  <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest">SaaS Cloud VaR</h4>
                  <div className="text-5xl font-black text-white font-mono">${(trades.length * 2850).toLocaleString()}</div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">99.9% MC - Updated Live</p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* SYSTEM STATUS BAR */}
      <footer className="h-10 bg-slate-900 border-t border-white/10 px-8 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-600 shrink-0">
        <div className="flex gap-8">
          <span>INSTANCE: SAAS_PRD_V3</span>
          <span>CURRENCY: USD</span>
          <span className="text-blue-500">PLATFORM: MX.3 ENTERPRISE</span>
        </div>
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-emerald-400">MARKET_INFRA_CONNECTED</span>
          </div>
          <span className="opacity-30">|</span>
          <span>TECH_SKYLINE_IT_SOLUTIONS</span>
        </div>
      </footer>
    </div>
  );
};

export default MX3Simulator;
