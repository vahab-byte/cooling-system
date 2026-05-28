import React from 'react';
import Hero from '../components/layout/Hero';
import StatsBanner from '../components/sections/StatsBanner';
import Services from '../components/sections/Services';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import ServiceProcess from '../components/sections/ServiceProcess';
import BookingSection from '../components/sections/BookingSection';
import Testimonials from '../components/sections/Testimonials';
import FAQ from '../components/sections/FAQ';
import SEO from '../components/common/SEO';

const Home = () => {
  return (
    <div className="bg-white">
      <SEO path="/" />
      <Hero />
      <StatsBanner />
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
