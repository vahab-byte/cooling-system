import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Clock, BadgeCheck, IndianRupee, Truck, Award,
  ArrowRight, Sparkles
} from 'lucide-react';
import Section from '../ui/Section';
import Container from '../ui/Container';

const reasons = [
  {
    icon: BadgeCheck,
    title: 'Certified Technicians',
    desc: 'All our engineers are OEM-certified with 500+ hours of hands-on training before their first visit.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    stat: '500+hrs',
    statLabel: 'Training'
  },
  {
    icon: Truck,
    title: 'Doorstep Service',
    desc: 'We come to you. No need to carry heavy units anywhere — service happens at your location.',
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-50',
    stat: '100%',
    statLabel: 'Doorstep'
  },
  {
    icon: Clock,
    title: 'Same-Day Repair',
    desc: 'Book before 12 PM and get same-day service. We maintain a 2-hour rapid response window.',
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-50',
    stat: '2hr',
    statLabel: 'Response'
  },
  {
    icon: IndianRupee,
    title: 'Transparent Pricing',
    desc: 'No hidden charges. You see the full breakdown — labour, parts, tax — before we start.',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    stat: '₹0',
    statLabel: 'Hidden fees'
  },
  {
    icon: ShieldCheck,
    title: '30-Day Warranty',
    desc: 'Every repair comes with a 30-day service warranty on labour and 6 months on genuine parts.',
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50',
    stat: '30d',
    statLabel: 'Warranty'
  },
  {
    icon: Award,
    title: 'Genuine Parts Only',
    desc: 'We use only manufacturer-approved spare parts with proper warranty documentation.',
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'bg-teal-50',
    stat: 'OEM',
    statLabel: 'Parts Only'
  }
];

const WhyChooseUs = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <Section className="bg-white border-t border-neutral-100 overflow-hidden">
      <Container>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-2 mb-6">
              <Sparkles size={14} className="text-blue-600" />
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">Why ArcticFresh</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-tight">
              The Standard<br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Others Can't Match.</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-500 max-w-sm lg:text-right font-medium leading-relaxed"
          >
            Trusted by 5,000+ homes and businesses across Ahmedabad. Six reasons our clients never go anywhere else.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              onHoverStart={() => setHoveredIndex(i)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="relative group cursor-default"
            >
              <div className={`relative overflow-hidden border transition-all duration-500 rounded-3xl p-8 h-full ${
                hoveredIndex === i
                  ? 'border-transparent shadow-2xl bg-white'
                  : 'border-neutral-100 bg-neutral-50 hover:bg-white'
              }`}>
                {/* Gradient overlay on hover */}
                <AnimatePresence>
                  {hoveredIndex === i && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5 rounded-3xl`}
                    />
                  )}
                </AnimatePresence>

                {/* Stat badge */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    <item.icon size={26} className={`bg-gradient-to-br ${item.color} bg-clip-text`}
                      style={{ color: 'transparent', WebkitBackgroundClip: 'text' }}
                    />
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-black bg-gradient-to-br ${item.color} bg-clip-text text-transparent`}>{item.stat}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.statLabel}</div>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>

                {/* Hover arrow */}
                <motion.div
                  animate={{ x: hoveredIndex === i ? 0 : -10, opacity: hoveredIndex === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center gap-1.5 mt-6 text-xs font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
                >
                  Learn more <ArrowRight size={12} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default WhyChooseUs;
