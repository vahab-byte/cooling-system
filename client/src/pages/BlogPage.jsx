import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { blogPosts } from '../data';
import { Calendar, User, ArrowRight, BookOpen, Clock, Sparkles, Filter, ChevronRight, Zap } from 'lucide-react';
import Container from '../components/ui/Container';

const CATEGORIES = ['All', 'Commercial', 'Residential', 'Maintenance', 'Energy', 'Industry'];

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const featuredPost = blogPosts[0];
  const regularPosts = filteredPosts.filter(p => p.id !== (activeCategory === 'All' ? featuredPost.id : null));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-32 bg-white relative overflow-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-dot-grid opacity-[0.3] pointer-events-none" />
      
      <Container>
        {/* Cinematic Hero Section */}
        <div className="relative pt-20 pb-24 border-b border-slate-100 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 bg-slate-950 text-white rounded-full">
              <Zap size={14} className="text-primary fill-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Intelligence</span>
            </div>
            
            <h1 className="text-6xl lg:text-[9rem] font-black text-slate-950 mb-10 tracking-tighter leading-[0.85] uppercase">
              Arctic <br />
              <span className="text-primary italic">Insights.</span>
            </h1>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
               <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                 Strategic intelligence on high-performance cooling, thermodynamic precision, and the evolution of climate control protocols.
               </p>
               
               {/* Category Filter HUD */}
               <div className="flex flex-wrap gap-2">
                 {CATEGORIES.map((cat) => (
                   <button
                     key={cat}
                     onClick={() => setActiveCategory(cat)}
                     className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 border ${
                       activeCategory === cat 
                       ? 'bg-slate-950 text-white border-slate-950 shadow-xl' 
                       : 'bg-white text-slate-400 border-slate-100 hover:border-primary hover:text-primary'
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>
            </div>
          </motion.div>
        </div>

        {/* Featured Strategic Post */}
        {activeCategory === 'All' && (
           <motion.div 
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mb-32 group cursor-pointer"
           >
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                 <div className="relative aspect-[16/10] lg:aspect-square overflow-hidden rounded-[3rem] shadow-2xl border border-slate-100">
                    <img 
                      src={featuredPost.img} 
                      alt={featuredPost.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-all duration-700" />
                    <div className="absolute top-10 left-10">
                       <span className="px-6 py-3 bg-white/90 backdrop-blur-xl border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-slate-950 rounded-2xl">
                          Featured Insight
                       </span>
                    </div>
                 </div>
                 
                 <div className="space-y-8">
                    <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                       <div className="flex items-center gap-2"><Calendar size={14} className="text-primary" /> {featuredPost.date}</div>
                       <div className="w-1 h-1 rounded-full bg-slate-200" />
                       <div className="flex items-center gap-2"><Clock size={14} className="text-primary" /> {featuredPost.readTime}</div>
                    </div>
                    
                    <h2 className="text-5xl lg:text-7xl font-black text-slate-950 leading-[0.95] tracking-tighter group-hover:text-primary transition-colors">
                       {featuredPost.title}
                    </h2>
                    
                    <p className="text-xl text-slate-500 font-medium leading-relaxed">
                       {featuredPost.desc}
                    </p>
                    
                    <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
                             <User size={18} className="text-slate-950" />
                          </div>
                          <div>
                             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expert Attribution</div>
                             <div className="text-xs font-black text-slate-950">{featuredPost.expert}</div>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4 text-slate-950 group-hover:translate-x-3 transition-transform">
                          <span className="text-xs font-black uppercase tracking-[0.3em]">Access Dossier</span>
                          <ArrowRight size={20} className="text-primary" />
                       </div>
                    </div>
                 </div>
              </div>
           </motion.div>
        )}

        {/* Insight Matrix Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
          <AnimatePresence mode="popLayout">
            {(activeCategory === 'All' ? regularPosts : filteredPosts).map((post, i) => (
              <motion.article 
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="flex flex-col group cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] mb-10 border border-slate-100 shadow-premium">
                  <img 
                    src={post.img || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800"} 
                    alt={post.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-all duration-700" />
                  
                  <div className="absolute top-8 left-8">
                     <div className="px-4 py-2 bg-white/90 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 rounded-xl">
                        {post.category}
                     </div>
                  </div>

                  <div className="absolute bottom-10 left-10 right-10 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                     <div className="bg-slate-950 p-5 rounded-2xl text-white flex items-center justify-between shadow-2xl">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Read Protocol</span>
                        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                           <ChevronRight size={16} className="text-white" />
                        </div>
                     </div>
                  </div>
                </div>

                <div className="space-y-6 px-4">
                  <div className="flex items-center gap-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2"><Calendar size={12} className="text-primary" /> {post.date}</div>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <div className="flex items-center gap-2"><Clock size={12} className="text-primary" /> {post.readTime}</div>
                  </div>
                  
                  <h3 className="text-3xl font-black text-slate-950 tracking-tighter leading-tight group-hover:text-primary transition-colors duration-300">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-400 font-medium text-sm leading-relaxed line-clamp-2">
                    {post.desc}
                  </p>
                  
                  <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
                     <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Authored By</div>
                     <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{post.expert.split(',')[0]}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Global Operational Updates Callout */}
        <section className="mt-40 relative">
           <div className="bg-slate-950 rounded-[4rem] p-16 lg:p-32 text-center relative overflow-hidden group">
              {/* Animated Glow Units */}
              <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
              
              <div className="relative z-10 max-w-3xl mx-auto">
                 <div className="inline-flex items-center gap-3 mb-10 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                    <Sparkles size={14} className="text-primary" />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Strategic Access</span>
                 </div>
                 <h2 className="text-5xl lg:text-8xl font-black text-white mb-16 tracking-tighter leading-[0.95] uppercase">
                    Sync with <br />
                    <span className="text-primary italic">The Arctic.</span>
                 </h2>
                 <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-12">
                    <input 
                      type="email" 
                      required
                      placeholder="ENTER PROTOCOL EMAIL" 
                      className="flex-1 bg-white/5 border border-white/10 px-8 py-5 text-xs font-black text-white placeholder:text-white/20 rounded-[2rem] outline-none focus:border-primary transition-all uppercase tracking-widest"
                    />
                    <button className="px-12 py-5 bg-primary text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:-translate-y-2 transition-all duration-500">Subscribe</button>
                 </form>
                 <div className="flex items-center justify-center gap-6">
                    <div className="h-[1px] w-12 bg-white/10" />
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Operational Updates Only. Zero Noise.</p>
                    <div className="h-[1px] w-12 bg-white/10" />
                 </div>
              </div>
           </div>
        </section>

      </Container>
    </motion.div>
  );
};

export default BlogPage;
