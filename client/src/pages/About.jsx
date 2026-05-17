import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, ThumbsUp, Users, History, CheckCircle2, Trophy, Star, Sparkles, Wind } from 'lucide-react';
import Section from '../components/ui/Section';
import Container from '../components/ui/Container';
import SEO from '../components/common/SEO';

const About = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-24 bg-white">
      <SEO title="About Us" description="ArcticFresh: 12+ years of premium AC service excellence in Ahmedabad. 1,250+ installations, certified technicians, and a commitment to precision cooling." path="/about" />
      <Container>
        
        {/* Story Section */}
        <div className="grid lg:grid-cols-12 gap-20 items-center mb-32 py-20">
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-4 mb-10">
                <div className="w-12 h-12 border border-neutral-200 flex items-center justify-center bg-white">
                  <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                </div>
                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-neutral-500">Our Legacy</span>
              </div>
              <h1 className="text-6xl lg:text-9xl font-bold text-black leading-[1.05] mb-10 tracking-tighter font-display">
                Engineering <br /> <span className="text-blue-600 italic">Better Air.</span>
              </h1>
              <p className="text-2xl text-neutral-700 font-medium leading-relaxed mb-16 max-w-2xl">
                Founded in 2012, ArcticFresh began as a specialized engineering squad in Ahmedabad. Today, we are the region's premier AC service station, combining surgical technical precision with a frictionless digital experience.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-10">
                <div className="p-12 border border-neutral-200 bg-white flex flex-col items-start transition-all duration-500 hover:border-blue-600 hover:shadow-2xl">
                  <div className="w-16 h-16 rounded-none bg-neutral-50 border border-neutral-200 flex items-center justify-center text-blue-600 mb-8">
                     <History size={24} />
                  </div>
                  <div className="text-6xl font-black text-black mb-2 tracking-tighter">12+</div>
                  <div className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.2em]">Years of Excellence</div>
                </div>
                <div className="p-12 border border-neutral-200 bg-white flex flex-col items-start transition-all duration-500 hover:border-blue-600 hover:shadow-2xl">
                  <div className="w-16 h-16 rounded-none bg-neutral-50 border border-neutral-200 flex items-center justify-center text-blue-600 mb-8">
                     <ThumbsUp size={24} />
                  </div>
                  <div className="text-6xl font-black text-black mb-2 tracking-tighter">100%</div>
                  <div className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.2em]">Client Satisfaction</div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-5 relative">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8 }}>
              <div className="relative rounded-none overflow-hidden border border-neutral-200 shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1000" 
                  alt="Technician at work" 
                  className="w-full h-[750px] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-transparent transition-colors duration-1000" />
                
                <div className="absolute bottom-12 left-12 right-12">
                   <div className="bg-white p-12 border border-neutral-200 text-black shadow-2xl">
                      <div className="flex items-center gap-3 text-blue-600 text-[11px] font-black uppercase tracking-[0.3em] mb-4">
                         <Star size={14} fill="currentColor" /> Industry Standard
                      </div>
                      <p className="text-lg font-bold leading-relaxed italic">
                        "Ahmedabad's leading service platform recognized for engineering transparency and rapid response protocols."
                      </p>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Pillars Section */}
        <Section className="bg-neutral-50 border-y border-neutral-200 px-0">
          <div className="text-center mb-32 max-w-2xl mx-auto">
             <div className="inline-flex items-center gap-4 mb-6">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-neutral-500">Core Principles</span>
             </div>
             <h2 className="text-4xl lg:text-7xl font-bold text-black tracking-tighter">The Pillars of <br /><span className="text-blue-600">ArcticFresh.</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                title: "Certified Personnel", 
                desc: "Every technician undergoes 500+ hours of specialized training before their first on-site visit.",
                icon: Users
              },
              { 
                title: "Premium Componentry", 
                desc: "We exclusively utilize genuine manufacturer-grade spare parts with integrated digital tracking.",
                icon: Award
              },
              { 
                title: "Digital Integrity", 
                desc: "100% transparent digital invoices, real-time tracking, and secure cloud-based history.",
                icon: ShieldCheck
              }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-16 bg-white border border-neutral-200 hover:border-blue-600 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="w-20 h-20 rounded-none bg-neutral-50 border border-neutral-200 flex items-center justify-center mb-12 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600">
                  <item.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-black mb-6 tracking-tighter text-black group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-neutral-600 font-medium text-base leading-relaxed">{item.desc}</p>
                <div className="absolute top-0 right-0 p-8 text-neutral-100 font-black text-6xl select-none group-hover:text-blue-50 transition-colors">
                  0{i+1}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Vision CTA */}
        <Section className="bg-white">
           <div className="bg-black p-12 lg:p-24 text-center relative overflow-hidden">
              <div className="relative z-10 max-w-3xl mx-auto">
                 <div className="inline-flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black">
                       <Wind size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-neutral-500 tracking-[0.4em]">Evolving Climate Control</span>
                 </div>
                 <h2 className="text-4xl lg:text-7xl font-medium text-white mb-12 tracking-tight">Standardizing the <br /> <span className="text-neutral-500 italic">Future of Fast.</span></h2>
                 <div className="flex flex-wrap justify-center gap-8">
                    <a href="/login" className="btn btn-primary px-12 py-5 border-white bg-white text-black hover:bg-neutral-200">Start Project</a>
                    <a href="/services" className="btn btn-secondary px-12 py-5 border-neutral-800 text-white hover:bg-neutral-900 bg-transparent">View Services</a>
                 </div>
              </div>
           </div>
        </Section>

      </Container>
    </motion.div>
  );
};

export default About;

