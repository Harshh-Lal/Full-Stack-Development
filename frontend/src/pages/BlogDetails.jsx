import { useParams, Link } from 'react-router-dom';
import blogPosts from '../data/blogPosts';

export default function BlogDetails() {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <main className="relative pt-24 sm:pt-32 pb-24 min-h-screen">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Article Not Found</h1>
          <Link to="/blogs" className="text-primary hover:underline font-medium">Back to Intel Hub</Link>
        </div>
      </main>
    );
  }

  const relatedPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      {/* Social Float Sidebar */}
      <aside className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-4">
        <a aria-label="Share on Discord" className="w-10 h-10 rounded-full bg-surface-dark border border-white/10 flex items-center justify-center text-gray-400 hover:text-secondary hover:border-secondary transition-all hover:scale-110" href="#">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"></path></svg>
        </a>
        <a aria-label="Share on X" className="w-10 h-10 rounded-full bg-surface-dark border border-white/10 flex items-center justify-center text-gray-400 hover:text-secondary hover:border-secondary transition-all hover:scale-110" href="#">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
        </a>
        <a aria-label="Copy Link" className="w-10 h-10 rounded-full bg-surface-dark border border-white/10 flex items-center justify-center text-gray-400 hover:text-secondary hover:border-secondary transition-all hover:scale-110" href="#">
          <span className="material-symbols-outlined text-lg">link</span>
        </a>
      </aside>

      <main className="relative pt-24 sm:pt-32 pb-24 min-h-screen">
        {/* Background effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-bg-dark"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-0 right-0 w-125 h-125 bg-secondary/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-125 h-125 bg-primary/5 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3"></div>
        </div>

        <article className="relative z-10 container mx-auto px-6 max-w-225">
          {/* Article Header */}
          <header className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded border border-secondary/30 bg-secondary/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-xs font-bold tracking-widest uppercase text-secondary">The Intel Hub</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-8">
              {post.title.split(' ').slice(0, -2).join(' ')}{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-purple-400">
                {post.title.split(' ').slice(-2).join(' ')}
              </span>
            </h1>
            <div className="flex items-center justify-center gap-4 sm:gap-6 border-t border-b border-white/5 py-6 flex-wrap gap-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-primary p-0.5">
                  <img alt={post.author} loading="lazy" className="w-full h-full object-cover rounded-full" src={post.authorAvatar} />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-sm">By {post.author}</div>
                  <div className="text-secondary text-xs font-medium">{post.authorRole}</div>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
              <div className="text-left">
                <div className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Published</div>
                <div className="text-white font-medium text-sm">{post.date}</div>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
              <div className="px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-[0_0_10px_rgba(13,242,89,0.2)]">
                {post.readTime.toUpperCase()}
              </div>
            </div>
          </header>

          {/* Hero Image */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden neon-glow-purple mb-16 group">
            <div className="absolute inset-0 bg-secondary/20 z-10 mix-blend-overlay"></div>
            <img alt={post.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={post.image} />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-bg-dark to-transparent z-20"></div>
          </div>

          {/* Article Content */}
          <div className="article-content max-w-[70ch] mx-auto text-gray-300">
            <p className="lead text-xl text-gray-300 font-light mb-8">{post.content.lead}</p>

            {post.content.sections.map((section, idx) => (
              <div key={idx}>
                {section.isH3 ? (
                  <h3>{section.heading}</h3>
                ) : (
                  <h2>{section.heading}</h2>
                )}

                {section.paragraphs?.map((p, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
                ))}

                {section.proTip && (
                  <div className="pro-tip-block">
                    <div className="flex items-center gap-2 mb-2 text-primary font-bold uppercase text-xs tracking-wider">
                      <span className="material-symbols-outlined text-sm">lightbulb</span> Pro Tip
                    </div>
                    <p className="text-lg text-white mb-0">{section.proTip}</p>
                  </div>
                )}

                {section.list && (
                  <ul className="list-disc pl-5 space-y-2 marker:text-primary mb-8">
                    {section.list.map((item, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </ul>
                )}

                {section.callout && (
                  <div className="my-12 p-6 rounded-xl bg-surface-dark border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
                    <h4 className="text-white font-bold text-lg mb-2">{section.callout.title}</h4>
                    <p className="text-sm text-gray-400 mb-4">{section.callout.text}</p>
                    <button className="px-6 py-2 bg-primary text-bg-dark font-bold text-sm rounded hover:bg-[#ffffff] hover:text-[#000000] hover:shadow-[0_0_20px_rgba(13,242,89,0.5)] transition-all">
                      {section.callout.buttonText}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="max-w-[70ch] mx-auto mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-2">
            <span className="text-gray-500 text-sm mr-2">Tags:</span>
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-surface-dark border border-white/10 text-xs text-gray-300 hover:border-primary hover:text-primary transition-colors cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        </article>
      </main>

      {/* ─── RELATED INTEL ─── */}
      <section className="py-20 bg-surface-dark border-t border-white/5 relative">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-white">Related <span className="text-primary">Intel</span></h2>
            <Link to="/blogs" className="text-sm text-gray-400 hover:text-primary flex items-center gap-1 transition-colors">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((rp) => {
              const colorMap = {
                primary: { bg: 'bg-[#0df259]/20', text: 'text-[#0df259]', border: 'border-[#0df259]/30' },
                secondary: { bg: 'bg-[#a855f7]/20', text: 'text-[#a855f7]', border: 'border-[#a855f7]/30' },
                blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
                purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
                yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
                red: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
              };
              const c = colorMap[rp.categoryColor] || colorMap.primary;
              return (
                <Link to={`/blog/${rp.id}`} key={rp.id} className="group relative h-64 md:h-[340px] rounded-lg overflow-hidden bg-card-dark neon-border card-hover-reveal block">
                  <div className="absolute inset-0">
                    <img alt={rp.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={rp.image} />
                    <div className="absolute inset-0 bg-linear-to-t"></div>
                  </div>
                  <div className="absolute top-0 left-0 p-6 w-full">
                    <span className={`${c.bg} ${c.text} text-[10px] font-bold px-2 py-1 rounded border ${c.border} uppercase tracking-wide`}>
                      {rp.category}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-surface-dark border-t border-white/10 reveal-content">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white leading-tight group-hover:text-primary transition-colors">{rp.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{rp.date.replace(', 2023', '')}</span> &bull; <span>{rp.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
