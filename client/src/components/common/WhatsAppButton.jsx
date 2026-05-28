import React from 'react';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/916353774046"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[104px] right-6 lg:bottom-[136px] lg:right-12 z-40 group"
    >
      <div className="relative w-14 h-14 lg:w-16 lg:h-16 bg-[#25D366]/10 backdrop-blur-xl border border-[#25D366]/30 text-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-[#25D366]/20 transition-all duration-500 overflow-visible">
        <MessageSquare size={24} fill="currentColor" className="lg:hidden" />
        <MessageSquare size={28} fill="currentColor" className="hidden lg:block" />

        {/* Refined Aura */}
        <div className="absolute inset-0 rounded-full border border-[#25D366]/20 animate-ping opacity-20 pointer-events-none" />

        {/* Professional Label */}
        <div className="absolute right-full mr-4 px-4 py-2 bg-white border border-slate-100 text-slate-900 rounded-xl text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 pointer-events-none">
          Message Support
        </div>
      </div>
    </motion.a>
  );
};

export default WhatsAppButton;
