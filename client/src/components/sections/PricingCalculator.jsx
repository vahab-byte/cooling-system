import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Zap, ThermometerSnowflake, CheckCircle2, ChevronDown } from 'lucide-react';

const PricingCalculator = () => {
  const [acType, setAcType] = useState('split');
  const [tonnage, setTonnage] = useState(1.5);
  const [serviceType, setServiceType] = useState('deep');

  const prices = {
    split: { basic: 400, deep: 600, gas: 2500 },
    window: { basic: 300, deep: 500, gas: 2000 }
  };

  const estimatedPrice = prices[acType][serviceType] + (tonnage > 1.5 ? 200 : 0);

  return (
    <div className="bg-white/40 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-white/50 flex flex-col md:flex-row min-h-[520px] relative">
      {/* Background Glow Accent */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="md:w-[40%] bg-white/40 p-10 lg:p-12 flex flex-col justify-between relative shrink-0 border-r border-white/20">
        <div className="relative z-10">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-10 shadow-sm">
             <Calculator size={24} />
          </div>
          <h3 className="text-3xl font-bold mb-4 leading-tight text-slate-900">Instant<br />Estimate</h3>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">Personalized pricing for your specific AC configuration.</p>
        </div>
        
        <div className="relative z-10 pt-10 border-t border-slate-200/50">
          <div className="text-6xl font-bold mb-3 tracking-tighter text-slate-900">₹{estimatedPrice}</div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Estimated Total (Incl. GST)</p>
        </div>
      </div>

      <div className="flex-1 p-8 lg:p-12 space-y-10 flex flex-col justify-center bg-white/20">
        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">AC Configuration</label>
          <div className="flex gap-4">
            {['split', 'window'].map(t => (
              <button
                key={t}
                onClick={() => setAcType(t)}
                className={`flex-1 py-3 px-6 rounded-xl font-bold border transition-all text-sm capitalize ${
                  acType === t 
                  ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-white/50 border-slate-100 text-slate-500 hover:border-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tonnage</label>
            <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">{tonnage} Ton</span>
          </div>
          <div className="relative pt-2">
            <input 
               type="range" 
               min="0.5" 
               max="3" 
               step="0.5" 
               value={tonnage}
               onChange={(e) => setTonnage(parseFloat(e.target.value))}
               className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" 
            />
            <div className="flex justify-between mt-3 text-[9px] font-bold text-slate-300 uppercase tracking-widest px-1">
               <span>0.5 T</span>
               <span>3.0 T</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Service Category</label>
          <div className="relative group/select">
             <select 
               value={serviceType}
               onChange={(e) => setServiceType(e.target.value)}
               className="w-full pl-5 pr-10 py-3.5 rounded-xl bg-white border border-slate-100 outline-none focus:border-primary font-bold text-slate-600 appearance-none shadow-sm text-sm"
             >
               <option value="basic">Standard Jet Service</option>
               <option value="deep">Foam Deep Cleaning</option>
               <option value="gas">Full Gas Refilling</option>
             </select>
             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                <ChevronDown size={18} />
             </div>
          </div>
        </div>

        <button className="w-full bg-slate-950 text-white rounded-xl py-4 font-bold text-sm hover:bg-primary transition-all shadow-xl shadow-slate-950/10">
          Book at this Price
        </button>
      </div>
    </div>
  );
};

export default PricingCalculator;
