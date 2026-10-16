import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Calendar, MessageSquare, Award, Shield, User, Loader2 } from 'lucide-react';
import StarRating from './StarRating';
import api from '../services/api';

const FeedbackDetailModal = ({ isOpen, onClose, student, onGiveFeedback }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !student) return;

    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/students/${student._id}`);
        if (res.data.success) {
          setFeedbacks(res.data.feedbacks || []);
        }
      } catch (err) {
        console.error('Error fetching student feedbacks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [isOpen, student]);

  if (!isOpen || !student) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#07070B]/80 backdrop-blur-xl transition-opacity"
        />

        {/* Modal Window with Apple Vision Pro depth */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-[#0D0D15]/95 border border-white/[0.1] rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.85)] overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Subtle top violet sheen */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent" />

          {/* Header */}
          <div className="p-6 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3.5">
              <img
                src={
                  student.avatar ||
                  `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(student.name)}`
                }
                alt={student.name}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#8B5CF6]/40"
              />
              <div>
                <h2 className="text-base font-bold text-[#F5F3FF]">
                  {student.name}'s Feedback Portfolio
                </h2>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-[#A1A1B5]">
                  <span className="font-mono">{student.rollNumber}</span>
                  <span>•</span>
                  <span>{student.branch}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-[#FBBF24] font-bold font-mono">
                    <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                    <span>{student.averageRating > 0 ? student.averageRating.toFixed(1) : '0.0'}</span>
                    <span className="text-[#A1A1B5] font-normal font-sans">({student.totalFeedbackCount} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#A1A1B5] hover:text-[#F5F3FF] hover:bg-white/[0.06] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-4">
            {loading ? (
              <div className="py-14 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-[#8B5CF6]" />
                <span className="text-xs text-[#A1A1B5]">Loading peer reviews...</span>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 text-[#B9A0FF] flex items-center justify-center mx-auto border border-[#8B5CF6]/20">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-[#F5F3FF]">
                  No feedback recorded yet
                </h3>
                <p className="text-xs text-[#A1A1B5] max-w-sm mx-auto">
                  Be the first peer to provide constructive ratings and recognition for {student.name}!
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      if (onGiveFeedback) onGiveFeedback(student);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white violet-glow-btn transition"
                  >
                    Give Feedback Now
                  </button>
                </div>
              </div>
            ) : (
              feedbacks.map((fb) => (
                <div
                  key={fb._id}
                  className="p-4 rounded-2xl bg-[#141420]/75 border border-white/[0.06] space-y-3 shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/15 text-[#B9A0FF] flex items-center justify-center font-bold text-xs border border-[#8B5CF6]/25">
                        {fb.isAnonymous ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#F5F3FF] block">
                          {fb.submitterName}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-[#A1A1B5]">
                          <span className="flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3" />
                            {new Date(fb.createdAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span className="px-2 py-0.2 rounded-full bg-[#8B5CF6]/15 text-[#B9A0FF] font-medium border border-[#8B5CF6]/25">
                            {fb.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <StarRating rating={fb.ratings?.overall || 5} size="sm" />
                    </div>
                  </div>

                  <p className="text-xs text-[#F5F3FF] leading-relaxed italic">
                    "{fb.comments}"
                  </p>

                  {fb.suggestions && (
                    <div className="p-3 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[11px] text-[#B9A0FF]">
                      <span className="font-bold text-white">Suggestion: </span>
                      {fb.suggestions}
                    </div>
                  )}

                  {/* Multi-criteria scores */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/[0.05] text-[10px] text-[#A1A1B5]">
                    <div>Academics: <strong className="text-[#F5F3FF] font-mono">{fb.ratings?.academics || fb.ratings?.overall}/5</strong></div>
                    <div>Teamwork: <strong className="text-[#F5F3FF] font-mono">{fb.ratings?.collaboration || fb.ratings?.overall}/5</strong></div>
                    <div>Communication: <strong className="text-[#F5F3FF] font-mono">{fb.ratings?.communication || fb.ratings?.overall}/5</strong></div>
                    <div>Punctuality: <strong className="text-[#F5F3FF] font-mono">{fb.ratings?.punctuality || fb.ratings?.overall}/5</strong></div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
            <span className="text-xs text-[#A1A1B5] font-mono">
              {feedbacks.length} peer evaluations
            </span>
            <button
              onClick={() => {
                onClose();
                if (onGiveFeedback) onGiveFeedback(student);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white violet-glow-btn transition"
            >
              Add New Feedback
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FeedbackDetailModal;
