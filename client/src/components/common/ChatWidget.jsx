import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Sparkles, Calendar, CreditCard, Headphones, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to ArcticFresh. I'm your Concierge Assistant. How can I assist you today?", isBot: true, time: "Just Now" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const suggestions = [
    { text: "Book a Service", icon: Calendar, action: "booking" },
    { text: "View AMC Plans", icon: CreditCard, action: "pricing" },
    { text: "Consult Specialist", icon: Headphones, action: "contact" }
  ];

  const handleSend = (textOverride = null) => {
    const textToSend = textOverride || message;
    if (!textToSend.trim()) return;

    const newUserMsg = {
      id: Date.now(),
      text: textToSend,
      isBot: false,
      time: "Just Now"
    };

    setMessages(prev => [...prev, newUserMsg]);
    if (!textOverride) setMessage('');
    setIsTyping(true);
    setShowSuggestions(false);

    // Smart-ish response logic
    setTimeout(() => {
      let responseText = "Thank you for reaching out. A specialist from our concierge team will be with you shortly.";
      
      if (textToSend.toLowerCase().includes('booking')) {
        responseText = "I can certainly help with that. Our booking protocol is streamlined for precision. Would you like to view our available service windows?";
      } else if (textToSend.toLowerCase().includes('pricing')) {
        responseText = "Our AMC plans start at just ₹2,499. You can view the full breakdown on our pricing page for complete transparency.";
      }

      const botResponse = {
        id: Date.now() + 1,
        text: responseText,
        isBot: true,
        time: "Just Now"
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSend(suggestion.text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-12 lg:right-12 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="w-[90vw] sm:w-[400px] h-[calc(100vh-140px)] max-h-[620px] mb-6 flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.12)] border border-slate-100 relative"
          >
            {/* Arctic Aura Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Premium Header */}
            <div className="p-8 pb-6 bg-white flex justify-between items-center relative z-10 border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-xl shadow-slate-950/20">
                    <Sparkles size={20} className="text-primary" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-white" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-lg tracking-tight leading-none mb-1.5">Arctic Concierge</div>
                  <div className="flex items-center gap-1.5">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Intelligence Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Message Area */}
            <div 
              ref={scrollRef}
              className="flex-1 p-8 pt-6 space-y-6 overflow-y-auto scroll-smooth relative z-10"
            >
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={msg.id} 
                  className={`flex flex-col gap-2 ${msg.isBot ? 'max-w-[85%]' : 'max-w-[85%] ml-auto items-end'}`}
                >
                  <div className={`p-4 px-5 rounded-[1.8rem] text-sm leading-relaxed shadow-sm border ${
                    msg.isBot 
                    ? 'bg-slate-50 border-slate-100 text-slate-700 rounded-tl-none' 
                    : 'bg-primary border-primary text-white rounded-tr-none shadow-lg shadow-primary/20'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest px-2">
                    {msg.isBot ? 'Concierge' : 'You'} · {msg.time}
                  </span>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex flex-col gap-2 max-w-[85%]">
                   <div className="bg-slate-50 border border-slate-100 p-4 px-5 rounded-[1.5rem] rounded-tl-none flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce" />
                   </div>
                </div>
              )}

              {/* Smart Suggestions Layer */}
              {showSuggestions && !isTyping && (
                <div className="pt-2 flex flex-col gap-3">
                   <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1 px-1">Suggested for you</div>
                   {suggestions.map((s, i) => (
                     <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        onClick={() => handleSuggestionClick(s)}
                        className="flex items-center justify-between p-4 px-5 bg-white border border-slate-100 rounded-2xl hover:border-primary transition-all group text-left shadow-sm hover:shadow-md"
                     >
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                              <s.icon size={16} />
                           </div>
                           <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{s.text}</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-200 group-hover:text-primary transition-colors" />
                     </motion.button>
                   ))}
                </div>
              )}
            </div>

            {/* Enhanced Input Area */}
            <div className="p-8 bg-white border-t border-slate-100 relative z-10">
               <div className="flex gap-3 bg-slate-50 rounded-[1.5rem] p-1.5 border border-slate-100 focus-within:border-primary focus-within:bg-white transition-all shadow-inner">
                  <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your inquiry..."
                    className="flex-1 bg-transparent px-5 py-3 text-sm outline-none font-bold text-slate-700 placeholder:text-slate-300"
                  />
                  <button 
                    onClick={() => handleSend()}
                    className="w-12 h-12 rounded-[1.2rem] bg-slate-950 text-white flex items-center justify-center hover:bg-primary transition-all shadow-xl shadow-slate-950/20 active:scale-95"
                  >
                    <Send size={20} />
                  </button>
               </div>
               <div className="mt-4 flex items-center justify-center gap-2.5 text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                  <Sparkles size={11} className="text-primary shadow-glow" /> Encrypted Command Link
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Main Pulse Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 lg:w-16 lg:h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 border relative ${
          isOpen 
          ? 'bg-slate-950 border-slate-950 text-white' 
          : 'bg-primary border-primary text-white shadow-primary/20'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={28} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Subtle Indicator */}
        {!isOpen && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-bounce" />
        )}
      </motion.button>
    </div>
  );
};

export default ChatWidget;
