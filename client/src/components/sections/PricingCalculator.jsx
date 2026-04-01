import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Zap, ThermometerSnowflake, CheckCircle2 } from 'lucide-react';

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
    <div className="bg-white rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col md:flex-row min-h-[550px]">
      <div className="md:w-5/12 bg-primary p-10 lg:p-14 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        
        <div className="relative z-10">
          <Calculator size={40} className="mb-8 opacity-40" />
          <h3 className="text-3xl lg:text-4xl font-black mb-4 leading-[1.1] tracking-tight">Instant <br />Estimate</h3>
          <p className="text-primary-light/80 text-sm font-medium mb-8 leading-relaxed">Precise pricing based on your AC configuration.</p>
        </div>
        
        <div className="relative z-10">
          <div className="text-6xl lg:text-7xl font-black mb-2 leading-none tracking-tighter">₹{estimatedPrice}</div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Estimated Total (Incl. GST)</p>
        </div>
      </div>

      <div className="flex-1 p-8 lg:p-12 space-y-10 flex flex-col justify-center">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">AC Configuration</label>
          <div className="flex gap-4">
            {['split', 'window'].map(t => (
              <button
                key={t}
                onClick={() => setAcType(t)}
                className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all capitalize ${
                  acType === t ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tonnage</label>
            <span className="text-sm font-black text-primary">{tonnage} Ton</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="3" 
            step="0.5" 
            value={tonnage}
            onChange={(e) => setTonnage(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary" 
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            <span>0.5 T</span>
            <span>3.0 T</span>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Service Category</label>
          <select 
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-primary font-bold text-slate-700"
          >
            <option value="basic">Standard Jet Service</option>
            <option value="deep">Foam Deep Cleaning</option>
            <option value="gas">Full Gas Refilling</option>
          </select>
        </div>

        <button className="w-full btn btn-primary py-4 text-lg">
          Book at this Price
        </button>
      </div>
    </div>
  );
};

export default PricingCalculator;
