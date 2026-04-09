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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-24 bg-white selection:bg-primary/10">
      <Container>

        {/* Refined Hero Section */}
        <div className="max-w-4xl mb-24 py-10 lg:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Personalized Support</span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-bold text-slate-900 mb-8 tracking-tight leading-[1.05]">
              Always Here to <br /> <span className="text-primary italic">Perfect Your Atmosphere.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
              Dedicated engineering support for your cooling infrastructure. Our concierge team is standing by to assist with emergency repairs or long-term care plans.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 mb-32">
          {/* Info Column */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-1 gap-6">
              {[
                { icon: Phone, label: "Concierge Helpline", val: "+91 6353774046", desc: "Premium Support 08:00 - 20:00" },
                { icon: Mail, label: "Digital Inquiry", val: "sabdulwahab252@gmail.com", desc: "Response within 4 operational hours" },
                { icon: MapPin, label: "Ahmedabad Studio", val: "Sector 15, Vastrapur, Ahmedabad", desc: "Private Consultations Available" }
              ].map((item, i) => (
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={i} className="flex items-center gap-6 group p-8 rounded-3xl border border-slate-100 bg-white hover:border-primary transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-primary/5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{item.label}</div>
                    <div className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-primary transition-colors">{item.val}</div>
                    <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-slate-950 rounded-[2.5rem] p-10 lg:p-14 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 text-white">
                <div className="flex items-center gap-3 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
                  <Clock size={16} /> Priority Support Protocol
                </div>
                <h4 className="text-3xl font-bold mb-5 tracking-tight">Need Immediate <br /> Assistance?</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
                  Our rapid-response squad prioritizes critical cooling failures with advanced thermal diagnostics and surgical-grade repair.
                </p>
                <a href="https://wa.me/916353774046" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 bg-primary text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all shadow-xl shadow-primary/20">
                  WhatsApp Concierge <Send size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Clean Form Column */}
          <div className="lg:col-span-12 xl:col-span-7">
            <div className="rounded-[3rem] p-10 lg:p-16 bg-white border border-slate-100 relative shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] hover:border-primary transition-all duration-700">
              <div className="relative z-10">
                <h3 className="text-4xl lg:text-5xl font-bold mb-12 tracking-tight text-slate-950">Send a <span className="text-primary italic">Message.</span></h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <input name="name" required placeholder="John Doe" className="w-full bg-slate-50/50 rounded-xl px-6 py-4 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-primary border border-transparent transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <input name="email" type="email" required placeholder="john@example.com" className="w-full bg-slate-50/50 rounded-xl px-6 py-4 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-primary border border-transparent transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Building Type</label>
                    <div className="relative group/select">
                      <select name="type" className="w-full bg-slate-50/50 rounded-xl px-6 py-4 text-sm font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-primary border border-transparent appearance-none transition-all">
                        <option value="residential">Residential Property</option>
                        <option value="commercial">Commercial / Office</option>
                        <option value="industrial">Industrial Complex</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Urgency Level</label>
                    <div className="relative group/select">
                      <select name="urgency" className="w-full bg-slate-50/50 rounded-xl px-6 py-4 text-sm font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-primary border border-transparent appearance-none transition-all">
                        <option value="standard">Standard Inquiry (24h)</option>
                        <option value="urgent">Urgent Support (4-6h)</option>
                        <option value="emergency">Critical Failure (&lt; 2h)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                    <input name="subject" required placeholder="How can we assist you?" className="w-full bg-slate-50/50 rounded-xl px-6 py-4 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-primary border border-transparent transition-all" />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">How can we help?</label>
                    <textarea name="message" required placeholder="Please describe your requirements..." className="w-full bg-slate-50/50 rounded-xl px-6 py-4 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-primary border border-transparent transition-all h-40 resize-none pt-4" />
                  </div>

                  <div className="md:col-span-2 pt-6">
                    <button disabled={loading} className="w-full bg-slate-950 text-white rounded-2xl py-5 text-sm font-bold uppercase tracking-widest group hover:bg-primary transition-all active:scale-[0.98] shadow-xl shadow-slate-950/20">
                      {loading ? <Loader2 size={24} className="animate-spin mx-auto text-primary" /> : <div className="flex items-center justify-center gap-3">Connect with Our Team <Send size={18} className="translate-x-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></div>}
                    </button>
                    <div className="mt-8 flex items-center justify-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <ShieldCheck size={16} className="text-primary" /> Secure Concierge Inquiry Path
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Service Guidance */}
        <div className="mb-40 rounded-[2.5rem] border border-slate-100 p-10 lg:p-16 bg-slate-50/50">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { zone: "Satellite Hub", area: "Satellite, Vastrapur, Bodakdev", time: "15 min" },
              { zone: "Bopal Hub", area: "Bopal, Ambli, Shilaj", time: "20 min" },
              { zone: "Central Hub", area: "Navrangpura, Mithakhali", time: "10 min" },
              { zone: "Northern Hub", area: "Gota, Chandlodia, Ranip", time: "25 min" }
            ].map((hub, i) => (
              <div key={i} className="space-y-4">
                <div className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Operational Sector 0{i + 1}</div>
                <h5 className="text-2xl font-bold text-slate-950 tracking-tight">{hub.zone}</h5>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{hub.area}</p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Response Pulse: {hub.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clean Location Map */}
        <div className="mt-40">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8 border-b border-slate-100 pb-12">
            <div>
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Headquarters</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-950 tracking-tight leading-none uppercase">Find a hub <br /> <span className="text-primary italic">Near You.</span></h2>
            </div>
            <div className="md:text-right">
              <p className="text-primary font-bold text-[10px] uppercase tracking-[0.3em] mb-2">Ahmedabad, Gujarat, India</p>
              <p className="text-slate-900 font-bold text-xl tracking-tight italic">Premium Engineering Studio Available 24/7</p>
            </div>
          </div>

          <div className="h-[550px] rounded-[3rem] overflow-hidden relative border border-slate-100 shadow-2xl transition-all duration-1000 grayscale-[0.2] hover:grayscale-0">
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

