import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import HoverMaskReveal from '../components/HoverMaskReveal';

const loungeHighlights = [
  {
    title: 'Built For Competitive Play',
    description: '40 high-performance stations, low-latency networking, and tournament-grade displays tuned for esports response times.',
    icon: 'sports_esports',
  },
  {
    title: 'Always-On Community',
    description: 'Daily ranked nights, weekend brackets, and team bootcamp slots for organized squads and creators.',
    icon: 'groups',
  },
  {
    title: 'Premium Comfort',
    description: 'Ergonomic chairs, climate-controlled halls, and dedicated streaming corners designed for long sessions.',
    icon: 'chair_alt',
  },
];

const gameLibrary = [
  {
    title: 'Valorant',
    genre: 'Tactical FPS',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    accent: 'text-primary',
  },
  {
    title: 'Counter-Strike 2',
    genre: 'Precision Shooter',
    image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=1200&q=80',
    accent: 'text-secondary',
  },
  {
    title: 'Rocket League',
    genre: 'Arcade Esports',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    accent: 'text-primary',
  },
  {
    title: 'EA FC',
    genre: 'Sports Sim',
    image: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=1200&q=80',
    accent: 'text-secondary',
  },
  {
    title: 'Call of Duty',
    genre: 'Action FPS',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1200&q=80',
    accent: 'text-primary',
  },
  {
    title: 'Tekken 8',
    genre: 'Fighting',
    image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1200&q=80',
    accent: 'text-secondary',
  },
];

const faqs = [
  {
    q: 'Do I need to bring my own peripherals?',
    a: 'No. We provide tournament-grade mice, keyboards, headsets, and controllers. You are welcome to bring your own setup as well.',
  },
  {
    q: 'Can teams book private scrim sessions?',
    a: 'Yes. Team rooms and grouped station blocks can be reserved for scrims, VOD review, and coaching sessions.',
  },
  {
    q: 'Do you host tournaments for beginners?',
    a: 'Absolutely. We run both open-entry community ladders and competitive skill-tier events every month.',
  },
  {
    q: 'What are the lounge operating hours?',
    a: 'We are open 10 AM to 2 AM on weekdays and 9 AM to 3 AM on weekends, with extended hours during major events.',
  },
];

export default function About() {
  const [openIndex, setOpenIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <main className="relative pt-20 bg-bg-dark text-white overflow-hidden">
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[60]"
      />

      <section className="relative min-h-[80vh] flex items-center border-b border-white/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-mesh-pattern opacity-30" />
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-secondary/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('/ab_bg.png')" }} />

        <div className="container mx-auto px-6 py-20 relative z-10 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-4"
            >
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-5xl md:text-7xl font-black tracking-tight"
            >
              OUR DNA
              <span className="block text-secondary">LEVEL UP LOUNGE</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-6 max-w-xl text-gray-300 text-lg leading-relaxed"
            >
              Level Up is a performance-first esports lounge built for players who care about both skill growth and game-day atmosphere. We blend high-end infrastructure, community events, and competitive culture into one arena.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="h-[420px] md:h-[500px]"
          >
            <HoverMaskReveal
              baseImage="/image.png"
              revealImage="/color_controller.png"
              title="Inside The Arena"
              className="h-full"
              revealRadius={185}
              revealScale={1}
            />
          </motion.div>
        </div>
      </section>

      <section className="py-20 border-b border-white/5 bg-surface-dark/40">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-8 items-stretch">
          <motion.article
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-white/10 bg-card-dark/90 p-8"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold mb-3">Founder / Owner</p>
            <h2 className="text-3xl font-bold">Harsh Vardhan</h2>
            <p className="text-secondary text-sm uppercase tracking-[0.18em] mt-2">Owner, Competitive Director</p>
            <p className="mt-6 text-gray-300 leading-relaxed">
              Started from local LAN nights and scaled into a full esports lounge vision. The focus has stayed the same: build a space where casual players feel welcome, and competitive players feel equipped.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <p className="text-gray-400">Launch Year</p>
                <p className="text-white font-bold">2022</p>
              </div>
              <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-4">
                <p className="text-gray-400">Community Events</p>
                <p className="text-white font-bold">120+ Hosted</p>
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-white/10 overflow-hidden bg-card-dark"
          >
            <img
              src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80"
              alt="Esports lounge owner with gaming setup"
              className="w-full h-72 object-cover"
            />
            <div className="p-8">
              <h3 className="text-xl font-bold">Lounge Info</h3>
              <p className="mt-4 text-gray-300 leading-relaxed">
                40 premium stations, dedicated console pods, 10Gbps fiber backbone, and a spectator-first stage zone. Designed for both daily play and event nights.
              </p>
            </div>
          </motion.article>
        </div>
      </section>

      <section className="py-20 bg-bg-dark border-b border-white/5">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            WHAT MAKES US DIFFERENT
          </motion.h2>
          <p className="text-gray-400 mb-10 max-w-3xl">Inspired by your Stitch About layout, this section keeps the same high-energy narrative style while adapting to your live website system.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {loungeHighlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="rounded-xl border border-white/10 bg-card-dark p-6 hover:border-primary/50 transition-colors"
              >
                <span className="material-symbols-outlined text-primary text-3xl">{item.icon}</span>
                <h3 className="text-xl font-bold mt-4">{item.title}</h3>
                <p className="mt-3 text-gray-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface-dark/40 border-b border-white/5">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            GAME LIBRARY
          </motion.h2>
          <p className="text-gray-400 mb-10 max-w-2xl">From tactical shooters to sports titles and fighting games, every station is optimized for competitive and casual comfort.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameLibrary.map((game, index) => (
              <motion.article
                key={game.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group rounded-xl overflow-hidden border border-white/10 bg-card-dark"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <p className="absolute left-4 bottom-4 text-xs uppercase tracking-[0.2em] text-gray-200">{game.genre}</p>
                </div>
                <div className="p-5">
                  <h3 className={`text-2xl font-bold ${game.accent}`}>{game.title}</h3>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-bg-dark">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-black mb-8"
          >
            FAQ
          </motion.h2>

          <div className="space-y-4">
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className="rounded-xl border border-white/10 bg-card-dark/80 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold text-lg">{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-primary text-3xl leading-none"
                    >
                      +
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 text-gray-300 leading-relaxed">{item.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
