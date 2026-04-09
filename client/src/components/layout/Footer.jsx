import React from 'react';
import { Link } from 'react-router-dom';
import { Wind, Mail, Phone, MapPin, ArrowUpRight, ArrowRight } from 'lucide-react';
import Container from '../ui/Container';

const Footer = () => {
  const hubs = [
    { name: "Satellite", status: "Operational" },
    { name: "Vastrapur", status: "Operational" },
    { name: "Bopal", status: "Operational" },
    { name: "Prahlad Nagar", status: "Operational" },
    { name: "Bodakdev", status: "Operational" },
    { name: "Thaltej", status: "Operational" },
    { name: "Gota", status: "Operational" },
    { name: "Memnagar", status: "Operational" },
    { name: "South Bopal", status: "Operational" },
    { name: "Navrangpura", status: "Operational" }
  ];

  return (
    <footer className="bg-slate-50 text-slate-600 pt-20 pb-12 border-t border-slate-200 overflow-hidden relative">
      {/* Subtle Blue Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      
      <Container>
        <div className="flex flex-col lg:flex-row items-start justify-between mb-16 gap-12">
          <div className="max-w-xl">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-primary shadow-sm">
                   <Wind size={20} />
                </div>
                <Link to="/" className="text-xl font-bold tracking-tight text-slate-950 group">
                   ArcticFresh<span className="w-1 h-1 bg-primary rounded-full inline-block ml-1" />
                </Link>
             </div>
             <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-md mb-8 italic">
                Engineering sophisticated comfort through precision maintenance and premium care since 2014. Ahmedabad's most trusted partner.
             </p>
             <div className="flex gap-3">
                <a href="tel:+919999999999" className="px-5 py-2.5 bg-slate-950 text-white rounded-lg text-[10px] font-bold hover:bg-primary transition-all">Call Support</a>
                <Link to="/booking" className="px-5 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-all">Schedule Service</Link>
             </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 lg:gap-20 w-full lg:w-auto">
             <div>
                <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-primary mb-6">Services</h4>
                <ul className="space-y-3 text-slate-500 text-xs font-medium">
                   <li><Link to="/services" className="hover:text-slate-950 transition-colors">Deep Cleaning</Link></li>
                   <li><Link to="/services" className="hover:text-slate-950 transition-colors">Installation</Link></li>
                   <li><Link to="/pricing" className="hover:text-slate-950 transition-colors">Yearly AMC</Link></li>
                   <li><Link to="/services" className="hover:text-slate-950 transition-colors">Repair Works</Link></li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-primary mb-6">Company</h4>
                <ul className="space-y-3 text-slate-500 text-xs font-medium">
                   <li><Link to="/about" className="hover:text-slate-950 transition-colors">About Us</Link></li>
                   <li><Link to="/blog" className="hover:text-slate-950 transition-colors">Our Blog</Link></li>
                   <li><Link to="/contact" className="hover:text-slate-950 transition-colors">Contact</Link></li>
                   <li><Link to="/pricing" className="hover:text-slate-950 transition-colors">View Pricing</Link></li>
                </ul>
             </div>
          </div>
        </div>

        {/* Regional Network Grid - Tightened */}
        <div className="py-10 border-y border-slate-200 mb-10">
           <div className="flex items-center gap-3 mb-8">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">Regional Hubs</span>
              <div className="flex-1 h-[1px] bg-slate-100" />
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-4 gap-x-6">
             {hubs.map((hub, i) => (
                <div key={i} className="flex items-center gap-2 group cursor-default">
                  <div className="w-1 h-1 rounded-full bg-slate-200 group-hover:bg-primary" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-950 transition-colors">{hub.name}</span>
                </div>
             ))}
           </div>
        </div>

        {/* Support & Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                © 2026 ARCTICFRESH <span className="mx-2 text-slate-200">|</span> Ahmedabad, India
              </div>
              <div className="flex gap-6 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                <Link to="#" className="hover:text-slate-950 transition-colors">Privacy Policy</Link>
                <Link to="#" className="hover:text-slate-950 transition-colors">Terms of Service</Link>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 italic">Precision Engineered Comfort.</span>
           </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
