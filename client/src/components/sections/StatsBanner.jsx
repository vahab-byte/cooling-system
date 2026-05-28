import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Users, Star, Zap, MapPin } from 'lucide-react';

const stats = [
  { icon: Users, value: 5000, suffix: '+', label: 'Customers Served', color: 'text-blue-400' },
  { icon: Star, value: 4.9, suffix: '', label: 'Average Rating', color: 'text-yellow-400', decimal: true },
  { icon: Award, value: 12, suffix: 'yr', label: 'In Business', color: 'text-purple-400' },
  { icon: Zap, value: 30, suffix: 'min', label: 'Avg Response Time', color: 'text-green-400' },
  { icon: TrendingUp, value: 99, suffix: '%', label: 'Satisfaction Rate', color: 'text-orange-400' },
  { icon: MapPin, value: 15, suffix: '+', label: 'Areas Covered', color: 'text-pink-400' },
];

const useCounter = (target, duration = 2000, started = false, decimal = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = eased * target;
      setCount(decimal ? parseFloat(val.toFixed(1)) : Math.floor(val));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration, decimal]);
  return count;
};

const StatItem = ({ stat, index }) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const count = useCounter(stat.value, 2000, inView, stat.decimal);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group text-center px-6 py-8 relative"
    >
      {/* Divider (not on first) */}
      {index > 0 && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px bg-white/10" />
      )}

      <div className={`flex justify-center mb-3 ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`}>
        <stat.icon size={22} strokeWidth={2} />
      </div>

      <div className={`text-3xl lg:text-4xl font-black tracking-tighter text-white mb-1.5`}>
        {count}{stat.suffix}
      </div>
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        {stat.label}
      </div>
    </motion.div>
  );
};

const StatsBanner = () => {
  return (
    <div className="relative bg-slate-900 border-y border-white/10 overflow-hidden">
      {/* Subtle gradient line on top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/30 via-transparent to-purple-950/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat, i) => (
            <StatItem key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
};

export default StatsBanner;
