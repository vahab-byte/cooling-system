import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ArrowRight, Loader2, Send, ShieldCheck, Headphones, Clock } from 'lucide-react';
import { contactService } from '../services/api';
import { toast } from 'react-hot-toast';
import Section from '../components/ui/Section';
import Container from '../components/ui/Container';

const ContactPage = () => {
  const [loading, setLoading] = React.useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    if (!data.name || !data.email || !data.subject || !data.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await contactService.submitMessage(data);
      toast.success('Message sent! Our experts will contact you shortly.');
      e.target.reset();
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-24 bg-white">
      <Container>
        
        {/* Header Section */}
        <div className="max-w-4xl mb-24 py-20 lg:py-32">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-4 mb-10">
                <div className="w-12 h-12 border border-neutral-200 flex items-center justify-center bg-white shadow-sm">
                  <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                </div>
                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-neutral-500">Connect with Experts</span>
              </div>
              <h1 className="text-6xl lg:text-9xl font-bold text-black mb-10 tracking-tighter font-display leading-[1.05]">
                Always Here to <br /> <span className="text-blue-600 italic">Keep it Cool.</span>
              </h1>
              <p className="text-2xl text-neutral-700 font-medium leading-relaxed max-w-2xl">
                Whether you're looking for a one-time emergency repair or a long-term commercial protocol, our engineering team is standing by across Ahmedabad.
              </p>
           </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-24 mb-32">
          <div className="lg:col-span-12 xl:col-span-5 space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-1 gap-10">
              {[
                { icon: Phone, label: "Professional Helpline", val: "+91 99999 99999", desc: "Available 8AM - 8PM Daily" },
                { icon: Mail, label: "Digital Support", val: "support@arcticfresh.com", desc: "Response within 24 hours" },
                { icon: MapPin, label: "Operational Hub", val: "Sector 15, Vastrapur, Ahmedabad", desc: "Visits by appointment only" }
              ].map((item, i) => (
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={i} className="flex items-center gap-8 group p-10 border-2 border-neutral-100 hover:border-blue-600 transition-all duration-500 bg-neutral-50 hover:bg-white shadow-xl">
                   <div className="w-16 h-16 rounded-none bg-white border-2 border-neutral-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                      <item.icon size={24} />
                   </div>
                   <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">{item.label}</div>
                      <div className="text-2xl font-black text-black tracking-tighter group-hover:text-blue-600 transition-colors uppercase italic">{item.val}</div>
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">{item.desc}</div>
                   </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-black border-2 border-black p-12 lg:p-16 relative overflow-hidden group shadow-2xl">
               <div className="relative z-10">
                  <div className="flex items-center gap-3 text-blue-500 text-[11px] font-black uppercase tracking-[0.4em] mb-8">
                     <Clock size={16} className="animate-pulse" /> 2-Hour Recovery Protocol
                  </div>
                  <h4 className="text-4xl font-black mb-6 tracking-tighter text-white uppercase italic">Emergency Dispatch</h4>
                  <p className="text-neutral-400 text-base font-medium leading-relaxed mb-12">
                     Critical cooling failure? Our emergency response protocols prioritize Ahmedabad residential clusters for rapid thermal recovery.
                  </p>
                  <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 bg-green-600 text-white px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all group-hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                     WhatsApp Engineering <Send size={16} />
                  </a>
               </div>
               <div className="absolute top-0 right-0 p-12 text-blue-500/10 font-black text-[12rem] select-none group-hover:text-blue-500/20 transition-colors tracking-tighter">
                  SOS
               </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-12 xl:col-span-7">
            <div className="border-2 border-neutral-200 p-12 lg:p-24 bg-white relative shadow-[0_60px_100px_-20px_rgba(0,0,0,0.1)] hover:border-blue-600 transition-colors duration-700">
              <div className="relative z-10">
                <h3 className="text-5xl lg:text-8xl font-black mb-16 tracking-tighter text-black uppercase italic leading-none">Draft a <br /> <span className="text-blue-600">Request.</span></h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500 ml-1">Full Name *</label>
                    <input name="name" required placeholder="John Doe" className="w-full border-b-2 border-neutral-100 bg-transparent px-0 py-6 text-sm font-bold text-black placeholder:text-neutral-300 focus:outline-none focus:border-blue-600 transition-all font-display uppercase tracking-widest" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500 ml-1">Email Address *</label>
                    <input name="email" type="email" required placeholder="john@example.com" className="w-full border-b-2 border-neutral-100 bg-transparent px-0 py-6 text-sm font-bold text-black placeholder:text-neutral-300 focus:outline-none focus:border-blue-600 transition-all font-display uppercase tracking-widest" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500 ml-1">Building Type</label>
                    <select name="type" className="w-full border-b-2 border-neutral-100 bg-transparent px-0 py-6 text-sm font-bold text-black focus:outline-none focus:border-blue-600 transition-all font-display uppercase tracking-widest appearance-none">
                       <option value="residential">Residential</option>
                       <option value="commercial">Commercial / Office</option>
                       <option value="industrial">Industrial Plant</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500 ml-1">Urgency Level</label>
                    <select name="urgency" className="w-full border-b-2 border-neutral-100 bg-transparent px-0 py-6 text-sm font-bold text-black focus:outline-none focus:border-blue-600 transition-all font-display uppercase tracking-widest appearance-none">
                       <option value="standard">Standard (24h)</option>
                       <option value="urgent">Urgent (4-6h)</option>
                       <option value="emergency">Emergency (&lt; 2h)</option>
                    </select>
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500 ml-1">Inquiry Parameter *</label>
                    <input name="subject" required placeholder="How can we help?" className="w-full border-b-2 border-neutral-100 bg-transparent px-0 py-6 text-sm font-bold text-black placeholder:text-neutral-300 focus:outline-none focus:border-blue-600 transition-all font-display uppercase tracking-widest" />
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500 ml-1">Technical Brief *</label>
                    <textarea name="message" required placeholder="Detail your AC issue or AMC requirements..." className="w-full border-b-2 border-neutral-100 bg-transparent px-0 py-6 text-sm font-bold text-black placeholder:text-neutral-300 focus:outline-none focus:border-blue-600 transition-all h-48 resize-none pt-4 font-display uppercase tracking-widest" />
                  </div>
                  
                  <div className="md:col-span-2 pt-10">
                    <button disabled={loading} className="w-full bg-black text-white py-10 text-sm font-black tracking-[0.5em] uppercase group hover:bg-blue-600 transition-all active:scale-[0.98] shadow-2xl">
                      {loading ? <Loader2 size={24} className="animate-spin mx-auto" /> : <div className="flex items-center justify-center gap-4 italic">Dispatch Protocol <Send size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /></div>}
                    </button>
                    <div className="mt-12 flex items-center justify-center gap-6 text-[11px] font-black text-neutral-400 uppercase tracking-[0.4em]">
                       <ShieldCheck size={18} className="text-black" /> Secure Multi-Factor Inquiry Path
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Location Grid */}
        <div className="mb-48 border-2 border-neutral-100 p-12 lg:p-20 bg-neutral-50">
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { zone: "Satellite Hub", area: "Satellite, Vastrapur, Bodakdev", time: "15 min" },
                { zone: "Bopal Hub", area: "Bopal, Ambli, Shilaj", time: "20 min" },
                { zone: "Central Hub", area: "Navrangpura, Mithakhali", time: "10 min" },
                { zone: "Northern Hub", area: "Gota, Chandlodia, Ranip", time: "25 min" }
              ].map((hub, i) => (
                <div key={i} className="space-y-4">
                   <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Active Sector 0{i+1}</div>
                   <h5 className="text-3xl font-black text-black tracking-tighter uppercase italic">{hub.zone}</h5>
                   <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest">{hub.area}</p>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Avg Pulse: {hub.time}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Map Visualization */}
        <div className="mt-48">
           <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 border-b-2 border-neutral-100 pb-12">
              <div>
                 <div className="inline-flex items-center gap-4 mb-6">
                    <div className="w-3 h-3 rounded-full bg-blue-600" />
                    <span className="text-[12px] font-black uppercase tracking-[0.4em] text-neutral-500">Global Location Matrix</span>
                 </div>
                 <h2 className="text-4xl lg:text-9xl font-black text-black tracking-tighter leading-none italic uppercase">Command <br /> <span className="text-blue-600">Center.</span></h2>
              </div>
              <div className="text-right">
                 <p className="text-blue-600 font-black text-[12px] uppercase tracking-[0.4em] mb-2">Ahmedabad HQ, Gujarat, India</p>
                 <p className="text-black font-black text-2xl uppercase tracking-tighter italic">Operational Command Center 24/7</p>
              </div>
           </div>
           
           <div className="h-[600px] rounded-none overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 relative border-2 border-neutral-200 shadow-2xl group">
             <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-transparent transition-colors duration-1000 z-20 pointer-events-none" />
             <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117506.38133504106!2d72.5027878!3d23.0202434!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fccd11674f9e90!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy"
                  className="relative z-10"
               />
           </div>
        </div>

      </Container>
    </motion.div>
  );
};

export default ContactPage;

