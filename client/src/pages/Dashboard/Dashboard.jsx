import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { bookingService, dashboardService } from '../../services/api';
import { Calendar, Clock, MapPin, Tag, Loader2, AlertCircle, CheckCircle2, UserCircle2, Phone, Star, LayoutDashboard, History, CreditCard, ChevronRight, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_STAGES = ['pending', 'confirmed', 'assigned', 'en_route', 'in_progress', 'completed'];
const STATUS_LABELS = {
  'pending': 'Pending',
  'confirmed': 'Confirmed',
  'assigned': 'Technician Assigned',
  'en_route': 'En Route',
  'in_progress': 'In Progress',
  'completed': 'Completed',
  'cancelled': 'Cancelled'
};

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [overview, setOverview] = useState({ totalSpent: 0, activeCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [bookingsData, overviewData] = await Promise.all([
          bookingService.getUserBookings(user.id),
          dashboardService.getUserOverview(user.id)
        ]);
        setBookings(bookingsData || []);
        setOverview(overviewData || { totalSpent: 0, activeCount: 0 });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
       <div className="relative">
          <div className="w-20 h-20 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
          </div>
       </div>
       <div className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Initializing Terminal...</div>
    </div>
  );

  const activeBookings = bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row relative">
      
      {/* Tactical Sidebar Navigation */}
      <aside className="lg:w-80 bg-white/80 backdrop-blur-3xl border-r border-slate-100 p-8 flex flex-col sticky top-0 h-screen pt-32 lg:pt-32 z-20">
         <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8 ml-2">Main Protocol</div>
         <div className="space-y-3">
            {[
              { id: 'active', label: 'Active Jobs', icon: LayoutDashboard },
              { id: 'past', label: 'Service History', icon: History },
              { id: 'billing', label: 'Billing Matrix', icon: CreditCard },
              { id: 'settings', label: 'Profile Key', icon: Settings }
            ].map((btn) => {
              const Icon = btn.icon;
              const isActive = activeTab === btn.id;
              return (
                <button 
                  key={btn.id}
                  onClick={() => setActiveTab(btn.id)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all duration-500 group ${
                    isActive 
                    ? 'bg-slate-950 text-white shadow-2xl shadow-slate-950/20 translate-x-2' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                   <div className="flex items-center gap-4">
                      <Icon size={18} className={isActive ? 'text-primary' : 'group-hover:text-primary'} />
                      {btn.label}
                   </div>
                   {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                </button>
              );
            })}
         </div>

         <div className="mt-auto group">
            <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 relative overflow-hidden transition-all duration-700 hover:border-primary/30">
               <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">System Secure</span>
                  </div>
                  <div className="font-black text-slate-900 text-sm mb-1 tracking-tight">ArcticFresh <span className="text-primary">PRO</span></div>
                  <div className="text-[10px] font-medium text-slate-400 mb-6 leading-relaxed">Elite Priority Access Active. Operational 24/7.</div>
                  <button className="w-full py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all duration-500">Contact Control</button>
               </div>
            </div>
         </div>
      </aside>

      <main className="flex-1 p-6 lg:p-12 pt-32 lg:pt-32 relative z-10">
        {/* Tactical Header Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 relative">
           <div>
              <div className="flex items-center gap-3 mb-3">
                 <div className="w-8 h-[1px] bg-primary" />
                 <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Terminal Access</span>
              </div>
              <h1 className="text-5xl font-black text-slate-950 tracking-tighter mb-2">
                {activeTab === 'active' && 'Current '}{activeTab === 'past' && 'Historic '}{activeTab === 'billing' && 'Financial '}{activeTab === 'settings' && 'Identity '}<span className="text-primary italic">Status.</span>
              </h1>
              <div className="flex items-center gap-4 text-slate-400">
                 <p className="text-xs font-medium uppercase tracking-widest opacity-60">Authentication: <span className="text-slate-900 font-black">{user?.email}</span></p>
                 <div className="w-1 h-1 rounded-full bg-slate-200" />
                 <p className="text-xs font-medium uppercase tracking-widest opacity-60">System Mode: <span className="text-slate-900 font-black">Production</span></p>
              </div>
           </div>
           
           <div className="flex gap-10">
              <div className="relative group">
                 <div className="absolute -inset-4 bg-slate-50 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-all duration-500" />
                 <div className="relative">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] block mb-2">Aggregate Value</span>
                    <div className="flex items-baseline gap-1">
                       <span className="text-xs font-black text-slate-400">₹</span>
                       <span className="text-4xl font-black text-slate-950 tabular-nums tracking-tighter">{overview.totalSpent.toLocaleString()}</span>
                    </div>
                 </div>
              </div>
              <div className="relative group">
                 <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-all duration-500" />
                 <div className="relative">
                    <span className="text-[9px] font-black text-primary/40 uppercase tracking-[0.3em] block mb-2">Queue Status</span>
                    <div className="flex items-baseline gap-2">
                       <span className="text-4xl font-black text-primary tabular-nums tracking-tighter">{overview.activeCount}</span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Missions</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-[2rem] flex items-center gap-4 mb-8 font-black text-[10px] uppercase tracking-widest">
            <AlertCircle />
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'billing' ? (
             <motion.div 
               key="billing"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-premium"
             >
                <div className="flex justify-between items-center mb-12">
                   <div>
                      <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Ledger Protocol</div>
                      <h3 className="text-2xl font-black text-slate-950 tracking-tight">Financial Records</h3>
                   </div>
                   <button className="px-8 py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-950/20 hover:-translate-y-1 transition-all">Download Audit (.pdf)</button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="border-b border-slate-50">
                            <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Hash ID</th>
                            <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Timestamp</th>
                            <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Credit Value</th>
                            <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Verification</th>
                            <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 text-right">Gateway</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {bookings.filter(b => b.status === 'completed' || b.status === 'confirmed').map(b => (
                            <tr key={b.id} className="group hover:bg-slate-50/50 transition-colors">
                               <td className="py-8 font-mono font-black text-xs text-slate-950">#INV-{b.id.slice(0,12).toUpperCase()}</td>
                               <td className="py-8 text-xs font-black text-slate-400 uppercase font-mono">{new Date(b.booking_date).toLocaleDateString()}</td>
                               <td className="py-8 text-xs font-black text-slate-900 font-mono">₹{Number(b.total_amount).toLocaleString()}</td>
                               <td className="py-8">
                                  <span className="px-4 py-1.5 bg-emerald-50 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-100 flex items-center gap-2 w-fit">
                                     <div className="w-1 h-1 rounded-full bg-emerald-500" /> Verified
                                  </span>
                               </td>
                               <td className="py-8 text-right">
                                  <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                     <CreditCard size={18} />
                                  </button>
                               </td>
                            </tr>
                         ))}
                         {bookings.length === 0 && (
                            <tr>
                               <td colSpan="5" className="py-32 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">No data packets found in this sector.</td>
                            </tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </motion.div>
          ) : activeTab === 'settings' ? (
             <motion.div 
               key="settings"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="grid lg:grid-cols-3 gap-12"
             >
                <div className="lg:col-span-2 space-y-10">
                   <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-premium relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                      <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">Identity Core</div>
                      <h3 className="text-2xl font-black text-slate-950 tracking-tight mb-10">Operational Access Keys</h3>
                      <div className="space-y-8 relative z-10">
                         <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                               <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Codename</label>
                               <div className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-xs font-black text-slate-900 font-mono flex items-center gap-3">
                                  <UserCircle2 size={16} className="text-primary" />
                                  {user?.user_metadata?.full_name || 'ANONYMOUS'}
                               </div>
                            </div>
                            <div className="space-y-3">
                               <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Secure Link (Phone)</label>
                               <input type="text" placeholder="+91 XXX XXX XXXX" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-xs font-black outline-none focus:border-primary focus:bg-white transition-all font-mono" />
                            </div>
                         </div>
                         <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Verification Email</label>
                            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-5 text-xs font-black text-slate-400 font-mono opacity-60">
                               {user?.email}
                            </div>
                         </div>
                         <button className="px-12 py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:-translate-y-2 transition-all duration-500">Rotate Access Keys</button>
                      </div>
                   </div>
                </div>
                <div className="space-y-10">
                   <div className="bg-slate-950 rounded-[3rem] p-10 text-white relative overflow-hidden h-full">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />
                      <div className="relative z-10 flex flex-col h-full">
                         <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mb-10 border border-white/10 group hover:border-primary transition-all duration-700">
                            <Star className="text-primary group-hover:scale-125 transition-transform duration-700" size={36} />
                         </div>
                         <div className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-2">Service Era</div>
                         <h4 className="text-3xl font-black mb-4 tracking-tighter">Established</h4>
                         <p className="text-slate-400 text-sm mb-auto font-medium uppercase tracking-widest leading-relaxed">{new Date(user?.created_at).toLocaleDateString(undefined, {month: 'long', year: 'numeric'})}</p>
                         
                         <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-5 group hover:bg-white/10 transition-colors">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse ring-8 ring-emerald-500/10" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Active Duty Phase</span>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          ) : (activeTab === 'active' || activeTab === 'past') && (
            (activeTab === 'active' ? activeBookings : pastBookings).length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/50 backdrop-blur-3xl rounded-[3rem] p-32 text-center border-2 border-dashed border-slate-100 relative overflow-hidden"
              >
                {/* Radar Animation */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                   <div className="w-64 h-64 border border-primary rounded-full animate-ping" />
                   <div className="w-96 h-96 border border-primary rounded-full animate-[ping_3s_linear_infinite]" />
                </div>
                <div className="relative z-10">
                   <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                     <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                   </div>
                   <h3 className="text-3xl font-black text-slate-950 mb-3 tracking-tighter">Scanning Status...</h3>
                   <p className="text-slate-400 font-medium mb-12 max-w-sm mx-auto uppercase text-[10px] tracking-[0.3em] leading-relaxed">No active mission protocols detected in the current sector.</p>
                   <a href="/services" className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/40 hover:-translate-y-1 transition-all">Initiate Service Protocol</a>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-12"
              >
                {(activeTab === 'active' ? activeBookings : pastBookings).map((booking, bIdx) => {
                  const currentStageIndex = STATUS_STAGES.indexOf(booking.status);
                  const isCancelled = booking.status === 'cancelled';
                  const technician = booking.technicians;

                  return (
                    <motion.div 
                      key={booking.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: bIdx * 0.1 }}
                      className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-premium group hover:border-primary/20 transition-all duration-700 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-8">
                         <div className="bg-slate-50 px-6 py-2.5 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">ID: {booking.id.slice(0, 12).toUpperCase()}</span>
                         </div>
                      </div>

                      <div className="flex flex-col xl:flex-row gap-16">
                        
                        {/* Dossier Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-8 mb-12">
                             <div className="w-24 h-24 rounded-[2.5rem] bg-slate-950 flex items-center justify-center text-primary shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative group-hover:scale-105 transition-transform duration-700">
                                <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] animate-pulse" />
                                <Tag size={40} className="relative z-10" />
                             </div>
                             <div>
                                <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-2">Service Classification</div>
                                <h3 className="text-4xl font-black text-slate-950 tracking-tighter mb-2 group-hover:text-primary transition-colors">{booking.services?.title}</h3>
                                <div className="flex items-center gap-3">
                                   <div className="w-2 h-[1px] bg-primary" />
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{booking.services?.category} Division</span>
                                </div>
                             </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-8">
                             <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 flex items-center gap-8 group/item hover:bg-white hover:shadow-2xl transition-all duration-500">
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all duration-500">
                                   <Calendar size={24} />
                                </div>
                                <div>
                                   <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-2">Launch Window</div>
                                   <div className="text-sm font-black text-slate-900 font-mono uppercase tracking-tighter">
                                     {new Date(booking.booking_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}).toUpperCase()}
                                     <span className="block text-primary mt-1">{new Date(booking.booking_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})} HRS</span>
                                   </div>
                                </div>
                             </div>
                             <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 flex items-center gap-8 group/item hover:bg-white hover:shadow-2xl transition-all duration-500 overflow-hidden">
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all duration-500">
                                   <MapPin size={24} />
                                </div>
                                <div className="truncate">
                                   <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-2">Vector (Location)</div>
                                   <div className="text-sm font-black text-slate-900 truncate font-mono uppercase tracking-tighter">{booking.address}</div>
                                </div>
                             </div>
                          </div>
                        </div>

                        {/* Tactical HUD Column */}
                        <div className="flex-1 lg:max-w-md space-y-12">
                           
                           {/* Expert Attribution */}
                           {technician ? (
                              <div className="bg-slate-950 rounded-[3rem] p-6 pr-12 shadow-2xl relative overflow-hidden group/tech">
                                 <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all" />
                                 <div className="flex items-center gap-8 relative z-10">
                                    <div className="w-24 h-24 rounded-[2rem] bg-white/5 overflow-hidden border border-white/10 p-1.5 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-700">
                                      {technician.avatar_url ? (
                                        <img src={technician.avatar_url} alt={technician.name} className="w-full h-full object-cover rounded-[1.6rem]" />
                                      ) : (
                                        <UserCircle2 size={56} className="text-white/10" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                       <div className="flex items-center gap-3 mb-2">
                                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Expert On-Grid</span>
                                       </div>
                                       <h4 className="font-black text-white text-2xl tracking-tighter mb-4">{technician.name}</h4>
                                       <div className="flex items-center gap-8">
                                          <div className="flex items-center gap-2 text-[10px] font-black text-white/40">
                                             <Star size={14} className="text-primary" fill="currentColor" /> {technician.rating || '4.9'}
                                          </div>
                                          <a href={`tel:${technician.phone}`} className="px-6 py-2 bg-white/10 hover:bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500">
                                             Comm Link
                                          </a>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ) : (
                              <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center">
                                 <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 relative hover:scale-110 transition-transform">
                                    <div className="absolute inset-0 border-2 border-primary/20 border-t-primary rounded-3xl animate-spin" />
                                    <Clock size={28} className="text-primary/40" />
                                 </div>
                                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] leading-relaxed">Scanning Network for Optimal Professional Intelligence...</p>
                              </div>
                           )}

                           {/* Status Pipeline Protocol */}
                           {!isCancelled && (
                              <div className="relative pt-8 px-2">
                                 <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-3">
                                       <div className="w-4 h-[1px] bg-slate-200" />
                                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Operational Phase</span>
                                    </div>
                                    <span className="text-[11px] font-black text-primary uppercase tracking-[0.4em] drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">{STATUS_LABELS[booking.status]}</span>
                                 </div>
                                 
                                 <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden mb-12 shadow-inner">
                                    <div 
                                      className="absolute top-0 left-0 h-full bg-primary glow-pulse transition-all duration-1000 ease-in-out"
                                      style={{ width: `${((currentStageIndex + 1) / STATUS_STAGES.length) * 100}%` }}
                                    />
                                 </div>

                                 <div className="flex justify-between relative">
                                   {STATUS_STAGES.map((stage, index) => {
                                     const isCompleted = index <= currentStageIndex;
                                     const isActive = index === currentStageIndex;
                                     
                                     return (
                                       <div key={stage} className="relative group">
                                          <div className={`w-4 h-4 rounded-full transition-all duration-700 cursor-help ${
                                            isActive ? 'bg-primary scale-[1.8] ring-8 ring-primary/10 shadow-[0_0_20px_rgba(59,130,246,0.6)]' : 
                                            isCompleted ? 'bg-slate-950 scale-110' : 'bg-slate-200'
                                          }`} />
                                          <div className={`absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none whitespace-nowrap bg-slate-950 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2.5 rounded-xl z-30 shadow-2xl`}>
                                             {STATUS_LABELS[stage]}
                                          </div>
                                       </div>
                                     );
                                   })}
                                 </div>
                              </div>
                           )}
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
