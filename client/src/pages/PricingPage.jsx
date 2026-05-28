import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Calculator, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import PricingCalculator from '../components/sections/PricingCalculator';
import { pricingService } from '../services/api';
import Section from '../components/ui/Section';
import Container from '../components/ui/Container';
import SEO from '../components/common/SEO';

const PricingPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback pricing plans when API is unavailable
  const fallbackPlans = [
    {
      name: 'Basic Care',
      type: 'home',
      price: 1999,
      period: '/yr',
      description: 'Perfect for single-room cooling maintenance.',
      features: ['2 Wet Services', 'Unlimited Breakdowns', '10% Off Spare Parts', 'Priority Search', 'Basic Diagnostics'],
      is_featured: false,
      is_popular: false,
    },
    {
      name: 'Premium Shield',
      type: 'home',
      price: 3499,
      period: '/yr',
      description: 'Our most popular comprehensive protection.',
      features: ['3 Wet Services', 'Free Gas Charging', '20% Off Spare Parts', '2-Hr Response Time', 'Priority Support'],
      is_featured: true,
      is_popular: true,
    },
    {
      name: 'Business Pro',
      type: 'commercial',
      price: 0,
      period: '',
      description: 'Scalable solutions for corporate offices.',
      features: ['Monthly Maintenance', 'Dedicated Account Manager', 'Free Spare Parts', 'Bulk AC Management', 'Custom SLA'],
      is_featured: false,
      is_popular: false,
    },
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await pricingService.getPlans();
        setPlans(data && data.length > 0 ? data : fallbackPlans);
      } catch (error) {
        console.error('Failed to fetch pricing plans:', error);
        setPlans(fallbackPlans);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-24 bg-white selection:bg-primary/10">
      <SEO title="Pricing & AMC Plans" description="Transparent pricing for AC services. AMC plans from ₹2,499/year. Free inspection, upfront costs, 30-day warranty." path="/pricing" />
      
      {/* Refined Hero Section */}
      <Section padding="none" className="mb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <Container>
          <div className="max-w-4xl py-10 lg:py-16 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Premium Maintenance Plans</span>
              </div>
              <h1 className="text-6xl lg:text-8xl font-bold text-slate-900 mb-10 tracking-tight leading-[1.05]">
                Investment in <br /> <span className="text-primary italic">Absolute Comfort.</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed mb-12">
                Sophisticated care for your cooling infrastructure. Save up to 40% on annual maintenance while ensuring priority engineering response.
              </p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Modern Plan Cards */}
      <Section className="bg-white">
        <Container>
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto mb-32">
              {plans.map((plan, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative p-6 sm:p-10 lg:p-14 rounded-[2.5rem] border transition-all duration-500 flex flex-col group overflow-hidden ${
                    plan.is_popular 
                    ? 'bg-white border-primary shadow-[0_40px_100px_-20px_rgba(37,99,235,0.15)] ring-4 ring-primary/5 lg:scale-105 z-10' 
                    : 'bg-white border-slate-100 hover:border-slate-300'
                  }`}
                >
                  {plan.is_popular && (
                    <>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute top-6 right-10 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                        Recommended
                      </div>
                    </>
                  )}

                  <div className="mb-10 relative z-10">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Service Tier 0{i+1}</div>
                    <h3 className="text-3xl font-bold mb-3 tracking-tight text-slate-900">{plan.name}</h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-12 relative z-10">
                    {parseInt(plan.price) === 0 ? (
                      <span className="text-3xl font-bold tracking-tight text-primary">Custom Quote</span>
                    ) : (
                      <>
                        <span className="text-5xl lg:text-6xl font-bold tracking-tighter text-slate-900">
                          ₹{parseInt(plan.price).toLocaleString()}
                        </span>
                        <span className="font-bold text-xs uppercase tracking-widest text-slate-400">/ per year</span>
                      </>
                    )}
                  </div>
                  
                  <ul className="space-y-6 mb-12 flex-grow relative z-10">
                    {(plan.features || []).slice(0, 5).map((f, index) => (
                      <li key={index} className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Check size={12} strokeWidth={4} />
                        </div> 
                        <span className="text-sm font-medium text-slate-600">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all relative z-10 ${
                    plan.is_popular 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-slate-900' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white'
                  }`}>
                    {parseInt(plan.price) === 0 ? "Contact Us" : "Get Started"}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* Refined Comparison Guide */}
      <Section className="bg-slate-50/50 border-y border-slate-100">
        <Container>
          <div className="text-center mb-24 max-w-2xl mx-auto">
             <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Feature Audit</span>
             </div>
             <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">Compare <span className="text-primary italic">Our Plans.</span></h2>
          </div>

          <div className="overflow-x-auto rounded-3xl bg-white border border-slate-100 shadow-xl mb-10">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-8 text-left text-[11px] font-bold uppercase tracking-widest">Service Features</th>
                  <th className="p-8 text-center text-[11px] font-bold uppercase tracking-widest">Standard</th>
                  <th className="p-8 text-center text-[11px] font-bold uppercase tracking-widest bg-primary text-white">Elite AMC</th>
                  <th className="p-8 text-center text-[11px] font-bold uppercase tracking-widest">Corporate</th>
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
                  <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors">
                    <td className="p-6 px-8 text-sm font-semibold text-slate-700">{row.label}</td>
                    <td className="p-6 text-center">
                       {row.std ? <Check className="mx-auto text-emerald-500" size={18} strokeWidth={4} /> : <div className="w-1.5 h-1.5 bg-slate-100 mx-auto rounded-full" />}
                    </td>
                    <td className="p-6 text-center bg-primary/5">
                       {row.amc ? <Check className="mx-auto text-primary" size={18} strokeWidth={4} /> : <div className="w-1.5 h-1.5 bg-slate-100 mx-auto rounded-full" />}
                    </td>
                    <td className="p-6 text-center">
                       {row.corp ? <Check className="mx-auto text-emerald-500" size={18} strokeWidth={4} /> : <div className="w-1.5 h-1.5 bg-slate-100 mx-auto rounded-full" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      {/* Clean Calculator Section */}
      <Section className="bg-white">
        <Container>
          <div className="flex flex-col lg:flex-row gap-20 items-center py-24">
             <div className="flex-1 max-w-xl">
                <div className="inline-flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Total Transparency</span>
                </div>
                <h2 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-8 tracking-tight leading-tight">Precise Quotes. <br /> <span className="text-primary italic">Absolute Clarity.</span></h2>
                <p className="text-lg text-slate-500 font-medium mb-12 leading-relaxed">
                  Calculate labor and service costs instantly. Our transparent estimator ensures you only investment in exactly what you need.
                </p>
                
                <div className="flex items-center gap-6 p-10 rounded-3xl border border-slate-100 bg-slate-50/50 group transition-all">
                   <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                      <Sparkles size={24} />
                   </div>
                   <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Guaranteed Accuracy</div>
                      <div className="text-sm font-semibold text-slate-700 italic">All estimates follow premium service standards.</div>
                   </div>
                </div>
             </div>
             
             <div className="flex-1 w-full max-w-2xl relative">
                <div className="absolute -inset-4 bg-primary/5 rounded-[4rem] blur-3xl -z-10" />
                <PricingCalculator />
             </div>
          </div>
        </Container>
      </Section>

      {/* Modern FAQ Section */}
      <Section className="bg-slate-50/50 border-t border-slate-100 pb-32">
        <Container>
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/3">
               <div className="sticky top-40">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-4 block">Information Center</span>
                  <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-8">Common <br /><span className="text-primary italic">Questions.</span></h3>
                  <p className="text-slate-500 font-medium leading-relaxed mb-10">
                    Everything you need to know about our Premium Care Plans and Service Guarantees.
                  </p>
                  <button className="flex items-center gap-4 text-xs font-bold text-slate-900 border-b-2 border-slate-900 pb-2 hover:text-primary hover:border-primary transition-all uppercase tracking-widest">
                     Download Plan Guide <ArrowRight size={16} />
                  </button>
               </div>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                 { q: "What does the AMC plan cover?", a: "Unlimited repair visits, quarterly preventive checkups, and priority response within a 4-hour window." },
                 { q: "Is gas refilling included?", a: "Yes, our Elite and Corporate tiers include gas calibration and top-ups as standard." },
                 { q: "Can I transfer my plan?", a: "Yes, you can transfer your service plan to a new location within the city at no extra charge." },
                 { q: "Emergency support policy?", a: "Elite members have access to our 24/7 priority line for critical failure recovery." }
               ].map((item, i) => (
                 <motion.div 
                   key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                   className="p-10 bg-white rounded-3xl border border-slate-100 hover:border-primary transition-all group shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all"
                 >
                   <h4 className="text-xl font-bold text-slate-900 mb-6 tracking-tight group-hover:text-primary transition-colors">{item.q}</h4>
                   <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.a}</p>
                 </motion.div>
               ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Refined 'Arctic Light' CTA Section */}
      <Section className="bg-white text-slate-900 py-32 overflow-hidden relative border-t border-slate-100">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-40" />
         
         <Container className="relative z-10 text-center">
            <div className="max-w-3xl mx-auto">
               <div className="inline-flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Final Step</span>
               </div>
               <h3 className="text-5xl lg:text-7xl font-bold mb-10 tracking-tight leading-tight text-slate-950">Ready for <br /><span className="text-primary italic">Absolute Comfort?</span></h3>
               <p className="text-slate-500 font-medium text-lg mb-16 leading-relaxed">
                 Join thousands of premium property owners who trust ArcticFresh for sophisticated engineering and 100% cooling uptime.
               </p>
               <div className="flex justify-center flex-wrap gap-6">
                  <Link to="/booking" className="bg-slate-950 text-white px-12 py-5 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-950/10">Get Started Now</Link>
                  <Link to="/contact" className="bg-white border border-slate-200 text-slate-900 px-12 py-5 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">Contact Sales</Link>
               </div>
            </div>
         </Container>
      </Section>

    </motion.div>
  );
};

export default PricingPage;
