import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ShieldCheck, Loader2, ArrowRight, Wind, ChevronLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const VerifyEmail = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendVerification } = useAuth();

  const email = location.state?.email || '';

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      navigate('/signup', { replace: true });
    }
  }, [email, navigate]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (value && index === 5) {
      const code = newOtp.join('');
      if (code.length === 6) {
        handleVerify(code);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData.length === 0) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length; i++) {
      newOtp[i] = pasteData[i];
    }
    setOtp(newOtp);

    // Focus the next empty input or last one
    const nextEmpty = newOtp.findIndex((v) => !v);
    const focusIdx = nextEmpty === -1 ? 5 : nextEmpty;
    inputRefs.current[focusIdx]?.focus();

    // Auto-submit if 6 digits pasted
    if (pasteData.length === 6) {
      handleVerify(pasteData);
    }
  };

  const handleVerify = async (code) => {
    const otpCode = code || otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      const { error } = await verifyEmail(email, otpCode);
      if (error) throw error;
      setVerified(true);
      toast.success('Email verified successfully!');
      // Redirect to login after 2 seconds
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (error) {
      toast.error(error.error || error.message || 'Invalid verification code');
      // Clear OTP inputs on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResending(true);
    try {
      const { error } = await resendVerification(email);
      if (error) throw error;
      toast.success('New verification code sent!');
      setCooldown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error.error || error.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_, start, mid, end) => start + '•'.repeat(mid.length) + end)
    : '';

  if (verified) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Verified!</h2>
          <p className="text-slate-500 text-lg mb-6">
            Your email has been verified successfully. Redirecting to sign in...
          </p>
          <div className="w-16 h-1 bg-emerald-500 rounded-full mx-auto animate-pulse" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row overflow-hidden font-sans">

      {/* Left: Decorative Column */}
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
            Almost There! <br /> Verify Your Email.
          </h2>
          <p className="text-white/90 text-lg font-medium leading-relaxed mb-12 drop-shadow">
            We've sent a 6-digit verification code to your email. Enter it below to activate your account.
          </p>

          <div className="space-y-4">
            {[
              { icon: ShieldCheck, text: "Secure 6-Digit Verification" },
              { icon: Mail, text: "Check Your Inbox & Spam Folder" },
              { icon: RefreshCw, text: "Code Expires in 10 Minutes" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-left">
                <item.icon className="text-white" size={20} />
                <span className="text-sm font-semibold text-white">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: OTP Form Column */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 xl:p-20 relative bg-white lg:rounded-l-[2.5rem] lg:-ml-10 z-10 shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.1)]">
        <Link to="/signup" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 font-medium text-sm hover:text-primary transition-colors">
          <ChevronLeft size={18} /> Back to Signup
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
              <Mail size={36} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Check Your Email</h1>
            <p className="text-slate-500">
              We've sent a 6-digit code to<br />
              <span className="font-bold text-slate-700">{maskedEmail}</span>
            </p>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`w-14 h-16 text-center text-2xl font-bold rounded-2xl border-2 outline-none transition-all duration-300 ${
                  digit
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_4px_20px_rgba(59,130,246,0.15)]'
                    : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-blue-600 focus:bg-blue-50 focus:shadow-[0_4px_20px_rgba(59,130,246,0.15)]'
                }`}
              />
            ))}
          </div>

          {/* Verify Button */}
          <div className="mb-8">
            <button
              onClick={() => handleVerify()}
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.5)] transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <>
                  Verify Email <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Resend Section */}
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-2">Didn't receive the code?</p>
            {cooldown > 0 ? (
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <div className="relative w-8 h-8">
                  <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="14" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                    <circle
                      cx="16" cy="16" r="14" fill="none" stroke="#3b82f6" strokeWidth="2"
                      strokeDasharray={88}
                      strokeDashoffset={88 - (88 * cooldown) / 60}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                </div>
                <span className="text-sm font-semibold">
                  Resend in <span className="text-blue-600 font-bold">{cooldown}s</span>
                </span>
              </div>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors disabled:opacity-50"
              >
                {resending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
                Resend Verification Code
              </button>
            )}
          </div>

          {/* Footer link */}
          <div className="mt-10 text-center text-slate-500 font-medium">
            Wrong email? <Link to="/signup" className="text-blue-600 font-bold hover:text-blue-800 transition-colors ml-1">Sign up again</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;
