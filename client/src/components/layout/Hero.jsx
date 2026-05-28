import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Wind, Phone, Star, CheckCircle, Zap, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../ui/Container';

// Animated counter hook
const useCounter = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
};

const stats = [
  { value: 5000, suffix: '+', label: 'Happy Customers', icon: Star },
  { value: 12, suffix: 'yr', label: 'Experience', icon: Shield },
  { value: 30, suffix: 'min', label: 'Avg Response', icon: Clock },
  { value: 99, suffix: '%', label: 'Satisfaction Rate', icon: Zap },
];

const StatCard = ({ stat, index }) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const count = useCounter(stat.value, 2000, inView);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="relative group"
    >
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:border-blue-400/40 transition-all duration-500 hover:bg-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="text-4xl font-black text-white tracking-tighter mb-1">
            {count.toLocaleString()}{stat.suffix}
          </div>
          <div className="text-[11px] font-bold text-blue-300/70 uppercase tracking-widest">{stat.label}</div>
        </div>
      </div>
    </motion.div>
  );
};

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentText, setCurrentText] = useState(0);
  const heroTexts = ['Optimization.', 'Excellence.', 'Precision.', 'Comfort.'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText(prev => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-[80px] animate-pulse [animation-delay:2s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
          style={{
            left: `${10 + (i * 7.5)}%`,
            top: `${20 + (i * 5) % 60}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + (i * 0.3),
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      <Container className="relative z-10 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Live Status Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-full px-5 py-2.5 mb-8"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-[11px] font-bold text-green-400 uppercase tracking-widest">Available Now — Ahmedabad</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.02] tracking-tighter text-white mb-4">
              Air.{' '}
              <span className="block">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentText}
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent font-black"
                  >
                    {heroTexts[currentText]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            <p className="text-lg text-slate-400 mb-10 max-w-md leading-relaxed font-medium">
              Ahmedabad's most trusted AC service station. Industrial-grade repairs, same-day response, and transparent pricing — guaranteed.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/services"
                  className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] text-sm uppercase tracking-widest"
                >
                  Book Service Now
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href="tel:+919999999999"
                  className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 text-sm uppercase tracking-widest"
                >
                  <Phone size={16} />
                  Call Us Now
                </a>
              </motion.div>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap gap-6">
              {[
                'OEM Certified Techs',
                '30-Day Warranty',
                'No Hidden Charges',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-400">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  <span className="text-xs font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Premium Visual Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ transform: `perspective(1000px) rotateY(${mousePos.x * 0.3}deg) rotateX(${-mousePos.y * 0.3}deg)` }}
            className="relative hidden lg:block"
          >
            {/* Main Card */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10" />
                <img
                  src="/images/hero-ac-unit.png"
                  alt="Premium AC Service"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                />

                {/* Live Tech Badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-6 right-6 z-20 bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Wind size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="text-[9px] text-white/50 font-bold uppercase tracking-widest">Status</div>
                      <div className="text-sm text-white font-bold">Active Ops</div>
                    </div>
                  </div>
                </motion.div>

                {/* Rating Badge */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-6 left-6 z-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="#FBBF24" className="text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-white text-xs font-bold">4.9 (5,000+ reviews)</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Stats Grid below hero image */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {stats.map((stat, i) => (
                <StatCard key={i} stat={stat} index={i} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mobile Stats */}
        <div className="grid grid-cols-2 gap-3 mt-12 lg:hidden">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>
      </Container>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" className="w-full fill-white" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
