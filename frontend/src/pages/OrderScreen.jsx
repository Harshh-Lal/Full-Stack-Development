import { useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:5000/api';
const CATS = ['drinks', 'snacks', 'meals', 'desserts'];
const CAT_ICONS = { drinks: 'local_cafe', snacks: 'fastfood', meals: 'dinner_dining', desserts: 'icecream' };

function getToken() { return sessionStorage.getItem('lu_admin_token'); }
function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

function fmt(n) { return Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

// ── Bill View ─────────────────────────────────────────────────────────────────
function BillView({ bill, orderId, sessionId, onPaid, onBack }) {
  const [paying, setPaying] = useState(false);

  async function handlePaid() {
    setPaying(true);
    try {
      // 1. Mark order paid
      await fetch(`${API}/orders/${orderId}/status`, {
        method: 'PATCH', headers: authHeaders(),
        body: JSON.stringify({ status: 'paid' }),
      });
      // 2. End session
      await fetch(`${API}/sessions/${sessionId}/end`, { method: 'PATCH', headers: authHeaders() });
      onPaid();
    } catch { alert('Network error'); }
    finally { setPaying(false); }
  }

  const start = bill.session.startTime ? new Date(bill.session.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—';
  const end = bill.session.endTime ? new Date(bill.session.endTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Running';

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-bold tracking-widest uppercase text-primary">Final Bill</p>
        <button onClick={onBack} className="text-[10px] text-gray-500 hover:text-gray-300 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Order
        </button>
      </div>

      {/* Bill receipt */}
      <div className="flex-1 overflow-y-auto font-mono text-xs space-y-0 bg-black/40 rounded-xl border border-[#1a1a1a] p-4">
        {/* Header */}
        <div className="text-center mb-3">
          <p className="text-primary font-black text-base tracking-widest">LEVELUP ESPORTS</p>
          <p className="text-gray-600 text-[9px]">Premium Gaming Lounge</p>
        </div>
        <div className="border-t border-dashed border-[#2a2a2a] my-2" />

        <div className="space-y-0.5 text-gray-400 text-[10px] mb-2">
          <p><span className="text-gray-600">Customer:</span> <span className="text-white">{bill.customer.name}</span></p>
          <p><span className="text-gray-600">Phone:   </span> {bill.customer.phone}</p>
          <p><span className="text-gray-600">Station: </span> <span className="text-primary">{bill.station.label}</span> · {bill.station.specs?.split('·')[0]?.trim()}</p>
          <p><span className="text-gray-600">Duration:</span> {bill.session.plannedDuration}h · {start} – {end}</p>
        </div>
        <div className="border-t border-dashed border-[#2a2a2a] my-2" />

        {/* Station charge */}
        <div className="mb-2">
          <p className="text-gray-500 text-[9px] uppercase tracking-widest mb-1">Station Charge</p>
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-300">{bill.station.label} · {bill.session.plannedDuration}h @ ₹{bill.stationCharge / bill.session.plannedDuration}/hr</span>
            <span className="text-white">₹{fmt(bill.stationCharge)}</span>
          </div>
        </div>

        {/* Food items */}
        {bill.items.length > 0 && (
          <div className="mb-2">
            <p className="text-gray-500 text-[9px] uppercase tracking-widest mb-1">Food & Drinks</p>
            <div className="space-y-0.5">
              {bill.items.map((item, i) => (
                <div key={i} className="flex justify-between text-[10px]">
                  <span className="text-gray-300">{item.name} × {item.quantity} @ ₹{item.priceAtTime}</span>
                  <span className="text-white">₹{fmt(item.lineTotal)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-dashed border-[#2a2a2a] my-2" />

        {/* Totals */}
        <div className="space-y-0.5 text-[10px]">
          <div className="flex justify-between text-gray-400">
            <span>Food subtotal</span><span>₹{fmt(bill.foodSubtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Station charge</span><span>₹{fmt(bill.stationCharge)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Pre-GST total</span><span>₹{fmt(bill.preGSTTotal)}</span>
          </div>
          <div className="flex justify-between text-amber-400">
            <span>GST @ {bill.gstPercent}%</span><span>₹{fmt(bill.gstAmount)}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-[#2a2a2a] my-2" />
        <div className="flex justify-between text-primary font-black text-sm">
          <span>GRAND TOTAL</span><span>₹{fmt(bill.grandTotal)}</span>
        </div>
        <div className="border-t border-dashed border-[#2a2a2a] my-2" />
        <p className="text-center text-gray-700 text-[8px]">Thank you for gaming with us!</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button onClick={onBack} className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-white/10 text-gray-400 hover:border-white/20 hover:text-white transition-all tracking-widest uppercase">
          Back to Order
        </button>
        <button onClick={handlePaid} disabled={paying}
          className="flex-1 py-2.5 rounded-xl text-xs font-black bg-primary text-black hover:shadow-[0_0_20px_rgba(13,242,89,0.35)] transition-all tracking-widest uppercase disabled:opacity-40">
          {paying ? 'Processing...' : 'Mark as Paid ✓'}
        </button>
      </div>
    </div>
  );
}

// ── Order Screen ──────────────────────────────────────────────────────────────
export default function OrderScreen({ session, stationLabel, onClose, onSessionEnded }) {
  const { id: sessionId, customerName } = session;

  const [menuGrouped, setMenuGrouped] = useState({});
  const [activeCat, setActiveCat]     = useState('drinks');
  const [order, setOrder]             = useState(null);  // null = not yet loaded
  const [orderId, setOrderId]         = useState(null);
  const [loading, setLoading]         = useState({ menu: true, order: true });
  const [addingId, setAddingId]       = useState(null);
  const [bill, setBill]               = useState(null);
  const [billingLoading, setBillingLoading] = useState(false);

  //── Fetch menu once ──
  useEffect(() => {
    fetch(`${API}/menu`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => { setMenuGrouped(data); setLoading(l => ({ ...l, menu: false })); })
      .catch(() => setLoading(l => ({ ...l, menu: false })));
  }, []);

  // ── Fetch / create order ──
  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`${API}/orders/session/${sessionId}`, { headers: authHeaders() });
      const data = await res.json();
      if (data) { setOrder(data); setOrderId(data.id); }
      else setOrder(null);
    } finally { setLoading(l => ({ ...l, order: false })); }
  }, [sessionId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  // ── Ensure order exists when first item is added ──
  async function ensureOrder() {
    if (orderId) return orderId;
    const res  = await fetch(`${API}/orders/session/${sessionId}`, { method: 'POST', headers: authHeaders() });
    const data = await res.json();
    setOrder(data); setOrderId(data.id);
    return data.id;
  }

  // ── Add item ──
  async function handleAdd(menuItemId) {
    setAddingId(menuItemId);
    try {
      const oid = await ensureOrder();
      const res = await fetch(`${API}/orders/${oid}/items`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ menuItemId, quantity: 1 }),
      });
      const data = await res.json();
      setOrder(data); setOrderId(data.id);
    } finally { setAddingId(null); }
  }

  // ── Update qty ──
  async function handleQty(itemId, qty) {
    const res = await fetch(`${API}/orders/${orderId}/items/${itemId}`, {
      method: 'PATCH', headers: authHeaders(),
      body: JSON.stringify({ quantity: qty }),
    });
    const data = await res.json();
    setOrder(data);
  }

  // ── Generate bill ──
  async function handleGenerateBill() {
    setBillingLoading(true);
    try {
      const res = await fetch(`${API}/bill/session/${sessionId}`, { headers: authHeaders() });
      const data = await res.json();
      setBill(data);
    } finally { setBillingLoading(false); }
  }

  const activeItems = order?.items ?? [];
  const qtyMap = Object.fromEntries(activeItems.map(i => [i.menuItemId, { qty: i.quantity, itemId: i.id }]));
  const menuItems = menuGrouped[activeCat] ?? [];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-stretch justify-end">
      {/* Click-outside to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-5xl bg-[#0a0a0a] border-l border-[#1a1a1a] flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/40">
              <span className="material-symbols-outlined text-primary text-base">receipt_long</span>
            </div>
            <div>
              <p className="text-[9px] text-primary font-bold tracking-widest uppercase">Order Screen</p>
              <h3 className="text-white font-black text-base leading-none">{stationLabel} · {customerName}</h3>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-all">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Two-panel body */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── LEFT: Menu ── */}
          <div className="w-1/2 border-r border-[#1a1a1a] flex flex-col overflow-hidden">
            {/* Category tabs */}
            <div className="flex gap-1 px-4 pt-4 pb-3 border-b border-[#1a1a1a]">
              {CATS.map(cat => (
                <button key={cat} onClick={() => setActiveCat(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all border ${
                    activeCat === cat
                      ? 'bg-primary/10 border-primary/40 text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-white/10'
                  }`}>
                  <span className="material-symbols-outlined text-sm">{CAT_ICONS[cat]}</span>
                  {cat}
                </button>
              ))}
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {loading.menu ? (
                Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 rounded-lg bg-[#0f0f0f] animate-pulse" />)
              ) : menuItems.length === 0 ? (
                <p className="text-gray-600 text-xs text-center py-8">No items in this category</p>
              ) : menuItems.map(item => {
                const inOrder = qtyMap[item.id];
                return (
                  <div key={item.id} className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
                    item.isAvailable ? 'border-[#1a1a1a] bg-[#0f0f0f] hover:border-[#2a2a2a]' : 'border-white/3 bg-white/2 opacity-40'
                  }`}>
                    <div>
                      <p className={`text-xs font-bold ${item.isAvailable ? 'text-white' : 'text-gray-600'}`}>{item.name}</p>
                      <p className="text-[10px] text-primary">₹{item.price}</p>
                    </div>
                    {item.isAvailable ? (
                      <button onClick={() => handleAdd(item.id)} disabled={addingId === item.id}
                        className="relative w-8 h-8 rounded-lg bg-primary/10 border border-primary/40 flex items-center justify-center text-primary hover:bg-primary/20 transition-all disabled:opacity-40">
                        {addingId === item.id
                          ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                          : <span className="material-symbols-outlined text-sm">add</span>
                        }
                        {inOrder && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-black text-[8px] font-black flex items-center justify-center">
                            {inOrder.qty}
                          </span>
                        )}
                      </button>
                    ) : (
                      <span className="text-[9px] text-gray-600 uppercase tracking-widest">Out</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: Order / Bill ── */}
          <div className="w-1/2 flex flex-col overflow-hidden px-5 py-4">
            {bill ? (
              <BillView
                bill={bill}
                orderId={orderId}
                sessionId={sessionId}
                onPaid={() => { onSessionEnded(); onClose(); }}
                onBack={() => setBill(null)}
              />
            ) : (
              <>
                {/* Order header */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Running Order</p>
                  {order?.foodSubtotal > 0 && (
                    <span className="text-primary text-xs font-black">₹{fmt(order.foodSubtotal)}</span>
                  )}
                </div>

                {/* Items list */}
                <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                  {loading.order ? (
                    Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-10 rounded-lg bg-[#0f0f0f] animate-pulse" />)
                  ) : activeItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10">
                      <span className="material-symbols-outlined text-4xl text-gray-700 mb-2">receipt_long</span>
                      <p className="text-gray-600 text-xs">No items yet.</p>
                      <p className="text-gray-700 text-[10px] mt-1">Add from the menu on the left.</p>
                    </div>
                  ) : activeItems.map(item => (
                    <div key={item.id} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#1a1a1a] bg-[#0f0f0f]">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{item.menuItem.name}</p>
                        <p className="text-[10px] text-primary">₹{fmt(item.quantity * item.priceAtTime)}</p>
                      </div>
                      {/* Qty controls */}
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleQty(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm">
                          <span className="material-symbols-outlined text-xs">{item.quantity === 1 ? 'delete' : 'remove'}</span>
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white">{item.quantity}</span>
                        <button onClick={() => handleQty(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all">
                          <span className="material-symbols-outlined text-xs">add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal + Generate Bill */}
                <div className="border-t border-[#1a1a1a] pt-3 space-y-2">
                  {activeItems.length > 0 && (
                    <div className="flex justify-between text-xs text-gray-400 px-1">
                      <span>Food subtotal</span>
                      <span className="text-primary font-bold">₹{fmt(order?.foodSubtotal ?? 0)}</span>
                    </div>
                  )}
                  <button onClick={handleGenerateBill} disabled={billingLoading}
                    className="w-full py-3 rounded-xl text-sm font-black tracking-widest uppercase bg-primary text-black hover:shadow-[0_0_20px_rgba(13,242,89,0.35)] transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-base">receipt</span>
                    {billingLoading ? 'Computing...' : 'Generate Bill'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
