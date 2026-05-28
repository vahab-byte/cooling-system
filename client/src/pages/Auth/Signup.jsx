import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, User, Loader2, Wind, ChevronLeft, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
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
      toast.success('Verification code sent to your email!');
      navigate('/verify-email', { state: { email } });
    } catch (error) {
      toast.error(error.error || error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* Left: Decorative/Branding Column */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-primary/5">
        <div className="absolute inset-0">
          <img src="/images/modern-ac-premium.png" alt="Premium AC" className="w-full h-full object-cover opacity-20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-primary/80 mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 max-w-md text-center px-8">
           <Link to="/" className="inline-flex items-center gap-3 mb-8 group bg-white/20 p-4 rounded-3xl backdrop-blur-md border border-white/30 shadow-2xl transition hover:bg-white/30">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                <Wind className="text-primary" size={24} />
              </div>
              <span className="text-3xl font-bold tracking-tight text-white">
                ArcticFresh
              </span>
           </Link>
           <h2 className="text-4xl font-bold text-white mb-6 leading-tight drop-shadow-md">
             Join the Elite <br /> Cooling Network.
           </h2>
           <p className="text-white/90 text-lg font-medium leading-relaxed mb-12 drop-shadow">
             Become part of Ahmedabad's most trusted AC service platform. Experience priority scheduling and transparent pricing.
           </p>
           
           <div className="space-y-4">
              {[
                { icon: ShieldCheck, text: "Background-Verified Technicians" },
                { icon: Sparkles, text: "Exclusive Member AMC Discounts" },
                { icon: Wind, text: "Priority Heavy-Season Support" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-left">
                   <item.icon className="text-white" size={20} />
                   <span className="text-sm font-semibold text-white">{item.text}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Right: Signup Form Column */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 xl:p-20 relative bg-white lg:rounded-l-[2.5rem] lg:-ml-10 z-10 shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.1)]">
        <Link to="/" className="absolute top-8 left-8 lg:hidden flex items-center gap-2 text-slate-500 font-medium text-sm hover:text-primary transition-colors">
           <ChevronLeft size={18} /> Back to Home
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500">Join 5,000+ satisfied customers today.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="text" 
                  required 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400 placeholder:font-normal" 
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400 placeholder:font-normal" 
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400 placeholder:font-normal" 
                  placeholder="Min 6 characters"
                  minLength={6}
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.5)] transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Sign Up <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center text-slate-500 font-medium">
            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:text-blue-800 transition-colors ml-1">Sign In</Link>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Signup;
