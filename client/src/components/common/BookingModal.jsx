import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Loader2, ArrowRight, Settings, FileText, ShieldCheck, ChevronRight, Check, Sparkles } from 'lucide-react';
import { bookingService, sparePartsService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import AddressAutocomplete from './AddressAutocomplete';

// We now fetch these dynamically from the /api/spare-parts endpoint

const BookingModal = ({ isOpen, onClose, serviceId, serviceTitle, price }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [selectedParts, setSelectedParts] = useState([]);
  const [addons, setAddons] = useState([]);
  const [estimate, setEstimate] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setDate('');
      setAddress('');
      setSelectedParts([]);
      setEstimate(null);
      fetchAddons();
    }
  }, [isOpen]);

  const fetchAddons = async () => {
    try {
      const data = await sparePartsService.getSpareParts();
      setAddons(data);
    } catch (error) {
      console.error('Failed to fetch add-ons:', error);
    }
  };

  const handleGetEstimate = async () => {
    if (!date || !address) {
      toast.error('Please fill in date and address');
      return;
    }
    setLoading(true);
    try {
      const result = await bookingService.estimatePrice(serviceId, selectedParts);
      setEstimate(result);
      setStep(3);
    } catch (error) {
      toast.error('Failed to calculate estimate.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book a service');
      return;
    }
    setLoading(true);
    try {
      await bookingService.createBooking({
        userId: user.id,
        serviceId: serviceId,
        bookingDate: date,
        address: address,
        partIds: selectedParts
      });
      toast.success('Booking confirmed! Track it in your dashboard.');
      onClose();
    } catch (error) {
      const errorMsg = error.response?.data?.details?.[0] || error.response?.data?.error || 'Booking failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const togglePart = (id) => {
    setSelectedParts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  if (!isOpen) return null;

  const steps = [
    { id: 1, label: 'Details', icon: MapPin },
    { id: 2, label: 'Add-ons', icon: Settings },
    { id: 3, label: 'Confirm', icon: FileText }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
      />
      
      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 40 }}
        className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col lg:flex-row max-h-[90vh]"
      >
        {/* Left Sidebar: Progress */}
        <div className="hidden lg:flex lg:w-72 bg-neutral-50 p-10 flex-col border-r border-neutral-100">
          <div className="mb-12">
             <div className="text-black text-[10px] font-black uppercase tracking-widest mb-2">Booking Wizard</div>
             <h3 className="text-black text-2xl font-black leading-tight tracking-tight">Professional <br/>Service.</h3>
          </div>
          
          <div className="space-y-8 flex-grow">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              
              return (
                <div key={s.id} className="flex items-center gap-4 group cursor-default">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                     isActive ? 'bg-black border-black text-white shadow-lg shadow-black/10' :
                     isCompleted ? 'bg-black border-black text-white' : 'bg-white border-neutral-200 text-neutral-300'
                   }`}>
                      {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                   </div>
                   <div className="flex flex-col">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-black' : 'text-neutral-300'}`}>Step 0{s.id}</span>
                      <span className={`font-bold transition-colors text-sm ${isActive ? 'text-black' : 'text-neutral-400'}`}>{s.label}</span>
                   </div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-8 border-t border-neutral-200 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-black">
                <ShieldCheck size={16} />
             </div>
             <span className="text-[10px] font-bold text-neutral-400 leading-tight uppercase tracking-wider">Secure Booking <br/>Encryption</span>
          </div>
        </div>


        {/* Right Content Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="p-8 border-b border-neutral-50 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-20">
             <div>
                <div className="flex items-center gap-2">
                   <h4 className="text-xl font-black text-black tracking-tight">{serviceTitle}</h4>
                   <span className="lg:hidden bg-neutral-100 text-neutral-850 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Step {step}/3</span>
                </div>
                <div className="text-xs font-bold text-neutral-400 mt-1 uppercase tracking-widest">Starting from ₹{price}</div>
             </div>
             <button onClick={onClose} className="w-12 h-12 rounded-full bg-neutral-50 hover:bg-neutral-100 flex items-center justify-center group transition-all">
                <X size={20} className="text-neutral-400 group-hover:rotate-90 group-hover:text-black transition-all" />
             </button>
          </div>


          {/* Form Steps */}
          <div className="flex-1 p-6 sm:p-10 overflow-y-auto">
             <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    <div className="relative">
                      <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Service Date & Time</label>
                      <div className="relative">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={20} />
                        <input 
                          type="datetime-local" 
                          className="input-field pl-14"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <AddressAutocomplete
                      variant="modal"
                      value={address}
                      onChange={(val) => setAddress(val)}
                      placeholder="Ex: 123 Business Road, Ahmedabad, Gujarat"
                    />

                    <button 
                      disabled={!date || !address || address.trim().length < 10}
                      onClick={() => setStep(2)}
                      className="w-full btn btn-primary py-5 text-sm"
                    >
                      Continue to Add-ons <ChevronRight size={16} />
                    </button>
                  </motion.div>
                )}


                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="grid gap-4">
                      {addons.length === 0 ? (
                        <div className="text-center py-10 text-neutral-400 font-bold">No add-ons available for this service.</div>
                      ) : (
                        addons.map(addon => (
                          <label key={addon.id} className={`flex items-center gap-6 p-6 transition-all cursor-pointer group ${
                            selectedParts.includes(addon.id) ? 'border border-black bg-neutral-50' : 'border border-neutral-100 hover:border-neutral-300 bg-white'
                          }`}>
                            <div className={`w-6 h-6 border flex items-center justify-center transition-all ${
                              selectedParts.includes(addon.id) ? 'bg-black border-black text-white' : 'border-neutral-300 bg-white'
                            }`}>
                              {selectedParts.includes(addon.id) && <Check size={14} />}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-black text-sm">{addon.name}</div>
                              <div className="text-xs text-neutral-500 font-medium">{addon.description}</div>
                              <div className="text-[10px] font-black text-black mt-1 uppercase tracking-widest">₹{addon.price} added</div>
                            </div>
                            <input type="checkbox" className="hidden" checked={selectedParts.includes(addon.id)} onChange={() => togglePart(addon.id)} />
                          </label>
                        ))
                      )}
                    </div>

                    <div className="flex gap-4 pt-6">
                       <button onClick={() => setStep(1)} className="flex-1 btn btn-ghost">Back</button>
                       <button onClick={handleGetEstimate} disabled={loading} className="flex-[2] btn btn-primary">
                          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Review Estimate'}
                       </button>
                    </div>
                  </motion.div>
                )}


                {step === 3 && estimate && (
                  <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                    <div className="bg-black p-8 text-white relative overflow-hidden">
                       <div className="relative z-10 font-sans">
                          <div className="flex items-center gap-2 text-white/50 text-[10px] font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
                             <Sparkles size={12} /> Digital Invoice Summary
                          </div>
                          <div className="space-y-4">
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-white/40 font-medium uppercase tracking-widest text-[10px]">Standard Service</span>
                                <span className="font-bold">₹{estimate.basePrice.toFixed(2)}</span>
                             </div>
                             {estimate.partsPrice > 0 && (
                               <div className="flex justify-between items-center text-sm">
                                  <span className="text-white/40 font-medium uppercase tracking-widest text-[10px]">Optional Upgrades</span>
                                  <span className="font-bold">₹{estimate.partsPrice.toFixed(2)}</span>
                               </div>
                             )}
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-white/40 font-medium uppercase tracking-widest text-[10px]">GST (18%)</span>
                                <span className="font-bold">₹{estimate.tax.toFixed(2)}</span>
                             </div>
                             <div className="pt-6 mt-6 border-t border-white/20 flex justify-between items-center">
                                <span className="text-lg font-black uppercase tracking-widest">Total</span>
                                <span className="text-3xl font-black tracking-tighter">₹{estimate.total.toFixed(2)}</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                       <button onClick={() => setStep(2)} className="flex-1 btn btn-ghost">Modify</button>
                       <button onClick={handleBooking} disabled={loading} className="flex-[2] btn btn-primary">
                          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Confirm & Schedule'}
                       </button>
                    </div>
                  </motion.div>
                )}

             </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingModal;
