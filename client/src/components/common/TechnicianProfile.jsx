import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle2, Phone, Star, ShieldCheck, MapPin, Award, PlayCircle, X } from 'lucide-react';

const TechnicianProfile = ({ technician }) => {
  const [showVideo, setShowVideo] = useState(false);

  // Mock extended data if not provided by backend yet
  const rating = technician.rating || "4.9";
  const jobsCompleted = technician.jobsCompleted || "450+";
  const experience = technician.experience || "6 Years";

  return (
    <>
      <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />
        
        {/* Verification Badge */}
        <div className="absolute top-3 right-3 bg-green-500/20 border border-green-500/30 px-2 py-1 rounded-md flex items-center gap-1 z-10">
          <ShieldCheck size={12} className="text-green-400" />
          <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest">Verified</span>
        </div>

        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden border border-slate-700">
                {technician.avatar_url ? (
                  <img src={technician.avatar_url} alt={technician.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><UserCircle2 size={32} className="text-slate-500" /></div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-slate-950 border border-slate-800 rounded-lg p-1">
                <div className="flex items-center gap-0.5 px-1">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] font-bold">{rating}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 pt-1">
              <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">Assigned Expert</div>
              <h4 className="font-bold text-lg mb-1">{technician.name}</h4>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Award size={12} /> {experience} Exp</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="flex items-center gap-1"><ShieldCheck size={12} /> {jobsCompleted} Jobs</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <a 
              href={`tel:${technician.phone}`} 
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-2.5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-blue-500/20"
            >
              <Phone size={14} /> Call Expert
            </a>
            <button 
              onClick={() => setShowVideo(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-2.5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors border border-slate-700"
            >
              <PlayCircle size={14} /> Meet Expert
            </button>
          </div>
        </div>
      </div>

      {/* Video Intro Modal */}
      <AnimatePresence>
        {showVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-800"
            >
              <div className="p-4 flex items-center justify-between bg-slate-950">
                <div>
                  <h3 className="font-bold text-white">Meet {technician.name.split(' ')[0]}</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Background Verified Expert</p>
                </div>
                <button onClick={() => setShowVideo(false)} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700">
                  <X size={16} />
                </button>
              </div>
              
              <div className="aspect-[9/16] bg-slate-800 relative flex items-center justify-center">
                {/* Mock Video Player */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                <img 
                  src={technician.avatar_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=600&auto=format&fit=crop'} 
                  alt="Technician Video" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 z-20 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4 animate-pulse cursor-pointer">
                    <PlayCircle size={24} className="text-white" />
                  </div>
                  <p className="text-sm font-medium text-white mb-1">Hi, I'm {technician.name}</p>
                  <p className="text-xs text-slate-300">I will be fixing your AC today. I have 6 years of experience and I carry all genuine parts. See you soon!</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TechnicianProfile;
