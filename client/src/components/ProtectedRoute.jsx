import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07070B]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/15 flex items-center justify-center border border-[#8B5CF6]/30 shadow-[0_0_20px_rgba(139,92,246,0.25)]">
            <Loader2 className="w-5 h-5 text-[#B9A0FF] animate-spin" />
          </div>
          <span className="text-xs font-mono font-medium text-[#A1A1B5] tracking-wider animate-pulse">
            AUTHENTICATING CAMPUSVOICE...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="black-glass max-w-md w-full p-8 rounded-3xl text-center space-y-4 border border-white/[0.1] shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/25 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#F5F3FF]">
            Access Restricted
          </h2>
          <p className="text-xs text-[#A1A1B5] leading-relaxed">
            This module requires <span className="font-bold text-rose-400 uppercase">{requiredRole}</span> privileges. You are currently logged in as a <span className="capitalize font-bold text-[#F5F3FF]">{user.role}</span>.
          </p>
          <div className="pt-2">
            <a
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-xl text-white violet-glow-btn transition"
            >
              Return to Student Directory
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
