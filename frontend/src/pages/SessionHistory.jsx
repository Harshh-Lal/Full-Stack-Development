import { useState, useEffect, useCallback } from 'react';
import OrderScreen from './OrderScreen.jsx';

const API = 'http://localhost:5000/api';

function getToken() { return sessionStorage.getItem('lu_admin_token'); }
function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

function formatDate(d) {
  const date = new Date(d);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + 
         ' ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function SessionHistory({ light }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewBillSessionId, setViewBillSessionId] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/sessions/history`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Failed to fetch history');
      setSessions(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const tc = {
    card:  light ? 'bg-white border-gray-200'   : 'bg-[#0f0f0f] border-[#1a1a1a]',
    th:    light ? 'bg-gray-50 text-gray-500'   : 'bg-[#080808] text-gray-500',
    tr:    light ? 'hover:bg-gray-50 border-b border-gray-100' : 'hover:bg-white/2 border-b border-[#1a1a1a]',
    td:    light ? 'text-gray-900' : 'text-white',
    muted: light ? 'text-gray-400' : 'text-gray-500',
    h1:    light ? 'text-gray-900' : 'text-white',
  };

  if (viewBillSessionId) {
    const session = sessions.find(s => s.id === viewBillSessionId);
    return (
      <div className={`fixed inset-0 z-[100] ${light ? 'bg-gray-50' : 'bg-bg-dark'} flex flex-col`}>
        <OrderScreen 
          session={session}
          stationLabel={session?.station?.label || 'History'} 
          onClose={() => setViewBillSessionId(null)} 
          light={light}
          readOnly={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-1">Billing & Records</p>
          <h2 className={`text-3xl font-black tracking-tight ${tc.h1}`}>
            SESSION <span className="text-primary">HISTORY</span>
          </h2>
        </div>
        <button onClick={fetchHistory}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-bold tracking-widest uppercase ${
            light ? 'border-gray-200 text-gray-600 hover:bg-gray-50' : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
          }`}>
          <span className="material-symbols-outlined text-base">refresh</span>
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <span className="material-symbols-outlined text-red-400">error</span>
          <span className="text-red-400 text-sm flex-1">{error}</span>
        </div>
      )}

      <div className={`rounded-2xl overflow-hidden border ${tc.card}`}>
        <table className="w-full text-sm">
          <thead>
            <tr className={tc.th}>
              {['Date/Time', 'Customer', 'Station', 'Duration', 'Session Type', 'Status', 'Bill'].map(h => (
                <th key={h} className="px-4 py-3 text-[10px] font-bold tracking-widest uppercase text-left whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center">
                <span className="material-symbols-outlined text-primary text-xl animate-spin">progress_activity</span>
              </td></tr>
            ) : sessions.length === 0 ? (
              <tr><td colSpan={7} className={`p-8 text-center text-xs ${tc.muted}`}>No session history found</td></tr>
            ) : sessions.map(session => (
              <tr key={session.id} className={tc.tr}>
                <td className="px-4 py-4 whitespace-nowrap">
                   <p className={`font-bold ${tc.h1}`}>{formatDate(session.startTime)}</p>
                   {session.endTime && <p className={`text-[10px] mt-0.5 ${tc.muted}`}>Ended: {formatDate(session.endTime)}</p>}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <p className={`font-bold ${tc.h1}`}>{session.customerName}</p>
                  <p className={`text-[10px] mt-0.5 ${tc.muted}`}>{session.phone}</p>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">
                      {session.station?.type === 'ps5' ? 'sports_esports' : 'computer'}
                    </span>
                    <span className={`font-bold text-sm ${tc.h1}`}>{session.station?.label}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`font-bold ${tc.h1}`}>{session.plannedDuration}h</span>
                  <span className={`text-[10px] ml-1 ${tc.muted}`}>@ ₹{session.pricingINR}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${
                    session.sessionType === 'maintenance' ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' : 'border-primary/30 text-primary bg-primary/10'
                  }`}>
                    {session.sessionType}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${
                    session.status === 'forcedend' ? 'border-red-500/30 text-red-500 bg-red-500/10' : 'border-gray-500/30 text-gray-400 bg-gray-500/10'
                  }`}>
                    {session.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <button onClick={() => setViewBillSessionId(session.id)}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/30 rounded px-2 py-1 hover:bg-primary/10 transition-all">
                    <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                    {session.status === 'forcedend' ? 'FORCE BILL' : 'VIEW BILL'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
