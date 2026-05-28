import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Wind, Send, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email address');
    setLoading(true);
    try {
      await axios.post(`${API}/auth/forgot-password`, { email });
      setSent(true);
      toast.success('Reset code sent to your email!');
      setTimeout(() => navigate('/reset-password', { state: { email } }), 1500);
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Wind size={18} className="text-white" />
            </div>
            <span className="text-lg font-black text-white">ArcticFresh<span className="text-blue-400">.</span></span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
              <Mail size={24} className="text-orange-400" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">Forgot Password?</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Enter your registered email address and we'll send you a 6-digit reset code.
            </p>
          </div>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <Send size={24} className="text-green-400" />
              </div>
              <p className="text-green-400 font-bold text-sm">Reset code sent!</p>
              <p className="text-slate-400 text-xs mt-1">Redirecting to reset page...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-5 text-white placeholder:text-slate-600 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white/8 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> Sending...</>
                ) : (
                  <><Send size={16} /> Send Reset Code</>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={14} />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
