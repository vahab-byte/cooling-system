import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, ShieldCheck, Snowflake, Wrench, Check, ArrowRight } from 'lucide-react';
import { contentService } from '../../services/api';
import { services as fallbackServices } from '../../data';
import BookingModal from '../common/BookingModal';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Section from '../ui/Section';
import Container from '../ui/Container';

const iconMap = {
  Wind, ShieldCheck, Snowflake, Wrench
};

const Services = () => {
  const [activeCategory, setActiveCategory] = useState('service');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState({ open: false, service: null });

  useEffect(() => {
    const fetchServices = async () => {
       try {
         const data = await contentService.getServices();
         setServices(data && data.length > 0 ? data : fallbackServices);
       } catch (err) {
         setServices(fallbackServices);
       } finally {
         setLoading(false);
       }
    };
    fetchServices();
  }, []);

  const categories = [
    { id: 'service', label: 'AC Service' },
    { id: 'repair', label: 'Repair & Gas' },
    { id: 'install', label: 'Installation' }
  ];

  const filteredServices = services.filter(s => s.category === activeCategory);

  if (loading) return (
    <Section className="flex items-center justify-center min-h-[400px]">
       <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
    </Section>
  );

  return (
    <>
      <Section id="services" className="bg-white">
        <Container>
          <div className="max-w-3xl mb-24">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-4xl lg:text-7xl font-bold text-black mb-8 tracking-tighter">
                Engineering <br />
                <span className="text-blue-600 font-display italic">Catalog.</span>
              </h2>
              <p className="text-xl text-neutral-600 leading-relaxed max-w-xl font-medium">
                Explore our industrial-grade HVAC protocols. Surgical precision for every environment.
              </p>
            </motion.div>
          </div>

          {/* Minimal Category Switcher */}
          <div className="flex flex-wrap gap-12 mb-20 border-b border-neutral-200">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`pb-6 text-sm font-bold uppercase tracking-widest transition-all relative ${
                  activeCategory === cat.id 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-neutral-400 hover:text-black'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
            >
              {filteredServices.map((service, index) => {
                const Icon = iconMap[service.icon] || Wind;
                const features = service.features || service.includes || [];
                return (
                  <motion.div 
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                  >
                    <Card padding="none" className="h-full flex flex-col group border-neutral-200 hover:border-blue-600 transition-all duration-500 hover:shadow-2xl">
                      <div className="p-12 flex-1">
                        <div className="mb-10 text-blue-600 group-hover:scale-110 transition-transform duration-500">
                          <Icon size={36} strokeWidth={2} />
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-4 tracking-tight group-hover:text-blue-600 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-neutral-600 text-sm leading-relaxed mb-10 font-medium">
                          {service.description}
                        </p>
                        
                        <div className="space-y-5">
                          {features.slice(0, 4).map((f, i) => (
                            <div key={i} className="flex items-center gap-4 text-xs font-bold text-neutral-500 uppercase tracking-wide">
                              <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                                <Check size={12} className="text-blue-600" strokeWidth={3} />
                              </div>
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-12 pt-0 mt-auto">
                        <div className="pt-10 border-t border-neutral-200 flex items-center justify-between">
                          <div>
                            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Fixed Investment</div>
                            <div className="flex items-baseline gap-2">
                               <span className="text-4xl font-bold text-black tracking-tighter">₹{service.price}</span>
                               {service.originalPrice && (
                                 <span className="text-sm text-neutral-300 line-through font-bold">₹{service.originalPrice}</span>
                               )}
                            </div>
                          </div>
                          <Button 
                            variant="primary"
                            className="w-14 h-14 !p-0 bg-black text-white hover:bg-blue-600 rounded-none transition-colors"
                            onClick={() => setBookingModal({ open: true, service })}
                          >
                            <ArrowRight size={24} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </Container>
      </Section>

      <BookingModal 
        isOpen={bookingModal.open}
        onClose={() => setBookingModal({ open: false, service: null })}
        serviceId={bookingModal.service?.id}
        serviceTitle={bookingModal.service?.title}
        price={bookingModal.service?.price}
      />
    </>
  );
};

export default Services;
