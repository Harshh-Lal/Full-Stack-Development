import { useState, useEffect } from 'react';

// ── Booking Config ─────────────────────────────────────────────────────────
export const STATION_CONFIG = {
    pc:   { label: 'PC',    icon: 'computer',         pricePerHour: 150,  ids: ['PC-01','PC-02','PC-03','PC-04','PC-05','PC-06','PC-07','PC-08','PC-09','PC-10'] },
    ps5:  { label: 'PS5',   icon: 'sports_esports',   pricePerHour: 200,  ids: ['PS5-01'] }, // 1 is active, 1 is unavailable
};
export const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
export const TIME_SLOTS = [
    '10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM',
    '3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM',
];
export const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'AED ' };

export default function BookingModal({ open, onClose }) {
    const [step, setStep] = useState(1); // 1=details, 2=success
    const [form, setForm] = useState({
        customerName: '', phone: '', email: '',
        stationType: 'pc', stationId: 'PC-01',
        durationHours: 2, date: '', timeSlot: '4:00 PM',
        notes: '', currency: 'INR',
    });
    const [rates, setRates] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [bookingId, setBookingId] = useState(null);
    const [ratesLoading, setRatesLoading] = useState(false);
    const [ratesError, setRatesError] = useState(false);

    // Fetch real-time rates using frankfurter.app (free, no API key needed)
    // Base is INR → gives us how many units of each currency = 1 INR
    useEffect(() => {
        if (!open) return;
        setRatesLoading(true);
        setRatesError(false);
        fetch('https://v6.exchangerate-api.com/v6/46b91f38b3d340044756c5d6/latest/INR')
            .then(r => {
                if (!r.ok) throw new Error('Network response was not ok');
                return r.json();
            })
            .then(data => {
                if (data.result === 'success' && data.conversion_rates) {
                    // conversion_rates already includes INR: 1
                    setRates(data.conversion_rates);
                } else {
                    setRatesError(true);
                }
            })
            .catch(() => {
                console.error("Failed to load real-time exchange rates.");
                setRatesError(true);
            })
            .finally(() => setRatesLoading(false));
    }, [open]);

    // Auto-select first station when type changes
    function handleTypeChange(type) {
        setForm(f => ({ ...f, stationType: type, stationId: STATION_CONFIG[type].ids[0] }));
    }

    const cfg = STATION_CONFIG[form.stationType];
    const priceINR = cfg.pricePerHour * form.durationHours;
    const ratesReady = Object.keys(rates).length > 1; // has more than just INR:1
    const rate = rates[form.currency] ?? null;
    const displayPrice = form.currency === 'INR'
        ? priceINR
        : ratesReady && rate !== null
            ? (priceINR * rate).toFixed(2)
            : null;
    const sym = CURRENCY_SYMBOLS[form.currency] || form.currency + ' ';

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: form.customerName,
                    phone: form.phone,
                    email: form.email || undefined,
                    stationType: form.stationType,
                    stationId: form.stationId,
                    durationHours: form.durationHours,
                    date: form.date,
                    timeSlot: form.timeSlot,
                    pricingINR: priceINR,
                    currencyShown: form.currency,
                    notes: form.notes || undefined,
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setBookingId(data.bookingId);
                setStep(2);
            } else {
                setError(data.error || 'Booking failed. Please try again.');
            }
        } catch {
            setError('Cannot connect to server. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    function handleClose() {
        onClose();
        setTimeout(() => { setStep(1); setError(''); setBookingId(null); setForm(f => ({ ...f, customerName: '', phone: '', email: '', notes: '', date: '' })); }, 300);
    }

    if (!open) return null;
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />

            {/* Modal card */}
            <div className="relative z-10 w-full max-w-2xl bg-card-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Glow accents */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 relative z-10 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/20 rounded flex items-center justify-center border border-primary/30">
                            <span className="material-symbols-outlined text-primary text-xl">event_seat</span>
                        </div>
                        <div>
                            <h2 className="text-white font-bold tracking-tight">BOOK A STATION</h2>
                            <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase">{step === 1 ? 'Reserve your gaming setup' : 'Booking confirmed'}</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {step === 1 ? (
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Station Type Selector */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Station Type</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {Object.entries(STATION_CONFIG).map(([key, val]) => (
                                        <button key={key} type="button" onClick={() => handleTypeChange(key)}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                                                form.stationType === key
                                                    ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(13,242,89,0.15)]'
                                                    : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'
                                            }`}>
                                            <span className="material-symbols-outlined text-2xl">{val.icon}</span>
                                            <span className="text-xs font-bold tracking-wider">{val.label}</span>
                                            <span className="text-[10px] text-gray-500">₹{val.pricePerHour}/hr</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Station ID + Duration */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Station Unit</label>
                                    <select value={form.stationId} onChange={e => setForm(f => ({...f, stationId: e.target.value}))}
                                        className="contact-input w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                                        {cfg.ids.map(id => <option key={id} value={id}>{id}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Duration</label>
                                    <select value={form.durationHours} onChange={e => setForm(f => ({...f, durationHours: parseInt(e.target.value)}))}
                                        className="contact-input w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                                        {[1,2,3,4,5,6,8].map(h => <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Date + Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date</label>
                                    <input required type="date" min={today} value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))}
                                        className="date-input contact-input w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Time Slot</label>
                                    <select value={form.timeSlot} onChange={e => setForm(f => ({...f, timeSlot: e.target.value}))}
                                        className="contact-input w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" htmlFor="b-name">Name *</label>
                                    <input required id="b-name" type="text" value={form.customerName} onChange={e => setForm(f => ({...f, customerName: e.target.value}))}
                                        placeholder="Your name" className="contact-input w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-600" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" htmlFor="b-phone">Phone *</label>
                                    <input required id="b-phone" type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                                        placeholder="+91 98765 43210" className="contact-input w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-600" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" htmlFor="b-email">Email (optional)</label>
                                <input id="b-email" type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                                    placeholder="you@example.com" className="contact-input w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-600" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" htmlFor="b-notes">Notes (optional)</label>
                                <input id="b-notes" type="text" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
                                    placeholder="Game preferences, special requests..." className="contact-input w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-600" />
                            </div>

                            {/* Price + Currency */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Price</p>
                                    {ratesLoading && form.currency !== 'INR' ? (
                                        <p className="text-2xl font-black text-yellow-400 animate-pulse">Loading...</p>
                                    ) : displayPrice !== null ? (
                                        <p className="text-2xl font-black text-primary">{sym}{displayPrice}</p>
                                    ) : (
                                        <p className="text-2xl font-black text-red-400">₹{priceINR}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-0.5">₹{priceINR} INR · {form.durationHours}h @ ₹{cfg.pricePerHour}/hr</p>
                                    {ratesError && form.currency !== 'INR' && (
                                        <p className="text-[10px] text-yellow-500 mt-1">⚠ Live rates unavailable — showing INR</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Currency</label>
                                    <select value={form.currency} onChange={e => setForm(f => ({...f, currency: e.target.value}))}
                                        className="contact-input bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none transition-all">
                                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    {ratesReady && form.currency !== 'INR' && (
                                        <p className="text-[10px] text-green-500 mt-1 text-right">✓ Live rate</p>
                                    )}
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                                    <span className="material-symbols-outlined text-red-400 text-sm">error</span>
                                    <span className="text-red-400 text-sm">{error}</span>
                                </div>
                            )}

                            <button type="submit" disabled={loading}
                                className="w-full py-4 bg-secondary text-white font-bold text-base rounded-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-indigo-600" />
                                <span className="relative z-10 flex items-center gap-2">
                                    {loading ? (
                                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    ) : (
                                        <>
                                            CONFIRM BOOKING
                                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </>
                                    )}
                                </span>
                            </button>

                            <p className="text-center text-xs text-gray-600">Admin will confirm your booking via phone. No payment required now.</p>
                        </form>
                    ) : (
                        /* Success State */
                        <div className="p-10 flex flex-col items-center text-center gap-5">
                            <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shadow-[0_0_40px_rgba(13,242,89,0.3)]">
                                <span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
                            </div>
                            <div>
                                <h3 className="text-white text-2xl font-black mb-2">BOOKING <span className="text-primary">RECEIVED!</span></h3>
                                <p className="text-gray-400 text-sm">Booking ID <span className="text-primary font-bold">#{bookingId}</span> created.</p>
                                <p className="text-gray-500 text-sm mt-3 max-w-xs mx-auto">Our admin has been notified and will confirm your slot. Keep your phone handy.</p>
                            </div>
                            <div className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-left space-y-2">
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Station</span><span className="text-white font-bold">{form.stationId}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Date</span><span className="text-white font-bold">{form.date} @ {form.timeSlot}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Duration</span><span className="text-white font-bold">{form.durationHours}h</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Amount</span><span className="text-primary font-black">₹{priceINR}</span></div>
                            </div>
                            <button onClick={handleClose} className="px-8 py-3 bg-primary text-bg-dark font-bold rounded-xl hover:bg-[#ffffff] hover:text-[#000000] transition-colors">
                                CLOSE
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
