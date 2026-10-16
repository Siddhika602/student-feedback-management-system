import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquarePlus, Award, BookOpen, Sparkles } from 'lucide-react';

const StudentCard = ({ student, onGiveFeedback, onViewDetails }) => {
  const branchPills = {
    'Computer Science': 'bg-[#8B5CF6]/15 text-[#B9A0FF] border-[#8B5CF6]/30',
    'Data Science & AI': 'bg-[#22D3EE]/15 text-[#22D3EE] border-[#22D3EE]/30',
    'Information Technology': 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30',
    'Electrical Engineering': 'bg-[#FBBF24]/15 text-[#FBBF24] border-[#FBBF24]/30',
    'Mechanical Engineering': 'bg-[#F43F5E]/15 text-[#FB7185] border-[#F43F5E]/30',
    'Civil Engineering': 'bg-[#34D399]/15 text-[#34D399] border-[#34D399]/30',
  };

  const branchBadgeClass =
    branchPills[student.branch] || 'bg-white/[0.05] text-[#A1A1B5] border-white/[0.1]';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="black-glass-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group"
    >
      {/* Delicate radiant top-right ambient glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#8B5CF6]/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

      <div>
        {/* Header: Avatar, Name, Roll No, Rating */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={
                  student.avatar ||
                  `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(student.name)}`
                }
                alt={student.name}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#8B5CF6]/30 group-hover:ring-[#8B5CF6]/60 transition-all duration-200"
                onError={(e) => {
                  e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(student.name)}`;
                }}
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#34D399] border-2 border-[#07070B] rounded-full" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#F5F3FF] leading-tight group-hover:text-white transition-colors">
                {student.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-white/[0.05] text-[#B9A0FF] border border-white/[0.06]">
                  {student.rollNumber}
                </span>
                <span className="text-white/20">•</span>
                <span className="text-[10px] text-[#A1A1B5]">
                  {student.semester}
                </span>
              </div>
            </div>
          </div>

          {/* Average Rating Pill */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FBBF24]/10 border border-[#FBBF24]/25 text-[#FBBF24] shadow-[0_0_12px_rgba(251,191,36,0.2)]">
              <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
              <span className="text-xs font-bold font-mono">
                {student.averageRating > 0 ? student.averageRating.toFixed(1) : 'New'}
              </span>
            </div>
            <span className="text-[10px] text-[#A1A1B5] mt-0.5 font-mono">
              {student.totalFeedbackCount} {student.totalFeedbackCount === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>

        {/* Branch Badge & CGPA */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${branchBadgeClass}`}>
            {student.branch}
          </span>
          {student.cgpa && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/[0.04] text-[#F5F3FF] border border-white/[0.06] flex items-center gap-1 font-mono">
              <Award className="w-3 h-3 text-[#8B5CF6]" />
              GPA {student.cgpa}
            </span>
          )}
        </div>

        {/* Bio */}
        {student.bio && (
          <p className="text-xs text-[#A1A1B5] line-clamp-2 mb-3.5 leading-relaxed">
            {student.bio}
          </p>
        )}

        {/* Tags */}
        {student.tags && student.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {student.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-md bg-[#161624] text-[#A1A1B5] border border-white/[0.05]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
        <button
          onClick={() => onViewDetails(student)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium text-[#A1A1B5] hover:text-[#F5F3FF] bg-[#141420]/80 hover:bg-[#1A1A2B] border border-white/[0.06] hover:border-white/[0.12] transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#B9A0FF]" />
          <span>Reviews ({student.totalFeedbackCount})</span>
        </button>

        <button
          onClick={() => onGiveFeedback(student)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white violet-glow-btn transition cursor-pointer"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          <span>Give Feedback</span>
        </button>
      </div>
    </motion.div>
  );
};

export default StudentCard;
