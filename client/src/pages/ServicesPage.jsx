import React from 'react';
import Services from '../components/sections/Services';
import { motion } from 'framer-motion';
import { Wind, ShieldCheck, Zap, ArrowRight, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import Container from '../components/ui/Container';
import SEO from '../components/common/SEO';

const ServicesPage = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-24 bg-white">
      <SEO title="Services" description="Professional AC repair, installation, deep cleaning, gas refill, and AMC services in Ahmedabad. Certified technicians with 30-day warranty." path="/services" />
      
      {/* Services Hero */}
      <Section padding="none" className="mb-24 relative overflow-hidden bg-white">
         <Container>
            <div className="max-w-4xl py-10 lg:py-16">
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <div className="inline-flex items-center gap-2 mb-8">
                    <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">Engineered for Performance</span>
                  </div>
                  <h1 className="text-4xl sm:text-6xl lg:text-8xl font-medium text-black mb-8 tracking-tight font-display leading-[1.05]">
                     Solutions for a <br /> <span className="text-neutral-400">Better Atmosphere.</span>
                  </h1>
                  <p className="text-xl text-neutral-500 font-medium leading-relaxed max-w-2xl mb-12">
                     From high-precision residential installations to commercial-grade maintenance protocols, we provide surgical-grade climate control solutions.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-black" size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">OEM Verified Spares</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-black" size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">2-Hour Rapid Response</span>
                     </div>
                  </div>
               </motion.div>
            </div>
         </Container>
      </Section>

      {/* Main Services Grid Layer */}
      <Services />

      {/* Process Section - Clean White Version */}
      <Section className="bg-neutral-50 border-y border-neutral-100">
         <Container>
            <div className="text-center mb-24 max-w-3xl mx-auto">
               <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-4xl lg:text-6xl font-medium text-black mb-8 tracking-tight">
                    The Arctic <br />
                    <span className="text-neutral-400 font-display">Fresh Protocol.</span>
                  </h2>
                  <p className="text-lg text-neutral-500 leading-relaxed">
                    A streamlined 3-step execution model designed for zero-friction service delivery and surgical precision.
                  </p>
               </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-12 lg:gap-20">
               {[
                 { step: "01", title: "Digital Diagnosis", desc: "Our diagnostic protocols analyze your AC tonnage and age for precise estimation.", icon: Play },
                 { step: "02", title: "On-Site Precision", desc: "Hand-picked engineers perform deep chemical cleaning and performance load assessments.", icon: Wind },
                 { step: "03", title: "Instant Certification", desc: "Receive an end-to-end digital health report and maintenance warranty certificate instantly.", icon: Sparkles }
               ].map((item, i) => (
                 <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group">
                    <div className="w-16 h-16 rounded-full border border-neutral-200 flex items-center justify-center text-black mb-10 group-hover:bg-black group-hover:text-white transition-all duration-500 relative">
                       <item.icon size={24} />
                       <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-[10px] font-bold text-black shadow-sm">
                          {item.step}
                       </div>
                    </div>
                    <h3 className="text-2xl font-bold text-black mb-4 tracking-tight">{item.title}</h3>
                    <p className="text-neutral-500 font-medium text-sm leading-relaxed max-w-xs">{item.desc}</p>
                 </motion.div>
               ))}
            </div>
         </Container>
      </Section>

      {/* Pricing CTA Layer */}
      <Section className="bg-white">
         <Container>
            <div className="max-w-4xl border border-neutral-100 p-6 sm:p-12 lg:p-20 bg-neutral-50 mx-auto">
               <h3 className="text-3xl lg:text-5xl font-medium text-black mb-8 tracking-tight leading-[1.1]">Looking for Annual <br /><span className="text-neutral-400">Total Protection?</span></h3>
               <p className="text-neutral-500 text-lg mb-12 max-w-2xl leading-relaxed">
                  Save up to 40% on labor and parts with our Platinum subscription plans. Includes priority response and surgical-grade thermal diagnostics.
               </p>
               <div className="flex flex-wrap gap-6">
                  <Link to="/pricing" className="btn btn-primary group px-10">
                     View AMC Plans 
                     <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/contact" className="btn btn-secondary px-10">Consult Specialist</Link>
               </div>
            </div>
         </Container>
      </Section>

    </motion.div>
  );
};

export default ServicesPage;

