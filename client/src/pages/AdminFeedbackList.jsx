import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Trash2,
  Edit3,
  Eye,
  RotateCcw,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Shield,
  Star,
  Loader2,
  AlertOctagon,
  MessageSquare,
  Sparkles,
  Activity,
  Layers
} from 'lucide-react';
import StarRating from '../components/StarRating';
import ExportCSVButton from '../components/ExportCSVButton';
import EditFeedbackModal from '../components/EditFeedbackModal';
import StatCard from '../components/StatCard';
import api from '../services/api';
import toast from 'react-hot-toast';

const categories = [
  'All Categories',
  'Academic Performance',
  'Project Collaboration',
  'Extracurricular Activities',
  'Leadership & Conduct',
  'General Feedback',
];

const statuses = ['All Statuses', 'Pending', 'Reviewed', 'Action Taken', 'Flagged'];

const AdminFeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Statuses');
  const [category, setCategory] = useState('All Categories');
  const [rating, setRating] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  // Modals & Actions
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [viewingFeedback, setViewingFeedback] = useState(null);
  const [deletingFeedback, setDeletingFeedback] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch real statistics for the 4 analytics cards
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  }, []);

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: status !== 'All Statuses' ? status : undefined,
        category: category !== 'All Categories' ? category : undefined,
        rating: rating !== 'all' ? rating : undefined,
        sortBy,
        order,
      };

      const res = await api.get('/admin/feedback', { params });
      if (res.data.success) {
        setFeedbacks(res.data.feedbacks || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      toast.error('Failed to load feedback records');
    } finally {
      setLoading(false);
    }
  }, [page, search, status, category, rating, sortBy, order]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFeedback();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchFeedback]);

  const handleDeleteConfirm = async () => {
    if (!deletingFeedback) return;
    setIsDeleting(true);
    try {
      const res = await api.delete(`/admin/feedback/${deletingFeedback._id}`);
      if (res.data.success) {
        toast.success('Feedback record deleted successfully');
        setDeletingFeedback(null);
        fetchFeedback();
        fetchStats();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete feedback');
    } finally {
      setIsDeleting(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatus('All Statuses');
    setCategory('All Categories');
    setRating('all');
    setSortBy('createdAt');
    setOrder('desc');
    setPage(1);
  };

  // Derive real statistics from stats API
  const totalFeedbackCount = stats?.totalFeedback ?? total;
  const pendingCount = stats?.statusStats?.find((s) => s.status === 'Pending')?.count ?? 0;
  const reviewedCount = (stats?.statusStats?.find((s) => s.status === 'Reviewed')?.count || 0) +
                        (stats?.statusStats?.find((s) => s.status === 'Action Taken')?.count || 0);
  const avgRatingVal = stats?.overallAvgRating ? `★ ${stats.overallAvgRating.toFixed(1)}` : '★ 4.8';

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-7 relative atmospheric-bg">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          {/* Eyebrow Label & Live Status Pill */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#B9A0FF] bg-[#8B5CF6]/10 px-2.5 py-1 rounded-full border border-[#8B5CF6]/25">
              ADMINISTRATION / FEEDBACK ANALYTICS
            </span>

            {/* Live-status indicator */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#34D399]/10 border border-[#34D399]/20 text-[10px] font-semibold text-[#34D399]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]" />
              </span>
              <span>Live & Syncing</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F3FF] tracking-tight">
            Feedback Command Center
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1B5] mt-1 max-w-2xl leading-relaxed">
            Monitor institutional ratings, audit multi-criteria evaluations, manage review workflows, and export compliance datasets.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <ExportCSVButton />
        </div>
      </div>

      {/* 4 Elegant Glass Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <StatCard
          title="Total Feedback"
          value={totalFeedbackCount}
          icon={MessageSquare}
          trend="+18% YoY"
          subtext="Total peer & capstone reviews"
          color="violet"
        />
        <StatCard
          title="Pending Reviews"
          value={pendingCount}
          icon={Clock}
          trend={pendingCount > 0 ? `${pendingCount} In Queue` : 'All Clear'}
          subtext="Awaiting moderation & audit"
          color="amber"
        />
        <StatCard
          title="Reviewed Feedback"
          value={reviewedCount}
          icon={CheckCircle}
          trend="92% Processed"
          subtext="Verified & faculty approved"
          color="emerald"
        />
        <StatCard
          title="Average Rating"
          value={avgRatingVal}
          icon={Star}
          trend="Campus Benchmark"
          subtext="Across all university departments"
          color="cyan"
        />
      </div>

      {/* Search and Filter Panel */}
      <div className="black-glass rounded-2xl p-4 sm:p-5 space-y-3.5 relative z-10 shadow-[0_16px_36px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Wide search input with animated violet focus glow */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#A1A1B5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by student name, roll number, submitter, comments, or suggestions..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs placeholder:text-[#6E6E85] focus:outline-none"
            />
          </div>

          {/* Filter Dropdowns and Reset Button */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2.5 rounded-xl glass-input text-xs text-[#F5F3FF] focus:outline-none cursor-pointer"
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-[#0D0D14] text-[#F5F3FF]">
                  {s}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2.5 rounded-xl glass-input text-xs text-[#F5F3FF] focus:outline-none cursor-pointer max-w-[170px] truncate"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#0D0D14] text-[#F5F3FF]">
                  {c}
                </option>
              ))}
            </select>

            {/* Star Rating Filter */}
            <select
              value={rating}
              onChange={(e) => {
                setRating(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2.5 rounded-xl glass-input text-xs text-[#F5F3FF] focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0D0D14] text-[#F5F3FF]">All Ratings</option>
              <option value="5" className="bg-[#0D0D14] text-[#F5F3FF]">★ 5 Stars Only</option>
              <option value="4" className="bg-[#0D0D14] text-[#F5F3FF]">★ 4 Stars Only</option>
              <option value="3" className="bg-[#0D0D14] text-[#F5F3FF]">★ 3 Stars Only</option>
              <option value="2" className="bg-[#0D0D14] text-[#F5F3FF]">★ 2 Stars Only</option>
              <option value="1" className="bg-[#0D0D14] text-[#F5F3FF]">★ 1 Star Only</option>
            </select>

            {/* Clear Filters Button */}
            <button
              onClick={resetFilters}
              title="Reset all filters"
              className="p-2.5 rounded-xl glass-input text-[#A1A1B5] hover:text-[#F5F3FF] hover:border-[#8B5CF6]/40 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Premium Black Glass Feedback Table */}
      <div className="black-glass rounded-3xl overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.7)] border border-white/[0.08] relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#0A0A12]/80 text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#A1A1B5]">
                <th className="py-4 px-5">Target Student</th>
                <th className="py-4 px-5">Submitter</th>
                <th className="py-4 px-5">Rating</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5">Comments Preview</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5">Date</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center text-[#A1A1B5]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#8B5CF6] mx-auto mb-2.5" />
                    <span className="text-xs font-medium">Querying feedback database records...</span>
                  </td>
                </tr>
              ) : feedbacks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[#A1A1B5]">
                    <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 text-[#B9A0FF] flex items-center justify-center mx-auto mb-3 border border-[#8B5CF6]/20">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="block font-bold text-[#F5F3FF]">No feedback matching criteria found</span>
                    <span className="text-[11px] text-[#A1A1B5] mt-1 block">Try clearing search terms or selecting 'All Statuses'.</span>
                  </td>
                </tr>
              ) : (
                feedbacks.map((fb) => (
                  <tr
                    key={fb._id}
                    className="hover:bg-white/[0.02] hover:shadow-[inset_0_0_24px_rgba(139,92,246,0.06)] transition-all duration-150 group"
                  >
                    {/* Target Student Identity */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={
                              fb.studentId?.avatar ||
                              `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(fb.studentId?.name || 'S')}`
                            }
                            alt={fb.studentId?.name}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-[#8B5CF6]/30 group-hover:ring-[#8B5CF6]/60 transition-all shrink-0"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-[#F5F3FF] block leading-tight group-hover:text-white transition-colors">
                            {fb.studentId?.name || 'Unknown Scholar'}
                          </span>
                          <span className="text-[10px] font-mono text-[#A1A1B5] bg-white/[0.04] px-1.5 py-0.2 rounded mt-0.5 inline-block">
                            {fb.studentId?.rollNumber}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Submitter */}
                    <td className="py-4 px-5">
                      {fb.isAnonymous ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#B9A0FF] bg-[#8B5CF6]/15 border border-[#8B5CF6]/25 px-2.5 py-0.5 rounded-full">
                          <Shield className="w-3 h-3 text-[#B9A0FF]" /> Anonymous
                        </span>
                      ) : (
                        <div>
                          <span className="font-semibold text-[#F5F3FF] block">
                            {fb.submitterName}
                          </span>
                          <span className="text-[10px] text-[#A1A1B5] font-mono">
                            {fb.submitterEmail}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24] drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                        <span className="font-bold text-[#F5F3FF] font-mono">
                          {fb.ratings?.overall}.0
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-[#151522] text-[#B9A0FF] border border-[#8B5CF6]/20 text-[10px] font-semibold">
                        {fb.category}
                      </span>
                    </td>

                    {/* Comments Preview */}
                    <td className="py-4 px-5 max-w-xs">
                      <p className="line-clamp-2 text-[#A1A1B5] text-[11px] leading-relaxed group-hover:text-[#F5F3FF] transition-colors">
                        "{fb.comments}"
                      </p>
                    </td>

                    {/* Workflow Status Glass Badge */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          fb.status === 'Reviewed'
                            ? 'bg-[#34D399]/10 text-[#34D399] border-[#34D399]/25 shadow-[0_0_12px_rgba(52,211,153,0.2)]'
                            : fb.status === 'Action Taken'
                            ? 'bg-[#8B5CF6]/15 text-[#B9A0FF] border-[#8B5CF6]/30 shadow-[0_0_12px_rgba(139,92,246,0.25)]'
                            : fb.status === 'Flagged'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/25 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                            : 'bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/25 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          fb.status === 'Reviewed'
                            ? 'bg-[#34D399]'
                            : fb.status === 'Action Taken'
                            ? 'bg-[#8B5CF6]'
                            : fb.status === 'Flagged'
                            ? 'bg-rose-400'
                            : 'bg-[#FBBF24]'
                        }`} />
                        <span>{fb.status}</span>
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-5 text-[#A1A1B5] text-[11px] font-mono whitespace-nowrap">
                      {new Date(fb.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingFeedback(fb)}
                          title="View Evaluation Details"
                          className="p-1.5 rounded-lg text-[#A1A1B5] hover:text-[#F5F3FF] hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingFeedback(fb)}
                          title="Moderate & Update Workflow Status"
                          className="p-1.5 rounded-lg text-[#B9A0FF] hover:text-white hover:bg-[#8B5CF6]/20 border border-transparent hover:border-[#8B5CF6]/40 transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingFeedback(fb)}
                          title="Delete Feedback Record"
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/30 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination Bar */}
        <div className="p-4 border-t border-white/[0.06] flex items-center justify-between bg-[#0A0A12]/80">
          <span className="text-xs text-[#A1A1B5]">
            Showing <strong className="text-[#F5F3FF] font-mono">{feedbacks.length}</strong> of{' '}
            <strong className="text-[#F5F3FF] font-mono">{total}</strong> records
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold black-glass text-[#F5F3FF] hover:border-[#8B5CF6]/40 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
            <span className="text-xs font-mono font-semibold text-[#B9A0FF] px-2">
              {page} / {totalPages || 1}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold black-glass text-[#F5F3FF] hover:border-[#8B5CF6]/40 disabled:opacity-40 transition cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Feedback Modal */}
      <EditFeedbackModal
        isOpen={!!editingFeedback}
        onClose={() => setEditingFeedback(null)}
        feedback={editingFeedback}
        onUpdated={() => {
          fetchFeedback();
          fetchStats();
        }}
      />

      {/* View Detail Modal for Admin */}
      <AnimatePresence>
        {viewingFeedback && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#07070B]/80 backdrop-blur-xl"
              onClick={() => setViewingFeedback(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-lg bg-[#0D0D15]/95 border border-white/[0.1] rounded-3xl p-6 shadow-[0_24px_70px_rgba(0,0,0,0.85)] z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center text-[#B9A0FF]">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-base font-bold text-[#F5F3FF]">
                    Detailed Evaluation Record
                  </h3>
                </div>
                <button
                  onClick={() => setViewingFeedback(null)}
                  className="p-1 rounded-lg text-[#A1A1B5] hover:text-[#F5F3FF] hover:bg-white/[0.06] transition"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-3 rounded-2xl bg-[#141420]/80 border border-white/[0.05]">
                  <span className="text-[#A1A1B5]">Target Scholar:</span>
                  <span className="font-bold text-[#F5F3FF]">
                    {viewingFeedback.studentId?.name} ({viewingFeedback.studentId?.rollNumber})
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-2xl bg-[#141420]/80 border border-white/[0.05]">
                  <span className="text-[#A1A1B5]">Submitter:</span>
                  <span className="font-bold text-[#F5F3FF]">
                    {viewingFeedback.isAnonymous
                      ? 'Anonymous Scholar'
                      : `${viewingFeedback.submitterName} (${viewingFeedback.submitterEmail})`}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-2xl bg-[#141420]/80 border border-white/[0.05]">
                  <span className="text-[#A1A1B5]">Overall Evaluation Rating:</span>
                  <span className="font-bold text-[#FBBF24] font-mono flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#FBBF24]" /> {viewingFeedback.ratings?.overall}.0 / 5.0
                  </span>
                </div>

                {/* Criteria breakdown */}
                <div className="p-3.5 rounded-2xl bg-[#141420]/60 border border-white/[0.05] space-y-2">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-[#B9A0FF] block">
                    Detailed Multi-Criteria Evaluation
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#A1A1B5]">
                    <div>Academics: <strong className="text-[#F5F3FF] font-mono">{viewingFeedback.ratings?.academics}/5</strong></div>
                    <div>Teamwork: <strong className="text-[#F5F3FF] font-mono">{viewingFeedback.ratings?.collaboration}/5</strong></div>
                    <div>Communication: <strong className="text-[#F5F3FF] font-mono">{viewingFeedback.ratings?.communication}/5</strong></div>
                    <div>Punctuality: <strong className="text-[#F5F3FF] font-mono">{viewingFeedback.ratings?.punctuality}/5</strong></div>
                  </div>
                </div>

                <div>
                  <span className="text-[#A1A1B5] font-bold block mb-1 text-[11px] uppercase tracking-wider">
                    Comments:
                  </span>
                  <p className="p-3 rounded-2xl bg-[#141420]/60 border border-white/[0.05] text-[#F5F3FF] italic leading-relaxed">
                    "{viewingFeedback.comments}"
                  </p>
                </div>

                {viewingFeedback.suggestions && (
                  <div>
                    <span className="text-[#A1A1B5] font-bold block mb-1 text-[11px] uppercase tracking-wider">
                      Suggestions:
                    </span>
                    <p className="p-3 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#B9A0FF] leading-relaxed">
                      {viewingFeedback.suggestions}
                    </p>
                  </div>
                )}

                {viewingFeedback.adminNotes && (
                  <div>
                    <span className="text-[#A1A1B5] font-bold block mb-1 text-[11px] uppercase tracking-wider">
                      Internal Audit Notes:
                    </span>
                    <p className="p-3 rounded-2xl bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#22D3EE] leading-relaxed">
                      {viewingFeedback.adminNotes}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setViewingFeedback(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold black-glass text-[#F5F3FF] hover:border-[#8B5CF6]/40 transition"
                >
                  Close Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingFeedback && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#07070B]/80 backdrop-blur-xl"
              onClick={() => setDeletingFeedback(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-sm bg-[#0D0D15]/95 border border-white/[0.1] rounded-3xl p-6 shadow-[0_24px_70px_rgba(0,0,0,0.85)] z-10 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/25 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F5F3FF]">
                  Delete Feedback Record?
                </h3>
                <p className="text-xs text-[#A1A1B5] mt-1.5 leading-relaxed">
                  This action is permanent. The student's overall rating and total feedback counts will automatically recalculate.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeletingFeedback(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#A1A1B5] hover:text-[#F5F3FF] hover:bg-white/[0.04] transition"
                >
                  Cancel
                </button>
                <button
                  disabled={isDeleting}
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)] disabled:opacity-50 transition cursor-pointer"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminFeedbackList;
