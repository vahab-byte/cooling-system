import React from 'react';
import Hero from '../components/layout/Hero';
import Services from '../components/sections/Services';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import ServiceProcess from '../components/sections/ServiceProcess';
import BookingSection from '../components/sections/BookingSection';
import Testimonials from '../components/sections/Testimonials';
import FAQ from '../components/sections/FAQ';

const Home = () => {
  return (
    <div className="bg-white">
      <Hero />
      <Services />
      <WhyChooseUs />
      <ServiceProcess />
      <BookingSection />
      <Testimonials />
      <FAQ />
    </div>
  );
};

export default Home;
