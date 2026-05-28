import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ChatWidget from '../components/common/ChatWidget';
import CallWidget from '../components/common/CallWidget';
import ScrollToTop from '../components/common/ScrollToTop';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-black antialiased selection:bg-black selection:text-white">
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <CallWidget />
      <ChatWidget />
      <Footer />
    </div>
  );
};

export default MainLayout;
