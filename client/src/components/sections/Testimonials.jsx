import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, MapPin, ThumbsUp } from 'lucide-react';
import Section from '../ui/Section';
import Container from '../ui/Container';

const reviews = [
  {
    name: "Sanjay Sharma",
    role: "Corporate Manager",
    location: "Satellite, Ahmedabad",
    text: "The precision they bring to HVAC maintenance is unparalleled. Our office cooling has never been more stable. Technician arrived on time and completed the job in under 2 hours.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=sanjay",
    service: "AC Deep Cleaning",
    date: "2 weeks ago",
    helpful: 24
  },
  {
    name: "Priya Patel",
    role: "Homeowner",
    location: "Bopal, Ahmedabad",
    text: "Transformative experience. They didn't just fix the AC; they optimized our entire indoor environment. Prices were transparent and there were absolutely no surprise charges.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=priya",
    service: "Gas Refill + Repair",
    date: "1 month ago",
    helpful: 18
  },
  {
    name: "Vikram Malhotra",
    role: "Studio Director",
    location: "Prahlad Nagar, Ahmedabad",
    text: "Elite service for elite spaces. Their attention to detail and zero-noise protocol is exactly what we needed for our recording studio. Will recommend to everyone.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=vikram",
    service: "AC Installation",
    date: "3 weeks ago",
    helpful: 31
  },
  {
    name: "Riya Desai",
    role: "Restaurant Owner",
    location: "CG Road, Ahmedabad",
    text: "Same-day service for our commercial units during peak summer! Genuinely saved our business that day. The AMC plan is also excellent value.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=riya",
    service: "Emergency Repair",
    date: "5 days ago",
    helpful: 42
  },
  {
    name: "Amit Trivedi",
    role: "IT Professional",
    location: "Gota, Ahmedabad",
    text: "Booked online, got confirmation in 5 minutes, and the technician came exactly on time. The digital invoice with warranty card is a fantastic touch.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=amit",
    service: "AC Servicing",
    date: "1 week ago",
    helpful: 15
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [helpfulClicked, setHelpfulClicked] = useState({});

  const next = () => setActiveIndex(i => (i + 1) % reviews.length);
  const prev = () => setActiveIndex(i => (i - 1 + reviews.length) % reviews.length);

  const toggleHelpful = (i) => {
    setHelpfulClicked(prev => ({ ...prev, [i]: !prev[i] }));
  };

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, []);

  const active = reviews[activeIndex];

  return (
    <Section className="bg-slate-950 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]" />

      <Container className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-6">
            <Star size={12} fill="#FBBF24" className="text-yellow-400" />
            <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-widest">5,000+ Reviews · 4.9 Average</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-4">
            Customers Who{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Love Us.</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto font-medium">
            Real stories from real customers across Ahmedabad. Verified reviews, no filters.
          </p>
        </motion.div>

        {/* Main Review Spotlight */}
        <div className="max-w-3xl mx-auto mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 left-10 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <Quote size={14} className="text-white fill-white" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(active.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="#FBBF24" className="text-yellow-400" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-xl lg:text-2xl text-white font-medium leading-relaxed mb-8 italic">
                "{active.text}"
              </p>

              {/* Author + Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={active.avatar}
                      alt={active.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-950" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-base">{active.name}</div>
                    <div className="text-slate-400 text-xs font-semibold">{active.role}</div>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                      <MapPin size={10} />
                      {active.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Service</div>
                    <div className="text-xs text-white font-bold">{active.service}</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Posted</div>
                    <div className="text-xs text-white font-bold">{active.date}</div>
                  </div>
                  <button
                    onClick={() => toggleHelpful(activeIndex)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl border text-xs font-bold transition-all ${
                      helpfulClicked[activeIndex]
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-blue-500/50 hover:text-blue-400'
                    }`}
                  >
                    <ThumbsUp size={12} />
                    {(active.helpful + (helpfulClicked[activeIndex] ? 1 : 0))} Helpful
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav Controls */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === activeIndex ? 'w-8 h-2 bg-blue-500' : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={prev}
                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 flex items-center justify-center text-white/60 hover:text-white transition-all"
              >
                <ChevronLeft size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={next}
                className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white transition-all hover:bg-blue-500"
              >
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-3 justify-center flex-wrap">
          {reviews.map((r, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveIndex(i)}
              whileHover={{ scale: 1.05 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300 ${
                i === activeIndex
                  ? 'bg-blue-600/20 border-blue-500/50'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <img src={r.avatar} alt={r.name} className="w-8 h-8 rounded-xl object-cover" />
              <div className="text-left hidden sm:block">
                <div className="text-xs text-white font-bold">{r.name}</div>
                <div className="text-[10px] text-slate-400">{r.service}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default Testimonials;
