import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, Hash, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const branches = [
  'Computer Science',
  'Data Science & AI',
  'Information Technology',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
];

const semesters = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
];

const Signup = () => {
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [branch, setBranch] = useState(branches[0]);
  const [semester, setSemester] = useState(semesters[5]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name,
      email,
      password,
      role,
      rollNumber: role === 'student' ? rollNumber : undefined,
      branch: role === 'student' ? branch : undefined,
      semester: role === 'student' ? semester : undefined,
    };

    const res = await register(payload);
    setIsSubmitting(false);

    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-4 sm:p-6 relative atmospheric-bg">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#22D3EE]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="black-glass rounded-3xl p-8 sm:p-10 shadow-[0_24px_70px_rgba(0,0,0,0.85)] border border-white/[0.1] backdrop-blur-2xl">
          <div className="text-center mb-6">
            <div className="relative w-14 h-14 mx-auto mb-3">
              <div className="absolute inset-0 bg-[#8B5CF6] rounded-2xl blur-lg opacity-40" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E1638] to-[#120F24] border border-[#8B5CF6]/50 flex items-center justify-center text-[#B9A0FF] shadow-2xl">
                <Sparkles className="w-7 h-7 drop-shadow-[0_0_8px_rgba(185,160,255,0.8)]" />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#F5F3FF]">
              Join CampusVoice
            </h1>
            <p className="text-xs text-[#A1A1B5] mt-1">
              Create your account to start peer reviews and access the dashboard
            </p>
          </div>

          {/* Role Pill Switcher */}
          <div className="mb-6 p-1.5 rounded-2xl bg-[#141420]/80 border border-white/[0.06] flex gap-1">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === 'student'
                  ? 'bg-[#8B5CF6]/25 text-white border border-[#8B5CF6]/40 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                  : 'text-[#A1A1B5] hover:text-[#F5F3FF]'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#B9A0FF]" />
              <span>Student Account</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === 'admin'
                  ? 'bg-[#8B5CF6]/25 text-white border border-[#8B5CF6]/40 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                  : 'text-[#A1A1B5] hover:text-[#F5F3FF]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#34D399]" />
              <span>Administrator</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1A1B5]">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#A1A1B5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs focus:outline-none"
                />
              </div>
            </div>

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
                  placeholder="student@campusvoice.edu"
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
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs focus:outline-none"
                />
              </div>
            </div>

            {role === 'student' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A1A1B5]">
                    Roll Number / Student ID
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-[#A1A1B5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. CS2024-105"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs font-mono focus:outline-none uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A1A1B5]">
                      Department / Branch
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl glass-input text-xs focus:outline-none cursor-pointer"
                    >
                      {branches.map((b) => (
                        <option key={b} value={b} className="bg-[#0D0D14] text-[#F5F3FF]">
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A1A1B5]">
                      Current Semester
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl glass-input text-xs focus:outline-none cursor-pointer"
                    >
                      {semesters.map((s) => (
                        <option key={s} value={s} className="bg-[#0D0D14] text-[#F5F3FF]">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white violet-glow-btn disabled:opacity-50 transition cursor-pointer"
            >
              <span>{isSubmitting ? 'Creating Profile...' : 'Complete Registration'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center mt-6 pt-5 border-t border-white/[0.06]">
            <p className="text-xs text-[#A1A1B5]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-[#B9A0FF] hover:text-white hover:underline transition"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
