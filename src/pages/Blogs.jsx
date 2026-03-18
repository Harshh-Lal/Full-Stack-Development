import { useState } from 'react';
import { Link } from 'react-router-dom';
import blogPosts from '../data/blogPosts';

const categoryColorMap = {
  primary: { bg: 'bg-[#0df259]/20', text: 'text-[#0df259]', border: 'border-[#0df259]/30', hoverText: 'group-hover:text-[#0df259]', borderBottom: 'border-[#0df259]' },
  secondary: { bg: 'bg-[#a855f7]/20', text: 'text-[#a855f7]', border: 'border-[#a855f7]/30', hoverText: 'group-hover:text-[#a855f7]', borderBottom: 'border-[#a855f7]' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', hoverText: 'group-hover:text-blue-400', borderBottom: 'border-blue-400' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', hoverText: 'group-hover:text-purple-400', borderBottom: 'border-purple-400' },
  yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', hoverText: 'group-hover:text-yellow-400', borderBottom: 'border-yellow-400' },
  red: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', hoverText: 'group-hover:text-red-400', borderBottom: 'border-red-400' },
};

const filters = ['All', 'Strategy', 'Gear', 'Events', 'Community'];

export default function Blogs() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredPosts = activeFilter === 'All'
    ? blogPosts
    : blogPosts.filter(p => p.category.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <main className="relative pt-24 sm:pt-32 pb-24">
      {/* Background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-bg-dark"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-150 h-150 bg-secondary/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-150 h-150 bg-primary/5 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none mb-6">
            THE INTEL HUB
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto">
            Strategies, Gear Reviews, and <span className="text-secondary font-medium">Community News</span>
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`filter-chip px-6 py-2 rounded-full border text-sm font-bold uppercase tracking-wide transition-all bg-surface-dark ${activeFilter === filter
                ? 'active'
                : 'border-white/10 text-gray-400 hover:border-primary hover:text-primary'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {filteredPosts.map((post) => {
            const colors = categoryColorMap[post.categoryColor] || categoryColorMap.primary;
            return (
              <Link to={`/blog/${post.id}`} key={post.id}>
                <article className="group relative h-64 sm:h-80 md:h-[450px] rounded-xl overflow-hidden bg-card-dark neon-border blog-card-hover cursor-pointer">
                  <div className="absolute inset-0">
                    <img alt={post.title} loading="lazy" className="w-full h-full object-cover" src={post.image} />
                  </div>
                  <div className="absolute inset-0 card-overlay backdrop-blur-[2px]"></div>
                  <div className="absolute top-6 left-6 z-20">
                    <span className={`${colors.bg} ${colors.text} text-[10px] font-bold px-3 py-1.5 rounded border ${colors.border} uppercase tracking-widest backdrop-blur-md`}>
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-8 reveal-content z-20">
                    <h3 className={`text-3xl font-bold text-white leading-tight mb-3 ${colors.hoverText} transition-colors`}>
                      {post.title}
                    </h3>
                    <p className="text-gray-300 mb-6 line-clamp-2 text-sm leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          <span>{post.readTime}</span>
                        </div>
                        <span>&bull;</span>
                        <span>{post.date}</span>
                      </div>
                      <span className={`flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wide border-b ${colors.borderBottom} pb-0.5 ${colors.hoverText} transition-colors`}>
                        Read Now <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {/* Load More */}
        <div className="mt-16 flex justify-center">
          <button className="group px-8 py-3 rounded border border-white/10 bg-surface-dark hover:border-primary transition-all flex items-center gap-2">
            <span className="text-sm font-bold text-white group-hover:text-primary tracking-widest uppercase">Load More Intel</span>
            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">expand_more</span>
          </button>
        </div>
      </div>
    </main>
  );
}
