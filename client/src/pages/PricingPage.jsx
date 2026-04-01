import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Calculator, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import PricingCalculator from '../components/sections/PricingCalculator';
import { pricingService } from '../services/api';
import Section from '../components/ui/Section';
import Container from '../components/ui/Container';

const PricingPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await pricingService.getPlans();
        setPlans(data);
      } catch (error) {
        console.error('Failed to fetch pricing plans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-24 bg-white selection:bg-neutral-100">
      
      {/* Header Section */}
      <Section padding="none" className="mb-24 relative overflow-hidden bg-white">
        <Container>
          <div className="max-w-4xl py-20 lg:py-32">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-4 mb-10">
                <div className="w-12 h-12 border border-neutral-200 flex items-center justify-center bg-white shadow-sm">
                  <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                </div>
                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-neutral-500">Investment in Comfort</span>
              </div>
              <h1 className="text-6xl lg:text-9xl font-bold text-black mb-10 tracking-tighter font-display leading-[1.05]">
                Plans Built for <br /> <span className="text-blue-600 italic">Absolute Peace.</span>
              </h1>
              <p className="text-2xl text-neutral-700 max-w-2xl font-medium leading-relaxed mb-16">
                Protect your cooling investment. Save up to 40% on repairs and ensure priority engineering support all year round.
              </p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Plans Grid */}
      <Section className="bg-white">
        <Container>
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="animate-spin text-blue-600" size={64} strokeWidth={3} />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-10 lg:gap-16 max-w-7xl mx-auto mb-32">
              {plans.map((plan, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative p-12 lg:p-18 border-2 transition-all duration-500 flex flex-col group ${
                    plan.is_popular 
                    ? 'bg-black border-black text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] lg:scale-110 z-10' 
                    : 'bg-white border-neutral-100 hover:border-blue-600'
                  }`}
                >
                  {plan.is_popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.3em] px-10 py-3 shadow-2xl">
                      Elite Recommended
                    </div>
                  )}

                  <div className="mb-12">
                    <div className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 ${plan.is_popular ? 'text-blue-500' : 'text-neutral-400'}`}>Tier 0{i+1} Protocol</div>
                    <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">{plan.name}</h3>
                    <p className={`text-base font-bold leading-relaxed ${plan.is_popular ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {plan.description}
                    </p>
                  </div>
                  
                  <div className="flex items-baseline gap-3 mb-16">
                    {parseInt(plan.price) === 0 ? (
                      <span className="text-4xl font-black tracking-tighter uppercase text-blue-600 italic">Custom Quote</span>
                    ) : (
                      <>
                        <span className="text-6xl lg:text-7xl font-black tracking-tighter">
                          ₹{parseInt(plan.price).toLocaleString()}
                        </span>
                        <span className={`font-black text-xs uppercase tracking-widest ${plan.is_popular ? 'text-neutral-500' : 'text-neutral-400'}`}>/ year</span>
                      </>
                    )}
                  </div>
                  
                  <ul className="space-y-8 mb-16 flex-grow">
                    {(plan.features || []).slice(0, 5).map((f, index) => (
                      <li key={index} className="flex items-center gap-5">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-none flex items-center justify-center border-2 ${
                          plan.is_popular ? 'border-blue-600 text-blue-600 bg-white' : 'border-neutral-200 text-blue-600 bg-neutral-50'
                        }`}>
                          <Check size={14} strokeWidth={4} />
                        </div> 
                        <span className={`text-[11px] font-black uppercase tracking-widest leading-tight ${plan.is_popular ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-6 font-black text-xs uppercase tracking-[0.3em] transition-all border-none shadow-xl ${
                    plan.is_popular 
                    ? 'bg-blue-600 text-white hover:bg-white hover:text-black' 
                    : 'bg-black text-white hover:bg-blue-600'
                  }`}>
                    Initialize Protection
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* Comparison Table */}
      <Section className="bg-neutral-50 border-y-2 border-neutral-100">
        <Container>
          <div className="text-center mb-24 max-w-2xl mx-auto">
             <div className="inline-flex items-center gap-4 mb-6">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-neutral-500">Technical Audit</span>
             </div>
             <h2 className="text-4xl lg:text-7xl font-bold text-black tracking-tighter uppercase italic">The Matrix <br /><span className="text-blue-600">Comparison.</span></h2>
          </div>

          <div className="overflow-x-auto shadow-2xl bg-white border-2 border-neutral-100">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  <th className="p-10 text-left text-[12px] font-black uppercase tracking-[0.4em] border-r border-white/10">Feature Parameters</th>
                  <th className="p-10 text-center text-[12px] font-black uppercase tracking-[0.4em] border-r border-white/10">Standard</th>
                  <th className="p-10 text-center text-[12px] font-black uppercase tracking-[0.4em] bg-blue-600 border-r border-white/10">Elite AMC</th>
                  <th className="p-10 text-center text-[12px] font-black uppercase tracking-[0.4em]">Corporate</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Deep Bio-Cleaning Service", std: true, amc: true, corp: true },
                  { label: "Gas Pressure Calibration", std: true, amc: true, corp: true },
                  { label: "Electrical Load Audit", std: false, amc: true, corp: true },
                  { label: "Priority Response < 4 Hours", std: false, amc: true, corp: true },
                  { label: "Zero Labor Charges on Repair", std: false, amc: true, corp: true },
                  { label: "Quarterly Preventive Check", std: false, amc: true, corp: true },
                  { label: "Digital Performance Reports", std: false, amc: false, corp: true },
                  { label: "Multi-Zone Infrastructure Audit", std: false, amc: false, corp: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-neutral-100 group hover:bg-neutral-50 transition-colors">
                    <td className="p-8 text-sm font-black text-neutral-600 uppercase tracking-widest border-r border-neutral-100 group-hover:text-black">{row.label}</td>
                    <td className="p-8 text-center border-r border-neutral-100">
                       {row.std ? <Check className="mx-auto text-blue-600" size={18} strokeWidth={4} /> : <div className="w-1 h-1 bg-neutral-200 mx-auto rounded-full" />}
                    </td>
                    <td className="p-8 text-center border-r border-neutral-100 bg-blue-50/50 group-hover:bg-blue-100/50 transition-colors">
                       {row.amc ? <Check className="mx-auto text-blue-600" size={18} strokeWidth={4} /> : <div className="w-1 h-1 bg-neutral-200 mx-auto rounded-full" />}
                    </td>
                    <td className="p-8 text-center">
                       {row.corp ? <Check className="mx-auto text-blue-600" size={18} strokeWidth={4} /> : <div className="w-1 h-1 bg-neutral-200 mx-auto rounded-full" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      {/* Calculator Section */}
      <Section className="bg-white">
        <Container>
          <div className="flex flex-col lg:flex-row gap-24 items-center py-20">
             <div className="flex-1 max-w-xl">
                <div className="inline-flex items-center gap-4 mb-10">
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                  <span className="text-[12px] font-black uppercase tracking-[0.4em] text-neutral-500">Transparency First</span>
                </div>
                <h2 className="text-5xl lg:text-8xl font-black text-black mb-10 tracking-tighter leading-[1.1]">Precise Quotes. <br /> <span className="text-blue-600 italic text-7xl lg:text-9xl tracking-[-0.05em]">Clarity.</span></h2>
                <p className="text-2xl text-neutral-700 font-medium mb-16 leading-relaxed">
                  Not sure about the project scope? Use our high-precision estimator to calculate labor and service costs based on your specific cooling requirements.
                </p>
                
                <div className="flex items-center gap-10 p-12 border-2 border-neutral-200 bg-white group hover:border-blue-600 transition-colors duration-500 shadow-xl">
                   <div className="w-16 h-16 rounded-none bg-neutral-50 flex items-center justify-center text-blue-600 border border-neutral-200 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Calculator size={24} />
                   </div>
                   <div>
                      <div className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2 font-display">Standard Rates</div>
                      <div className="text-sm font-bold text-black italic leading-tight">* All estimates follow current labor regulatory norms.</div>
                   </div>
                </div>
             </div>
             
             <div className="flex-1 w-full max-w-2xl bg-white p-2 border-2 border-neutral-100 shadow-[0_50px_100px_-20px_rgba(37,99,235,0.1)]">
                <PricingCalculator />
             </div>
          </div>
        </Container>
      </Section>

      {/* AMC FAQ Section */}
      <Section className="bg-neutral-50 border-t-2 border-neutral-100">
        <Container>
          <div className="flex flex-col lg:flex-row gap-24">
            <div className="lg:w-1/3">
               <div className="sticky top-32">
                  <div className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em] mb-6">Knowledge Base</div>
                  <h3 className="text-4xl lg:text-5xl font-black text-black tracking-tighter mb-8 italic uppercase">Common <br /> Queries.</h3>
                  <p className="text-neutral-500 font-medium leading-relaxed mb-12">
                    Everything you need to know about our Annual Maintenance Protocols and Service Guarantees.
                  </p>
                  <button className="flex items-center gap-4 text-[11px] font-black text-black hover:text-blue-600 transition-all uppercase tracking-[0.3em] border-b-2 border-black pb-2">
                     Download Full AMC Guide <ArrowRight size={16} />
                  </button>
               </div>
            </div>
            <div className="lg:w-2/3 space-y-12">
               {[
                 { q: "What exactly does the AMC plan cover?", a: "Our AMC covers all labor charges for unlimited repairs, quarterly preventive maintenance audits, chemical deep-cleaning twice a year, and priority engineering dispatch within 4 hours of complaint registration." },
                 { q: "Is gas charging included in the pricing?", a: "Gas charging is subsidized in the Lite AMC and fully covered in the Elite and Corporate tiers, provided the structural integrity of the copper coils is verified during the initial audit." },
                 { q: "Can I transfer my AMC to a different location?", a: "Yes, ArcticFresh allows one-time transfer of your AMC protocol within Ahmedabad at no additional cost, ensuring your comfort moves with you." },
                 { q: "What is the procedure for an Emergency Dispatch?", a: "Elite AMC members have a dedicated 24/7 hotline. Upon registration, an engineering squad is dispatched within a 2-hour window for critical cooling failures." }
               ].map((item, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                   className="p-12 bg-white border-2 border-neutral-100 hover:border-blue-600 transition-all group"
                 >
                   <h4 className="text-2xl font-black text-black mb-6 tracking-tighter group-hover:text-blue-600 transition-colors uppercase italic">{item.q}</h4>
                   <p className="text-neutral-600 font-medium leading-relaxed tracking-tight">{item.a}</p>
                 </motion.div>
               ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Footer */}
      <Section className="bg-black text-white text-center py-32 overflow-hidden relative">
         <motion.div 
          animate={{ x: [-100, 100], opacity: [0, 1, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-0 w-full h-full bg-blue-600/5 rotate-12 -z-0"
         />
         <Container className="relative z-10">
            <div className="max-w-3xl mx-auto">
               <h3 className="text-5xl lg:text-8xl font-black mb-10 uppercase tracking-tighter italic">Ready for <br /><span className="text-blue-600">Absolute Cool?</span></h3>
               <p className="text-neutral-400 font-medium text-xl mb-16 leading-relaxed">
                 Join 5,000+ homes and businesses in Ahmedabad who trust ArcticFresh for surgical engineering and 100% cooling uptime.
               </p>
               <div className="flex flex-wrap justify-center gap-8">
                  <Link to="/booking" className="bg-blue-600 text-white px-16 py-8 text-sm font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-2xl active:scale-[0.98]">Activate Protection Now</Link>
               </div>
            </div>
         </Container>
      </Section>

    </motion.div>
  );
};

export default PricingPage;

