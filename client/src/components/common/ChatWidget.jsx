import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, Sparkles, Calendar, CreditCard,
  Headphones, ChevronRight, Phone, MapPin, Wrench, Wind,
  CheckCircle, ArrowRight, Star, Clock, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Smart Knowledge Base ───────────────────────────────────────────────────
const KB = [
  // Booking
  { keys: ['book', 'booking', 'appoint', 'schedule', 'service'], response: null, action: 'booking_flow' },
  // Pricing
  { keys: ['price', 'pricing', 'cost', 'charge', 'rate', 'amount', 'amc', 'annual', 'plan'], response: "💰 **Our Plans:**\n\n• **Basic Service** — ₹599\n• **Deep Clean** — ₹999\n• **Gas Refill** — ₹1,499\n• **AMC Annual** — ₹2,499/year\n\nAll plans include free inspection and a 30-day warranty! Would you like to book?", hasActions: ['Book Now', 'See All Prices'] },
  // Repair
  { keys: ['repair', 'fix', 'broken', 'problem', 'issue', 'cooling', 'noise', 'leak', 'drip', 'not working'], response: "🔧 **AC Repair Services:**\n\nWe provide same-day repair. Common issues we fix:\n• Not cooling — Gas leak / compressor issue\n• Water dripping — Drain blockage\n• Unusual noise — Fan/motor issue\n• AC won't turn on — Electrical fault\n\nShould we send a technician now?", hasActions: ['Call Now', 'Book Repair'] },
  // Timing
  { keys: ['time', 'hours', 'timing', 'available', 'when', 'open', 'close', 'sunday', 'holiday'], response: "🕐 **Service Hours:**\n\n• Monday – Saturday: **8:00 AM – 9:00 PM**\n• Sunday: **9:00 AM – 6:00 PM**\n• Emergency: **24/7** (Elite Members)\n\nBook before **12 PM** for same-day service!", hasActions: ['Book Now'] },
  // Location / Areas
  { keys: ['area', 'location', 'where', 'ahmedabad', 'satellite', 'bopal', 'prahlad', 'cover', 'service area'], response: "📍 **We Cover These Areas in Ahmedabad:**\n\nSatellite • Vastrapur • Bopal • Prahlad Nagar • Bodakdev • Thaltej • Gota • Memnagar • South Bopal • Navrangpura • CG Road • Drive-in\n\nYour area is covered! Would you like to book now?", hasActions: ['Book Service'] },
  // Warranty
  { keys: ['warranty', 'guarantee', 'days'], response: "🛡️ **Our Warranty Policy:**\n\n• **30 days** — Labour warranty\n• **6 months** — Genuine parts warranty\n• **Free revisit** — If the same issue occurs again\n\nYou get a full digital certificate with all repairs.", hasActions: ['Book Service'] },
  // Installation
  { keys: ['install', 'installation', 'new ac', 'fitting', 'relocate'], response: "🆕 **AC Installation Service:**\n\n• Split AC installation — ₹1,999\n• Window AC — ₹999\n• Outdoor unit relocation — ₹1,499\n\nIncludes: Pipe fitting, electrical connection, testing & demo. Same-day service available!", hasActions: ['Book Installation', 'Call Now'] },
  // Emergency
  { keys: ['emergency', 'urgent', 'asap', 'immediately', 'help', 'now'], response: "🚨 **Emergency Service Available!**\n\nWe understand — it's tough when your AC breaks down in hot weather. Our emergency team can reach your home in 2 hours.\n\nCall or WhatsApp us right now:", hasActions: ['📞 Call Now', '💬 WhatsApp'] },
  // Technician
  { keys: ['technician', 'engineer', 'certified', 'qualified', 'who', 'experience'], response: "👷 **Our Technicians:**\n\n• OEM Certified (Daikin, Voltas, LG, etc.)\n• 500+ hours training\n• Background verified\n• Uniform + ID card\n• Tool kit + genuine parts\n\nYou can see your technician's photo and details in advance!", hasActions: ['Book Now'] },
  // Gas refill
  { keys: ['gas', 'refrigerant', 'refill', 'recharge', 'r22', 'r32', 'r410'], response: "❄️ **Gas Refill Service:**\n\nWe use genuine refrigerants for all AC types:\n• R22 — ₹1,200\n• R32 — ₹1,499  \n• R410A — ₹1,499\n\nIncludes leak detection + pressure test.", hasActions: ['Book Gas Refill'] },
  // Contact
  { keys: ['contact', 'call', 'phone', 'number', 'reach', 'talk', 'speak'], response: "📞 **Our Contact Numbers:**\n\n• **Line 1:** +91 6353 774 046\n• **Line 2:** +91 9726 885 447\n• **WhatsApp:** +91 6353 774 046\n\nYou can also book a service right here in the chat! 😊", hasActions: ['📞 Call Line 1', '📞 Call Line 2', '💬 WhatsApp'] },
];

const QUICK_ACTIONS = [
  { label: '📅 Service Book', key: 'book' },
  { label: '💰 Pricing', key: 'pricing' },
  { label: '🔧 Repair', key: 'repair nahi chal' },
  { label: '📞 Call Us', key: 'contact' },
  { label: '📍 My Area', key: 'area' },
  { label: '🆘 Emergency', key: 'emergency' },
];

const BOOKING_FLOW = [
  { id: 'name', question: "What is your name? 😊", placeholder: "e.g. Rahul Sharma" },
  { id: 'phone', question: "Your mobile number? (We will call to confirm)", placeholder: "e.g. 9876543210" },
  { id: 'area', question: "Where are you located? (Area/locality)", placeholder: "e.g. Satellite, Ahmedabad" },
  { id: 'service', question: "Which service do you need?", placeholder: "e.g. AC Service / Repair / Gas Refill" },
  { id: 'time', question: "When do you need the service? (Date & time)", placeholder: "e.g. Today 4 PM / Tomorrow Morning" },
];

const getSmartResponse = (text) => {
  const lower = text.toLowerCase();
  for (const item of KB) {
    if (item.keys.some(k => lower.includes(k))) {
      return item;
    }
  }
  return null;
};

const formatMessage = (text) => {
  return text.split('\n').map((line, i) => (
    <span key={i}>
      {line.startsWith('•') ? (
        <span className="flex gap-2 my-0.5">
          <span className="text-blue-500 flex-shrink-0">•</span>
          <span>{line.slice(1).trim()}</span>
        </span>
      ) : line.startsWith('**') && line.endsWith('**') ? (
        <strong>{line.slice(2, -2)}</strong>
      ) : (
        line.split('**').map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )
      )}
      {i < text.split('\n').length - 1 && <br />}
    </span>
  ));
};

// ─── Main Component ─────────────────────────────────────────────────────────
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 🙏 I am ArcticFresh's Smart Assistant.\n\nYou can ask me about:\n• Service booking\n• Pricing & plans\n• Repair help\n• Emergency support\n\nHow can I help you today?",
      isBot: true,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [bookingStep, setBookingStep] = useState(-1); // -1 = no booking flow
  const [bookingData, setBookingData] = useState({});
  const [unread, setUnread] = useState(1);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const now = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const addBotMessage = (text, extra = {}) => {
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text,
        isBot: true,
        time: now(),
        ...extra
      }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleActionButton = (action) => {
    if (action === 'Book Now' || action === 'Book Service' || action === 'Book Repair' || action === 'Book Installation' || action === 'Book Gas Refill') {
      startBookingFlow();
    } else if (action === '📞 Call Now' || action === 'Call Now') {
      window.location.href = 'tel:+916353774046';
    } else if (action === '📞 Call Line 1') {
      window.location.href = 'tel:+916353774046';
    } else if (action === '📞 Call Line 2') {
      window.location.href = 'tel:+919726885447';
    } else if (action === '💬 WhatsApp') {
      window.open('https://wa.me/916353774046', '_blank');
    } else if (action === 'See All Prices') {
      window.location.href = '/pricing';
    }
  };

  const startBookingFlow = () => {
    setBookingStep(0);
    setBookingData({});
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "✅ Great! Let's get your booking started. Just a few simple questions:\n\n" + BOOKING_FLOW[0].question,
        isBot: true,
        time: now(),
        isBookingStep: true,
        placeholder: BOOKING_FLOW[0].placeholder
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleBookingInput = (value) => {
    const currentField = BOOKING_FLOW[bookingStep];
    const newData = { ...bookingData, [currentField.id]: value };
    setBookingData(newData);

    if (bookingStep < BOOKING_FLOW.length - 1) {
      const nextStep = bookingStep + 1;
      setBookingStep(nextStep);
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: BOOKING_FLOW[nextStep].question,
          isBot: true,
          time: now(),
          isBookingStep: true,
          placeholder: BOOKING_FLOW[nextStep].placeholder
        }]);
        setIsTyping(false);
      }, 800);
    } else {
      // Booking complete
      setBookingStep(-1);
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: `🎉 **Booking Confirmed!**\n\nYour details have been saved:\n• Name: ${newData.name}\n• Phone: ${newData.phone}\n• Area: ${newData.area}\n• Service: ${newData.service}\n• Time: ${newData.time}\n\nOur team will call you shortly at **${newData.phone}** to confirm! ✅`,
          isBot: true,
          time: now(),
          isSuccess: true
        }]);
        setIsTyping(false);
        // Also send WhatsApp with booking details
        const waMsg = encodeURIComponent(
          `New Booking from Chatbot:\nName: ${newData.name}\nPhone: ${newData.phone}\nArea: ${newData.area}\nService: ${newData.service}\nTime: ${newData.time}`
        );
        setTimeout(() => {
          window.open(`https://wa.me/916353774046?text=${waMsg}`, '_blank');
        }, 2000);
      }, 1200);
    }
  };

  const handleSend = (textOverride = null) => {
    const textToSend = (textOverride || message).trim();
    if (!textToSend) return;

    const userMsg = { id: Date.now(), text: textToSend, isBot: false, time: now() };
    setMessages(prev => [...prev, userMsg]);
    if (!textOverride) setMessage('');
    setIsTyping(true);

    // If in booking flow, handle as booking input
    if (bookingStep >= 0) {
      handleBookingInput(textToSend);
      return;
    }

    // Check for booking flow trigger
    if (textToSend.toLowerCase().includes('book') || textToSend.toLowerCase().includes('booking')) {
      setTimeout(() => {
        startBookingFlow();
        setIsTyping(false);
      }, 600);
      return;
    }

    // Match knowledge base
    const match = getSmartResponse(textToSend);
    if (match) {
      if (match.action === 'booking_flow') {
        setTimeout(() => { startBookingFlow(); setIsTyping(false); }, 600);
      } else {
        addBotMessage(match.response, { hasActions: match.hasActions });
      }
    } else {
      addBotMessage(
        "I didn't quite catch that 😅 But I'm here to help!\n\nYou can call or WhatsApp us directly, or choose from the options below:",
        { hasActions: ['📞 Call Now', '💬 WhatsApp', 'Book Service'] }
      );
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-40 flex flex-col items-end gap-3">

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="w-[92vw] sm:w-[380px] h-[580px] flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20 border border-slate-100 bg-white"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-900 p-5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center">
                    <Wind size={20} className="text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-slate-900" />
                </div>
                <div>
                  <div className="font-black text-white text-sm">ArcticFresh Bot</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Online · Smart Assistant</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href="tel:+916353774046" className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                  <Phone size={15} />
                </a>
                <button onClick={() => setIsOpen(false)} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-slate-100 flex-shrink-0 scrollbar-hide bg-slate-50">
              {QUICK_ACTIONS.map((a) => (
                <button
                  key={a.key}
                  onClick={() => handleSend(a.key)}
                  className="flex-shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all whitespace-nowrap"
                >
                  {a.label}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex flex-col ${msg.isBot ? 'items-start' : 'items-end'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.isBot
                        ? msg.isSuccess
                          ? 'bg-green-50 border border-green-200 text-green-800 rounded-tl-sm'
                          : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                        : 'bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-500/20'
                    }`}>
                      <div className="whitespace-pre-wrap">{formatMessage(msg.text)}</div>

                      {/* Action Buttons */}
                      {msg.hasActions && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {msg.hasActions.map((action) => (
                            <button
                              key={action}
                              onClick={() => handleActionButton(action)}
                              className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      )}

                      {msg.isSuccess && (
                        <div className="flex items-center gap-1.5 mt-2 text-green-600 text-xs font-bold">
                          <CheckCircle size={13} /> Booking details sent on WhatsApp
                        </div>
                      )}
                    </div>

                    {/* Booking step input hint */}
                    {msg.isBookingStep && msg.placeholder && bookingStep >= 0 && (
                      <div className="text-[10px] text-slate-400 mt-1 px-1 italic">{msg.placeholder}</div>
                    )}

                    <span className="text-[9px] text-slate-300 mt-1 px-1 font-bold uppercase tracking-widest">
                      {msg.isBot ? 'Arctic Bot' : 'You'} · {msg.time}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2">
                  <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5">
                    {[0, 0.15, 0.3].map((d, i) => (
                      <div key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-100 flex-shrink-0 bg-white">
              {bookingStep >= 0 && (
                <div className="mb-2 px-1 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                    Booking in progress — Step {bookingStep + 1}/{BOOKING_FLOW.length}
                  </span>
                </div>
              )}
              <div className="flex gap-2 bg-slate-50 rounded-2xl p-1.5 border border-slate-200 focus-within:border-blue-400 focus-within:bg-white transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={bookingStep >= 0 ? BOOKING_FLOW[bookingStep]?.placeholder : "Ask me anything..."}
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!message.trim()}
                  className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex-shrink-0"
                >
                  <Send size={17} />
                </button>
              </div>
              <div className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-2">
                ArcticFresh Smart Assistant · Ahmedabad
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
            ? 'bg-slate-900 text-white'
            : 'bg-blue-600 text-white shadow-blue-500/40'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle size={26} />
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && unread > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-black"
          >
            {unread}
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

export default ChatWidget;
