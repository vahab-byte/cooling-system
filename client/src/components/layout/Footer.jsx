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
    <footer className="bg-[#0a0a0a] text-white pt-32 pb-16 overflow-hidden border-t border-white/5">
      <Container>
        {/* Protocol 01: Core Command */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-32 gap-16">
          <div className="max-w-2xl">
             <div className="flex items-center gap-6 mb-10">
                <div className="w-14 h-14 border border-white/10 flex items-center justify-center bg-[#111111] shadow-2xl">
                   <Wind size={28} className="text-blue-500" />
                </div>
                <div>
                   <Link to="/" className="text-4xl font-black tracking-[0.3em] text-white uppercase italic leading-none">
                      Arctic<span className="text-blue-500">Fresh.</span>
                   </Link>
                   <div className="flex items-center gap-3 mt-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                      <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">Command Pulse: Sector Active</span>
                   </div>
                </div>
             </div>
             <p className="text-xl text-neutral-400 font-medium leading-relaxed italic max-w-xl">
                Engineering absolute comfort through precision maintenance and transparent digital recovery protocols. Ahmedabad's surgical AC service station since 2014.
             </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 w-full lg:w-auto">
             <div className="p-10 border border-white/5 bg-[#111111] flex flex-col items-start min-w-[280px] shadow-2xl relative group overflow-hidden">
                <div className="relative z-10 text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-6">Service Load</div>
                <div className="relative z-10 text-5xl font-black text-white tracking-tighter mb-2 italic">14<span className="text-blue-500">/25</span></div>
                <div className="relative z-10 text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Active Engineering Squads</div>
                <div className="absolute top-0 right-0 p-8 text-white/5 font-black text-8xl select-none translate-x-4 -translate-y-4">
                   OPS
                </div>
             </div>
             <Link to="/booking" className="bg-blue-600 text-white p-10 flex flex-col items-start justify-between min-w-[320px] hover:bg-white hover:text-black transition-all duration-700 group relative overflow-hidden shadow-2xl">
                <div className="relative z-10 text-[11px] font-black uppercase tracking-[0.5em] mb-10">Instant Dispatch</div>
                <div className="relative z-10 text-3xl font-black tracking-tighter uppercase italic flex items-center gap-6 group-hover:translate-x-3 transition-transform">
                  Book Protocol <ArrowUpRight size={32} />
                </div>
                <div className="absolute top-0 right-0 p-8 text-black/5 font-black text-9xl select-none group-hover:text-black/10 transition-all duration-700">
                  SOS
                </div>
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-20 mb-32 border-t border-white/5 pt-24">
          
          {/* Protocol 02: Regional Architecture */}
          <div className="lg:col-span-5">
            <h4 className="font-black mb-12 uppercase text-[12px] tracking-[0.5em] text-blue-500 border-b border-white/10 inline-block pb-2">Regional Hubs</h4>
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              {hubs.map((hub, i) => (
                <div key={i} className="flex items-center justify-between group cursor-default border-b border-white/[0.03] pb-3">
                  <div className="flex items-center gap-4">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20 group-hover:bg-blue-500 transition-all duration-500" />
                     <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest group-hover:text-white transition-colors">{hub.name}</span>
                  </div>
                  <span className="text-[9px] font-black text-white/10 uppercase tracking-widest group-hover:text-blue-500 transition-colors">{hub.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Protocol 03: Service Parameters */}
          <div className="lg:col-span-3">
            <h4 className="font-black mb-12 uppercase text-[12px] tracking-[0.5em] text-blue-500 border-b border-white/10 inline-block pb-2">Parameters</h4>
            <ul className="space-y-8 text-neutral-400 text-[12px] font-black uppercase tracking-[0.3em]">
              <li><Link to="/services" className="hover:text-blue-500 transition-all flex items-center justify-between group">Deep bio-clean <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
              <li><Link to="/services" className="hover:text-blue-500 transition-all flex items-center justify-between group">Precision Install <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
              <li><Link to="/pricing" className="hover:text-blue-500 transition-all flex items-center justify-between group">Protection AMC <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
              <li><Link to="/services" className="hover:text-blue-500 transition-all flex items-center justify-between group">Thermal Recovery <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
            </ul>
          </div>

          {/* Protocol 04: Digital Ecosystem */}
          <div className="lg:col-span-4 lg:ml-auto">
            <h4 className="font-black mb-12 uppercase text-[12px] tracking-[0.5em] text-blue-500 border-b border-white/10 inline-block pb-2">Eco-System</h4>
            <div className="space-y-10">
              <div className="group">
                 <div className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-4">Support Direct</div>
                 <div className="text-2xl font-black text-white tracking-tighter italic hover:text-blue-500 transition-colors cursor-pointer">+91 99999 99999</div>
              </div>
              <div className="group">
                 <div className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-4">Operations Interface</div>
                 <div className="text-xl font-black text-white tracking-tight hover:text-blue-500 transition-colors cursor-pointer uppercase italic">ops@arcticfresh.com</div>
              </div>
              <Link to="/contact" className="inline-flex items-center gap-4 text-[11px] font-black text-blue-500 hover:text-white transition-all uppercase tracking-[0.4em] pt-4 group">
                 Initialize Support Channel <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
        
        {/* Trust Integrity Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-24 border-y border-white/5 py-16">
          {[
            { icon: Wind, label: "OEM Certified Spares" },
            { icon: Wind, label: "ISO-9001 Protocol" },
            { icon: Wind, label: "Real-time Telemetry" },
            { icon: Wind, label: "Engineering AMC" }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-center lg:justify-start gap-6 text-neutral-600 hover:text-blue-500 transition-all duration-500 group cursor-default">
              <div className="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                 <item.icon size={20} className="group-hover:rotate-12 transition-transform duration-700" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] group-hover:text-white transition-colors">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 pt-8">
           <div className="text-neutral-600 text-[11px] font-black uppercase tracking-[0.5em] flex items-center gap-4">
            © 2026 ARCTICFRESH OPS <span className="w-1 h-1 bg-white/10 rounded-full" /> Ahmedabad, IND
          </div>
          
          <div className="flex gap-12 text-neutral-500 text-[10px] font-black uppercase tracking-[0.4em]">
            <Link to="#" className="hover:text-white transition-all">Privacy Protocol</Link>
            <Link to="#" className="hover:text-white transition-all">Service Parameters</Link>
            <Link to="#" className="hover:text-white transition-all">Command Access</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
