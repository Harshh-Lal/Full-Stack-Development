import { useState } from 'react';

const galleryImages = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtC4_jPkerXcT9vsTTPToilcc-7NKoM6oQWXEF9M1SzUbJfGBJD2GvkZWN8HFsq5Vfne8cL-V032u9lwhY79UGN4Hp3LNlnPZlDbYgc2awCUMHYGN4fEtBhLWTa6dchyTzhOsrDYWQLZPE11VFWpw8HfILYGdkUVktJRMCZfsybwaN_FUIHeRZrZ1G56BUIZnboOEtJMzhVEWpwKJ79cKjH_tsdhjN8AEMSj3wuYdYi3vFwozGTzd9IXykdUSsljFnx61MybnWNr0",
    title: "The Main Arena",
    description: "40 battle stations, tournament-grade monitors, and RGB everywhere.",
    category: "Arena",
    span: "col-span-2 row-span-2",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5rBAxke71_8Q5-yB5IpnZvKs4iZJKH_EQ0ub9Hji5n0eEZKSfIl1UCZ5lJVzm2Aw_f2wmFpA5bXCuNsv2KSJdV9SYyakrE0UvMo8YMLWhRmAHCsx3paA9PuBQQjyeQpFlqW3TSkKVGOZaTfFAhcHy2xL0tyK7-crA7TIbW3l9QGB3F7KnOEiXQ0nHJNyO5UZZITwTpefAz5abFCyN9IiTHeLEn0Gt1TqPEg4P9ycpvmxQZrdjlMJGtIv7ALh2MfGnrsyjWVdO7TE",
    title: "RTX 4090 Rigs",
    description: "Every station powered by top-tier hardware.",
    category: "Hardware",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXJ6YyzbiepQBwWVtfweeD6bBSAgoQN7UT__B2vodKYeFkDcggn9xqjS0kMAvhRMbl8JSaxW3RCAeDentgA_p0zFb6vLSJDy1PNsr2p1MbXwHkqcgIiQ0YL7dEmbaxTO1009BEyXBwyFAEthWK2OGP0Qlob8wIdhzWcJRhEaz7aRbIN6y9JQAqZ3hw94KPPJ2mEUET7LMtCqTHLJ51kdNrxPu1p39QaDcaMchnQ-EkUIoV8X426jZ8I3DADngeJqADJc2o1q27YKo",
    title: "Tournament Nights",
    description: "Weekly tournaments with massive prize pools.",
    category: "Events",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBL3NfsC1wk5qSGR2emDrdLfrxBb4GqqaaC0OIh3HPsAyPdhGDot7TyTUK0-GFZmQ7rmSRNNztAG2JrpqRgc2Uukl7dDNnElXJdroTC4-IliiGogWvMdRpxfAwgpdVMavfMjbcqxRnCTDEWWY8pae_doJ1_kUarTFEPyADobgbXH6kesNiKeOWFNpw4ayxUUGAAI3guVwhux-JuFKot5SQd7MAP3wUAlKfJ48f-1VBOirTc6d3oIWbh4IFZyawpV2dRds-4S909tNI",
    title: "Console Chill Zone",
    description: "PS5 & Xbox Series X on 4K OLED screens.",
    category: "Lounge",
    span: "col-span-1 row-span-2",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcemo_CuZZwrSXBt0_E-LmDR490T5GLTZNOsjwmI_26r3ZlQwOpreawlD1OVXlgycodMFaPdKics03x7dCJauCGXuLgCx9EP8fZBY1z9xmsMd1SpFecWgyg52Asd5wKpSkkFJNaN-U0PYfmnBH2WJ3l1GncahZroE3355xpvN2OSXkEzeCKsgYsLuwEyrtGDCkUzrLDnwM2hxhPWSpIF7Lo2FMnUsi8Eu-9G68PpSscBtSY2rKjDTKOe4oc8sMuTvJNeJOq3mXmtU",
    title: "Premium Peripherals",
    description: "Custom mechs, Holy Pandas, and gasket-mount boards.",
    category: "Hardware",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3frtKvMp1dVxYcwtTn6LT-3piAAyLcCs6I2acwbEKqHIjQc5LQ8KHGWa8u7a3_xw40MiYQ9MEFxNinZm7zCFu1PbmSURl_FrcdQxnpsonNco0lUVTqh5HAvGaPRksScUTBWPKvo_qPMMvmhtXrMC5zfsUoVG4g2mSm3KUBhnqidEj1v0w0Cau0HgHbiTdCC2nPVlcEZY-vvB4Dh6tzCcf6LOr15ONRTJqjAosOt1ATnZ7AnVR7SsJgCw0z5Q0v882dC1gfqnfvOY",
    title: "Pro Controllers",
    description: "SCUF, DualSense Edge — adjustable triggers, back paddles.",
    category: "Hardware",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLUENPufRAH63oVmI98CmYxUbfy7fnia35EBfBUAr8a6CgoLYq2ZmT0UW4q05hJhqI44GFvreB_ANpqe-kuKcw_n0zvTl1P3tVKM5chFqLThNPfLhW5LedosyWwginOKB-jHrZqUnKLWSe0a09SZPsNxi-gUV1ySuSdg-HLLxg6jVQp4fvgACxI5frXJGjbUT4HItmDu_2PwRKuTawDvBHmcuc--02kajZbrWmnNzldgQ-KTcaj-BrWWA8XN1ZV7-Vot_ErIhn82M",
    title: "VR Experience",
    description: "Step into the game with our dedicated VR pods.",
    category: "Experiences",
    span: "col-span-2 row-span-1",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3iJFDQLQGJaDYlyESSrQYDe8vKxaI5fL2tj5vIQw3EWpDpsQK-rpaNU5xSt5eRil3y-WQiYI7EJkOwHyfEjqgNfChn0a3IrcnaF-jAXdWWoTKq9x-zdkGsIw2DTCc9IhNDg0a6-QwwqTorg1VtJRplHDh0MeRka9K63eX-Q70f1cnib_zSZeN_yPdkErpShS-oe62uJQ6-VDcPeAJuEhOSTCbSPXW_H5NseJSHwHbv2jW9QlfjIbVRRoUPCmk9gAAx1YW3WBoYgM",
    title: "The Lounge Vibe",
    description: "Ambient lighting, premium sound, and the smell of victory.",
    category: "Lounge",
    span: "col-span-1 row-span-1",
  },
];

const categories = ['All', 'Arena', 'Hardware', 'Events', 'Lounge', 'Experiences'];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const filtered = activeFilter === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeFilter);

  return (
    <>
      <main className="relative pt-28 pb-24 min-h-screen">
        {/* Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-bg-dark"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-200 bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 w-150 h-150 bg-secondary/8 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 max-w-7xl">
          {/* Hero header */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/40 to-transparent"></div>
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary">Level Up Esports Lounge</span>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/40 to-transparent"></div>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white text-center tracking-tighter leading-none mb-6">
              THE <span className="text-primary">GALLERY</span>
            </h1>
            <p className="text-center text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Step inside. See the rigs, the arena, the vibe — captured in pixels.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all border ${
                  activeFilter === cat
                    ? 'bg-primary/10 border-primary text-primary shadow-[0_0_12px_rgba(13,242,89,0.2)]'
                    : 'bg-surface-dark border-white/10 text-gray-400 hover:border-primary/50 hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry-style grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]">
            {filtered.map((img, idx) => (
              <div
                key={img.title}
                className={`gallery-card group relative rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-primary/40 transition-all duration-500 ${img.span}`}
                onClick={() => setLightbox(idx)}
              >
                {/* Image */}
                <img
                  alt={img.title}
                  src={img.src}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>

                {/* Category pill — top left */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                    {img.category}
                  </span>
                </div>

                {/* Counter — top right */}
                <div className="absolute top-4 right-4 z-10 text-white/30 text-xs font-mono">
                  {String(idx + 1).padStart(2, '0')}
                </div>

                {/* Info — bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors duration-300">
                    {img.title}
                  </h3>
                  <p className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 max-w-sm">
                    {img.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    <span className="text-xs text-primary font-bold uppercase tracking-wider">View Full</span>
                    <span className="material-symbols-outlined text-primary text-sm">open_in_full</span>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute bottom-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-2 right-2 w-8 h-px bg-primary"></div>
                  <div className="absolute bottom-2 right-2 w-px h-8 bg-primary"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '40+', label: 'Battle Stations', icon: 'desktop_windows' },
              { value: '10Gbps', label: 'Fiber Internet', icon: 'speed' },
              { value: '4K', label: 'OLED Screens', icon: 'monitor' },
              { value: '24/7', label: 'Open Always', icon: 'schedule' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-xl bg-surface-dark/50 border border-white/5 hover:border-primary/30 transition-colors group">
                <span className="material-symbols-outlined text-3xl text-primary mb-3 block group-hover:scale-110 transition-transform">{stat.icon}</span>
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Lightbox overlay */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-100 bg-black/95 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
            onClick={() => setLightbox(null)}
          >
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>

          {/* Prev */}
          <button
            className="absolute left-4 md:left-8 text-white/40 hover:text-primary transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((lightbox - 1 + filtered.length) % filtered.length);
            }}
          >
            <span className="material-symbols-outlined text-5xl">chevron_left</span>
          </button>

          {/* Image */}
          <div className="max-w-5xl max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              alt={filtered[lightbox].title}
              src={filtered[lightbox].src}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-white">{filtered[lightbox].title}</h3>
              <p className="text-sm text-gray-400 mt-1">{filtered[lightbox].description}</p>
              <div className="flex items-center justify-center gap-4 mt-3">
                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
                  {filtered[lightbox].category}
                </span>
                <span className="text-white/40 text-sm font-mono">
                  {String(lightbox + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Next */}
          <button
            className="absolute right-4 md:right-8 text-white/40 hover:text-primary transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((lightbox + 1) % filtered.length);
            }}
          >
            <span className="material-symbols-outlined text-5xl">chevron_right</span>
          </button>
        </div>
      )}
    </>
  );
}
