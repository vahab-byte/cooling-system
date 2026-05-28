import React from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, ClipboardList, UserCheck, Search, Wrench, FileCheck, ArrowRight } from 'lucide-react';
import Section from '../ui/Section';
import Container from '../ui/Container';
import { Link } from 'react-router-dom';

const steps = [
  {
    icon: CalendarCheck,
    step: '01',
    title: 'Book Online',
    desc: 'Choose your service and pick a convenient date & time slot online — takes under 60 seconds.',
    color: 'from-blue-500 to-cyan-500',
    glow: 'rgba(59,130,246,0.3)',
  },
  {
    icon: ClipboardList,
    step: '02',
    title: 'Share Issue Details',
    desc: 'Tell us about your AC model and the problems you\'re facing for faster, targeted diagnosis.',
    color: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.3)',
  },
  {
    icon: UserCheck,
    step: '03',
    title: 'Technician Assigned',
    desc: 'A certified technician is assigned and dispatched to your location within 2 hours.',
    color: 'from-green-500 to-emerald-500',
    glow: 'rgba(34,197,94,0.3)',
  },
  {
    icon: Search,
    step: '04',
    title: 'Inspection & Quote',
    desc: 'On-site diagnosis with a fully transparent cost breakdown before any work begins.',
    color: 'from-orange-500 to-amber-500',
    glow: 'rgba(249,115,22,0.3)',
  },
  {
    icon: Wrench,
    step: '05',
    title: 'Repair & Testing',
    desc: 'Professional repair with genuine parts, followed by thorough cooling performance tests.',
    color: 'from-pink-500 to-rose-500',
    glow: 'rgba(236,72,153,0.3)',
  },
  {
    icon: FileCheck,
    step: '06',
    title: 'Invoice & Warranty',
    desc: 'Digital invoice with warranty certificate delivered instantly to your phone and email.',
    color: 'from-teal-500 to-cyan-600',
    glow: 'rgba(20,184,166,0.3)',
  }
];

const ServiceProcess = () => {
  return (
    <Section className="bg-slate-950 relative overflow-hidden">
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Background circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]" />

      <Container className="relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">How It Works</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter">
              6 Steps to<br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Perfect Cooling.
              </span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-slate-400 max-w-sm lg:text-right font-medium leading-relaxed">
              From booking to warranty — a streamlined process designed for zero hassle and maximum efficiency.
            </p>
            <div className="flex lg:justify-end mt-6">
              <Link to="/services" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm transition-colors">
                Book a service <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative"
            >
              <div className="relative overflow-hidden bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-3xl p-8 transition-all duration-500 h-full"
                style={{ '--glow': item.glow }}
              >
                {/* Step number - big watermark */}
                <div className="absolute top-4 right-6 text-7xl font-black text-white/5 select-none">
                  {item.step}
                </div>

                {/* Icon with glow */}
                <div className="relative mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}
                    style={{ boxShadow: `0 8px 24px ${item.glow}` }}
                  >
                    <item.icon size={24} className="text-white" strokeWidth={2} />
                  </div>
                </div>

                {/* Step badge */}
                <div className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${item.color} rounded-full px-3 py-1 mb-4`}>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Phase {item.step}</span>
                </div>

                <h3 className="text-xl font-black text-white mb-3 tracking-tight group-hover:text-blue-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">{item.desc}</p>

                {/* Connector arrow (not on last in row) */}
                {(i + 1) % 3 !== 0 && i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-white/10">
                    <ArrowRight size={16} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default ServiceProcess;
