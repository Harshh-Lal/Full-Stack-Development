import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/tournament', label: 'Tournament' },
  { to: '/blogs', label: 'Intel Hub' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
];

export default function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  
  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Apply theme to HTML and save
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const isActive = (path) => location.pathname === path;
  const isBlogActive = (path) =>
    location.pathname.startsWith('/blogs') || location.pathname.startsWith('/blog/');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/20 rounded flex items-center justify-center border border-primary/50 group-hover:border-primary transition-colors">
            <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">sports_esports</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-none">
              LEVEL<span className="text-primary">UP</span>
            </h1>
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-gray-400 uppercase">Esports Lounge</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-medium transition-colors uppercase tracking-wide ${to === '/blogs'
                  ? isBlogActive(to)
                    ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
                    : 'text-gray-300 hover:text-primary'
                  : isActive(to)
                    ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
                    : 'text-gray-300 hover:text-primary'
                }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-dark/80 border border-primary/30">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="text-xs font-bold text-primary tracking-wide whitespace-nowrap">12/40 PCs ONLINE</span>
          </div>
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-all ml-1"
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined text-sm sm:text-base">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Hamburger */}
          <button
            className="md:hidden text-white p-1 rounded hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <nav className="flex flex-col px-4 pb-4 pt-2 gap-1 border-t border-white/5 bg-bg-dark/95 backdrop-blur-md">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${to === '/blogs'
                  ? isBlogActive(to)
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-300 hover:bg-white/5 hover:text-primary'
                  : isActive(to)
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-300 hover:bg-white/5 hover:text-primary'
                }`}
            >
              {label}
            </Link>
          ))}
          {/* Mobile PC status */}
          <div className="flex sm:hidden items-center gap-2 px-4 py-3 mt-1 rounded-full bg-bg-dark/80 border border-primary/30 self-start">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="text-xs font-bold text-primary tracking-wide">12/40 PCs ONLINE</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
