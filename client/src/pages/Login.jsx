import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    }
  };

  const fillCredentials = (type) => {
    if (type === 'admin') {
      setEmail('admin@campusvoice.edu');
      setPassword('AdminPassword123!');
    } else {
      setEmail('student@campusvoice.edu');
      setPassword('StudentPassword123!');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-4 sm:p-6 relative atmospheric-bg">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#22D3EE]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="black-glass rounded-3xl p-8 sm:p-10 shadow-[0_24px_70px_rgba(0,0,0,0.85)] border border-white/[0.1] backdrop-blur-2xl">
          {/* Logo & Headline */}
          <div className="text-center mb-7">
            <div className="relative w-14 h-14 mx-auto mb-4">
              <div className="absolute inset-0 bg-[#8B5CF6] rounded-2xl blur-lg opacity-40" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E1638] to-[#120F24] border border-[#8B5CF6]/50 flex items-center justify-center text-[#B9A0FF] shadow-2xl">
                <Sparkles className="w-7 h-7 drop-shadow-[0_0_8px_rgba(185,160,255,0.8)]" />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#F5F3FF]">
              Welcome to CampusVoice
            </h1>
            <p className="text-xs text-[#A1A1B5] mt-1.5 leading-relaxed">
              Sign in to manage peer evaluations, ratings, and academic feedback
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="mb-6 p-3 rounded-2xl bg-[#141420]/80 border border-white/[0.06] space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A1A1B5] block text-center">
              Quick 1-Click Demo Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-bold text-[#B9A0FF] bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/25 border border-[#8B5CF6]/30 transition cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Fill as Admin</span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('student')}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-bold text-[#22D3EE] bg-[#22D3EE]/15 hover:bg-[#22D3EE]/25 border border-[#22D3EE]/30 transition cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Fill as Student</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1A1B5]">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A1A1B5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campusvoice.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1A1B5]">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A1A1B5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A1A1B5] hover:text-[#F5F3FF]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white violet-glow-btn disabled:opacity-50 transition cursor-pointer"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Footer switch */}
          <div className="text-center mt-6 pt-5 border-t border-white/[0.06]">
            <p className="text-xs text-[#A1A1B5]">
              Don't have an account yet?{' '}
              <Link
                to="/signup"
                className="font-bold text-[#B9A0FF] hover:text-white hover:underline transition"
              >
                Create a student profile
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
