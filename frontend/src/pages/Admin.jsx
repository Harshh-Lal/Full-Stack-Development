import { useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:5001/api';

// ── Helpers ──────────────────────────────────────────────────────────────────
function getToken() { return sessionStorage.getItem('lu_admin_token'); }
function setToken(t) { sessionStorage.setItem('lu_admin_token', t); }
function clearToken() { sessionStorage.removeItem('lu_admin_token'); }

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status, light }) {
  const map = {
    pending:   { label: 'PENDING',   bg: light ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-amber-500/15 text-amber-400 border-amber-500/40' },
    confirmed: { label: 'CONFIRMED', bg: light ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-primary/15 text-primary border-primary/40' },
    cancelled: { label: 'CANCELLED', bg: light ? 'bg-red-100 text-red-600 border-red-300' : 'bg-red-500/15 text-red-400 border-red-500/40' },
  };
  const { label, bg } = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest border ${bg}`}>
      {label}
    </span>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent, light }) {
  const accentMap = {
    green:  { text: 'text-primary',    glow: 'shadow-[0_0_20px_rgba(13,242,89,0.12)]',   border: light ? 'border-emerald-200' : 'border-primary/20',   bg: light ? 'bg-emerald-50' : 'bg-primary/10' },
    amber:  { text: 'text-amber-400',  glow: 'shadow-[0_0_20px_rgba(245,158,11,0.12)]',  border: light ? 'border-amber-200'   : 'border-amber-500/20', bg: light ? 'bg-amber-50'   : 'bg-amber-500/10' },
    purple: { text: 'text-secondary',  glow: 'shadow-[0_0_20px_rgba(168,85,247,0.12)]',  border: light ? 'border-purple-200'  : 'border-secondary/20', bg: light ? 'bg-purple-50'  : 'bg-purple-500/10' },
  };
  const a = accentMap[accent] || accentMap.green;
  return (
    <div className={`rounded-xl border p-6 flex items-center gap-5 transition-all duration-300 hover:-translate-y-0.5 ${a.glow} ${a.border} ${light ? 'bg-white' : 'bg-card-dark'}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${a.bg}`}>
        <span className={`material-symbols-outlined text-2xl ${a.text}`}>{icon}</span>
      </div>
      <div>
        <p className={`text-xs font-bold tracking-widest uppercase mb-1 ${light ? 'text-gray-500' : 'text-gray-400'}`}>{label}</p>
        <p className={`text-3xl font-black ${light ? 'text-gray-900' : 'text-white'}`}>{value ?? '—'}</p>
      </div>
    </div>
  );
}

// ── Filter Pill ───────────────────────────────────────────────────────────────
function FilterPill({ label, active, onClick, count, light }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all border ${
        active
          ? 'bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(13,242,89,0.2)]'
          : light
            ? 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
            : 'bg-transparent border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] ${
          active ? 'bg-primary/20 text-primary' : light ? 'bg-gray-100 text-gray-500' : 'bg-white/10 text-gray-400'
        }`}>{count}</span>
      )}
    </button>
  );
}

// ── PIN Modal ─────────────────────────────────────────────────────────────────
function PinModal({ onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/admin/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        onSuccess();
      } else {
        setError(data.error || 'Invalid PIN. Try again.');
        setPin('');
      }
    } catch {
      setError('Cannot connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center relative overflow-hidden">
      {/* Background patterns matching site */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-mesh-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 bg-primary/20 rounded flex items-center justify-center border border-primary/50">
            <span className="material-symbols-outlined text-primary text-2xl">sports_esports</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">
              LEVEL<span className="text-primary">UP</span>
            </h1>
            <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">Admin Access</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card-dark border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary text-lg">lock</span>
              <h2 className="text-white font-bold text-lg tracking-wide">ENTER PIN</h2>
            </div>
            <p className="text-gray-500 text-sm mb-7">This dashboard is restricted. Enter your admin PIN to continue.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" htmlFor="admin-pin">
                  Admin PIN
                </label>
                <input
                  id="admin-pin"
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-center text-2xl tracking-[0.5em] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-700"
                  autoFocus
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <span className="material-symbols-outlined text-red-400 text-sm">error</span>
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !pin}
                className="w-full py-3 bg-primary text-bg-dark font-bold rounded-lg hover:bg-white hover:shadow-[0_0_20px_rgba(13,242,89,0.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                ) : (
                  <>
                    UNLOCK DASHBOARD
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-gray-700 text-xs mt-6 tracking-wider">
          ADMIN ACCESS ONLY · SESSION EXPIRES ON TAB CLOSE
        </p>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
function Dashboard({ onLock }) {
  const [light, setLight] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // booking id being updated
  const [clock, setClock] = useState('');

  // Live clock
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [bRes, sRes] = await Promise.all([
        fetch(`${API}/admin/bookings`, { headers: authHeaders() }),
        fetch(`${API}/admin/stats`, { headers: authHeaders() }),
      ]);
      if (bRes.status === 401 || sRes.status === 401) { onLock(); return; }
      const [b, s] = await Promise.all([bRes.json(), sRes.json()]);
      setBookings(b);
      setStats(s);
    } catch {
      setError('Failed to load data. Check backend connection.');
    } finally {
      setLoading(false);
    }
  }, [onLock]);

  useEffect(() => { loadData(); }, [loadData]);

  // Update booking status optimistically
  async function updateStatus(id, status) {
    setActionLoading(id);
    try {
      const res = await fetch(`${API}/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.status === 401) { onLock(); return; }
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
        setStats(prev => prev ? {
          ...prev,
          pending: status === 'confirmed' || status === 'cancelled' ? Math.max(0, prev.pending - 1) : prev.pending,
        } : prev);
      }
    } catch {
      setError('Action failed. Try again.');
    } finally {
      setActionLoading(null);
    }
  }

  // Filter bookings client-side
  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  // Theme classes
  const t = {
    page:    light ? 'bg-gray-50 min-h-screen'                          : 'bg-bg-dark min-h-screen',
    topbar:  light ? 'bg-white border-b border-gray-200'                : 'glass border-b border-white/5',
    card:    light ? 'bg-white border border-gray-200'                  : 'bg-card-dark border border-white/5',
    table:   light ? 'bg-white border border-gray-200'                  : 'bg-surface-dark border border-white/5',
    th:      light ? 'text-gray-500 border-b border-gray-100'           : 'text-gray-500 border-b border-white/5',
    tr:      light ? 'border-b border-gray-50 hover:bg-gray-50'         : 'border-b border-white/5 hover:bg-white/2',
    td:      light ? 'text-gray-700'                                    : 'text-gray-300',
    h1:      light ? 'text-gray-900'                                    : 'text-white',
    muted:   light ? 'text-gray-500'                                    : 'text-gray-400',
    section: light ? 'text-gray-800'                                    : 'text-white',
  };

  return (
    <div className={t.page}>
      {/* ── TOPBAR ── */}
      <header className={`sticky top-0 z-50 ${t.topbar}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo + admin badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/20 rounded flex items-center justify-center border border-primary/50">
              <span className="material-symbols-outlined text-primary text-xl">sports_esports</span>
            </div>
            <div>
              <h1 className={`text-base font-bold tracking-tight leading-none ${t.h1}`}>
                LEVEL<span className="text-primary">UP</span>
              </h1>
              <span className="text-[9px] tracking-[0.2em] text-primary/70 uppercase font-bold">Admin Panel</span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live clock */}
            <span className={`hidden sm:block text-xs font-mono ${t.muted}`}>{clock}</span>

            {/* Refresh */}
            <button
              onClick={loadData}
              title="Refresh data"
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors border ${
                light ? 'border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50' : 'border-white/10 text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
            </button>

            {/* Light/Dark toggle */}
            <button
              onClick={() => setLight(l => !l)}
              title={light ? 'Switch to dark mode' : 'Switch to light mode'}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
                light
                  ? 'border-gray-200 text-amber-500 hover:bg-amber-50 hover:border-amber-200'
                  : 'border-white/10 text-gray-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{light ? 'light_mode' : 'dark_mode'}</span>
            </button>

            {/* Lock session */}
            <button
              onClick={() => { clearToken(); onLock(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 transition-all"
            >
              <span className="material-symbols-outlined text-sm">lock</span>
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <span className="material-symbols-outlined text-red-400">error</span>
            <span className="text-red-400 text-sm flex-1">{error}</span>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        {/* Page heading */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-1">Booking Management</p>
            <h2 className={`text-3xl font-black tracking-tight ${t.h1}`}>
              OPERATIONS <span className="text-primary">DASHBOARD</span>
            </h2>
          </div>
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border ${light ? 'bg-emerald-50 border-emerald-200' : 'bg-bg-dark/80 border-primary/30'}`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-bold text-primary tracking-wide">LIVE</span>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[0, 1, 2].map(i => (
              <div key={i} className={`rounded-xl border p-6 h-24 animate-pulse ${light ? 'bg-gray-100 border-gray-200' : 'bg-card-dark border-white/5'}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon="confirmation_number" label="Total Bookings" value={stats?.total} accent="green" light={light} />
            <StatCard icon="pending"             label="Needs Attention" value={stats?.pending} accent="amber" light={light} />
            <StatCard icon="today"               label="Today's Bookings" value={stats?.todayCount} accent="purple" light={light} />
          </div>
        )}

        {/* ── FILTER PILLS + TABLE ── */}
        <div className={`rounded-2xl overflow-hidden ${t.table}`}>
          {/* Table header row */}
          <div className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${light ? 'border-gray-100' : 'border-white/5'}`}>
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-primary text-xl`}>table_chart</span>
              <span className={`font-bold text-sm tracking-widest uppercase ${t.h1}`}>
                Bookings
                <span className={`ml-2 text-xs font-normal ${t.muted}`}>({filtered.length} shown)</span>
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { key: 'all',       label: 'All' },
                { key: 'pending',   label: 'Pending' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'cancelled', label: 'Cancelled' },
              ].map(({ key, label }) => (
                <FilterPill
                  key={key}
                  label={label}
                  active={filter === key}
                  onClick={() => setFilter(key)}
                  count={key === 'all' ? bookings.length : bookings.filter(b => b.status === key).length}
                  light={light}
                />
              ))}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-12 flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl animate-spin">progress_activity</span>
              <span className={`text-sm ${t.muted}`}>Loading bookings...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <span className={`material-symbols-outlined text-4xl mb-3 block ${t.muted}`}>inbox</span>
              <p className={`text-sm font-bold ${t.muted}`}>No {filter === 'all' ? '' : filter} bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`text-left ${t.th}`}>
                    {['Customer', 'Station', 'Date & Time', 'Duration', 'Amount', 'Booked At', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-[10px] font-bold tracking-widest uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(booking => (
                    <tr key={booking.id} className={`transition-colors ${t.tr}`}>
                      {/* Customer */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <p className={`font-bold ${t.h1}`}>{booking.customerName}</p>
                        <p className={`text-xs mt-0.5 ${t.muted}`}>{booking.phone}</p>
                        {booking.email && <p className={`text-xs ${t.muted}`}>{booking.email}</p>}
                      </td>

                      {/* Station */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                          light ? 'bg-gray-50 border-gray-200 text-gray-700' : 'bg-white/5 border-white/10 text-gray-200'
                        }`}>
                          <span className="material-symbols-outlined text-primary text-sm">
                            {booking.stationType === 'pc' ? 'computer' : booking.stationType === 'ps5' ? 'sports_esports' : 'stadia_controller'}
                          </span>
                          {booking.stationId}
                        </span>
                        <p className={`text-xs mt-1 ${t.muted} uppercase tracking-wider`}>{booking.stationType}</p>
                      </td>

                      {/* Date & Time */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <p className={`font-medium ${t.td}`}>{booking.date}</p>
                        <p className={`text-xs mt-0.5 ${t.muted}`}>{booking.timeSlot}</p>
                      </td>

                      {/* Duration */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`text-sm font-bold ${t.td}`}>{booking.durationHours}h</span>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <p className="font-bold text-primary">₹{booking.pricingINR.toLocaleString('en-IN')}</p>
                        {booking.currencyShown !== 'INR' && (
                          <p className={`text-xs ${t.muted}`}>shown in {booking.currencyShown}</p>
                        )}
                      </td>

                      {/* Booked At */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <p className={`text-xs ${t.muted}`}>{formatDate(booking.createdAt)}</p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={booking.status} light={light} />
                        {booking.notes && (
                          <p title={booking.notes} className={`text-xs mt-1 max-w-[120px] truncate ${t.muted}`}>
                            📝 {booking.notes}
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {booking.status === 'pending' ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateStatus(booking.id, 'confirmed')}
                              disabled={actionLoading === booking.id}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border border-primary/40 text-primary hover:bg-primary/10 hover:border-primary transition-all disabled:opacity-40"
                            >
                              {actionLoading === booking.id
                                ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                : <span className="material-symbols-outlined text-sm">check_circle</span>
                              }
                              <span className="hidden sm:inline">Confirm</span>
                            </button>
                            <button
                              onClick={() => updateStatus(booking.id, 'cancelled')}
                              disabled={actionLoading === booking.id}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 transition-all disabled:opacity-40"
                            >
                              <span className="material-symbols-outlined text-sm">cancel</span>
                              <span className="hidden sm:inline">Cancel</span>
                            </button>
                          </div>
                        ) : (
                          <span className={`text-xs ${t.muted}`}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className={`text-center text-xs pb-4 ${t.muted}`}>
          LEVELUP ESPORTS LOUNGE · ADMIN PANEL · SESSION ACTIVE
        </p>
      </main>
    </div>
  );
}

// ── Root Component ────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(!!getToken());

  // Re-check on mount (handles tab refresh)
  useEffect(() => { setAuthed(!!getToken()); }, []);

  if (!authed) return <PinModal onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLock={() => { clearToken(); setAuthed(false); }} />;
}
