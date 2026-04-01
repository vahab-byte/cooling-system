import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Section from '../ui/Section';
import Container from '../ui/Container';
import Card from '../ui/Card';

const Testimonials = () => {
  const reviews = [
    {
      name: "Sanjay Sharma",
      role: "Corporate Manager",
      text: "The precision they bring to HVAC maintenance is unparalleled. Our office cooling has never been more stable.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=sanjay"
    },
    {
      name: "Priya Patel",
      role: "Homeowner",
      text: "Transformative experience. They didn't just fix the AC; they optimized our entire indoor environment.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=priya"
    },
    {
      name: "Vikram Malhotra",
      role: "Studio Director",
      text: "Elite service for elite spaces. Their attention to detail and zero-noise protocol is exactly what we needed.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=vikram"
    }
  ];

  return (
    <Section className="bg-neutral-50">
      <Container>
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-6xl font-medium text-black mb-8 tracking-tight">
              Elite <br />
              <span className="text-neutral-400 font-display">Standard Feedback.</span>
            </h2>
            <p className="text-lg text-neutral-500 max-w-xl mx-auto leading-relaxed">
              Join the ranks of thousands who have upgraded to the ArcticFresh surgical-grade maintenance protocol.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
            >
              <Card className="h-full border-neutral-100 flex flex-col">
                <Quote className="text-black mb-8 opacity-10" size={40} />
                <p className="text-lg text-neutral-600 mb-12 italic leading-relaxed font-medium">
                  "{r.text}"
                </p>
                
                <div className="flex items-center gap-4 mt-auto border-t border-neutral-100 pt-8">
                  <img 
                    src={r.avatar} 
                    alt={r.name} 
                    className="w-12 h-12 rounded-full grayscale object-cover" 
                  />
                  <div>
                    <div className="text-black font-bold text-sm tracking-tight">{r.name}</div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{r.role}</div>
                  </div>
                </div>

                <div className="flex gap-1 mt-6">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} size={12} fill="black" className="text-black" />
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default Testimonials;
