import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, BadgeCheck, IndianRupee, Truck, Award } from 'lucide-react';
import Section from '../ui/Section';
import Container from '../ui/Container';

const reasons = [
  {
    icon: BadgeCheck,
    title: 'Certified Technicians',
    desc: 'All our engineers are OEM-certified with 500+ hours of hands-on training before their first visit.'
  },
  {
    icon: Truck,
    title: 'Doorstep Service',
    desc: 'We come to you. No need to carry heavy units anywhere — service happens at your location.'
  },
  {
    icon: Clock,
    title: 'Same-Day Repair',
    desc: 'Book before 12 PM and get same-day service. We maintain a 2-hour rapid response window.'
  },
  {
    icon: IndianRupee,
    title: 'Transparent Pricing',
    desc: 'No hidden charges. You see the full breakdown — labour, parts, tax — before we start.'
  },
  {
    icon: ShieldCheck,
    title: 'Service Warranty',
    desc: 'Every repair comes with a 30-day service warranty on labour and 6 months on genuine parts.'
  },
  {
    icon: Award,
    title: 'Genuine Parts Only',
    desc: 'We use only manufacturer-approved spare parts with proper warranty documentation.'
  }
];

const WhyChooseUs = () => {
  return (
    <Section className="bg-neutral-50 border-t border-neutral-100">
      <Container>
        <div className="max-w-3xl mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-7xl font-bold text-black mb-8 tracking-tighter">
              Why <br />
              <span className="text-blue-600 font-display italic">Choose Us.</span>
            </h2>
            <p className="text-xl text-neutral-600 leading-relaxed max-w-xl font-medium">
              Trusted by 5,000+ homes and businesses across Ahmedabad. Here's what sets our engineering apart.
            </p>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {reasons.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="group p-10 bg-white border border-neutral-200 hover:border-blue-600 transition-all duration-500 hover:shadow-xl"
            >
              <div className="mb-8 text-blue-600 group-hover:scale-110 transition-transform duration-500">
                <item.icon size={32} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-black mb-4 tracking-tight group-hover:text-blue-600 transition-colors">{item.title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default WhyChooseUs;
