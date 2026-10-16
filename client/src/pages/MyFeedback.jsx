import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquareCheck,
  Calendar,
  Star,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Loader2,
  FileText,
  Sparkles
} from 'lucide-react';
import StarRating from '../components/StarRating';
import api from '../services/api';
import { Link } from 'react-router-dom';

const MyFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyFeedback = async () => {
      setLoading(true);
      try {
        const res = await api.get('/feedback/my');
        if (res.data.success) {
          setFeedbacks(res.data.feedbacks || []);
        }
      } catch (err) {
        console.error('Error fetching submissions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyFeedback();
  }, []);

  const totalReviews = feedbacks.length;
  const avgGiven =
    totalReviews > 0
      ? (
          feedbacks.reduce((acc, curr) => acc + (curr.ratings?.overall || 0), 0) /
          totalReviews
        ).toFixed(1)
      : '0.0';
  const anonymousCount = feedbacks.filter((f) => f.isAnonymous).length;

  const statusBadges = {
    Pending: {
      color: 'bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/25 shadow-[0_0_12px_rgba(251,191,36,0.2)]',
      icon: Clock,
      label: 'Pending Review',
    },
    Reviewed: {
      color: 'bg-[#34D399]/10 text-[#34D399] border-[#34D399]/25 shadow-[0_0_12px_rgba(52,211,153,0.2)]',
      icon: CheckCircle,
      label: 'Reviewed & Approved',
    },
    'Action Taken': {
      color: 'bg-[#8B5CF6]/15 text-[#B9A0FF] border-[#8B5CF6]/30 shadow-[0_0_12px_rgba(139,92,246,0.25)]',
      icon: CheckCircle,
      label: 'Action Taken',
    },
    Flagged: {
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/25 shadow-[0_0_12px_rgba(244,63,94,0.2)]',
      icon: AlertTriangle,
      label: 'Flagged',
    },
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-7 relative atmospheric-bg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#B9A0FF] bg-[#8B5CF6]/10 px-2.5 py-1 rounded-full border border-[#8B5CF6]/25">
              PORTFOLIO / MY EVALUATIONS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F3FF] tracking-tight">
            My Feedback Submissions
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1B5] mt-1">
            Track evaluation histories, review statuses, and faculty moderation feedback
          </p>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white violet-glow-btn transition w-fit"
        >
          <span>Evaluate New Peer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Stats summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
        <div className="black-glass-card rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#A1A1B5] uppercase tracking-wider">
              Total Submissions
            </span>
            <span className="text-2xl font-bold font-mono text-[#F5F3FF] block mt-1">
              {totalReviews}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#B9A0FF] flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <MessageSquareCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="black-glass-card rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#A1A1B5] uppercase tracking-wider">
              Avg Rating Given
            </span>
            <span className="text-2xl font-bold font-mono text-[#FBBF24] block mt-1">
              ★ {avgGiven}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#FBBF24]/15 border border-[#FBBF24]/30 text-[#FBBF24] flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            <Star className="w-4 h-4" />
          </div>
        </div>

        <div className="black-glass-card rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#A1A1B5] uppercase tracking-wider">
              Anonymous Reviews
            </span>
            <span className="text-2xl font-bold font-mono text-[#22D3EE] block mt-1">
              {anonymousCount}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#22D3EE]/15 border border-[#22D3EE]/30 text-[#22D3EE] flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <Shield className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
          <span className="text-xs text-[#A1A1B5]">Loading your submissions...</span>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="black-glass rounded-3xl p-12 text-center space-y-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/10 text-[#B9A0FF] flex items-center justify-center mx-auto border border-[#8B5CF6]/20">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#F5F3FF]">
            No feedback submitted yet
          </h3>
          <p className="text-xs text-[#A1A1B5] max-w-sm mx-auto">
            You haven't submitted any feedback evaluations yet. Explore your classmates in the directory and share your constructive thoughts!
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white violet-glow-btn transition"
            >
              Browse Student Directory
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4 relative z-10">
          {feedbacks.map((fb) => {
            const statusConfig = statusBadges[fb.status] || statusBadges.Pending;
            const StatusIcon = statusConfig.icon;
            const student = fb.studentId || {};

            return (
              <motion.div
                key={fb._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="black-glass-card rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        student.avatar ||
                        `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(student.name || 'Student')}`
                      }
                      alt={student.name}
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-[#8B5CF6]/40"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-[#F5F3FF]">
                        {student.name || 'Scholar Profile'}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] text-[#A1A1B5] mt-0.5">
                        <span className="font-mono bg-white/[0.04] px-1.5 py-0.2 rounded">{student.rollNumber || 'N/A'}</span>
                        <span>•</span>
                        <span>{student.branch}</span>
                        <span>•</span>
                        <span>{student.semester}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {fb.isAnonymous && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#B9A0FF] border border-[#8B5CF6]/25">
                        <Shield className="w-3 h-3" /> Anonymous
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusConfig.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusConfig.label}</span>
                    </span>
                  </div>
                </div>

                {/* Rating & Category */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <StarRating rating={fb.ratings?.overall || 5} size="sm" showText={true} />
                    <span className="text-white/20">•</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-lg font-semibold bg-[#151522] text-[#B9A0FF] border border-[#8B5CF6]/20">
                      {fb.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#A1A1B5] font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(fb.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Comments & Suggestions */}
                <div className="space-y-2 text-xs text-[#F5F3FF] leading-relaxed bg-[#141420]/70 p-3.5 rounded-xl border border-white/[0.05]">
                  <p className="italic">
                    "{fb.comments}"
                  </p>
                  {fb.suggestions && (
                    <p className="text-[11px] text-[#A1A1B5] pt-2 border-t border-white/[0.04]">
                      <strong className="text-[#B9A0FF] font-semibold">Growth Suggestion: </strong>
                      {fb.suggestions}
                    </p>
                  )}
                </div>

                {/* Admin notes if present */}
                {fb.adminNotes && (
                  <div className="p-3 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#22D3EE] block mb-0.5">
                      Faculty / Administrative Response
                    </span>
                    <p className="text-[#F5F3FF]">
                      {fb.adminNotes}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyFeedback;
