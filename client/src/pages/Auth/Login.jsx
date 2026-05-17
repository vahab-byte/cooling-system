import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, Loader2, ArrowRight, Wind, ChevronLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await login(email, password);
      if (error) throw error;
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.error || error.message || 'Login failed');
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
             Welcome Back to <br /> Premium Comfort.
           </h2>
           <p className="text-white/90 text-lg font-medium leading-relaxed mb-12 drop-shadow">
             Sign in to manage your service history, track active maintenance, and book certified experts instantly.
           </p>
        </div>
      </div>

      {/* Right: Login Form Column */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20 relative bg-white lg:rounded-l-[2.5rem] lg:-ml-10 z-10 shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.1)]">
        <Link to="/" className="absolute top-8 left-8 lg:hidden flex items-center gap-2 text-slate-500 font-medium text-sm hover:text-primary transition-colors">
           <ChevronLeft size={18} /> Back to Home
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h1>
            <p className="text-slate-500">Please enter your details to access your account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-sm font-semibold text-primary hover:text-blue-700 transition-colors">Forgot Password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400 placeholder:font-normal" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.5)] transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center text-slate-500 font-medium">
            Don't have an account? <Link to="/signup" className="text-blue-600 font-bold hover:text-blue-800 transition-colors ml-1">Sign up for free</Link>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Login;
