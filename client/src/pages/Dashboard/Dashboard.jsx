import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { bookingService, dashboardService, paymentService } from '../../services/api';
import { Calendar, Clock, MapPin, Tag, Loader2, AlertCircle, CheckCircle2, UserCircle2, Phone, Star, LayoutDashboard, History, CreditCard, ChevronRight, Settings, Sparkles, Bell, Download, MessageSquarePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadRazorpay } from '../../components/common/RazorpayLoader';
import { toast } from 'react-hot-toast';

import ProgressTracker from './ProgressTracker';
import ReviewModal from './ReviewModal';
import SupportTab from './SupportTab';
import { downloadInvoice } from './InvoiceGenerator';

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
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [reviewModalData, setReviewModalData] = useState(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [bookingsData, overviewData, notifData] = await Promise.all([
        bookingService.getUserBookings(user.id),
        dashboardService.getUserOverview(user.id),
        dashboardService.getUserNotifications(user.id)
      ]);
      setBookings(bookingsData || []);
      setOverview(overviewData || { totalSpent: 0, activeCount: 0 });
      setNotifications(notifData || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (booking) => {
    const loadingToast = toast.loading('Initializing Secure Payment Protocol...');
    try {
      const res = await loadRazorpay();
      if (!res) {
        toast.error('Failed to load Payment SDK. Please check your connection.', { id: loadingToast });
        return;
      }

      // 1. Create order on backend
      const amount = booking.total_amount || booking.services.price_base;
      const orderData = await paymentService.createOrder(booking.id, amount);
      if (!orderData.success) throw new Error('Order creation failed');

      // 2. Configure Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ArcticFresh",
        description: `Service Payment: ${booking.services.title}`,
        order_id: orderData.order_id,
        handler: async (response) => {
          const verifyToast = toast.loading('Verifying Payment Signature...', { id: loadingToast });
          try {
            // 3. Verify payment on backend
            const verifyRes = await paymentService.verifyPayment({
              ...response,
              bookingId: booking.id,
              amount: amount,
              paymentMethod: 'razorpay' // Could be refined by checking response
            });

            if (verifyRes.success) {
              toast.success('Payment Secured. Status Updated.', { id: verifyToast });
              // Refresh data to reflect payment status
              fetchData();
            } else {
              toast.error('Verification failed. Contact support.', { id: verifyToast });
            }
          } catch (err) {
            console.error('Verification error:', err);
            toast.error('Network error during verification.', { id: verifyToast });
          }
        },
        prefill: {
          name: user?.user_metadata?.full_name,
          email: user?.email,
        },
        theme: {
          color: "#020617", // Slate-950 to match brand
        },
        modal: {
          ondismiss: () => {
            toast.dismiss(loadingToast);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Could not initialize payment.', { id: loadingToast });
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await dashboardService.markNotificationRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

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
      
      {/* Minimalist Sidebar */}
      <aside className="lg:w-72 bg-white border-r border-slate-100 p-8 flex flex-col sticky top-0 h-screen pt-32 z-20">
         <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 ml-2">Navigation</div>
         <div className="space-y-2">
            {[
              { id: 'active', label: 'Ongoing Services', icon: LayoutDashboard },
              { id: 'past', label: 'History', icon: History },
              { id: 'billing', label: 'Payments', icon: CreditCard },
              { id: 'support', label: 'Support Desk', icon: MessageSquarePlus },
              { id: 'settings', label: 'Account', icon: Settings }
            ].map((btn) => {
              const Icon = btn.icon;
              const isActive = activeTab === btn.id;
              return (
                <button 
                  key={btn.id}
                  onClick={() => setActiveTab(btn.id)}
                  className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive 
                    ? 'bg-primary/5 text-primary shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                   <Icon size={18} />
                   {btn.label}
                </button>
              );
            })}
         </div>

         <div className="mt-auto">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Elite Account</span>
               </div>
               <div className="font-bold text-slate-900 text-sm mb-1">ArcticFresh PRO</div>
               <div className="text-[11px] text-slate-400 mb-5 leading-relaxed">Priority status active.</div>
               <button onClick={() => setActiveTab('support')} className="w-full py-2.5 bg-white border border-slate-200 text-slate-900 rounded-lg text-[11px] font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">Support Desk</button>
            </div>
         </div>
      </aside>

      <main className="flex-1 p-6 lg:p-12 pt-32 lg:pt-32 relative z-10">
        {/* Elegant Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12 relative">
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Dashboard Overview</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
                {activeTab === 'active' && 'Active '}{activeTab === 'past' && 'Service '}{activeTab === 'billing' && 'Billing '}{activeTab === 'settings' && 'Account '}<span className="text-primary">Overview</span>
              </h1>
              <p className="text-sm text-slate-500 font-medium">Hello, {user?.user_metadata?.full_name || 'Valued Client'}. Welcome back to your ArcticFresh dashboard.</p>
           </div>
           
           <div className="flex gap-10 items-center">
              <div className="relative">
                 <button 
                   onClick={() => setShowNotifications(!showNotifications)}
                   className="w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors relative"
                 >
                   <Bell size={20} className="text-slate-600" />
                   {notifications.filter(n => !n.is_read).length > 0 && (
                     <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                   )}
                 </button>
                 <AnimatePresence>
                   {showNotifications && (
                     <motion.div 
                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
                       className="absolute right-0 top-16 w-80 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 overflow-hidden z-50"
                     >
                        <div className="p-4 border-b border-slate-50">
                           <h4 className="font-bold text-sm">Notifications</h4>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                           {notifications.length === 0 ? (
                             <div className="p-8 text-center text-slate-400 text-xs">No notifications.</div>
                           ) : (
                             notifications.map(n => (
                               <div 
                                 key={n.id} 
                                 onClick={() => !n.is_read && handleMarkRead(n.id)}
                                 className={`p-4 border-b border-slate-50 text-sm cursor-pointer hover:bg-slate-50 transition-colors ${!n.is_read ? 'bg-primary/5' : ''}`}
                               >
                                 <h5 className={`font-bold ${!n.is_read ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</h5>
                                 <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                                 <span className="text-[10px] font-bold text-slate-400 uppercase mt-2 block">{new Date(n.created_at).toLocaleDateString()}</span>
                               </div>
                             ))
                           )}
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

              <div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">My Spending</span>
                 <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-slate-400">₹</span>
                    <span className="text-3xl font-bold text-slate-900 tabular-nums">{overview.totalSpent.toLocaleString()}</span>
                 </div>
              </div>
              <div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Active Orders</span>
                 <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary tabular-nums">{overview.activeCount}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current</span>
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
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-8"
             >
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
                      <div className="relative z-10">
                         <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100">
                               <Sparkles size={18} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Total Investment</span>
                         </div>
                         <div className="flex items-baseline gap-2">
                            <span className="text-sm font-bold text-slate-300">₹</span>
                            <span className="text-5xl font-black text-slate-900 tabular-nums tracking-tighter">{overview.totalSpent.toLocaleString()}</span>
                         </div>
                         <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-100">Verified Protocol Funds</p>
                      </div>
                   </div>

                   <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors duration-700" />
                      <div className="relative z-10">
                         <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-amber-500 border border-slate-100">
                               <CreditCard size={18} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Pending Dues</span>
                         </div>
                         <div className="flex items-baseline gap-2">
                            <span className="text-sm font-bold text-slate-300">₹</span>
                            <span className="text-5xl font-black text-slate-900 tabular-nums tracking-tighter">
                               {bookings.filter(b => b.payment_status === 'unpaid' && b.status !== 'cancelled').reduce((acc, b) => acc + Number(b.total_amount || b.services?.price_base || 0), 0).toLocaleString()}
                            </span>
                         </div>
                         <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-100">Awaiting Secure Validation</p>
                      </div>
                   </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm overflow-hidden">
                   <div className="flex justify-between items-center mb-10 px-2">
                      <div>
                         <h3 className="text-xl font-bold text-slate-900 tracking-tight">Billing Protocol Hub</h3>
                         <p className="text-sm text-slate-500 font-medium">Verify your financial history and secure pending service payments.</p>
                      </div>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead>
                            <tr className="border-b border-slate-50 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                               <th className="pb-8 pl-4">Protocol ID</th>
                               <th className="pb-8">Scheduled Date</th>
                               <th className="pb-8">Amount</th>
                               <th className="pb-8">Payment Status</th>
                               <th className="pb-8 text-right pr-4">Secure Action</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50 text-sm">
                            {bookings.filter(b => b.status !== 'cancelled').map(b => (
                               <tr key={b.id} className="group hover:bg-slate-50/50 transition-colors">
                                  <td className="py-8 pl-4 font-bold text-slate-900">
                                     <div className="flex flex-col">
                                        <span>#AF-{b.id.slice(0,8).toUpperCase()}</span>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-widest">{b.services?.title}</span>
                                     </div>
                                  </td>
                                  <td className="py-8 font-medium text-slate-500">{new Date(b.booking_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                  <td className="py-8 font-black text-slate-900 tracking-tight">₹{Number(b.total_amount || b.services?.price_base || 0).toLocaleString()}</td>
                                  <td className="py-8">
                                     {b.payment_status === 'paid' ? (
                                        <div className="flex items-center gap-2">
                                           <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                                           <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Verified</span>
                                        </div>
                                     ) : (
                                        <div className="flex items-center gap-2">
                                           <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.4)]" />
                                           <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Pending Dues</span>
                                        </div>
                                     )}
                                  </td>
                                  <td className="py-8 text-right pr-4">
                                     {b.payment_status === 'unpaid' ? (
                                        <button 
                                          onClick={() => handlePayment(b)}
                                          className="px-5 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-slate-950/10 active:scale-95 flex items-center gap-2 ml-auto"
                                        >
                                           <CreditCard size={12} />
                                           Pay Now
                                        </button>
                                     ) : (
                                        <button 
                                          onClick={() => downloadInvoice(b, user)}
                                          className="px-4 py-2.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2 ml-auto"
                                        >
                                           <Download size={12} />
                                           Invoice
                                        </button>
                                     )}
                                  </td>
                               </tr>
                            ))}
                            {bookings.length === 0 && (
                               <tr>
                                  <td colSpan="5" className="py-24 text-center">
                                     <div className="flex flex-col items-center opacity-30">
                                        <CreditCard size={48} className="mb-4" />
                                        <p className="font-bold text-[10px] uppercase tracking-[0.2em]">Zero Financial Logs Found</p>
                                     </div>
                                  </td>
                               </tr>
                            )}
                         </tbody>
                      </table>
                   </div>
                </div>
              </motion.div>
           ) : activeTab === 'support' ? (
             <motion.div
               key="support"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
             >
               <SupportTab user={user} />
             </motion.div>
           ) : activeTab === 'settings' ? (
              <motion.div 
               key="settings"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="grid lg:grid-cols-3 gap-8"
             >
                <div className="lg:col-span-2">
                   <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm h-full">
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-8">Personal Information</h3>
                      <div className="space-y-6">
                         <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Full Name</label>
                               <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 flex items-center gap-3">
                                  <UserCircle2 size={16} className="text-primary" />
                                  {user?.user_metadata?.full_name || 'Anonymous User'}
                               </div>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Phone Number</label>
                               <input type="text" placeholder="Not provided" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary focus:bg-white transition-all" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
                            <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium text-slate-500">
                               {user?.email}
                            </div>
                         </div>
                         <button className="px-8 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">Update Profile</button>
                      </div>
                   </div>
                </div>
                <div>
                   <div className="bg-slate-900 rounded-3xl p-8 text-white h-full flex flex-col">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                         <Star className="text-primary" size={24} />
                      </div>
                      <h4 className="text-xl font-bold mb-2">Member Since</h4>
                      <p className="text-slate-400 text-sm mb-auto">{new Date(user?.created_at).toLocaleDateString(undefined, {month: 'long', year: 'numeric'})}</p>
                      
                      <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                         <span className="text-[10px] font-bold uppercase tracking-wider">Account Active</span>
                      </div>
                   </div>
                </div>
             </motion.div>
          ) : (activeTab === 'active' || activeTab === 'past') && (
            (activeTab === 'active' ? activeBookings : pastBookings).length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-100 flex flex-col items-center"
              >
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                   <LayoutDashboard size={32} className="text-slate-300" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">No Bookings Found</h3>
                 <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">It looks like you haven't scheduled any services yet. Start your first protocol today!</p>
                 <a href="/services" className="px-8 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">Browse Services</a>
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
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: bIdx * 0.1 }}
                      className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      <div className="flex flex-col lg:flex-row gap-10">
                        
                        {/* Service Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary">
                                <Tag size={28} />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{booking.services?.title}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{booking.services?.category}</p>
                              </div>
                            </div>
                            <div className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Order #{booking.id.slice(0, 8).toUpperCase()}</span>
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                             <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                                   <Calendar size={18} />
                                </div>
                                <div>
                                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Scheduled Date</div>
                                   <div className="text-sm font-bold text-slate-900">
                                     {new Date(booking.booking_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                                     <span className="ml-2 text-primary">{new Date(booking.booking_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                   </div>
                                </div>
                             </div>
                             <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                                   <MapPin size={18} />
                                </div>
                                <div className="truncate">
                                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Location</div>
                                   <div className="text-sm font-bold text-slate-900 truncate">{booking.address}</div>
                                </div>
                             </div>
                          </div>
                        </div>

                        {/* Status & Tech Info */}
                        <div className="lg:w-80 flex flex-col gap-6">
                           <div className="flex-1 flex flex-col justify-center">
                              {technician ? (
                                 <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-2xl text-white">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 overflow-hidden">
                                      {technician.avatar_url ? (
                                        <img src={technician.avatar_url} alt={technician.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center"><UserCircle2 size={24} className="text-white/20" /></div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                       <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5 whitespace-nowrap">Assigned Expert</div>
                                       <h4 className="font-bold text-sm truncate">{technician.name}</h4>
                                    </div>
                                    <a href={`tel:${technician.phone}`} className="w-10 h-10 bg-white/10 hover:bg-primary rounded-xl flex items-center justify-center transition-colors">
                                       <Phone size={16} />
                                    </a>
                                 </div>
                              ) : (
                                 <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                       <Clock size={20} className="text-primary/40 animate-pulse" />
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Matching Professional...</p>
                                 </div>
                              )}
                           </div>

                           {!isCancelled && (
                              <ProgressTracker currentStatus={booking.status} />
                           )}

                           {booking.payment_status === 'unpaid' && !isCancelled && (
                              <button 
                                onClick={() => handlePayment(booking)}
                                className="w-full py-4 bg-slate-950 text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl shadow-slate-950/10 active:scale-[0.98] flex items-center justify-center gap-2 group"
                              >
                                <Sparkles size={14} className="text-primary group-hover:text-white transition-colors" />
                                Secure Payment
                              </button>
                            )}

                            {booking.payment_status === 'paid' && (
                              <div className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] border border-emerald-100 flex items-center justify-center gap-2">
                                <CheckCircle2 size={14} />
                                Protocol Paid
                              </div>
                            )}

                            {activeTab === 'past' && booking.status === 'completed' && (
                              <button 
                                onClick={() => setReviewModalData(booking)}
                                className="w-full py-4 bg-white text-slate-600 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                              >
                                <Star size={14} />
                                Leave Review
                              </button>
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

        <ReviewModal 
          isOpen={!!reviewModalData} 
          onClose={() => setReviewModalData(null)} 
          booking={reviewModalData}
          user={user}
        />
      </main>
    </div>
  );
};

export default Dashboard;
