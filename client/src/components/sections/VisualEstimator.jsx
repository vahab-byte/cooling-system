import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Tool, Snowflake, Droplets, Zap, Wrench, CheckCircle2, AlertCircle, ChevronRight, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

const ISSUES = [
  {
    id: 'not_cooling',
    icon: Snowflake,
    title: 'Not Cooling Enough',
    desc: 'AC is running but blowing warm air or very weak airflow.',
    laborCost: 499,
    possibleParts: [
      { name: 'Gas Refill (R32/R410A)', price: 1499, probability: 'High' },
      { name: 'Capacitor Replacement', price: 650, probability: 'Medium' }
    ],
    color: 'text-blue-400',
    bg: 'bg-blue-500/10'
  },
  {
    id: 'water_leak',
    icon: Droplets,
    title: 'Water Leaking',
    desc: 'Water dripping from the indoor unit inside the room.',
    laborCost: 399,
    possibleParts: [
      { name: 'Drain Pipe Cleaning/Blockage Removal', price: 0, probability: 'High (Included in Labor)' },
      { name: 'New Drain Pipe (per meter)', price: 150, probability: 'Low' }
    ],
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10'
  },
  {
    id: 'noise',
    icon: Tool,
    title: 'Making Strange Noises',
    desc: 'Loud rattling, buzzing, or grinding sounds from indoor/outdoor unit.',
    laborCost: 499,
    possibleParts: [
      { name: 'Blower Motor Repair', price: 1200, probability: 'Medium' },
      { name: 'Fan Blade Replacement', price: 850, probability: 'Low' }
    ],
    color: 'text-orange-400',
    bg: 'bg-orange-500/10'
  },
  {
    id: 'power_issue',
    icon: Zap,
    title: 'AC Wont Turn On',
    desc: 'No power, no lights, or MCB trips immediately when turned on.',
    laborCost: 599,
    possibleParts: [
      { name: 'PCB Repair (Standard)', price: 2500, probability: 'High' },
      { name: 'Contactor Switch', price: 850, probability: 'Medium' },
      { name: 'Wire Burn/Short Circuit Fix', price: 300, probability: 'High' }
    ],
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10'
  }
];

const VisualEstimator = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden" id="estimator">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-blue-400 font-bold text-sm mb-6"
          >
            <ShieldCheck size={16} /> 100% Transparent Pricing
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight"
          >
            No Hidden Costs. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Guaranteed.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 leading-relaxed"
          >
            Aggregators often surprise you with massive bills after the technician arrives. 
            With our visual estimator, you know exactly what you might pay before you even book.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Select Issue */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Wrench className="text-blue-400" size={24} /> Step 1: What's the problem?
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {ISSUES.map((issue) => {
                const Icon = issue.icon;
                const isSelected = selectedIssue?.id === issue.id;
                
                return (
                  <motion.div
                    key={issue.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedIssue(issue)}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.15)]' 
                        : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isSelected ? issue.bg : 'bg-slate-800'}`}>
                      <Icon className={isSelected ? issue.color : 'text-slate-400'} size={24} />
                    </div>
                    <h4 className={`text-lg font-bold mb-2 transition-colors ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {issue.title}
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {issue.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Cost Breakdown */}
          <div className="lg:col-span-5">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Calculator className="text-blue-400" size={24} /> Step 2: Live Estimate
            </h3>
            
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden h-[calc(100%-3rem)] flex flex-col">
              
              {!selectedIssue ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                  <Calculator size={48} className="text-slate-600 mb-4" />
                  <p className="text-slate-400 font-medium">Select an issue on the left to see the complete cost breakdown.</p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedIssue.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedIssue.bg}`}>
                        <selectedIssue.icon className={selectedIssue.color} size={20} />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{selectedIssue.title}</h4>
                        <p className="text-xs text-slate-400">Diagnosis Estimate</p>
                      </div>
                    </div>

                    <div className="space-y-6 flex-1">
                      {/* Labor Cost */}
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <h5 className="text-sm font-bold text-slate-300">Base Labor Cost</h5>
                          <span className="text-lg font-black text-white">₹{selectedIssue.laborCost}</span>
                        </div>
                        <p className="text-xs text-slate-500">Includes inspection, diagnosis, and basic repair labor.</p>
                      </div>

                      {/* Possible Parts */}
                      <div>
                        <h5 className="text-sm font-bold text-slate-300 mb-3">If Spare Parts Are Needed:</h5>
                        <div className="space-y-3">
                          {selectedIssue.possibleParts.map((part, idx) => (
                            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-slate-300">{part.name}</p>
                                <p className={`text-[10px] font-bold uppercase tracking-wider ${
                                  part.probability.includes('High') ? 'text-orange-400' : 'text-blue-400'
                                }`}>
                                  {part.probability} Probability
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-bold text-white">
                                  {part.price === 0 ? 'Free' : `₹${part.price}`}
                                </span>
                                {part.price > 0 && <p className="text-[10px] text-slate-500 line-through">MRP ₹{Math.round(part.price * 1.2)}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-3 flex items-start gap-1">
                          <AlertCircle size={14} className="flex-shrink-0 text-slate-400" />
                          You only pay for parts IF they are actually damaged and replaced. We will show you the damaged part before replacing it.
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800">
                      <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border border-blue-500/30 rounded-xl p-4 mb-4 flex gap-3">
                        <ShieldCheck className="text-blue-400 flex-shrink-0" size={24} />
                        <div>
                          <p className="text-sm font-bold text-white mb-1">Price Lock Guarantee</p>
                          <p className="text-xs text-blue-200/70">The prices shown here are final. Our technicians cannot charge you a single rupee above this catalog.</p>
                        </div>
                      </div>

                      <Link 
                        to="/login"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                      >
                        Book Now at Fixed Price <ChevronRight size={18} />
                      </Link>
                    </div>

                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default VisualEstimator;
