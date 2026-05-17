import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, BookOpen, ChevronRight, Loader2, Eye } from 'lucide-react';
import Container from '../components/ui/Container';
import SEO from '../components/common/SEO';
import { blogService } from '../services/api';

const BlogArticle = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await blogService.getPostBySlug(slug);
        setPost(data);
        setRelatedPosts(data.relatedPosts || []);
      } catch (err) {
        setError('Article not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: post.title, text: post.excerpt, url });
    } else {
      navigator.clipboard.writeText(url);
      // Could use toast here
    }
  };

  // Simple markdown renderer for basic formatting
  const renderContent = (content) => {
    if (!content) return null;
    
    return content.split('\n').map((line, i) => {
      // Headings
      if (line.startsWith('### ')) return <h3 key={i} className="text-2xl font-bold text-slate-900 mt-10 mb-4 tracking-tight">{line.replace('### ', '')}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-3xl font-bold text-slate-900 mt-12 mb-6 tracking-tight">{line.replace('## ', '')}</h2>;
      
      // Blockquotes
      if (line.startsWith('> ')) return (
        <blockquote key={i} className="border-l-4 border-primary pl-6 py-2 my-8 text-lg italic text-slate-600 bg-slate-50/50 rounded-r-xl p-6">
          {line.replace('> ', '')}
        </blockquote>
      );
      
      // Table rows (basic)
      if (line.startsWith('|') && !line.startsWith('|---')) {
        const cells = line.split('|').filter(Boolean).map(c => c.trim());
        return (
          <div key={i} className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100 text-sm">
            {cells.map((cell, ci) => (
              <span key={ci} className={ci === 0 ? 'font-bold text-slate-900' : 'text-slate-600'}>{cell}</span>
            ))}
          </div>
        );
      }
      if (line.startsWith('|---')) return null;
      
      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        const content = line.replace(/^\d+\.\s/, '');
        // Handle bold markers
        const parts = content.split(/\*\*(.*?)\*\*/g);
        return (
          <li key={i} className="text-slate-600 leading-relaxed mb-3 ml-6 list-decimal">
            {parts.map((part, pi) => pi % 2 === 1 ? <strong key={pi} className="text-slate-900">{part}</strong> : part)}
          </li>
        );
      }
      
      // Bullet points
      if (line.startsWith('- ')) {
        const content = line.replace('- ', '');
        const parts = content.split(/\*\*(.*?)\*\*/g);
        return (
          <li key={i} className="text-slate-600 leading-relaxed mb-2 ml-6 list-disc">
            {parts.map((part, pi) => pi % 2 === 1 ? <strong key={pi} className="text-slate-900">{part}</strong> : part)}
          </li>
        );
      }
      
      // Empty lines
      if (line.trim() === '') return <br key={i} />;
      
      // Regular paragraphs with bold support
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="text-slate-600 text-lg leading-relaxed mb-4">
          {parts.map((part, pi) => pi % 2 === 1 ? <strong key={pi} className="text-slate-900">{part}</strong> : part)}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-primary mx-auto mb-4" />
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 animate-pulse">Loading Article...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <BookOpen size={48} className="text-slate-200 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Article Not Found</h2>
          <p className="text-slate-500 mb-8">This article may have been moved or deleted.</p>
          <Link to="/blog" className="px-8 py-3 bg-slate-950 text-white rounded-xl text-sm font-bold hover:bg-primary transition-all">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.cover_image}
        type="article"
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-32 bg-white">
        <Container>
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-12 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/blog" className="hover:text-slate-900 transition-colors">Blog</Link>
            <ChevronRight size={12} />
            <span className="text-primary">{post.category}</span>
          </div>

          {/* Article Header */}
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              {/* Category badge */}
              <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 bg-slate-950 text-white rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{post.category}</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black text-slate-950 mb-8 tracking-tighter leading-[0.95]">
                {post.title}
              </h1>

              <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
                {post.excerpt}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-8 pb-10 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
                    {post.author_avatar ? (
                      <img src={post.author_avatar} alt={post.author_name} className="w-full h-full rounded-2xl object-cover" />
                    ) : (
                      <User size={18} className="text-slate-950" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{post.author_name}</div>
                    {post.author_role && (
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.author_role}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-primary" />
                    {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-primary" />
                    {post.read_time_minutes} min read
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye size={14} className="text-primary" />
                    {(post.views || 0).toLocaleString()} views
                  </div>
                </div>

                <button 
                  onClick={handleShare}
                  className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-primary hover:text-white hover:border-primary transition-all"
                >
                  <Share2 size={14} /> Share
                </button>
              </div>
            </motion.div>

            {/* Cover Image */}
            {post.cover_image && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="my-12 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl"
              >
                <img 
                  src={post.cover_image} 
                  alt={post.title}
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                  loading="lazy"
                />
              </motion.div>
            )}

            {/* Article Content */}
            <motion.article 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="prose prose-lg max-w-none py-8"
            >
              {renderContent(post.content)}
            </motion.article>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-8 border-t border-slate-100 mt-12">
                {post.tags.map((tag, i) => (
                  <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-32 pt-16 border-t border-slate-100">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary block mb-2">Continue Reading</span>
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Related <span className="text-primary italic">Articles.</span></h3>
                </div>
                <Link to="/blog" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center gap-2">
                  View All <ChevronRight size={14} />
                </Link>
              </div>
              
              <div className="grid md:grid-cols-3 gap-10">
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} to={`/blog/${rp.slug}`} className="group">
                    <div className="aspect-[16/10] overflow-hidden rounded-2xl mb-6 border border-slate-100">
                      <img 
                        src={rp.cover_image || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800'} 
                        alt={rp.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-3">
                      <Calendar size={12} className="text-primary" />
                      {new Date(rp.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      {rp.read_time_minutes} min
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-primary transition-colors leading-tight">
                      {rp.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog CTA */}
          <div className="text-center mt-24">
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-xl"
            >
              <ArrowLeft size={16} />
              All Articles
            </Link>
          </div>
        </Container>
      </motion.div>
    </>
  );
};

export default BlogArticle;
