import React from 'react';
import { motion } from 'framer-motion';
import { Wind, ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const NotFound = () => {
  return (
    <>
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." path="/404" />
      <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-dot-grid opacity-[0.15] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10 px-6"
        >
          {/* Animated icon */}
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 mx-auto mb-8 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center"
          >
            <Wind size={40} className="text-primary" />
          </motion.div>

          {/* 404 Number */}
          <h1 className="text-[10rem] lg:text-[14rem] font-black text-slate-100 leading-none tracking-tighter select-none">
            404
          </h1>
          
          <div className="-mt-16 relative z-10">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Signal <span className="text-primary italic">Lost.</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium mb-12 max-w-md mx-auto leading-relaxed">
              The page you're looking for has been relocated or doesn't exist in our system.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-950/10 active:scale-[0.98]"
              >
                <Home size={16} />
                Return Home
              </Link>
              <button 
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
              >
                <ArrowLeft size={16} />
                Go Back
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;
