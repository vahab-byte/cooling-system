import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import ChatWidget from '../components/common/ChatWidget';
import WhatsAppButton from '../components/common/WhatsAppButton';
import ScrollToTop from '../components/common/ScrollToTop';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-black antialiased selection:bg-primary selection:text-white relative overflow-hidden">
      {/* Background Intelligence Layer */}
      <div className="absolute inset-0 bg-dot-grid opacity-[0.4] pointer-events-none" />
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <ScrollToTop />
      <Header />
      <main className="relative z-10">
        <Outlet />
      </main>
      <WhatsAppButton />
      <ChatWidget />
      {/* Footer omitted for Dashboard perfection */}
      <footer className="py-8 bg-white border-t border-slate-100 mt-auto">
         <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
               © 2026 ArcticFresh Pro Dashboard <span className="mx-2">|</span> Operational Systems
            </div>
            <div className="flex gap-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">
               <span className="cursor-pointer hover:text-primary transition-colors">Privacy</span>
               <span className="cursor-pointer hover:text-primary transition-colors">Compliance</span>
               <span className="cursor-pointer hover:text-primary transition-colors">System Status</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
