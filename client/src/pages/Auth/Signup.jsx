import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, User, Loader2, ShieldCheck, Wind, ChevronLeft, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await signup(email, password, fullName);
      if (error) throw error;
      toast.success('Account created! Please verify your email.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
      
      {/* Left: Decorative/Branding Column */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative items-center justify-center p-20 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[100px]" />
        
        <div className="relative z-10 max-w-md text-center">
           <Link to="/" className="inline-flex items-center gap-3 mb-10 group">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
                <Wind className="text-white" size={32} />
              </div>
              <span className="text-4xl font-black tracking-tighter text-white font-display">
                Arctic<span className="text-primary tracking-tight">Fresh</span>
              </span>
           </Link>
           <h2 className="text-4xl font-black text-white mb-6 tracking-tight leading-tight">Join the Elite <br /> <span className="text-primary italic">Cooling</span> Network.</h2>
           <p className="text-slate-400 font-medium leading-relaxed mb-12">
             Become part of Ahmedabad's most trusted AC service platform. Experience priority scheduling, transparent pricing, and professional engineering at its best.
           </p>
           
           <div className="space-y-4">
              {[
                { icon: ShieldCheck, text: "Background-Verified Technicians" },
                { icon: Sparkles, text: "Exclusive Member AMC Discounts" },
                { icon: Wind, text: "Priority Heavy-Season Support" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 text-left">
                   <item.icon className="text-primary" size={20} />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.text}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Right: Signup Form Column */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20 relative bg-slate-50 lg:bg-white">
        <Link to="/" className="absolute top-8 left-8 lg:hidden flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
           <ChevronLeft size={16} /> Home
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-950 mb-3 tracking-tight font-display">Create Access.</h1>
            <p className="text-slate-500 font-medium">Join 5,000+ satisfied customers today.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Legal Individual Name</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="text" 
                  required 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field pl-14" 
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Digital Identification (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-14" 
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Secret Key (Password)</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-14" 
                  placeholder="Min 6 characters"
                  minLength={6}
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                disabled={loading}
                className="w-full btn btn-primary py-6 text-xl shadow-2xl shadow-primary/20 group"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Initialize Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </div>
          </form>

          <div className="mt-12 text-center text-sm font-medium text-slate-400">
            Already have an account? <Link to="/login" className="text-primary font-black hover:text-primary-dark transition-colors ml-1 uppercase tracking-widest text-xs">Sign In</Link>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Signup;
