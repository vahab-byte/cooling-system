import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, Wind, CheckCircle, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || '';

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [success, setSuccess] = useState(false);

  const otpRefs = useRef([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => { if (i < 6) newOtp[i] = char; });
    setOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleResend = async () => {
    if (resendTimer > 0 || !email) return;
    setResending(true);
    try {
      await axios.post(`${API}/auth/forgot-password`, { email });
      toast.success('A new code has been sent to your email!');
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return toast.error('Please enter the 6-digit code');
    if (!newPassword) return toast.error('Please enter a new password');
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      await axios.post(`${API}/auth/reset-password`, {
        email,
        otp: otpValue,
        newPassword
      });
      setSuccess(true);
      toast.success('Password updated successfully!');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const otpComplete = otp.every(d => d !== '');
  const passwordStrength = newPassword.length >= 8
    ? 'strong' : newPassword.length >= 6 ? 'medium' : 'weak';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-4">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

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

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={36} className="text-green-400" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Password Reset!</h2>
                <p className="text-slate-400 text-sm mb-6">Your password has been updated successfully. Redirecting to login...</p>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.5 }}
                    className="h-full bg-green-500"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h1 className="text-2xl font-black text-white mb-1">Reset Your Password</h1>
                  <p className="text-slate-400 text-sm">
                    Enter the code sent to <span className="text-blue-400 font-bold">{email}</span>
                  </p>
                </div>

                {/* OTP Inputs */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">
                    6-Digit Reset Code
                  </label>
                  <div className="flex justify-between gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => otpRefs.current[i] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className={`w-10 sm:w-12 h-12 sm:h-14 text-center text-xl font-black rounded-xl sm:rounded-2xl border transition-all focus:outline-none ${
                          digit
                            ? 'bg-blue-600/20 border-blue-500 text-white'
                            : 'bg-white/5 border-white/10 text-white focus:border-blue-500'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Resend */}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-slate-500">Didn't receive the code?</span>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendTimer > 0 || resending}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 disabled:text-slate-600 transition-colors flex items-center gap-1"
                    >
                      {resending ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">New Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-12 text-white placeholder:text-slate-600 text-sm font-medium focus:outline-none focus:border-blue-500 transition-all"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {newPassword && (
                    <div className="mt-2 flex items-center gap-1">
                      {['weak', 'medium', 'strong'].map((level, i) => (
                        <div key={level} className={`h-1 flex-1 rounded-full transition-colors ${
                          i < (passwordStrength === 'strong' ? 3 : passwordStrength === 'medium' ? 2 : 1)
                            ? passwordStrength === 'strong' ? 'bg-green-500' : passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                            : 'bg-white/10'
                        }`} />
                      ))}
                      <span className={`text-[10px] font-bold ml-1 ${
                        passwordStrength === 'strong' ? 'text-green-400' : passwordStrength === 'medium' ? 'text-yellow-400' : 'text-red-400'
                      }`}>{passwordStrength}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Confirm Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      className={`w-full bg-white/5 border rounded-2xl py-4 pl-11 pr-5 text-white placeholder:text-slate-600 text-sm font-medium focus:outline-none transition-all ${
                        confirmPassword && newPassword !== confirmPassword
                          ? 'border-red-500/50 focus:border-red-500'
                          : confirmPassword && newPassword === confirmPassword
                          ? 'border-green-500/50 focus:border-green-500'
                          : 'border-white/10 focus:border-blue-500'
                      }`}
                    />
                    {confirmPassword && newPassword === confirmPassword && (
                      <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400" />
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !otpComplete || !newPassword || newPassword !== confirmPassword}
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Updating...</>
                  ) : (
                    <><Lock size={16} /> Update Password</>
                  )}
                </button>

                <div className="text-center">
                  <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={14} /> Back to Login
                  </Link>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
