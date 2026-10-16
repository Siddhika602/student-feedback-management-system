import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles,
  Sun,
  Moon,
  Users,
  MessageSquareCheck,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-4 rounded-2xl black-glass border border-white/[0.08] shadow-[0_16px_36px_-10px_rgba(0,0,0,0.8)] backdrop-blur-2xl pointer-events-auto transition-all duration-300">
        {/* Brand Logo & Wordmark */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            {/* Glowing violet halo behind icon */}
            <div className="absolute inset-0 bg-[#8B5CF6] rounded-xl blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-300" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E1638] to-[#120F24] border border-[#8B5CF6]/40 flex items-center justify-center text-[#B9A0FF] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-4 h-4 text-[#B9A0FF] drop-shadow-[0_0_6px_rgba(185,160,255,0.8)]" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-[#F5F3FF] group-hover:text-white transition-colors">
                CampusVoice
              </span>
              <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-[#8B5CF6]/15 text-[#B9A0FF] border border-[#8B5CF6]/30">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-[#A1A1B5] font-medium tracking-wide">
              Student Feedback Management
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-[#090910]/80 border border-white/[0.05]">
            <Link
              to="/dashboard"
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                isActive('/dashboard')
                  ? 'text-white bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 shadow-[0_0_14px_rgba(139,92,246,0.25)]'
                  : 'text-[#A1A1B5] hover:text-[#F5F3FF] hover:bg-white/[0.04]'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#B9A0FF]" />
              <span>Students Directory</span>
            </Link>

            <Link
              to="/my-feedback"
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                isActive('/my-feedback')
                  ? 'text-white bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 shadow-[0_0_14px_rgba(139,92,246,0.25)]'
                  : 'text-[#A1A1B5] hover:text-[#F5F3FF] hover:bg-white/[0.04]'
              }`}
            >
              <MessageSquareCheck className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>My Submissions</span>
            </Link>

            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive('/admin')
                      ? 'text-white bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 shadow-[0_0_14px_rgba(139,92,246,0.25)]'
                      : 'text-[#A1A1B5] hover:text-[#F5F3FF] hover:bg-white/[0.04]'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#B9A0FF]" />
                  <span>Admin Panel</span>
                </Link>

                <Link
                  to="/admin/feedback"
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive('/admin/feedback')
                      ? 'text-white bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 shadow-[0_0_14px_rgba(139,92,246,0.25)]'
                      : 'text-[#A1A1B5] hover:text-[#F5F3FF] hover:bg-white/[0.04]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Feedback Manager</span>
                </Link>
              </>
            )}
          </nav>
        )}

        {/* Right Section: Appearance Control & User Menu */}
        <div className="flex items-center gap-2.5">
          {/* Subtle Ambient Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-[#A1A1B5] hover:text-[#F5F3FF] hover:bg-white/[0.06] border border-white/[0.05] transition-all focus:outline-none"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-[#FBBF24] hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-[#8B5CF6] hover:-rotate-12 transition-transform" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 py-1 px-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-[#8B5CF6]/30 transition-all focus:outline-none group"
              >
                <div className="relative">
                  <img
                    src={
                      user?.avatar ||
                      `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(user?.name || 'User')}`
                    }
                    alt={user?.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#8B5CF6]/40"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#34D399] ring-2 ring-[#07070B]" />
                </div>

                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-[#F5F3FF] leading-tight">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-[#A1A1B5]">
                    {isAdmin ? (
                      <span className="text-[#B9A0FF] font-semibold">Administrator</span>
                    ) : (
                      <span className="text-[#8B5CF6] font-semibold">Student</span>
                    )}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#A1A1B5] group-hover:text-[#F5F3FF] transition-colors" />
              </button>

              {/* Glass User Dropdown */}
              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-60 black-glass rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 p-2.5 border border-white/[0.1]"
                    >
                      <div className="px-3 py-2 border-b border-white/[0.06] mb-1.5">
                        <p className="text-xs font-bold text-[#F5F3FF] truncate">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-[#A1A1B5] truncate mt-0.5">
                          {user?.email}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#8B5CF6]/20 text-[#B9A0FF] border border-[#8B5CF6]/30">
                            {user?.role}
                          </span>
                          {user?.rollNumber && (
                            <span className="text-[10px] font-mono text-[#A1A1B5]">
                              {user.rollNumber}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-semibold text-[#A1A1B5] hover:text-[#F5F3FF] transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-white violet-glow-btn transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          {isAuthenticated && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#A1A1B5] hover:text-[#F5F3FF] hover:bg-white/[0.06]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 mx-auto max-w-7xl black-glass rounded-2xl p-4 border border-white/[0.08] shadow-2xl space-y-2 pointer-events-auto"
          >
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                isActive('/dashboard')
                  ? 'bg-[#8B5CF6]/25 text-white border border-[#8B5CF6]/40'
                  : 'text-[#A1A1B5] hover:bg-white/[0.04] hover:text-[#F5F3FF]'
              }`}
            >
              <Users className="w-4 h-4 text-[#B9A0FF]" />
              <span>Students Directory</span>
            </Link>

            <Link
              to="/my-feedback"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                isActive('/my-feedback')
                  ? 'bg-[#8B5CF6]/25 text-white border border-[#8B5CF6]/40'
                  : 'text-[#A1A1B5] hover:bg-white/[0.04] hover:text-[#F5F3FF]'
              }`}
            >
              <MessageSquareCheck className="w-4 h-4 text-[#22D3EE]" />
              <span>My Submissions</span>
            </Link>

            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive('/admin')
                      ? 'bg-[#8B5CF6]/25 text-white border border-[#8B5CF6]/40'
                      : 'text-[#A1A1B5] hover:bg-white/[0.04] hover:text-[#F5F3FF]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-[#B9A0FF]" />
                  <span>Admin Panel</span>
                </Link>

                <Link
                  to="/admin/feedback"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive('/admin/feedback')
                      ? 'bg-[#8B5CF6]/25 text-white border border-[#8B5CF6]/40'
                      : 'text-[#A1A1B5] hover:bg-white/[0.04] hover:text-[#F5F3FF]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                  <span>Feedback Manager</span>
                </Link>
              </>
            )}

            <div className="pt-2 border-t border-white/[0.06]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
