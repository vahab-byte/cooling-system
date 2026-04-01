import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, User, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-12 lg:right-12 z-[100] flex flex-col items-end group">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-[90vw] sm:w-[420px] h-[650px] mb-8 flex flex-col bg-[#020617]/95 backdrop-blur-3xl rounded-[3rem] overflow-hidden shadow-[0_50px_120px_rgba(0,0,0,0.8)] border border-white/10"
          >
            {/* SaaS Header */}
            <div className="p-10 bg-white/[0.03] border-b border-white/10 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full blur-3xl opacity-50" />
              <div className="flex items-center gap-5 relative z-10">
                <div className="relative">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-primary flex items-center justify-center text-white shadow-[0_0_40px_rgba(59,130,246,0.6)] group-hover:scale-105 transition-transform">
                    <ShieldCheck size={32} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-[#020617] animate-pulse" />
                </div>
                <div>
                  <div className="font-black text-white text-xl tracking-tight leading-none mb-2">Concierge Elite</div>
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] leading-none">Ops Intelligence Active</div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all hover:rotate-90 duration-500"
              >
                <X size={24} />
              </button>
            </div>

            {/* Tactical Messages Area */}
            <div className="flex-1 p-10 space-y-8 overflow-y-auto custom-scrollbar relative">
               <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />
              <div className="flex flex-col gap-3 max-w-[85%] relative z-10">
                <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] rounded-bl-none text-blue-100/60 font-medium leading-relaxed text-base shadow-xl">
                  Welcome to ArcticFresh Elite Operations. How may we optimize your comfort environment today? ❄️
                </div>
                <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em] ml-2">System · Just Now</span>
              </div>
            </div>

            {/* Precision Input Area */}
            <div className="p-8 bg-white/[0.015] border-t border-white/5 flex gap-4">
              <input 
                type="text" 
                placeholder="Describe requirement..."
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 text-white text-sm outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-blue-100/10 font-medium"
              />
              <button className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-all shadow-[0_15px_45px_rgba(59,130,246,0.5)] group/send hover:-translate-y-1">
                <Send size={24} className="group-hover/send:translate-x-1 group-hover/send:-translate-y-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Toggle (Dominant SaaS Style) */}
      <motion.button
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 lg:w-20 lg:h-20 rounded-[2.2rem] flex items-center justify-center shadow-[0_25px_65px_rgba(0,0,0,0.6)] transition-all duration-700 border ${
          isOpen 
          ? 'bg-white/[0.05] border-white/10 text-white rotate-[180deg]' 
          : 'bg-primary border-primary text-white shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:shadow-[0_0_90px_rgba(59,130,246,0.8)]'
        }`}
      >
        {isOpen ? <X size={36} /> : <MessageCircle size={40} />}
      </motion.button>
    </div>
  );
};

export default ChatWidget;
