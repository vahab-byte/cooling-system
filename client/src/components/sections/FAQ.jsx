import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, HelpCircle, Phone, ArrowRight } from 'lucide-react';
import Section from '../ui/Section';
import Container from '../ui/Container';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What is the 'ArcticFresh Protocol'?",
      answer: "A surgical-grade maintenance standard involving 10-step chemical cleaning, antimicrobial coil treatment, and precision airflow calibration to restore factory-performance levels. Every session is documented with before/after temperature readings.",
      category: "Service"
    },
    {
      question: "How often should I schedule service?",
      answer: "For maximum efficiency and longevity, we recommend our Platinum Audit every 6 months for residential units and every 3 months for commercial environments. Regular maintenance can reduce energy bills by up to 25%.",
      category: "Maintenance"
    },
    {
      question: "Do you offer emergency 24/7 repair?",
      answer: "Yes. Our Elite members receive priority response within 2 hours, 24/7, across all serviced zones. We maintain a zero-downtime commitment. Standard customers receive same-day service if booked before 2 PM.",
      category: "Availability"
    },
    {
      question: "What components are covered in a standard audit?",
      answer: "Our audits cover everything from centrifugal fan cleaning and drain pan sterilization to refrigerant level optimization and electrical system safety checks. You receive a full digital report post-service.",
      category: "Coverage"
    },
    {
      question: "What warranty do you provide on repairs?",
      answer: "All repairs come with a 30-day service warranty on labour and 6 months on genuine parts. If the same issue recurs within warranty, we fix it at zero cost — no questions asked.",
      category: "Warranty"
    },
    {
      question: "How is pricing calculated?",
      answer: "Our pricing is always fixed and transparent. You get the full breakdown before work begins — labour charges, part costs, GST — and you only pay what was quoted. No surprises, ever.",
      category: "Pricing"
    }
  ];

  const categoryColors = {
    'Service': 'bg-blue-50 text-blue-600',
    'Maintenance': 'bg-green-50 text-green-600',
    'Availability': 'bg-orange-50 text-orange-600',
    'Coverage': 'bg-purple-50 text-purple-600',
    'Warranty': 'bg-red-50 text-red-600',
    'Pricing': 'bg-teal-50 text-teal-600',
  };

  return (
    <Section className="bg-white border-t border-neutral-100">
      <Container>
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">

          {/* Left sticky panel */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:sticky lg:top-32"
            >
              <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 mb-6">
                <HelpCircle size={13} className="text-slate-500" />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">FAQ</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-6">
                Got Questions?
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  We've Got Answers.
                </span>
              </h2>
              <p className="text-slate-500 leading-relaxed font-medium mb-10">
                Everything you need to know about our services, pricing, and protocols. Didn't find what you're looking for?
              </p>

              {/* CTA cards */}
              <div className="space-y-3">
                <Link to="/contact">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-5 rounded-2xl bg-slate-950 group cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageCircle size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-bold text-sm">Chat with an Engineer</div>
                      <div className="text-slate-400 text-xs font-medium">Avg. response: 3 min</div>
                    </div>
                    <ArrowRight size={16} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </motion.div>
                </Link>

                <a href="tel:+919999999999">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50 group cursor-pointer hover:border-slate-200 transition-all"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone size={20} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-slate-900 font-bold text-sm">Call Us Directly</div>
                      <div className="text-slate-400 text-xs font-medium">Mon–Sun, 8am–9pm</div>
                    </div>
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                  </motion.div>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right: FAQ Accordion */}
          <div className="lg:col-span-8 space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.6 }}
              >
                <div
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className={`rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                    openIndex === i
                      ? 'border-blue-200 bg-blue-50/50 shadow-sm shadow-blue-100'
                      : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center gap-4 p-6">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex-shrink-0 ${categoryColors[faq.category]}`}>
                        {faq.category}
                      </span>
                      <h3 className={`text-base font-bold tracking-tight transition-colors ${
                        openIndex === i ? 'text-blue-700' : 'text-slate-800'
                      }`}>
                        {faq.question}
                      </h3>
                    </div>
                    <motion.div
                      animate={{ rotate: openIndex === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        openIndex === i ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-200'
                      }`}
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-6 pb-6 pt-0">
                          <div className="h-px bg-blue-100 mb-4" />
                          <p className="text-slate-600 text-sm leading-relaxed font-medium">
                            {faq.answer}
                          </p>
                        </div>
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
