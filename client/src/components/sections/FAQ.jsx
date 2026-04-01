import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';
import Section from '../ui/Section';
import Container from '../ui/Container';
import Card from '../ui/Card';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What is the 'ArcticFresh Protocol'?",
      answer: "A surgical-grade maintenance standard involving 10-step chemical cleaning, antimicrobial coil treatment, and precision airflow calibration to restore factory-performance."
    },
    {
      question: "How often should I schedule service?",
      answer: "For maximum efficiency and longevity, we recommend our Platinum Audit every 6 months for residential units and every 3 months for commercial environments."
    },
    {
      question: "Do you offer emergency 24/7 repair?",
      answer: "Yes. Our Elite members receive priority response within 2 hours, 24/7, across all serviced zones. We maintain a zero-downtime commitment."
    },
    {
      question: "What components are covered in a standard audit?",
      answer: "Our audits cover everything from centrifugal fan cleaning and drain pan sterilization to refrigerant level optimization and electrical system safety checks."
    }
  ];

  return (
    <Section className="bg-white border-t border-neutral-100">
      <Container>
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
          
          <div className="lg:col-span-5">
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-4xl lg:text-6xl font-medium text-black mb-8 tracking-tight leading-[1.1]">
                 Expert <br />
                 <span className="text-neutral-400 font-display">Insights Hub.</span>
              </h2>
              <p className="text-lg text-neutral-500 leading-relaxed mb-12">
                Everything you need to know about optimizing your architectural comfort. Our engineers provide surgical precision for your cooling ecosystem.
              </p>
              
              <Card variant="flat" padding="small" className="group cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center transition-transform group-hover:scale-110">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <div className="text-black font-bold text-sm">Need dedicated help?</div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Speak with an Engineer</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
              >
                <div 
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className={`border-b border-neutral-100 cursor-pointer overflow-hidden transition-all duration-500 pb-6 ${
                    openIndex === i ? 'mb-8' : 'hover:opacity-70'
                  }`}
                >
                  <div className="flex justify-between items-center gap-8">
                    <h3 className={`text-lg lg:text-xl font-medium tracking-tight transition-colors ${
                      openIndex === i ? 'text-black' : 'text-neutral-400'
                    }`}>
                      {faq.question}
                    </h3>
                    <div className={`transition-transform duration-500 ${
                      openIndex === i ? 'rotate-180 text-black' : 'text-neutral-300'
                    }`}>
                      <ChevronDown size={20} />
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 20 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <p className="text-neutral-500 text-base leading-relaxed max-w-2xl">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default FAQ;
