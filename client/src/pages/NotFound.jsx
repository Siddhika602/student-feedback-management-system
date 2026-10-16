import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-6 text-center relative atmospheric-bg">
      <div className="black-glass max-w-md w-full p-8 rounded-3xl space-y-4 border border-white/[0.1] shadow-2xl z-10 relative">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#8B5CF6]/15 text-[#B9A0FF] flex items-center justify-center border border-[#8B5CF6]/30 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
          <Sparkles className="w-7 h-7" />
        </div>
        <span className="text-4xl font-extrabold text-[#B9A0FF] font-mono block">
          404
        </span>
        <h1 className="text-lg font-bold text-[#F5F3FF]">
          Route Not Found
        </h1>
        <p className="text-xs text-[#A1A1B5]">
          The requested path does not exist or has been relocated within CampusVoice.
        </p>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white violet-glow-btn transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
