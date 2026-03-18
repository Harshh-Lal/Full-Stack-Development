import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 max-w-xs">
            <Link to="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">sports_esports</span>
              <h2 className="text-2xl font-bold text-white">
                LEVEL<span className="text-primary">UP</span>
              </h2>
            </Link>
            <p className="text-gray-500 text-sm">
              The premier destination for esports excellence. High-performance rigs, competitive tournaments, and a community of champions.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 mt-2">
              <a className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all" href="#">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"></path></svg>
              </a>
              <a className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all" href="#">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"></path></svg>
              </a>
              <a className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all" href="#">
                <span className="material-symbols-outlined text-xl">alternate_email</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-12 sm:gap-24">
            <div>
              <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Menu</h3>
              <ul className="space-y-2">
                <li><a className="text-gray-400 hover:text-primary text-sm transition-colors" href="#">Book a PC</a></li>
                <li><a className="text-gray-400 hover:text-primary text-sm transition-colors" href="#">Pricing</a></li>
                <li><a className="text-gray-400 hover:text-primary text-sm transition-colors" href="#">Tournaments</a></li>
                <li><a className="text-gray-400 hover:text-primary text-sm transition-colors" href="#">Membership</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Support</h3>
              <ul className="space-y-2">
                <li><a className="text-gray-400 hover:text-primary text-sm transition-colors" href="#">FAQ</a></li>
                <li><a className="text-gray-400 hover:text-primary text-sm transition-colors" href="#">Contact Us</a></li>
                <li><a className="text-gray-400 hover:text-primary text-sm transition-colors" href="#">Terms of Service</a></li>
                <li><a className="text-gray-400 hover:text-primary text-sm transition-colors" href="#">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <p>&copy; 2023 Level Up Esports Lounge. All rights reserved.</p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>Systems Operational</span>
          </div>
        </div>
      </div>

      {/* Bottom promo bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-primary text-bg-dark py-2 z-50">
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-black min-w-0">
            <span className="material-symbols-outlined animate-pulse flex-shrink-0">local_offer</span>
            <span className="truncate">NEW MEMBER SPECIAL: FIRST HOUR FREE!</span>
          </div>
          <button className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-gray-800 transition-colors flex-shrink-0">
            CLAIM NOW
          </button>
        </div>
      </div>
    </footer>
  );
}
