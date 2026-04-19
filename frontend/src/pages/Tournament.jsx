import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const MockDataBadge = () => (
  <span className="ml-3 inline-flex items-center gap-1 px-2 py-0.5 rounded border border-gray-600/50 bg-gray-800/50 text-[9px] font-bold uppercase tracking-widest text-gray-400 select-none align-middle backdrop-blur-sm" title="This section uses mock data">
    <span className="material-symbols-outlined text-[10px]">science</span> MOCK DATA
  </span>
);

// ─── DATA ────────────────────────────────────────────────────────────────────

const upcomingTournaments = [
  {
    id: 1,
    game: 'VALORANT',
    title: 'Neon Clash Invitational',
    date: 'April 19, 2026',
    time: '6:00 PM',
    prize: '₹25,000',
    slots: 32,
    filled: 27,
    format: '5v5 Double Elimination',
    entryFee: '₹500 / team',
    tag: 'FEATURED',
    tagColor: 'primary',
    icon: 'military_tech',
    color: '#ff4655',
    bg: 'from-red-900/30 to-bg-dark',
    rules: ['Teams of 5', 'Best-of-3 in group stage', 'Best-of-5 in finals', 'Cheating = instant disqualification', 'Standard competitive ruleset'],
  },
  {
    id: 2,
    game: 'FIFA 25',
    title: 'Golden Boot Championship',
    date: 'April 26, 2026',
    time: '4:00 PM',
    prize: '₹15,000',
    slots: 64,
    filled: 41,
    format: '1v1 Single Elimination',
    entryFee: '₹200 / player',
    tag: 'OPEN',
    tagColor: 'secondary',
    icon: 'sports_soccer',
    color: '#a855f7',
    bg: 'from-purple-900/30 to-bg-dark',
    rules: ['1v1 knockout', 'Semi-pro/Ultimate difficulty', '6 minute halves', 'No pause after 80th minute', 'Referee decisions are final'],
  },
  {
    id: 3,
    game: 'FREE FIRE',
    title: 'Booyah Battle Royale',
    date: 'May 3, 2026',
    time: '7:00 PM',
    prize: '₹20,000',
    slots: 48,
    filled: 18,
    format: 'Squad Battle Royale',
    entryFee: '₹300 / squad',
    tag: 'COMING SOON',
    tagColor: 'yellow',
    icon: 'gps_fixed',
    color: '#f59e0b',
    bg: 'from-yellow-900/30 to-bg-dark',
    rules: ['Squads of 4', '3 matches, points accumulation', 'Custom room hosted by admin', 'No emulators permitted', 'Stream sniping = ban'],
  },
];

const pastTournaments = [
  {
    id: 1,
    game: 'VALORANT',
    title: 'Iron Siege Cup – S1',
    date: 'March 2026',
    prize: '₹25,000',
    teams: 32,
    winner: 'Shadow Protocol',
    runnerUp: 'Neon Vipers',
    mvp: 'KillaByte_99',
    mvpStat: '4.1 K/D Ratio',
    kills: 312,
    totalMatches: 47,
    icon: 'emoji_events',
    accent: 'primary',
  },
  {
    id: 2,
    game: 'BGMI',
    title: 'Kill or Be Killed – S3',
    date: 'February 2026',
    prize: '₹18,000',
    teams: 24,
    winner: 'Ghost Division',
    runnerUp: 'Apex Raiders',
    mvp: 'DesertEagle_X',
    mvpStat: '289 Total Kills',
    kills: 845,
    totalMatches: 18,
    icon: 'gps_fixed',
    accent: 'secondary',
  },
  {
    id: 3,
    game: 'FIFA 25',
    title: 'Street Kings League – S2',
    date: 'January 2026',
    prize: '₹12,000',
    teams: 16,
    winner: 'RetroWave',
    runnerUp: 'NeonValkyrie',
    mvp: 'RetroWave',
    mvpStat: '24 Goals Scored',
    kills: 0,
    totalMatches: 15,
    icon: 'sports_soccer',
    accent: 'primary',
  },
  {
    id: 4,
    game: 'CALL OF DUTY',
    title: 'Warzone Warriors Cup',
    date: 'December 2025',
    prize: '₹30,000',
    teams: 40,
    winner: 'Omega Squad',
    runnerUp: 'Dark Matter',
    mvp: 'TactiX_47',
    mvpStat: '3.8 K/D Ratio',
    kills: 1024,
    totalMatches: 60,
    icon: 'military_tech',
    accent: 'secondary',
  },
];

const brackets = [
  {
    round: 'QUARTER FINALS',
    matchdate: 'April 19 – 6:00 PM',
    matches: [
      { team1: 'Shadow Protocol', team2: 'Neon Vipers', score1: null, score2: null, status: 'upcoming' },
      { team1: 'Ghost Division', team2: 'KillaByte Squad', score1: null, score2: null, status: 'upcoming' },
      { team1: 'Apex Predators', team2: 'Steel Valor', score1: null, score2: null, status: 'upcoming' },
      { team1: 'Omega Squad', team2: 'TactiX Force', score1: null, score2: null, status: 'upcoming' },
    ],
  },
  {
    round: 'SEMI FINALS',
    matchdate: 'April 19 – 9:00 PM',
    matches: [
      { team1: 'TBD', team2: 'TBD', score1: null, score2: null, status: 'tbd' },
      { team1: 'TBD', team2: 'TBD', score1: null, score2: null, status: 'tbd' },
    ],
  },
  {
    round: 'GRAND FINAL',
    matchdate: 'April 19 – 11:00 PM',
    matches: [
      { team1: 'TBD', team2: 'TBD', score1: null, score2: null, status: 'tbd' },
    ],
  },
];

const hallOfFame = [
  {
    season: 'Season 04',
    tournament: 'Iron Siege Cup',
    date: 'March 2026',
    game: 'VALORANT',
    gameColor: '#ff4655',
    prize: '₹25,000',
    champion: { name: 'Shadow Protocol', tag: 'Champions', icon: 'emoji_events', color: '#fbbf24' },
    runnerUp: { name: 'Neon Vipers', tag: 'Runner-Up', icon: 'workspace_premium', color: '#9ca3af' },
    mvp: { name: 'KillaByte_99', stat: '4.1 K/D Ratio', statIcon: 'local_fire_department', team: 'Shadow Protocol' },
    highlight: 'Shadow Protocol swept the grand final 3-0 in a historic shutout. KillaByte_99 dropped a legendary 40-bomb in the deciding map.',
    gradient: 'from-red-900/40 via-card-dark to-card-dark',
    accentColor: 'primary',
  },
  {
    season: 'Season 03',
    tournament: 'Kill or Be Killed',
    date: 'February 2026',
    game: 'BGMI',
    gameColor: '#a855f7',
    prize: '₹18,000',
    champion: { name: 'Ghost Division', tag: 'Champions', icon: 'emoji_events', color: '#fbbf24' },
    runnerUp: { name: 'Apex Raiders', tag: 'Runner-Up', icon: 'workspace_premium', color: '#9ca3af' },
    mvp: { name: 'DesertEagle_X', stat: '289 Total Kills', statIcon: 'gps_fixed', team: 'Ghost Division' },
    highlight: 'Ghost Division dominated 3 consecutive chicken dinners. DesertEagle_X finished with the highest kill count in LevelUp BGMI history.',
    gradient: 'from-purple-900/40 via-card-dark to-card-dark',
    accentColor: 'secondary',
  },
  {
    season: 'Season 02',
    tournament: 'Street Kings League',
    date: 'January 2026',
    game: 'FIFA 25',
    gameColor: '#10b981',
    prize: '₹12,000',
    champion: { name: 'RetroWave', tag: 'Champion', icon: 'emoji_events', color: '#fbbf24' },
    runnerUp: { name: 'NeonValkyrie', tag: 'Runner-Up', icon: 'workspace_premium', color: '#9ca3af' },
    mvp: { name: 'RetroWave', stat: '24 Goals Scored', statIcon: 'sports_soccer', team: 'Solo Entry' },
    highlight: 'RetroWave went undefeated through 8 matches, scoring 24 goals. The final ended 5-0 — the most dominant display in LevelUp FIFA history.',
    gradient: 'from-emerald-900/40 via-card-dark to-card-dark',
    accentColor: 'primary',
  },
  {
    season: 'Season 01',
    tournament: 'Warzone Warriors Cup',
    date: 'December 2025',
    game: 'CALL OF DUTY',
    gameColor: '#f59e0b',
    prize: '₹30,000',
    champion: { name: 'Omega Squad', tag: 'Champions', icon: 'emoji_events', color: '#fbbf24' },
    runnerUp: { name: 'Dark Matter', tag: 'Runner-Up', icon: 'workspace_premium', color: '#9ca3af' },
    mvp: { name: 'TactiX_47', stat: '3.8 K/D Ratio', statIcon: 'military_tech', team: 'Omega Squad' },
    highlight: 'The inaugural LevelUp tournament drew 40 squads. Omega Squad clawed a comeback from the losers bracket, beating Dark Matter twice in the final.',
    gradient: 'from-yellow-900/40 via-card-dark to-card-dark',
    accentColor: 'secondary',
  },
];

const generalRules = [
  { icon: 'person', title: 'Eligibility', desc: 'All participants must be 14+ years old and present a valid government ID at check-in. Players must be physically present at the LevelUp arena.' },
  { icon: 'schedule', title: 'Punctuality', desc: 'Teams must check in 30 minutes before their scheduled match. No-shows after 10 minutes will result in a forfeit.' },
  { icon: 'devices', title: 'Equipment', desc: 'Peripherals (mouse, keyboard, headset) are provided FREE. Players may bring their own—subject to inspection for disallowed hardware.' },
  { icon: 'security', title: 'Fair Play', desc: 'Any cheats, hacks, or exploits result in immediate disqualification and a 90-day ban from future tournaments.' },
  { icon: 'sentiment_very_dissatisfied', title: 'Conduct', desc: 'Unsportsmanlike conduct, harassment, or abuse of staff/players = instant disqualification with no refund.' },
  { icon: 'contact_support', title: 'Disputes', desc: 'All decisions by the Tournament Admin are final. Please raise disputes calmly via the admin desk within 5 minutes of the match.' },
];

// ─── REGISTRATION MODAL ───────────────────────────────────────────────────────

function RegistrationModal({ tournament, onClose, onFeatureUnavailable }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ captain: '', email: '', phone: '', team: '', members: '', gameId: '', agree: false });
  const overlayRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // setSubmitted(true);
    if (onFeatureUnavailable) onFeatureUnavailable();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative w-full max-w-lg bg-card-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-[slideUp_0.35s_ease-out]">
        {/* Glow accents */}
        <div className="absolute top-0 left-0 w-64 h-32 bg-primary/10 blur-[60px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-32 bg-secondary/10 blur-[60px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-primary">Register Now</span>
              <h3 className="text-xl font-bold text-white mt-1">{tournament.title}</h3>
              <p className="text-gray-400 text-sm mt-0.5">{tournament.game} · {tournament.date}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors ml-4 mt-1">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {!submitted ? (
            <>
              {/* Step pills */}
              <div className="flex items-center gap-2 mb-6">
                {[1, 2].map((s) => (
                  <div key={s} className={`flex items-center gap-2 ${s < 2 ? 'flex-1' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-primary text-black' : 'bg-white/10 text-gray-500'}`}>{s}</div>
                    {s < 2 && <div className={`flex-1 h-0.5 transition-all ${step > s ? 'bg-primary' : 'bg-white/10'}`} />}
                  </div>
                ))}
              </div>

              <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleSubmit} className="space-y-4">
                {step === 1 && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="reg-captain">Captain / Player Name</label>
                      <input required id="reg-captain" name="captain" value={form.captain} onChange={handleChange}
                        className="contact-input w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-all placeholder-gray-600 text-sm"
                        placeholder="Your gamer tag / real name" type="text" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="reg-email">Email Address</label>
                      <input required id="reg-email" name="email" value={form.email} onChange={handleChange}
                        className="contact-input w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-all placeholder-gray-600 text-sm"
                        placeholder="you@example.com" type="email" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="reg-phone">Phone Number</label>
                      <input required id="reg-phone" name="phone" value={form.phone} onChange={handleChange}
                        className="contact-input w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-all placeholder-gray-600 text-sm"
                        placeholder="+91 XXXXX XXXXX" type="tel" />
                    </div>
                    <button type="submit" className="w-full py-3 bg-primary text-black font-bold rounded-lg hover:bg-[#ffffff] hover:text-[#000000] hover:shadow-[0_0_20px_rgba(13,242,89,0.4)] transition-all flex items-center justify-center gap-2 text-sm">
                      Next Step <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </>
                )}
                {step === 2 && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="reg-team">Team Name</label>
                      <input required id="reg-team" name="team" value={form.team} onChange={handleChange}
                        className="contact-input w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-all placeholder-gray-600 text-sm"
                        placeholder="e.g. Shadow Protocol" type="text" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="reg-members">Team Members (comma-separated)</label>
                      <input id="reg-members" name="members" value={form.members} onChange={handleChange}
                        className="contact-input w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-all placeholder-gray-600 text-sm"
                        placeholder="Player2, Player3, Player4, Player5" type="text" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="reg-gameid">In-Game ID / Username</label>
                      <input required id="reg-gameid" name="gameId" value={form.gameId} onChange={handleChange}
                        className="contact-input w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-all placeholder-gray-600 text-sm"
                        placeholder="Your in-game username" type="text" />
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" name="agree" required checked={form.agree} onChange={handleChange} className="mt-0.5 accent-primary w-4 h-4 flex-shrink-0" />
                      <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">I agree to the tournament rules and understand that entry fees are non-refundable. I confirm all team members are 14+.</span>
                    </label>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 border border-white/10 text-gray-300 font-bold rounded-lg hover:bg-white/5 transition-all text-sm">
                        Back
                      </button>
                      <button type="submit" className="flex-1 py-3 bg-primary text-black font-bold rounded-lg hover:bg-[#ffffff] hover:text-[#000000] hover:shadow-[0_0_20px_rgba(13,242,89,0.4)] transition-all flex items-center justify-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-sm">how_to_reg</span> Confirm Registration
                      </button>
                    </div>
                  </>
                )}
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">You're Registered!</h4>
              <p className="text-gray-400 text-sm mb-1">A confirmation has been sent to <span className="text-primary font-bold">{form.email}</span></p>
              <p className="text-gray-500 text-xs mb-6">Check in 30 mins before your match. Entry fee payable at the desk.</p>
              <div className="bg-card-dark border border-white/10 rounded-xl p-4 text-left text-sm space-y-2 mb-6">
                <div className="flex justify-between"><span className="text-gray-500">Team:</span><span className="text-white font-bold">{form.team || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Captain:</span><span className="text-white font-bold">{form.captain}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tournament:</span><span className="text-primary font-bold">{tournament.title}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date:</span><span className="text-white font-bold">{tournament.date} · {tournament.time}</span></div>
              </div>
              <button onClick={onClose} className="w-full py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-all text-sm">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── COUNTDOWN ────────────────────────────────────────────────────────────────

function Countdown({ targetDate }) {
  const calc = () => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <div className="flex gap-2 sm:gap-4">
      {[['d', 'Days'], ['h', 'Hrs'], ['m', 'Min'], ['s', 'Sec']].map(([k, label]) => (
        <div key={k} className="flex flex-col items-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-card-dark border border-primary/30 rounded-lg flex items-center justify-center">
            <span className="text-primary font-black text-xl sm:text-2xl tabular-nums">{pad(time[k])}</span>
          </div>
          <span className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function Tournament() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [expandedRules, setExpandedRules] = useState(null);
  const [hofActive, setHofActive] = useState(0);
  const [comingSoon, setComingSoon] = useState(false);

  useEffect(() => {
    if (comingSoon) {
      const timer = setTimeout(() => setComingSoon(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [comingSoon]);

  return (
    <main className="relative bg-bg-dark min-h-screen">

      {/* ─── HERO BANNER ─── */}
      <section className="pt-20 sm:pt-25 relative min-h-[65vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-bg-dark">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="absolute inset-0 bg-mesh-pattern opacity-30" />
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXJ6YyzbiepQBwWVtfweeD6bBSAgoQN7UT__B2vodKYeFkDcggn9xqjS0kMAvhRMbl8JSaxW3RCAeDentgA_p0zFb6vLSJDy1PNsr2p1MbXwHkqcgIiQ0YL7dEmbaxTO1009BEyXBwyFAEthWK2OGP0Qlob8wIdhzWcJRhEaz7aRbIN6y9JQAqZ3hw94KPPJ2mEUET7LMtCqTHLJ51kdNrxPu1p39QaDcaMchnQ-EkUIoV8X426jZ8I3DADngeJqADJc2o1q27YKo"
            alt="Tournament arena"
            className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-dark/60 to-bg-dark" />
        </div>

        {/* Floating trophy glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/8 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded border border-primary/30 bg-primary/10 backdrop-blur-sm">
            <span className="material-symbols-outlined text-primary text-sm animate-pulse">emoji_events</span>
            <span className="text-xs font-bold tracking-widest uppercase text-primary">Tournament Arena</span>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-none">
            COMPETE.<br />
            <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(13,242,89,0.6)' }}>CONQUER.</span><br />
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">CHAMPION.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Real stakes. Real glory. LevelUp hosts weekly esports tournaments across VALORANT, BGMI, FIFA 25, and more — with cash prizes up to ₹30,000.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <a href="#upcoming" className="group px-8 py-4 bg-primary text-black font-black text-base rounded overflow-hidden hover:bg-[#ffffff] hover:text-[#000000] hover:shadow-[0_0_30px_rgba(13,242,89,0.5)] transition-all flex items-center gap-2">
              <span className="material-symbols-outlined">how_to_reg</span>
              REGISTER NOW
            </a>
            <a href="#past-records" className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold text-base rounded hover:bg-white/5 hover:border-white/40 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined">history</span>
              PAST RECORDS
            </a>
          </div>
        </div>
      </section>

      {/* ─── STATS TICKER ─── */}
      <div className="mt-10 border-y border-primary/20 ticker-bg backdrop-blur-sm overflow-hidden">
        <div className="flex gap-0 animate-[scroll_20s_linear_infinite] whitespace-nowrap py-4 w-max">
          {[...Array(3)].map((_, ri) => (
            [
              { icon: 'emoji_events', label: 'Total Tournaments', value: '40+' },
              { icon: 'group', label: 'Players Competed', value: '1,200+' },
              { icon: 'payments', label: 'Prize Pool Awarded', value: '₹4.8 Lakh' },
              { icon: 'workspace_premium', label: 'Unique Champions', value: '28' },
              { icon: 'sports_esports', label: 'Games Featured', value: '6' },
            ].map((stat, i) => (
              <div key={`${ri}-${i}`} className="flex items-center gap-8 px-12">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-lg">{stat.icon}</span>
                  <span className="text-gray-500 text-sm uppercase tracking-wider">{stat.label}</span>
                  <span className="text-white font-black text-xl">{stat.value}</span>
                </div>
                <span className="text-primary/30 text-2xl font-thin">|</span>
              </div>
            ))
          ))}
        </div>
      </div>

      {/* ─── UPCOMING + PAST TABS ─── */}
      <section id="upcoming" className="py-20 container mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white">THE <span className="text-primary">ARENA</span> <MockDataBadge /></h2>
            <p className="text-gray-400 mt-2">Browse upcoming events and past tournament records.</p>
          </div>
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {['upcoming', 'past'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-primary text-black' : 'bg-surface-dark text-gray-400 hover:text-white'}`}>
                {tab === 'upcoming' ? '🟢 Upcoming' : '🏆 Records'}
              </button>
            ))}
          </div>
        </div>

        {/* UPCOMING TOURNAMENTS */}
        {activeTab === 'upcoming' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {upcomingTournaments.map((t) => {
              const pct = Math.round((t.filled / t.slots) * 100);
              return (
                <div key={t.id}
                  className={`relative rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-b ${t.bg} hover:border-white/20 transition-all group cursor-pointer`}
                  onClick={() => setSelectedTournament(t)}
                >
                  {/* Tag badge */}
                  <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${t.tagColor === 'primary' ? 'bg-primary/20 text-primary border border-primary/40' : t.tagColor === 'secondary' ? 'bg-secondary/20 text-secondary border border-secondary/40' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'}`}>
                    {t.tag}
                  </div>

                  <div className="p-6">
                    {/* Game icon */}
                    <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ background: `${t.color}20`, border: `1px solid ${t.color}40` }}>
                      <span className="material-symbols-outlined text-2xl" style={{ color: t.color }}>{t.icon}</span>
                    </div>

                    <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: t.color }}>{t.game}</div>
                    <h3 className="text-xl font-black text-white mb-4 group-hover:text-primary transition-colors">{t.title}</h3>

                    <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="material-symbols-outlined text-sm text-gray-600">calendar_today</span>
                        {t.date}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="material-symbols-outlined text-sm text-gray-600">schedule</span>
                        {t.time}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="material-symbols-outlined text-sm text-gray-600">payments</span>
                        <span className="font-bold text-white">{t.prize}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="material-symbols-outlined text-sm text-gray-600">sports_esports</span>
                        {t.format}
                      </div>
                    </div>

                    {/* Slot bar */}
                    <div className="mb-5">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-500 font-medium">Slots Filled</span>
                        <span className={`font-bold ${pct >= 90 ? 'text-red-400' : pct >= 70 ? 'text-yellow-400' : 'text-primary'}`}>{t.filled}/{t.slots} — {pct}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#0df259' }} />
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">Entry: <span className="text-white font-bold">{t.entryFee}</span></span>
                      <button
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-black"
                        onClick={(e) => { e.stopPropagation(); setComingSoon(true); }}
                      >
                        <span className="material-symbols-outlined text-sm">how_to_reg</span>
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAST RECORDS */}
        {activeTab === 'past' && (
          <div id="past-records" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastTournaments.map((t) => (
              <div key={t.id} className={`relative rounded-2xl bg-card-dark border border-white/5 hover:border-${t.accent === 'primary' ? 'primary' : 'secondary'}/30 overflow-hidden transition-all group p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={`text-xs font-bold tracking-widest uppercase ${t.accent === 'primary' ? 'text-primary' : 'text-secondary'}`}>{t.game}</span>
                    <h3 className="text-xl font-black text-white mt-0.5">{t.title}</h3>
                    <span className="text-xs text-gray-500">{t.date}</span>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${t.accent === 'primary' ? 'bg-primary/20 border border-primary/40' : 'bg-secondary/20 border border-secondary/40'}`}>
                    <span className={`material-symbols-outlined text-2xl ${t.accent === 'primary' ? 'text-primary' : 'text-secondary'}`}>{t.icon}</span>
                  </div>
                </div>

                {/* Results grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Prize Pool', value: t.prize, icon: 'payments' },
                    { label: 'Teams', value: t.teams, icon: 'group' },
                    { label: 'Matches', value: t.totalMatches, icon: 'sports_esports' },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                      <span className="material-symbols-outlined text-gray-600 text-sm mb-1 block">{s.icon}</span>
                      <div className="text-white font-black text-base">{s.value}</div>
                      <div className="text-gray-500 text-[10px] uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-yellow-400 text-base">emoji_events</span>
                      <span className="text-gray-400">Champion</span>
                    </div>
                    <span className="text-white font-black">{t.winner}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-gray-400 text-base">workspace_premium</span>
                      <span className="text-gray-400">Runner-Up</span>
                    </div>
                    <span className="text-white font-bold">{t.runnerUp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-primary text-base">star</span>
                      <span className="text-gray-400">MVP</span>
                    </div>
                    <span className="text-primary font-black">{t.mvp} <span className="text-gray-500 font-normal text-xs">· {t.mvpStat}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── FEATURED COUNTDOWN ─── */}
      <section className="py-16 border-y border-white/5 bg-surface-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-primary/30 bg-primary/10 mb-4">
                <span className="animate-ping w-2 h-2 rounded-full bg-primary inline-flex" />
                <span className="text-xs font-bold text-primary tracking-widest uppercase">Next Tournament</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-2">Neon Clash Invitational</h2>
              <p className="text-gray-400 mb-2">VALORANT · 5v5 Double Elimination · <span className="text-primary font-bold">₹25,000 Prize Pool</span></p>
              <p className="text-sm text-gray-500">April 19, 2026 @ 6:00 PM IST — LevelUp Esports Arena, Hall 2</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-500 text-sm uppercase tracking-widest">Starts In</p>
              <Countdown targetDate="2026-04-19T18:00:00+05:30" />
              <button onClick={() => setComingSoon(true)}
                className="mt-2 px-8 py-3 bg-primary text-black font-black rounded-lg hover:bg-[#ffffff] hover:text-[#000000] hover:shadow-[0_0_20px_rgba(13,242,89,0.5)] transition-all text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">how_to_reg</span>
                SECURE YOUR SLOT
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BRACKET / FIXTURES ─── */}
      <section className="py-20 container mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-3">MATCH <span className="text-primary">BRACKETS</span> <MockDataBadge /></h2>
          <p className="text-gray-400 max-w-xl mx-auto">Live bracket for the Neon Clash Invitational — April 19, 2026. Fixtures update in real-time during the event.</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-0 overflow-x-auto pb-4">
          {brackets.map((round, ri) => (
            <div key={round.round} className="flex items-center gap-0">
              <div className="min-w-[260px] w-full lg:w-72">
                {/* Round header */}
                <div className="text-center mb-4">
                  <span className="text-xs font-black tracking-widest uppercase text-primary">{round.round}</span>
                  <p className="text-gray-600 text-[10px] mt-0.5">{round.matchdate}</p>
                </div>
                <div className={`space-y-4 ${ri === 1 ? 'mt-14' : ri === 2 ? 'mt-28' : ''}`}>
                  {round.matches.map((m, mi) => (
                    <div key={mi} className={`rounded-xl border overflow-hidden transition-all ${m.status === 'tbd' ? 'border-white/5 opacity-50' : 'border-white/10 hover:border-primary/30'}`}>
                      {[{ name: m.team1, score: m.score1 }, { name: m.team2, score: m.score2 }].map((side, si) => (
                        <div key={si} className={`flex items-center justify-between px-4 py-2.5 ${si === 0 ? 'border-b border-white/5' : ''} ${m.status === 'tbd' ? 'bg-white/5' : 'bg-card-dark hover:bg-white/10 transition-colors'}`}>
                          <span className={`text-sm font-bold ${m.status === 'tbd' ? 'text-gray-600' : 'text-white'}`}>{side.name}</span>
                          <span className={`text-sm font-black px-2 py-0.5 rounded ${side.score !== null ? 'bg-primary/20 text-primary' : 'text-gray-600'}`}>{side.score !== null ? side.score : '—'}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              {/* Connector lines */}
              {ri < brackets.length - 1 && (
                <div className="hidden lg:flex flex-col items-center self-start mt-16 mx-2 opacity-30">
                  <div className="w-8 h-0.5 bg-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── RULES & GUIDELINES ─── */}
      <section className="py-20 bg-surface-dark border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-3">RULES & <span className="text-secondary">GUIDELINES</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto">Compete with integrity. All participants must adhere to the following rules. Ignorance is no excuse.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {generalRules.map((rule, i) => (
              <div
                key={rule.title}
                className="group bg-card-dark border border-white/5 hover:border-secondary/30 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.08)]"
                onClick={() => setExpandedRules(expandedRules === i ? null : i)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <span className="material-symbols-outlined text-secondary text-lg">{rule.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-base mb-1 group-hover:text-secondary transition-colors">{rule.title}</h3>
                    <p className={`text-gray-400 text-sm leading-relaxed transition-all duration-300 ${expandedRules === i ? 'max-h-40 opacity-100' : 'max-h-0 overflow-hidden opacity-0 md:max-h-40 md:opacity-100'}`}>
                      {rule.desc}
                    </p>
                  </div>
                  <span className={`material-symbols-outlined text-gray-600 transition-transform md:hidden ${expandedRules === i ? 'rotate-180' : ''}`}>expand_more</span>
                </div>
              </div>
            ))}
          </div>

          {/* Rule download CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3 px-6 py-4 bg-card-dark border border-white/10 rounded-xl">
              <span className="material-symbols-outlined text-primary">description</span>
              <div>
                <p className="text-white font-bold text-sm">Full Tournament Rulebook</p>
                <p className="text-gray-500 text-xs">PDF · 12 pages · Last updated March 2026</p>
              </div>
              <button className="ml-4 px-4 py-2 bg-primary/10 border border-primary/30 text-primary rounded-lg text-xs font-bold hover:bg-primary hover:text-black transition-all flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">download</span>
                Download
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HALL OF FAME ─── */}
      <section className="py-20 bg-surface-dark border-y border-white/5 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 mb-5">
              <span className="material-symbols-outlined text-yellow-400 text-base">auto_awesome</span>
              <span className="text-xs font-black tracking-widest uppercase text-yellow-400">Immortalized</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-3">HALL OF <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">FAME</span> <MockDataBadge /></h2>
            <p className="text-gray-400 max-w-xl mx-auto">The legends who conquered the LevelUp Arena. Every champion, every MVP — carved into history.</p>
          </div>

          {/* Season Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {hallOfFame.map((entry, i) => (
              <button
                key={entry.season}
                onClick={() => setHofActive(i)}
                className={`px-5 py-2.5 rounded-xl text-sm font-black tracking-wide transition-all border ${hofActive === i
                  ? 'bg-yellow-500/15 border-yellow-500/50 text-yellow-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                  : 'bg-card-dark border-white/5 text-gray-500 hover:text-white hover:border-white/20'
                  }`}
              >
                {entry.season}
                <span className="ml-2 text-[10px] opacity-60">{entry.game}</span>
              </button>
            ))}
          </div>

          {/* Active Entry */}
          {hallOfFame.map((entry, i) => (
            <div
              key={entry.season}
              className={`transition-all duration-500 ${hofActive === i ? 'block opacity-100' : 'hidden opacity-0'
                }`}
            >
              <div className={`rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-br ${entry.gradient}`}>
                {/* Tournament Header Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 sm:px-8 py-5 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${entry.gameColor}20`, border: `1px solid ${entry.gameColor}40` }}>
                      <span className="material-symbols-outlined text-xl" style={{ color: entry.gameColor }}>sports_esports</span>
                    </div>
                    <div>
                      <p className="text-xs font-black tracking-widest uppercase" style={{ color: entry.gameColor }}>{entry.game} · {entry.season}</p>
                      <h3 className="text-xl font-black text-white">{entry.tournament}</h3>
                      <p className="text-gray-500 text-xs">{entry.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <span className="material-symbols-outlined text-yellow-400">payments</span>
                    <div>
                      <p className="text-yellow-400 font-black text-lg leading-none">{entry.prize}</p>
                      <p className="text-yellow-600 text-[10px] uppercase tracking-wider">Prize Pool</p>
                    </div>
                  </div>
                </div>

                {/* Main grid: Champion | Runner-Up | MVP */}
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">

                  {/* Champion */}
                  <div className="flex flex-col items-center text-center p-8 relative">
                    <div className="absolute top-4 left-4 text-[10px] font-black tracking-widest uppercase text-yellow-500/60">Champion</div>
                    <div className="relative mb-4 mt-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400/30 to-amber-600/20 border-2 border-yellow-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                        <span className="material-symbols-outlined text-yellow-400 text-3xl">emoji_events</span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-black text-xs font-black">1</span>
                      </div>
                    </div>
                    <p className="text-2xl font-black text-white mb-1">{entry.champion.name}</p>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-[10px] font-black tracking-widest uppercase">
                      <span className="material-symbols-outlined text-xs">emoji_events</span>
                      {entry.champion.tag}
                    </span>
                  </div>

                  {/* Runner-Up */}
                  <div className="flex flex-col items-center text-center p-8 relative">
                    <div className="absolute top-4 left-4 text-[10px] font-black tracking-widest uppercase text-gray-600">Runner-Up</div>
                    <div className="relative mb-4 mt-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400/20 to-gray-600/10 border-2 border-gray-500/40 flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-400 text-3xl">workspace_premium</span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-black">2</span>
                      </div>
                    </div>
                    <p className="text-2xl font-black text-gray-200 mb-1">{entry.runnerUp.name}</p>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black tracking-widest uppercase">
                      <span className="material-symbols-outlined text-xs">workspace_premium</span>
                      {entry.runnerUp.tag}
                    </span>
                  </div>

                  {/* MVP */}
                  <div className="flex flex-col items-center text-center p-8 relative">
                    <div className="absolute top-4 left-4 text-[10px] font-black tracking-widest uppercase text-primary/60">MVP</div>
                    <div className="relative mb-4 mt-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-emerald-600/10 border-2 border-primary/50 flex items-center justify-center shadow-[0_0_25px_rgba(13,242,89,0.2)]">
                        <span className="material-symbols-outlined text-primary text-3xl">{entry.mvp.statIcon}</span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-black text-xs font-black">★</span>
                      </div>
                    </div>
                    <p className="text-2xl font-black text-primary mb-1">{entry.mvp.name}</p>
                    <p className="text-gray-500 text-xs mb-2">{entry.mvp.team}</p>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-black tracking-widest uppercase">
                      <span className="material-symbols-outlined text-xs">{entry.mvp.statIcon}</span>
                      {entry.mvp.stat}
                    </span>
                  </div>
                </div>

                {/* Highlight Quote */}
                <div className="px-6 sm:px-8 py-5 border-t border-white/5 bg-white/5 flex items-start gap-4">
                  <span className="material-symbols-outlined text-yellow-400/60 text-3xl flex-shrink-0 mt-0.5">format_quote</span>
                  <p className="text-gray-300 text-sm leading-relaxed italic">{entry.highlight}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Dot navigation */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {hallOfFame.map((_, i) => (
              <button
                key={i}
                onClick={() => setHofActive(i)}
                className={`rounded-full transition-all duration-300 ${hofActive === i
                  ? 'w-8 h-2 bg-yellow-400'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW TO REGISTER  ─── */}
      <section className="py-20 bg-surface-dark border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-pattern opacity-10 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-3">HOW TO <span className="text-primary">JOIN</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto">Getting into the arena is simple. Register online, pay at the desk, and battle.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', icon: 'search', title: 'Find Your Event', desc: 'Browse upcoming tournaments, pick your game, and check available slots.' },
              { step: '02', icon: 'how_to_reg', title: 'Register Online', desc: 'Fill out the registration form with your team details and get a confirmation code.' },
              { step: '03', icon: 'payments', title: 'Pay Entry Fee', desc: 'Pay the entry fee at the LevelUp front desk on the day of the event (cash/UPI).' },
              { step: '04', icon: 'military_tech', title: 'Compete & Win', desc: 'Show up 30 mins early, check in, and dominate. Prize awarded same day.' },
            ].map((s, i) => (
              <div key={s.step} className="relative group">
                {i < 3 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent z-0" />
                )}
                <div className="relative z-10 bg-card-dark border border-white/5 group-hover:border-primary/30 rounded-2xl p-6 transition-all group-hover:shadow-[0_0_30px_rgba(13,242,89,0.06)]">
                  <div className="text-6xl font-black text-white/5 mb-3 leading-none">{s.step}</div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-primary">{s.icon}</span>
                  </div>
                  <h3 className="text-white font-bold mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 relative overflow-hidden tourn-cta-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-bg-dark to-secondary/8" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="material-symbols-outlined text-primary text-5xl mb-4 block animate-pulse">emoji_events</span>
          <h2 className="cta-heading text-4xl md:text-6xl font-black text-white mb-4">READY TO <span className="text-primary">DOMINATE</span>?</h2>
          <p className="cta-subtext text-gray-400 mb-10 max-w-xl mx-auto text-lg">Register for an upcoming tournament today. Limited slots are available — secure yours before they're gone.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setComingSoon(true)}
              className="px-10 py-4 bg-primary text-black font-black text-base rounded hover:bg-[#ffffff] hover:text-[#000000] hover:shadow-[0_0_30px_rgba(13,242,89,0.5)] transition-all flex items-center gap-2">
              <span className="material-symbols-outlined">sports_esports</span>
              REGISTER NOW
            </button>
            <a href="tel:+915550000263" className="cta-outline-btn px-10 py-4 bg-transparent border border-white/20 text-white font-bold text-base rounded hover:bg-white/5 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined">call</span>
              CALL US
            </a>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {selectedTournament && (
        <RegistrationModal 
          tournament={selectedTournament} 
          onClose={() => setSelectedTournament(null)} 
          onFeatureUnavailable={() => {
            setSelectedTournament(null);
            setComingSoon(true);
          }}
        />
      )}

      {/* Coming Soon Toast */}
      {comingSoon && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-card-dark border border-primary/30 px-6 py-4 rounded-xl shadow-[0_0_40px_rgba(13,242,89,0.2)] flex items-center gap-3 animate-[slideUp_0.3s_ease-out]">
          <span className="material-symbols-outlined text-primary">construction</span>
          <span className="text-white font-bold text-sm whitespace-nowrap">Working on this feature currently. Stay tuned!</span>
          <button onClick={() => setComingSoon(false)} className="ml-4 text-gray-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
    </main>
  );
}
