import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-primary/20 rounded flex items-center justify-center border border-primary/50 group-hover:border-primary transition-colors">
            <span className="material-symbols-outlined text-primary text-2xl">sports_esports</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">
              LEVEL<span className="text-primary">UP</span>
            </h1>
            <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">Esports Lounge</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors uppercase tracking-wide ${
              isActive('/') ? 'text-primary font-bold border-b-2 border-primary pb-0.5' : 'text-gray-300 hover:text-primary'
            }`}
          >
            Home
          </Link>
          <Link
            to="/blogs"
            className={`text-sm font-medium transition-colors uppercase tracking-wide ${
              location.pathname.startsWith('/blogs') || location.pathname.startsWith('/blog/')
                ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
                : 'text-gray-300 hover:text-primary'
            }`}
          >
            Intel Hub
          </Link>
          <Link
            to="/gallery"
            className={`text-sm font-medium transition-colors uppercase tracking-wide ${
              isActive('/gallery')
                ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
                : 'text-gray-300 hover:text-primary'
            }`}
          >
            Gallery
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors uppercase tracking-wide ${
              isActive('/about')
                ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
                : 'text-gray-300 hover:text-primary'
            }`}
          >
            About
          </Link>
        </nav>

        {/* Status */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-dark/80 border border-primary/30">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="text-xs font-bold text-primary tracking-wide">12/40 PCs ONLINE</span>
          </div>
          <button className="md:hidden text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
