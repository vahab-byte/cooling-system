import React from 'react';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  return (
    <motion.a 
      href="https://wa.me/919999999999" 
      target="_blank" 
      rel="noopener noreferrer"
      initial={{ x: -100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-[100px] right-6 lg:bottom-[160px] lg:right-12 z-[100] group"
    >
      <div className="relative w-16 h-16 lg:w-20 lg:h-20 bg-[#25D366] text-white rounded-[2rem] flex items-center justify-center shadow-[0_20px_60px_rgba(37,211,102,0.4)] hover:shadow-[0_0_80px_rgba(37,211,102,0.6)] transition-all duration-700 border border-white/20">
        <MessageSquare size={32} fill="currentColor" className="lg:hidden" />
        <MessageSquare size={38} fill="currentColor" className="hidden lg:block shadow-sm" />
        
        {/* Animated Aura */}
        <div className="absolute inset-0 rounded-[2rem] border-[3px] border-white/30 animate-ping opacity-10" />
        
        <div className="absolute left-full ml-8 px-5 py-2.5 bg-[#020617]/80 backdrop-blur-3xl border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap shadow-2xl opacity-0 group-hover:opacity-100 -translate-x-6 group-hover:translate-x-0 transition-all duration-500 pointer-events-none hidden lg:block">
           Priority Channel
        </div>
      </div>
    </motion.a>
  );
};

export default WhatsAppButton;
