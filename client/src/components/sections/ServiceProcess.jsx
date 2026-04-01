import React from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, ClipboardList, UserCheck, Search, Wrench, FileCheck } from 'lucide-react';
import Section from '../ui/Section';
import Container from '../ui/Container';

const steps = [
  {
    icon: CalendarCheck,
    step: '01',
    title: 'Book Service',
    desc: 'Choose your service and pick a convenient date & time slot online or by calling us.'
  },
  {
    icon: ClipboardList,
    step: '02',
    title: 'Share Issue Details',
    desc: 'Tell us about your AC model, type, and the problems you are facing for faster diagnosis.'
  },
  {
    icon: UserCheck,
    step: '03',
    title: 'Technician Assigned',
    desc: 'A certified technician is assigned and dispatched to your location within hours.'
  },
  {
    icon: Search,
    step: '04',
    title: 'Inspection & Quotation',
    desc: 'On-site diagnosis with transparent upfront cost breakdown before any work begins.'
  },
  {
    icon: Wrench,
    step: '05',
    title: 'Repair & Testing',
    desc: 'Professional repair with genuine parts followed by thorough cooling and performance tests.'
  },
  {
    icon: FileCheck,
    step: '06',
    title: 'Invoice & Warranty',
    desc: 'Digital invoice with warranty certificate delivered instantly to your phone and email.'
  }
];

const ServiceProcess = () => {
  return (
    <Section className="bg-black text-white">
      <Container>
        <div className="max-w-3xl mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-7xl font-bold text-white mb-8 tracking-tighter">
              The <br />
              <span className="text-blue-500 font-display italic">Protocol.</span>
            </h2>
            <p className="text-xl text-neutral-400 leading-relaxed max-w-xl font-medium">
              From booking to warranty — a streamlined 6-step process designed for zero hassle and maximum technical efficiency.
            </p>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-900 border border-neutral-900">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="bg-black p-12 group hover:bg-neutral-950 transition-colors duration-500"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="text-blue-500 group-hover:scale-110 transition-transform duration-500">
                  <item.icon size={32} strokeWidth={2} />
                </div>
                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">
                  Phase {item.step}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-blue-500 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed font-normal">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default ServiceProcess;
