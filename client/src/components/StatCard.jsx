import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, subtext, color = 'violet' }) => {
  const colorMap = {
    violet: {
      circle: 'bg-[#8B5CF6]/15 border-[#8B5CF6]/30 text-[#B9A0FF] shadow-[0_0_18px_rgba(139,92,246,0.35)]',
      glow: 'from-[#8B5CF6]/15 to-transparent',
      badge: 'text-[#B9A0FF] bg-[#8B5CF6]/15 border-[#8B5CF6]/30',
    },
    cyan: {
      circle: 'bg-[#22D3EE]/15 border-[#22D3EE]/30 text-[#22D3EE] shadow-[0_0_18px_rgba(34,211,238,0.35)]',
      glow: 'from-[#22D3EE]/15 to-transparent',
      badge: 'text-[#22D3EE] bg-[#22D3EE]/15 border-[#22D3EE]/30',
    },
    emerald: {
      circle: 'bg-[#34D399]/15 border-[#34D399]/30 text-[#34D399] shadow-[0_0_18px_rgba(52,211,153,0.35)]',
      glow: 'from-[#34D399]/15 to-transparent',
      badge: 'text-[#34D399] bg-[#34D399]/15 border-[#34D399]/30',
    },
    amber: {
      circle: 'bg-[#FBBF24]/15 border-[#FBBF24]/30 text-[#FBBF24] shadow-[0_0_18px_rgba(251,191,36,0.35)]',
      glow: 'from-[#FBBF24]/15 to-transparent',
      badge: 'text-[#FBBF24] bg-[#FBBF24]/15 border-[#FBBF24]/30',
    },
  };

  const activeColor = colorMap[color] || colorMap.violet;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="black-glass-card rounded-2xl p-5 relative overflow-hidden group"
    >
      {/* Corner ambient radiant glow */}
      <div
        className={`absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br ${activeColor.glow} rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500`}
      />

      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#A1A1B5]">
          {title}
        </span>
        {/* Glowing circular icon container */}
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center border ${activeColor.circle} transition-transform group-hover:scale-110`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2.5">
        <span className="text-3xl font-extrabold tracking-tight text-[#F5F3FF] font-mono">
          {value}
        </span>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeColor.badge}`}>
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-[11px] text-[#A1A1B5] mt-2">
          {subtext}
        </p>
      )}
    </motion.div>
  );
};

export default StatCard;
