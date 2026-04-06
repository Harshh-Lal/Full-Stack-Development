import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogPosts from '../data/blogPosts';

// Images
const images = {
    hero: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3iJFDQLQGJaDYlyESSrQYDe8vKxaI5fL2tj5vIQw3EWpDpsQK-rpaNU5xSt5eRil3y-WQiYI7EJkOwHyfEjqgNfChn0a3IrcnaF-jAXdWWoTKq9x-zdkGsIw2DTCc9IhNDg0a6-QwwqTorg1VtJRplHDh0MeRka9K63eX-Q70f1cnib_zSZeN_yPdkErpShS-oe62uJQ6-VDcPeAJuEhOSTCbSPXW_H5NseJSHwHbv2jW9QlfjIbVRRoUPCmk9gAAx1YW3WBoYgM",
    battleStation: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5rBAxke71_8Q5-yB5IpnZvKs4iZJKH_EQ0ub9Hji5n0eEZKSfIl1UCZ5lJVzm2Aw_f2wmFpA5bXCuNsv2KSJdV9SYyakrE0UvMo8YMLWhRmAHCsx3paA9PuBQQjyeQpFlqW3TSkKVGOZaTfFAhcHy2xL0tyK7-crA7TIbW3l9QGB3F7KnOEiXQ0nHJNyO5UZZITwTpefAz5abFCyN9IiTHeLEn0Gt1TqPEg4P9ycpvmxQZrdjlMJGtIv7ALh2MfGnrsyjWVdO7TE",
    console: "https://lh3.googleusercontent.com/aida-public/AB6AXuBL3NfsC1wk5qSGR2emDrdLfrxBb4GqqaaC0OIh3HPsAyPdhGDot7TyTUK0-GFZmQ7rmSRNNztAG2JrpqRgc2Uukl7dDNnElXJdroTC4-IliiGogWvMdRpxfAwgpdVMavfMjbcqxRnCTDEWWY8pae_doJ1_kUarTFEPyADobgbXH6kesNiKeOWFNpw4ayxUUGAAI3guVwhux-JuFKot5SQd7MAP3wUAlKfJ48f-1VBOirTc6d3oIWbh4IFZyawpV2dRds-4S909tNI",
    controller: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3frtKvMp1dVxYcwtTn6LT-3piAAyLcCs6I2acwbEKqHIjQc5LQ8KHGWa8u7a3_xw40MiYQ9MEFxNinZm7zCFu1PbmSURl_FrcdQxnpsonNco0lUVTqh5HAvGaPRksScUTBWPKvo_qPMMvmhtXrMC5zfsUoVG4g2mSm3KUBhnqidEj1v0w0Cau0HgHbiTdCC2nPVlcEZY-vvB4Dh6tzCcf6LOr15ONRTJqjAosOt1ATnZ7AnVR7SsJgCw0z5Q0v882dC1gfqnfvOY",
    keyboard: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcemo_CuZZwrSXBt0_E-LmDR490T5GLTZNOsjwmI_26r3ZlQwOpreawlD1OVXlgycodMFaPdKics03x7dCJauCGXuLgCx9EP8fZBY1z9xmsMd1SpFecWgyg52Asd5wKpSkkFJNaN-U0PYfmnBH2WJ3l1GncahZroE3355xpvN2OSXkEzeCKsgYsLuwEyrtGDCkUzrLDnwM2hxhPWSpIF7Lo2FMnUsi8Eu-9G68PpSscBtSY2rKjDTKOe4oc8sMuTvJNeJOq3mXmtU",
    arena: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtC4_jPkerXcT9vsTTPToilcc-7NKoM6oQWXEF9M1SzUbJfGBJD2GvkZWN8HFsq5Vfne8cL-V032u9lwhY79UGN4Hp3LNlnPZlDbYgc2awCUMHYGN4fEtBhLWTa6dchyTzhOsrDYWQLZPE11VFWpw8HfILYGdkUVktJRMCZfsybwaN_FUIHeRZrZ1G56BUIZnboOEtJMzhVEWpwKJ79cKjH_tsdhjN8AEMSj3wuYdYi3vFwozGTzd9IXykdUSsljFnx61MybnWNr0",
    tournament: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXJ6YyzbiepQBwWVtfweeD6bBSAgoQN7UT__B2vodKYeFkDcggn9xqjS0kMAvhRMbl8JSaxW3RCAeDentgA_p0zFb6vLSJDy1PNsr2p1MbXwHkqcgIiQ0YL7dEmbaxTO1009BEyXBwyFAEthWK2OGP0Qlob8wIdhzWcJRhEaz7aRbIN6y9JQAqZ3hw94KPPJ2mEUET7LMtCqTHLJ51kdNrxPu1p39QaDcaMchnQ-EkUIoV8X426jZ8I3DADngeJqADJc2o1q27YKo",
    vr: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLUENPufRAH63oVmI98CmYxUbfy7fnia35EBfBUAr8a6CgoLYq2ZmT0UW4q05hJhqI44GFvreB_ANpqe-kuKcw_n0zvTl1P3tVKM5chFqLThNPfLhW5LedosyWwginOKB-jHrZqUnKLWSe0a09SZPsNxi-gUV1ySuSdg-HLLxg6jVQp4fvgACxI5frXJGjbUT4HItmDu_2PwRKuTawDvBHmcuc--02kajZbrWmnNzldgQ-KTcaj-BrWWA8XN1ZV7-Vot_ErIhn82M",
    avatarAlex: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmcW-Rhdq3nKbpifaDM25ehBBRBLpXfdmI6qTHI29SUDu3bhK9qd2F_dw2pKQdgBPZlEiaH-w5127xoPB1zD5m4B6HLtm9GV7igURlAURrqxhLm8C79bJrPvYAJYQzsNW5aqTVNu_dwD2kEVJ-O2UR2763g7E8gm3VYlA94zJTp-7EAqeuUG5hzNo44_TOqiiO3c46eSbH7so3KkZc3BkTB7ITxm4a9t5yqOJ753PgbO_Rm0_o-B51LmdWAhjID45RCN43srwhw7Q",
    avatarSarah: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSjqxnA3b_rtagb69N74LdwAV-_tTETqI67WsiuS-_4jOTxLd9mpPGyy0WoIDF1h2_9LBkkglolPVk6DTrox64J9vlA4T2Bi8IEq2Hpr6IvQ7gOgQKAzNmuJCQIKQnhAlXazrXYTqc6DVZx-T4thMys2QqncDVTR1WfSOzoOO2EkD5VZHxVNcFYhD8rqaHPOT3vRu5LPAzXRI_msvx6e5x7WxTZW7iTYyud-GuXS-bHQbjag3uviB2vfvZL1XI60nZNDTTRJsuY_o",
    avatarMike: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfaWdwtXTHD0zb4GI60Rbwa4rODmJwJDenz9LmMuxJXpCKRrJkSQ_5zAplmtm0A8w-EJUIMAHaBbIXNqUeol-vJCpVgqRA9k_ElH8V9pOngJdfv98xe6CZhYxEoWMg7L1gGIf_38NAolBOoorqxR7p5KS-PGXfqiqDXTYH9aFuaTjKnOrYabtEjNW0nDl16m9KPYp1ZjAM1arOHWtCj_9pcQL_00SdIWWRh3SXKb2jZAwxoba_rqMK-rVhvSad7aHlp3o12hgV0DA",
};

// ── Booking Config ─────────────────────────────────────────────────────────
const STATION_CONFIG = {
    pc:   { label: 'PC',    icon: 'computer',         pricePerHour: 150,  ids: ['PC-01','PC-02','PC-03','PC-04','PC-05','PC-06','PC-07','PC-08'] },
    ps5:  { label: 'PS5',   icon: 'sports_esports',   pricePerHour: 200,  ids: ['PS5-01','PS5-02','PS5-03'] },
    xbox: { label: 'Xbox',  icon: 'stadia_controller',pricePerHour: 180,  ids: ['XBOX-01','XBOX-02'] },
};
const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
const TIME_SLOTS = [
    '10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM',
    '3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM',
];
const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'AED ' };

function BookingModal({ open, onClose }) {
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

    // Fetch rates once on mount
    useEffect(() => {
        if (!open) return;
        fetch('http://localhost:5000/api/rates')
            .then(r => r.json())
            .then(data => { if (data.rates) setRates(data.rates); })
            .catch(() => {});
    }, [open]);

    // Auto-select first station when type changes
    function handleTypeChange(type) {
        setForm(f => ({ ...f, stationType: type, stationId: STATION_CONFIG[type].ids[0] }));
    }

    const cfg = STATION_CONFIG[form.stationType];
    const priceINR = cfg.pricePerHour * form.durationHours;
    const rate = rates[form.currency] ?? 1;
    const displayPrice = form.currency === 'INR' ? priceINR : (priceINR * rate).toFixed(2);
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
                <div className="overflow-y-auto flex-1 relative z-10">
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
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                                        {cfg.ids.map(id => <option key={id} value={id}>{id}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Duration</label>
                                    <select value={form.durationHours} onChange={e => setForm(f => ({...f, durationHours: parseInt(e.target.value)}))}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                                        {[1,2,3,4,5,6,8].map(h => <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Date + Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date</label>
                                    <input required type="date" min={today} value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Time Slot</label>
                                    <select value={form.timeSlot} onChange={e => setForm(f => ({...f, timeSlot: e.target.value}))}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" htmlFor="b-name">Name *</label>
                                    <input required id="b-name" type="text" value={form.customerName} onChange={e => setForm(f => ({...f, customerName: e.target.value}))}
                                        placeholder="Your name" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-600" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" htmlFor="b-phone">Phone *</label>
                                    <input required id="b-phone" type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                                        placeholder="+91 98765 43210" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-600" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" htmlFor="b-email">Email (optional)</label>
                                <input id="b-email" type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                                    placeholder="you@example.com" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-600" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" htmlFor="b-notes">Notes (optional)</label>
                                <input id="b-notes" type="text" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
                                    placeholder="Game preferences, special requests..." className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-600" />
                            </div>

                            {/* Price + Currency */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Price</p>
                                    <p className="text-2xl font-black text-primary">{sym}{displayPrice}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">₹{priceINR} INR · {form.durationHours}h @ ₹{cfg.pricePerHour}/hr</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Currency</label>
                                    <select value={form.currency} onChange={e => setForm(f => ({...f, currency: e.target.value}))}
                                        className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none transition-all">
                                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
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
                            <button onClick={handleClose} className="px-8 py-3 bg-primary text-bg-dark font-bold rounded-xl hover:bg-white transition-colors">
                                CLOSE
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const techColorMap = {
    primary: 'text-primary',
    secondary: 'text-secondary',
};

const techCards = [
    {
        title: "BATTLE STATIONS", subtitle: "TIER 1 RIGS", color: "primary", image: images.battleStation,
        specs: [{ label: "GPU", value: "RTX 4090" }, { label: "CPU", value: "i9-14900K" }, { label: "RAM", value: "64GB DDR5" }]
    },
    {
        title: "NEXT-GEN CONSOLES", subtitle: "PS5 & XBOX SERIES X", color: "secondary", image: images.console,
        specs: [{ label: "Display", value: "4K 120Hz OLED" }, { label: "Sound", value: "3D Audio" }, { label: "Library", value: "Game Pass Ult." }]
    },
    {
        title: "PRECISION INPUT", subtitle: "SCUF & DUALSENSE EDGE", color: "primary", image: images.controller,
        specs: [{ label: "Type", value: "Back Paddles" }, { label: "Trigger", value: "Adjustable Stops" }, { label: "Latency", value: "1ms Wireless" }]
    },
    {
        title: "TACTILE CONTROL", subtitle: "CUSTOM MECH BOARDS", color: "secondary", image: images.keyboard,
        specs: [{ label: "Switches", value: "Holy Pandas" }, { label: "Build", value: "Gasket Mount" }, { label: "Polling", value: "8000Hz" }]
    },
];

const testimonials = [
    {
        text: '"The network speed here is insane. Played a full tournament bracket with zero latency issues. The atmosphere is unmatched."',
        name: "KillaByte_99", role: "Semi-Pro Valorant Player", avatar: images.avatarAlex,
        gradient: "from-primary to-blue-500", stars: 5, offset: false,
    },
    {
        text: '"VIP Bootcamp room is a game changer for our scrims. Soundproof, private, and the rigs are beasts. Worth every penny."',
        name: "NeonValkyrie", role: "Overwatch Team Captain", avatar: images.avatarSarah,
        gradient: "from-purple-500 to-pink-500", stars: 5, offset: true,
    },
    {
        text: '"Great selection of peripherals. I didn\'t even need to bring my own mouse. The chairs are super comfortable for long sessions."',
        name: "RetroWave", role: "Casual Gamer", avatar: images.avatarMike,
        gradient: "from-yellow-500 to-red-500", stars: 4.5, offset: false,
    },
];

const galleryItems = [
    { src: images.arena, label: "The Main Arena", span: "lg:col-span-2" },
    { src: images.tournament, label: "Tournament Nights", span: "" },
    { src: images.console, label: "Console Chill Zone", span: "" },
    { src: images.keyboard, label: "Premium Gear", span: "lg:col-span-2" },
];

export default function Home() {
    const [bookingOpen, setBookingOpen] = useState(false);
    const featuredPosts = blogPosts.slice(0, 3);
    const heroRef = useRef(null);
    const godmodeRef = useRef(null);
    const ascendRef = useRef(null);
    const cursorRef = useRef(null);
    const [isOverGodmode, setIsOverGodmode] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [messageText, setMessageText] = useState("");

    // Responsive mask size — must match CSS breakpoints for .hero-cursor--expanded
    const getExpandedMaskSize = useCallback(() => {
        const w = window.innerWidth;
        if (w >= 768) return 400;
        if (w >= 640) return 250;
        return 150;
    }, []);

    const handleHeroMouseMove = useCallback((e) => {
        const hero = heroRef.current;
        const cursor = cursorRef.current;
        const godmode = godmodeRef.current;
        if (!hero || !cursor) return;

        const heroRect = hero.getBoundingClientRect();
        // Position cursor dot/circle relative to hero
        cursor.style.left = `${e.clientX - heroRect.left}px`;
        cursor.style.top = `${e.clientY - heroRect.top}px`;

        const expandedSize = getExpandedMaskSize();
        const smallSize = expandedSize < 200 ? 20 : 40;

        // Update mask on GOD MODE text
        if (godmode) {
            const gmRect = godmode.getBoundingClientRect();
            // Mask should match the cursor circle size & position
            const maskSize = isOverGodmode ? expandedSize : smallSize;
            const mx = e.clientX - gmRect.left - maskSize / 2;
            const my = e.clientY - gmRect.top - maskSize / 2;
            godmode.style.setProperty('--mask-x', `${mx}px`);
            godmode.style.setProperty('--mask-y', `${my}px`);
            godmode.style.setProperty('--mask-size', `${maskSize}px`);
        }

        // Update mask on ASCEND TO text
        const ascend = ascendRef.current;
        if (ascend) {
            const asRect = ascend.getBoundingClientRect();
            const maskSize = isOverGodmode ? expandedSize : smallSize;
            const mx = e.clientX - asRect.left - maskSize / 2;
            const my = e.clientY - asRect.top - maskSize / 2;
            ascend.style.setProperty('--mask-x', `${mx}px`);
            ascend.style.setProperty('--mask-y', `${my}px`);
            ascend.style.setProperty('--mask-size', `${maskSize}px`);
        }
    }, [isOverGodmode, getExpandedMaskSize]);

    const handleGodmodeEnter = useCallback(() => setIsOverGodmode(true), []);
    const handleGodmodeLeave = useCallback(() => {
        setIsOverGodmode(false);
        const smallSize = window.innerWidth >= 768 ? 40 : 20;
        const el = godmodeRef.current;
        if (el) el.style.setProperty('--mask-size', `${smallSize}px`);
    }, []);

    return (
        <main className="relative pt-16 sm:pt-20">
            {/* ─── HERO ─── */}
            <section
                ref={heroRef}
                className="relative min-h-[75vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden"
                style={{ cursor: 'none' }}
                onMouseMove={handleHeroMouseMove}
            >
                {/* Green cursor dot/circle — sits behind text content */}
                <span ref={cursorRef} className={`hero-cursor ${isOverGodmode ? 'hero-cursor--expanded' : ''}`} />
                <div className="absolute inset-0 bg-bg-dark z-0">
                    <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                    <div className="absolute inset-0 bg-mesh-pattern opacity-40"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/5 rounded-full blur-[100px]"></div>
                    <div className="absolute top-[40%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-secondary/5 rounded-full blur-[80px]"></div>
                    <div className="absolute inset-0 opacity-10 mix-blend-luminosity bg-cover bg-center" style={{ backgroundImage: `url('${images.hero}')` }}></div>
                    <div className="absolute inset-0 bg-linear-to-t from-bg-dark via-bg-dark/80 to-transparent"></div>
                </div>
                <div className="relative z-10 container mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded border border-white/10 bg-white/5 backdrop-blur-sm">
                        <span className="material-symbols-outlined text-primary text-sm">bolt</span>
                        <span className="text-xs font-medium tracking-widest uppercase text-white">Next Gen Gaming Facility</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter mb-6 leading-none">
                        <span
                            ref={ascendRef}
                            className="ascend-wrapper"
                            onMouseEnter={handleGodmodeEnter}
                            onMouseLeave={handleGodmodeLeave}
                        >
                            <span className="ascend-base">ASCEND TO</span>
                            <span className="ascend-mask" aria-hidden="true">ASCEND TO</span>
                        </span> <br />
                        <span
                            ref={godmodeRef}
                            className="godmode-wrapper"
                            onMouseEnter={handleGodmodeEnter}
                            onMouseLeave={handleGodmodeLeave}
                        >
                            <span className="godmode-base">GOD MODE</span>
                            <span className="godmode-mask" aria-hidden="true">GOD MODE</span>
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        Experience the pinnacle of competitive gaming at Level Up. Ultra-high-end rigs, 10Gbps fiber internet, and an immersive atmosphere designed for champions.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={() => setBookingOpen(true)} className="group relative px-8 py-4 bg-secondary text-white font-bold text-lg rounded overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-95">
                            <span className="relative z-10 flex items-center gap-2">
                                BOOK A STATION <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </span>
                            <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-indigo-600"></div>
                        </button>
                        <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold text-lg rounded hover:bg-white/5 hover:border-white/40 transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined">play_circle</span>
                            WATCH TOUR
                        </button>
                    </div>
                </div>
            </section>

            {/* ─── THE TECH ─── */}
            <section id="tech" className="py-24 bg-bg-dark relative border-y border-white/5">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none"></div>
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">THE <span className="text-primary">TECH</span></h2>
                            <p className="text-gray-400 text-lg max-w-xl">Curated hardware for peak performance. Whether you're a PC purist or console champion, our arsenal is ready.</p>
                        </div>
                        <a className="inline-flex items-center gap-2 text-white border border-white/20 px-4 py-2 rounded hover:bg-white/10 transition-colors text-sm font-bold tracking-wider" href="#">
                            VIEW FULL SPECS <span className="material-symbols-outlined text-sm">arrow_outward</span>
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {techCards.map((card) => (
                            <div key={card.title} className="group relative h-72 sm:h-96 lg:h-[450px] rounded-xl overflow-hidden bg-card-dark neon-border card-hover-reveal border border-white/5">
                                <div className="absolute inset-0">
                                    <img alt={card.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-50" src={card.image} />
                                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"></div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full p-6">
                                    <h3 className="text-2xl font-bold text-[#ffffff] mb-1">{card.title}</h3>
                                    <p className={`${techColorMap[card.color] || 'text-primary'} text-sm font-bold mb-4 tracking-wide`}>{card.subtitle}</p>
                                    <div className="space-y-3 bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        {card.specs.map((spec, i) => (
                                            <div key={spec.label} className={`flex justify-between ${i < card.specs.length - 1 ? 'border-b border-white/10 pb-2' : ''}`}>
                                                <span className="text-[#9ca3af] text-xs uppercase">{spec.label}</span>
                                                <span className="text-[#ffffff] text-xs font-bold">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── INTEL HUB (Blog Previews) ─── */}
            {/* <section className="py-24 bg-surface-dark relative overflow-hidden">
                <div className="absolute inset-0 bg-mesh-pattern opacity-10 pointer-events-none"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">THE <span className="text-secondary">INTEL HUB</span></h2>
                        <p className="text-gray-400 max-w-xl mx-auto">Latest strategies, patch notes, and pro-tips directly from the lounge.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredPosts.map((post) => (
                            <Link to={`/blog/${post.id}`} key={post.id}>
                                <article className="group cursor-pointer">
                                    <div className="relative h-64 rounded-2xl overflow-hidden mb-6 border border-white/5">
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                        <img alt={post.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" src={post.image} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">
                                            <span className={post.categoryColor === 'secondary' ? 'text-secondary' : 'text-primary'}>{post.category}</span>
                                            <span>&bull;</span>
                                            <span>{post.date}</span>
                                        </div>
                                        <h3 className="text-3xl text-white font-['Dancing_Script',cursive] group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                                        <div className="mt-4 flex items-center gap-2 text-white text-sm font-bold group-hover:translate-x-2 transition-transform">
                                            Read Article <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* ─── GALLERY ─── */}
            {/* <section id="gallery" className="py-24 bg-bg-dark relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">LOUNGE <span className="text-primary">GALLERY</span></h2>
                        <p className="text-gray-400 max-w-xl mx-auto">See where the magic happens.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[300px]">
                        {galleryItems.map((item) => (
                            <div key={item.label} className={`gallery-item ${item.span} row-span-1 border border-white/10 group`}>
                                <img alt={item.label} className="w-full h-full object-cover transition-transform duration-700" src={item.src} />
                                <div className="gallery-overlay absolute inset-0 flex items-end p-6">
                                    <span className="text-white font-bold text-xl">{item.label}</span>
                                </div>
                            </div>
                        ))}
                    </div> 
                </div>
            </section> */}

            {/* ─── COMMUNITY FEEDBACK ─── */}
            <section className="py-24 bg-surface-dark border-y border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10 pointer-events-none"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">COMMUNITY <span className="text-secondary">FEEDBACK</span></h2>
                        <div className="flex items-center justify-center gap-2">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className="material-symbols-outlined text-primary drop-shadow-[0_0_8px_rgba(13,242,89,0.8)]">star</span>
                            ))}
                            <span className="text-white font-bold ml-2">4.9/5 Average Rating</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((t) => (
                            <div key={t.name} className={`bg-card-dark p-6 sm:p-8 rounded-xl border border-white/5 shadow-lg hover:border-primary/50 transition-colors ${t.offset ? 'md:translate-y-8' : ''}`}>
                                <div className="flex items-center gap-1 mb-4 text-primary">
                                    {[...Array(Math.floor(t.stars))].map((_, i) => (
                                        <span key={i} className="material-symbols-outlined text-sm drop-shadow-[0_0_5px_rgba(13,242,89,0.6)]">star</span>
                                    ))}
                                    {t.stars % 1 !== 0 && (
                                        <span className="material-symbols-outlined text-sm drop-shadow-[0_0_5px_rgba(13,242,89,0.6)]">star_half</span>
                                    )}
                                </div>
                                <p className="text-gray-300 italic mb-6">{t.text}</p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full bg-linear-to-tr ${t.gradient} overflow-hidden`}>
                                        <img alt={t.name} src={t.avatar} loading="lazy" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">{t.name}</h4>
                                        <span className="text-xs text-gray-500">{t.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CONTACT ─── */}
            <section id="about" className="py-24 bg-bg-dark relative">
                <div className="absolute inset-0 bg-secondary/5 skew-y-3 transform origin-top-left scale-110 pointer-events-none"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto bg-card-dark border border-white/10 rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
                        <div className="relative z-10 grid md:grid-cols-2 gap-12">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-4">REACH <span className="text-primary">OUT</span></h2>
                                <p className="text-gray-400 mb-8">Got questions about booking, events, or partnerships? Drop us a line.</p>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 text-gray-300">
                                        <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined">location_on</span>
                                        </div>
                                        <span>123 Cyber Avenue, Neo-Tokyo District</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-300">
                                        <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined">mail</span>
                                        </div>
                                        <span>contact@levelup-lounge.gg</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-300">
                                        <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined">call</span>
                                        </div>
                                        <span>+1 (555) 000-GAME</span>
                                    </div>
                                </div>
                            </div>
                            <form className="space-y-4" onSubmit={(e) => {
                                e.preventDefault();
                                setFormSubmitted(true);
                                setMessageText("");
                                e.target.reset();
                                setTimeout(() => setFormSubmitted(false), 4000);
                            }}>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" htmlFor="name">Name</label>
                                    <input required className="contact-input w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-600" id="name" placeholder="Your Gamer Tag or Name" type="text" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" htmlFor="email">Email</label>
                                    <input required className="contact-input w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-600" id="email" placeholder="you@example.com" type="email" />
                                </div>
                                <div className="relative">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" htmlFor="message">Message</label>
                                    <textarea required maxLength={400} value={messageText} onChange={(e) => setMessageText(e.target.value)} className="contact-input w-full bg-black/40 border border-white/10 rounded-lg p-3 pb-6 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-600 h-32 resize-none" id="message" placeholder="How can we help you level up?"></textarea>
                                    <div className={`absolute bottom-3 right-3 text-xs font-medium ${messageText.length === 400 ? 'text-red-500' : 'text-gray-500'}`}>
                                        {messageText.length}/400
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-primary text-bg-dark font-bold text-lg rounded-lg hover:bg-white hover:shadow-[0_0_20px_rgba(13,242,89,0.5)] transition-all flex items-center justify-center gap-2 group">
                                    SEND MESSAGE <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Success notification */}
            {formSubmitted && (
                <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 bg-card-dark border border-primary/40 rounded-xl shadow-[0_0_30px_rgba(13,242,89,0.2)] animate-[slideUp_0.4s_ease-out]">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">check_circle</span>
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm">Message Sent!</p>
                        <p className="text-gray-400 text-xs">We'll get back to you shortly.</p>
                    </div>
                    <button onClick={() => setFormSubmitted(false)} className="ml-4 text-gray-500 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
            )}

            {/* ─── CTA ─── */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-bg-dark to-secondary/8" />
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <span className="material-symbols-outlined text-primary text-5xl mb-4 block animate-pulse">emoji_events</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-4">READY TO <span className="text-primary">DOMINATE</span>?</h2>
                    <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg">Register for an upcoming tournament today. Limited slots are available — secure yours before they're gone.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/tournament"
                            className="px-10 py-4 bg-primary text-black font-black text-base rounded hover:bg-white hover:shadow-[0_0_30px_rgba(13,242,89,0.5)] transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined">sports_esports</span>
                            REGISTER NOW
                        </Link>
                        <a href="tel:+915550000263" className="px-10 py-4 bg-transparent border border-white/20 text-white font-bold text-base rounded hover:bg-white/5 transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined">call</span>
                            CALL US
                        </a>
                    </div>
                </div>
            </section>
            {/* Booking Modal */}
            <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
        </main>
    );
}
