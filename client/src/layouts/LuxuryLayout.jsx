import React from 'react';
import { Outlet } from 'react-router-dom';
import LuxuryNavbar from '../components/luxury/Navbar';
import LuxuryFooter from '../components/luxury/Footer';
import '../components/luxury/global.css';

const LuxuryLayout = () => {
  return (
    <div className="luxury-arctic-theme antialiased selection:bg-cyan-500 selection:text-white">
      <LuxuryNavbar />
      <main>
        <Outlet />
      </main>
      <LuxuryFooter />
    </div>
  );
};

export default LuxuryLayout;
