import { useState, useEffect, useCallback } from 'react';
import OrderScreen from './OrderScreen.jsx';

const API = 'http://localhost:5000/api';

function getToken() { return sessionStorage.getItem('lu_admin_token'); }
function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

// ── useElapsed — returns { display, isOvertime } and ticks every second ───────
function useElapsed(startTime, plannedDuration) {
  const [state, setState] = useState({ display: '', isOvertime: false });
  useEffect(() => {
    if (!startTime) return;
    const calc = () => {
      const diff = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
      const planned = (plannedDuration || 0) * 3600;
      const isOvertime = planned > 0 && diff > planned;
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      const pad = (n) => String(n).padStart(2, '0');
      setState({ display: h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`, isOvertime });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [startTime, plannedDuration]);
  return state;
}

// ── Timer Badge — large clock shown below End Session button ──────────────────
function TimerBadge({ startTime, plannedDuration, compact = false, light = false }) {
  const { display, isOvertime } = useElapsed(startTime, plannedDuration);
  if (!display) return null;
  if (compact) {
    return (
      <div className={`flex items-center justify-center gap-1.5 py-1 rounded-lg ${isOvertime ? 'bg-red-500/10' : light ? 'bg-black/5' : 'bg-black/30'}`}>
        <span className={`font-mono font-black text-sm tabular-nums tracking-wider ${isOvertime ? 'text-red-400' : 'text-primary'}`}>
          {display}
        </span>
        {isOvertime && <span className="text-[8px] font-black tracking-widest text-red-500 uppercase">OT</span>}
      </div>
    );
  }
  return (
    <div className={`mt-1 flex items-center justify-between px-3 py-2 rounded-lg border ${
      isOvertime ? 'border-red-500/30 bg-red-500/8' : light ? 'border-primary/20 bg-primary/5' : 'border-primary/15 bg-primary/5'
    }`}>
      <div className="flex items-center gap-1.5">
        <span className={`material-symbols-outlined text-sm ${isOvertime ? 'text-red-500' : 'text-primary'}`}>timer</span>
        <span className={`text-[9px] font-bold tracking-widest uppercase hidden xl:inline ${isOvertime ? 'text-red-500' : 'text-primary'}`}>
          {isOvertime ? 'OVERTIME' : 'ELAPSED'}
        </span>
      </div>
      <span className={`font-mono font-black text-base xl:text-xl tabular-nums tracking-widest ${isOvertime ? 'text-red-500' : 'text-primary'}`}>
        {display}
      </span>
    </div>
  );
}

// ── Card border colour helper ─────────────────────────────────────────────────
function useCardBorder(station, light) {
  const { isActive, activeSession } = station;
  if (!isActive) return light ? 'border-gray-200' : 'border-white/5';
  if (!activeSession) return light ? 'border-gray-200' : 'border-[#1a1a1a]';
  if (activeSession.sessionType === 'maintenance') return 'border-amber-500/40';
  return 'border-primary/30'; // green = active; will be overridden to red in overtime by TimerBadge colouring
}

// ── Shared StationCard — used by both Grid and Floor views ───────────────────
function StationCard({ station, onStartSession, onEndSession, onToggleActive, onViewOrder, compact = false, light = false }) {
  const { label, type, specs, hourlyRate, isActive, activeSession } = station;
  const icon = type === 'ps5' ? 'sports_esports' : 'computer';
  const borderBase = useCardBorder(station, light);
  const bgClass = light ? 'bg-white shadow-sm' : 'bg-[#0f0f0f]';
  const textTitleClass = light ? 'text-gray-800' : 'text-white';
  const textMutedClass = light ? 'text-gray-500' : 'text-gray-400';
  const textFaintClass = light ? 'text-gray-400' : 'text-gray-600';

  // Always call hook at top level
  const { isOvertime } = useElapsed(activeSession?.startTime, activeSession?.plannedDuration);

  // ── INACTIVE ─────────────────────────────────────────────────────────────
  if (!isActive) {
    return (
      <div className={`rounded-xl border ${borderBase} ${bgClass} p-3 flex flex-col gap-2 opacity-55`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-black tracking-widest ${textMutedClass}`}>{label}</span>
          <span className={`material-symbols-outlined text-base ${textFaintClass}`}>{icon}</span>
        </div>
        {!compact && <p className={`text-[9px] leading-snug ${textFaintClass}`}>{specs}</p>}
        <div className="flex items-center gap-1.5 mt-auto">
          <span className={`w-1.5 h-1.5 rounded-full inline-block ${light ? 'bg-gray-400' : 'bg-gray-600'}`} />
          <span className={`text-[9px] font-bold tracking-widest uppercase ${textMutedClass}`}>UNAVAILABLE</span>
        </div>
        <button onClick={() => onToggleActive(station.id, true)}
          className={`w-full py-1.5 rounded-lg text-[9px] font-bold tracking-widest uppercase border transition-all ${
            light ? 'border-gray-200 text-gray-500 hover:border-primary/40 hover:text-primary' : 'border-white/10 text-gray-400 hover:border-primary/40 hover:text-primary'
          }`}>
          Re-enable
        </button>
      </div>
    );
  }

  // ── OCCUPIED ─────────────────────────────────────────────────────────────
  if (activeSession) {
    const isMaintenance = activeSession.sessionType === 'maintenance';
    const border = isMaintenance ? (light ? 'border-amber-400' : 'border-amber-500/30') : isOvertime ? (light ? 'border-red-400' : 'border-red-500/50') : (light ? 'border-primary/40 shadow-sm' : 'border-primary/30');

    let timeRange = '';
    if (!isMaintenance && activeSession.startTime && activeSession.plannedDuration) {
      const s = new Date(activeSession.startTime);
      const e = new Date(s.getTime() + activeSession.plannedDuration * 3600000);
      const f = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
      timeRange = `${f.format(s).replace(/\s/g, '').toLowerCase()} to ${f.format(e).replace(/\s/g, '').toLowerCase()}`;
    }

    return (
      <div className={`rounded-xl border ${border} ${bgClass} p-3 flex flex-col gap-2 transition-colors`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-black tracking-widest ${textTitleClass}`}>{label}</span>
          <span className={`material-symbols-outlined text-base ${isMaintenance ? 'text-amber-500' : 'text-primary'}`}>{icon}</span>
        </div>
        {isMaintenance ? (
          <div className="flex items-center gap-1.5">
            <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            <span className="text-[9px] font-bold tracking-widest uppercase text-amber-500">MAINTENANCE</span>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className={`text-xs font-bold truncate ${textTitleClass}`}>{activeSession.customerName}</p>
              {!compact && (
                <span className={`text-[9px] font-bold tracking-wider ${light ? 'text-gray-500 bg-gray-100' : 'text-gray-400 bg-white/5'} px-1.5 py-0.5 rounded`}>
                  {timeRange}
                </span>
              )}
            </div>
            {!compact && <p className={`text-[9px] ${textMutedClass}`}>{activeSession.phone}</p>}
            <div className="flex items-center gap-1.5">
              <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              <span className="text-[9px] font-bold tracking-widest uppercase text-primary">ACTIVE</span>
              {!compact && <span className={`text-[9px] ${textMutedClass}`}>· {activeSession.plannedDuration}h Plan · ₹{activeSession.pricingINR}</span>}
            </div>
          </>
        )}
        <button onClick={() => onEndSession(activeSession, label)}
          className={`w-full py-1.5 rounded-lg text-[9px] font-bold tracking-widest uppercase border transition-all ${
            light ? 'border-red-400 text-red-500 hover:bg-red-50' : 'border-red-500/40 text-red-400 hover:bg-red-500/10'
          }`}>
          End Session
        </button>
        {!isMaintenance && (
          <button onClick={() => onViewOrder(activeSession, label)}
            className={`w-full py-1.5 rounded-lg text-[9px] font-bold tracking-widest uppercase border border-primary/30 text-primary hover:bg-primary/10 transition-all flex items-center justify-center gap-1`}>
            <span className="material-symbols-outlined text-xs">receipt_long</span>
            View Order
          </button>
        )}
        {/* Large live timer — below End Session */}
        {!isMaintenance && (
          <TimerBadge
            startTime={activeSession.startTime}
            plannedDuration={activeSession.plannedDuration}
            compact={compact}
            light={light}
          />
        )}
      </div>
    );
  }

  // ── AVAILABLE ─────────────────────────────────────────────────────────────
  return (
    <div className={`rounded-xl border ${borderBase} ${bgClass} p-3 flex flex-col gap-2 hover:border-primary/40 transition-all`}>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-black tracking-widest ${light ? 'text-[#0ca73e]' : 'text-[#0df259]'}`}>{label}</span>
        <span className="material-symbols-outlined text-primary text-base">{icon}</span>
      </div>
      {!compact && (
        <span className={`self-start text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${
          type === 'ps5' ? 'border-purple-500/40 text-purple-600 bg-purple-500/10' : 'border-primary/30 text-primary bg-primary/10'
        }`}>{type.toUpperCase()}</span>
      )}
      {!compact && <p className={`text-[9px] leading-snug ${textMutedClass}`}>{specs}</p>}
      <p className={`text-[9px] ${textMutedClass}`}>₹{hourlyRate}/hr</p>
      <div className="flex items-center gap-1.5 mt-auto">
        <span className={`w-1.5 h-1.5 rounded-full inline-block ${light ? 'bg-[#0ca73e]' : 'bg-[#0df259]'}`} />
        <span className={`text-[9px] font-bold tracking-widest uppercase ${light ? 'text-[#0ca73e]' : 'text-[#0df259]'}`}>AVAILABLE</span>
      </div>
      <button onClick={() => onStartSession(station)}
        className="w-full py-1.5 rounded-lg text-[9px] font-bold tracking-widest uppercase bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20 hover:shadow-[0_0_12px_rgba(13,242,89,0.15)] transition-all">
        Start Session
      </button>
      <button onClick={() => onToggleActive(station.id, false)}
        className={`w-full py-1 rounded-lg text-[8px] font-bold tracking-widest uppercase border transition-all ${
          light ? 'border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-500 hover:bg-amber-50' : 'border-white/5 text-gray-600 hover:border-amber-500/30 hover:text-amber-500'
        }`}>
        Mark Unavailable
      </button>
    </div>
  );
}

// ── Floor Layout View — mirrors physical cafe layout ─────────────────────────
// Left: PCs in 2 columns × 5 rows | Right: PS5s in a column
function FloorLayoutView({ pcs, ps5s, cardProps, light }) {
  const bgClass = light ? 'bg-gray-50 border-gray-200 shadow-inner' : 'bg-[#080808] border-[#1a1a1a]';
  const labelMutedClass = light ? 'text-gray-500' : 'text-gray-600';
  const labelTitleClass = light ? 'text-gray-700' : 'text-gray-400';
  const dividerClass = light ? 'bg-gray-200' : 'bg-[#1a1a1a]';
  
  return (
    <div className={`rounded-2xl border ${bgClass} p-6 overflow-x-auto`}>
      {/* Room label header */}
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-[9px] font-bold tracking-[0.3em] uppercase ${labelMutedClass}`}>CAFE FLOOR PLAN</span>
      </div>

      <div className="flex gap-6 items-start">
        {/* ── PC Zone (left) ── */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-sm">computer</span>
            <span className={`text-[10px] font-bold tracking-widest uppercase ${labelTitleClass}`}>PC Zone</span>
            <div className={`flex-1 h-px ${dividerClass}`} />
            <span className={`text-[9px] ${labelMutedClass}`}>{pcs.filter(s => s.activeSession).length}/{pcs.length}</span>
          </div>
          {/* 2-col × 5-row grid */}
          <div className="grid grid-cols-2 gap-2">
            {pcs.map(s => (
              <StationCard key={s.id} station={s} {...cardProps} compact light={light} />
            ))}
          </div>
        </div>

        {/* Divider wall */}
        <div className={`flex-none w-px self-stretch relative ${dividerClass}`}>
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-3 flex flex-col justify-center items-center gap-1">
            <span className={`w-1 h-1 rounded-full ${dividerClass}`} />
            <span className={`w-1 h-1 rounded-full ${dividerClass}`} />
            <span className={`w-1 h-1 rounded-full ${dividerClass}`} />
          </div>
        </div>

        {/* ── Console Zone (right) ── */}
        <div className="w-44">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-purple-500 text-sm">sports_esports</span>
            <span className={`text-[10px] font-bold tracking-widest uppercase ${labelTitleClass}`}>Console</span>
          </div>
          <div className="flex flex-col gap-2">
            {ps5s.map(s => (
              <StationCard key={s.id} station={s} {...cardProps} compact light={light} />
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={`flex items-center gap-4 mt-5 pt-4 border-t ${dividerClass}`}>
        {[
          { color: 'bg-[#0df259]', label: 'Available' },
          { color: 'bg-primary border border-primary/50', label: 'Active' },
          { color: 'bg-red-500', label: 'Overtime' },
          { color: 'bg-amber-400', label: 'Maintenance' },
          { color: light ? 'bg-gray-400' : 'bg-gray-700', label: 'Unavailable' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${color} inline-block`} />
            <span className={`text-[9px] uppercase tracking-widest ${labelMutedClass}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Start Session Modal ───────────────────────────────────────────────────────
function StartSessionModal({ station, onClose, onConfirm }) {
  const [form, setForm] = useState({ customerName: '', phone: '', sessionType: 'walkin', plannedDuration: 1, notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customDur, setCustomDur] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const dur = form.plannedDuration === 'custom' ? (parseInt(customDur) || 0) : form.plannedDuration;
  const charge = station.hourlyRate * dur;

  async function handleConfirm() {
    if (!form.customerName.trim() || !form.phone.trim()) { setError('Name and phone are required.'); return; }
    if (dur < 1) { setError('Duration must be at least 1 hour.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/sessions`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ stationId: station.id, customerName: form.customerName.trim(), phone: form.phone.trim(), sessionType: form.sessionType, plannedDuration: dur, notes: form.notes.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to start session.'); return; }
      onConfirm();
    } catch { setError('Network error.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] text-primary font-bold tracking-widest uppercase mb-0.5">Start Session</p>
            <h3 className="text-white font-black text-lg tracking-tight">{station.label}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-all">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Customer Name *</label>
            <input value={form.customerName} onChange={e => set('customerName', e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="e.g. Rahul Sharma" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Phone *</label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="10-digit number" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Session Type</label>
            <select value={form.sessionType} onChange={e => set('sessionType', e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none transition-all">
              <option value="walkin">Walk-in</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Duration</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(h => (
                <button key={h} onClick={() => set('plannedDuration', h)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${form.plannedDuration === h ? 'bg-primary/10 border-primary text-primary' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>
                  {h}h
                </button>
              ))}
              <button onClick={() => set('plannedDuration', 'custom')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${form.plannedDuration === 'custom' ? 'bg-primary/10 border-primary text-primary' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>
                Custom
              </button>
            </div>
            {form.plannedDuration === 'custom' && (
              <input type="number" min="1" value={customDur} onChange={e => setCustomDur(e.target.value)}
                className="mt-2 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none transition-all" placeholder="Enter hours" />
            )}
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Notes (optional)</label>
            <input value={form.notes} onChange={e => set('notes', e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none transition-all" placeholder="e.g. Tournament player" />
          </div>
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 flex items-center justify-between">
            <span className="text-xs text-gray-400">{dur}h × ₹{station.hourlyRate}/hr</span>
            <span className="text-primary font-black text-lg">₹{charge}</span>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button onClick={handleConfirm} disabled={loading}
            className="w-full py-3 bg-primary text-black font-black rounded-xl text-sm tracking-widest uppercase hover:shadow-[0_0_20px_rgba(13,242,89,0.3)] transition-all disabled:opacity-40">
            {loading ? 'Starting...' : 'Confirm & Start'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── End Session Modal ─────────────────────────────────────────────────────────
function EndSessionModal({ session, stationLabel, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [force, setForce] = useState(false);
  const { display: elapsed } = useElapsed(session.startTime, session.plannedDuration);

  async function handleEnd() {
    setLoading(true);
    try {
      const endpoint = force ? 'forceend' : 'end';
      const res = await fetch(`${API}/sessions/${session.id}/${endpoint}`, { method: 'PATCH', headers: authHeaders() });
      if (!res.ok) { const d = await res.json(); alert(d.error); return; }
      onConfirm();
    } catch { alert('Network error.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] text-red-400 font-bold tracking-widest uppercase mb-0.5">End Session</p>
            <h3 className="text-white font-black text-lg">{stationLabel}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        <div className="space-y-3 mb-5">
          <div className="rounded-xl bg-white/3 border border-white/5 p-3 space-y-1.5">
            <div className="flex justify-between text-xs"><span className="text-gray-500">Customer</span><span className="text-white font-bold">{session.customerName}</span></div>
            <div className="flex justify-between text-xs"><span className="text-gray-500">Elapsed</span><span className="text-primary font-mono font-black">{elapsed}</span></div>
            <div className="flex justify-between text-xs"><span className="text-gray-500">Station Charge</span><span className="text-primary font-black">₹{session.pricingINR}</span></div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={force} onChange={e => setForce(e.target.checked)} className="accent-red-500" />
            <span className="text-xs text-gray-400">Force end (early exit / asked to leave)</span>
          </label>
        </div>
        <button onClick={handleEnd} disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-black tracking-widest uppercase border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40">
          {loading ? 'Ending...' : force ? 'Force End Session' : 'End Session'}
        </button>
      </div>
    </div>
  );
}

// ── Live Stations Section — main export ──────────────────────────────────────
export default function LiveStationsSection({ light }) {
  const [stations, setStations]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [viewMode, setViewMode]         = useState('grid'); // 'grid' | 'floor'
  const [startModal, setStartModal]     = useState(null);
  const [endModal, setEndModal]         = useState(null);
  const [orderScreen, setOrderScreen]   = useState(null); // { session, stationLabel }

  const fetchStations = useCallback(async () => {
    try {
      const res = await fetch(`${API}/stations`, { headers: authHeaders() });
      if (res.ok) setStations(await res.json());
    } catch { /* silent on poll */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchStations();
    const id = setInterval(fetchStations, 15000);
    return () => clearInterval(id);
  }, [fetchStations]);

  async function handleToggleActive(stationId, isActive) {
    await fetch(`${API}/stations/${stationId}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ isActive }) });
    fetchStations();
  }

  const pcs  = stations.filter(s => s.type === 'pc');
  const ps5s = stations.filter(s => s.type === 'ps5');
  const muted = light ? 'text-gray-500' : 'text-gray-400';

  const cardProps = {
    onStartSession: (s) => setStartModal(s),
    onEndSession:   (session, label) => setEndModal({ session, stationLabel: label }),
    onToggleActive: handleToggleActive,
    onViewOrder:    (session, label) => setOrderScreen({ session, stationLabel: label }),
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-1">Real-Time</p>
          <h2 className={`text-3xl font-black tracking-tight ${light ? 'text-gray-900' : 'text-white'}`}>
            LIVE <span className="text-primary">STATIONS</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Live pulse */}
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border ${light ? 'bg-emerald-50 border-emerald-200' : 'bg-[#0a0a0a] border-primary/30'}`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-bold text-primary tracking-wide">LIVE · 15s</span>
          </div>

          {/* View toggle */}
          <div className={`hidden sm:flex items-center p-0.5 rounded-lg border ${light ? 'border-gray-200 bg-gray-100' : 'border-[#1a1a1a] bg-[#0f0f0f]'}`}>
            {[
              { key: 'grid',  icon: 'grid_view',     title: 'Grid View' },
              { key: 'floor', icon: 'floor_lamp',    title: 'Floor Layout' },
            ].map(({ key, icon, title }) => (
              <button key={key} onClick={() => setViewMode(key)} title={title}
                className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${
                  viewMode === key
                    ? 'bg-primary/10 border border-primary/40 text-primary'
                    : light ? 'text-gray-400 hover:text-gray-700' : 'text-gray-600 hover:text-gray-300'
                }`}>
                <span className="material-symbols-outlined text-base">{icon}</span>
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button onClick={fetchStations}
            className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${light ? 'border-gray-200 text-gray-500 hover:text-gray-700' : 'border-white/10 text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
            <span className="material-symbols-outlined text-lg">refresh</span>
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`rounded-xl border h-44 animate-pulse ${light ? 'bg-gray-100 border-gray-200' : 'bg-[#0f0f0f] border-[#1a1a1a]'}`} />
          ))}
        </div>
      ) : viewMode === 'floor' ? (
        <FloorLayoutView pcs={pcs} ps5s={ps5s} cardProps={cardProps} light={light} />
      ) : (
        /* ── Grid View ── */
        <div className="space-y-8">
          {/* PC Zone */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-primary text-base">computer</span>
              <span className={`text-xs font-bold tracking-widest uppercase ${muted}`}>PC Zone</span>
              <div className={`flex-1 h-px ${light ? 'bg-gray-200' : 'bg-white/5'}`} />
              <span className={`text-[10px] ${muted}`}>{pcs.filter(s => s.activeSession).length}/{pcs.length} occupied</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {pcs.map(s => <StationCard key={s.id} station={s} {...cardProps} light={light} />)}
            </div>
          </div>
          {/* Console Zone */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-purple-400 text-base">sports_esports</span>
              <span className={`text-xs font-bold tracking-widest uppercase ${muted}`}>Console Zone</span>
              <div className={`flex-1 h-px ${light ? 'bg-gray-200' : 'bg-white/5'}`} />
              <span className={`text-[10px] ${muted}`}>{ps5s.filter(s => s.activeSession).length}/{ps5s.length} occupied</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {ps5s.map(s => <StationCard key={s.id} station={s} {...cardProps} light={light} />)}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {startModal && (
        <StartSessionModal station={startModal} onClose={() => setStartModal(null)} onConfirm={() => { setStartModal(null); fetchStations(); }} />
      )}
      {endModal && (
        <EndSessionModal session={endModal.session} stationLabel={endModal.stationLabel} onClose={() => setEndModal(null)} onConfirm={() => { setEndModal(null); fetchStations(); }} />
      )}
      {orderScreen && (
        <OrderScreen
          session={orderScreen.session}
          stationLabel={orderScreen.stationLabel}
          onClose={() => setOrderScreen(null)}
          onSessionEnded={() => { setOrderScreen(null); fetchStations(); }}
        />
      )}
    </div>
  );
}
