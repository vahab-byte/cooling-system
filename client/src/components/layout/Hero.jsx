import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Wind } from 'lucide-react';
import Button from '../ui/Button';
import Container from '../ui/Container';
import Section from '../ui/Section';

const Hero = () => {
  return (
    <Section padding="none" className="min-h-[90vh] flex items-center pt-20 bg-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content: Minimal & High-Contrast */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-neutral-500">Precision Engineering</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-9xl font-medium leading-[1.05] tracking-tight text-black mb-8">
              Air. <br />
              <span className="text-blue-600 font-display italic">Optimization.</span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 mb-12 max-w-md leading-relaxed font-medium">
              Industrial-grade AC maintenance for architectural environments. Precision cooling with zero compromise on air purity.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => window.location.href = '/services'}
                className="group px-10 py-4"
              >
                Plan Your Audit
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="secondary" onClick={() => window.location.href = '/pricing'} className="px-10 py-4 border-neutral-300">
                View Pricing
              </Button>
            </div>

            <div className="mt-20 pt-10 border-t border-neutral-200 flex gap-16">
              <div>
                <div className="text-3xl font-bold text-black tracking-tighter">12yr+</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mt-2">Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black tracking-tighter">99.9%</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mt-2">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black tracking-tighter">Elite</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mt-2">Standard</div>
              </div>
            </div>
          </motion.div>

          {/* Right Content: Focused Product Dominance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative"
          >
            {/* Subtle Airflow Mist */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
               <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black/5 to-transparent blur-md animate-airflow-clean" />
               <div className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black/5 to-transparent blur-md animate-airflow-clean [animation-delay:2s]" />
               <div className="absolute top-2/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black/5 to-transparent blur-md animate-airflow-clean [animation-delay:4s]" />
            </div>

            <div className="relative group">
              <div className="relative z-10 bg-neutral-50 p-12 transition-transform duration-700 group-hover:scale-[1.02]">
                <img 
                  src="https://images.unsplash.com/photo-1591185520173-05bbd9440692?q=80&w=1200" 
                  alt="Premium Industrial AC" 
                  className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000 object-cover"
                />
              </div>
              
              {/* Floating Specification Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-black text-white p-6 shadow-2xl z-20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                    <Wind size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-50">Status</div>
                    <div className="text-lg font-medium tracking-tight">Active Ops</div>
                  </div>
                </div>
              </motion.div>

              {/* Minimal Shadow */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-black/5 blur-[40px] rounded-full" />
            </div>
          </motion.div>

        </div>
      </Container>
    </Section>
  );
};

export default Hero;
