import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X, PhoneCall, MessageSquare, Clock, ChevronRight } from 'lucide-react';

const phones = [
  { label: 'Line 1 — Main', number: '6353774046', display: '+91 63537 74046', available: true },
  { label: 'Line 2 — Support', number: '9726885447', display: '+91 97268 85447', available: true },
];

const CallWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [calling, setCalling] = useState(null);

  const initiateCall = (phone) => {
    setCalling(phone.number);
    window.location.href = `tel:+91${phone.number}`;
    setTimeout(() => setCalling(null), 3000);
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/916353774046?text=Hello%2C%20I%20need%20AC%20service.', '_blank');
  };

  return (
    <div className="fixed bottom-24 lg:bottom-28 right-6 lg:right-8 z-40 flex flex-col items-end gap-3">

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="w-72 bg-white rounded-3xl shadow-2xl shadow-slate-900/15 border border-slate-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-black text-white text-base">Contact Us</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                    <span className="text-[10px] text-green-100 font-bold uppercase tracking-widest">Lines Open · 8AM–9PM</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="p-4 space-y-2.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Tap to Call</p>

              {phones.map((phone) => (
                <motion.button
                  key={phone.number}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => initiateCall(phone)}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-green-50 hover:border-green-200 transition-all group"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    calling === phone.number
                      ? 'bg-green-500 animate-pulse'
                      : 'bg-green-100 group-hover:bg-green-500'
                  }`}>
                    {calling === phone.number ? (
                      <PhoneCall size={18} className="text-white" />
                    ) : (
                      <Phone size={18} className="text-green-600 group-hover:text-white transition-colors" />
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{phone.label}</div>
                    <div className="text-sm font-black text-slate-800 group-hover:text-green-700 transition-colors">{phone.display}</div>
                  </div>
                  {calling === phone.number ? (
                    <span className="text-[10px] font-bold text-green-600 animate-pulse">Calling...</span>
                  ) : (
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-green-500 transition-colors" />
                  )}
                </motion.button>
              ))}

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* WhatsApp */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={openWhatsApp}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366] group transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-[#25D366]/20 group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors">
                  <MessageSquare size={18} className="text-[#25D366] group-hover:text-white transition-colors fill-current" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-[#25D366] group-hover:text-green-100 uppercase tracking-widest transition-colors">WhatsApp</div>
                  <div className="text-sm font-black text-slate-700 group-hover:text-white transition-colors">+91 63537 74046</div>
                </div>
                <ChevronRight size={16} className="ml-auto text-[#25D366]/40 group-hover:text-white transition-colors" />
              </motion.button>

              {/* Timing note */}
              <div className="flex items-center gap-2 px-1 py-2">
                <Clock size={12} className="text-slate-300 flex-shrink-0" />
                <span className="text-[10px] text-slate-400 font-medium">Mon–Sat: 8AM–9PM · Sun: 9AM–6PM · Emergency: 24/7</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 relative ${
          isOpen
            ? 'bg-slate-700 text-white'
            : 'bg-green-500 text-white shadow-green-400/40'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="phone" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Phone size={24} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ripple ring */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-2xl border-2 border-green-400 animate-ping opacity-30 pointer-events-none" />
        )}
      </motion.button>
    </div>
  );
};

export default CallWidget;
