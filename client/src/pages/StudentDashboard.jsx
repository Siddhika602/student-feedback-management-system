import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  Star,
  Users,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
  Loader2,
  Layers
} from 'lucide-react';
import StudentCard from '../components/StudentCard';
import FeedbackModal from '../components/FeedbackModal';
import FeedbackDetailModal from '../components/FeedbackDetailModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedMinRating, setSelectedMinRating] = useState('');
  const [sortBy, setSortBy] = useState('averageRating');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  // Modals state
  const [activeFeedbackStudent, setActiveFeedbackStudent] = useState(null);
  const [activeDetailStudent, setActiveDetailStudent] = useState(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 9,
        search: searchTerm,
        branch: selectedBranch !== 'all' ? selectedBranch : undefined,
        semester: selectedSemester !== 'all' ? selectedSemester : undefined,
        minRating: selectedMinRating || undefined,
        sort: sortBy,
        order: 'desc',
      };

      const res = await api.get('/students', { params });
      if (res.data.success) {
        setStudents(res.data.students || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalStudents(res.data.total || 0);
        if (res.data.branches?.length) setBranches(res.data.branches);
        if (res.data.semesters?.length) setSemesters(res.data.semesters);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedBranch, selectedSemester, selectedMinRating, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  const handleFeedbackSuccess = () => {
    fetchStudents();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedBranch('all');
    setSelectedSemester('all');
    setSelectedMinRating('');
    setSortBy('averageRating');
    setPage(1);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-7 relative atmospheric-bg">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 black-glass border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.85)] z-10">
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-[#22D3EE]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/15 text-[#B9A0FF] border border-[#8B5CF6]/30 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Peer Evaluation & Feedback Ecosystem</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F5F3FF] tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Scholar'}
            </h1>
            <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed">
              Explore the student directory, evaluate capstone peer contributions, rate lab synergy, and provide constructive academic feedback.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#0A0A10]/90 border border-white/[0.08] p-3 sm:p-4 rounded-2xl backdrop-blur-md shrink-0 shadow-xl">
            <div className="text-center px-3 border-r border-white/[0.06]">
              <span className="block text-xl font-bold font-mono text-[#B9A0FF]">
                {totalStudents}
              </span>
              <span className="text-[10px] text-[#A1A1B5] uppercase font-bold tracking-wider">Scholars</span>
            </div>
            <div className="text-center px-3 border-r border-white/[0.06]">
              <span className="block text-xl font-bold font-mono text-[#22D3EE]">
                {branches.length || 6}
              </span>
              <span className="text-[10px] text-[#A1A1B5] uppercase font-bold tracking-wider">Branches</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-xl font-bold font-mono text-[#FBBF24]">
                ★ 4.8
              </span>
              <span className="text-[10px] text-[#A1A1B5] uppercase font-bold tracking-wider">Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="black-glass rounded-2xl p-4 sm:p-5 space-y-3.5 relative z-10 shadow-[0_16px_36px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#A1A1B5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search by student name, roll number, branch, or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs placeholder:text-[#6E6E85] focus:outline-none"
            />
          </div>

          {/* Controls: Semester, Min Rating, Sort */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Semester Filter */}
            <select
              value={selectedSemester}
              onChange={(e) => {
                setSelectedSemester(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2.5 rounded-xl glass-input text-xs text-[#F5F3FF] focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0D0D14] text-[#F5F3FF]">All Semesters</option>
              {semesters.map((s) => (
                <option key={s} value={s} className="bg-[#0D0D14] text-[#F5F3FF]">
                  {s}
                </option>
              ))}
            </select>

            {/* Min Rating Filter */}
            <select
              value={selectedMinRating}
              onChange={(e) => {
                setSelectedMinRating(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2.5 rounded-xl glass-input text-xs text-[#F5F3FF] focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-[#0D0D14] text-[#F5F3FF]">Any Rating</option>
              <option value="4.5" className="bg-[#0D0D14] text-[#F5F3FF]">★ 4.5+ Stars</option>
              <option value="4.0" className="bg-[#0D0D14] text-[#F5F3FF]">★ 4.0+ Stars</option>
              <option value="3.0" className="bg-[#0D0D14] text-[#F5F3FF]">★ 3.0+ Stars</option>
            </select>

            {/* Sort order */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2.5 rounded-xl glass-input text-xs text-[#F5F3FF] focus:outline-none cursor-pointer"
            >
              <option value="averageRating" className="bg-[#0D0D14] text-[#F5F3FF]">Highest Rating</option>
              <option value="totalFeedbackCount" className="bg-[#0D0D14] text-[#F5F3FF]">Most Reviews</option>
              <option value="name" className="bg-[#0D0D14] text-[#F5F3FF]">Name (A-Z)</option>
            </select>

            {/* Reset button */}
            <button
              onClick={resetFilters}
              title="Reset all filters"
              className="p-2.5 rounded-xl glass-input text-[#A1A1B5] hover:text-[#F5F3FF] hover:border-[#8B5CF6]/40 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Branch Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => {
              setSelectedBranch('all');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedBranch === 'all'
                ? 'bg-[#8B5CF6]/25 text-white border border-[#8B5CF6]/50 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                : 'bg-[#141420]/70 text-[#A1A1B5] hover:text-[#F5F3FF] border border-white/[0.06]'
            }`}
          >
            All Departments ({totalStudents})
          </button>
          {branches.map((b) => (
            <button
              key={b}
              onClick={() => {
                setSelectedBranch(b);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedBranch === b
                  ? 'bg-[#8B5CF6]/25 text-white border border-[#8B5CF6]/50 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                  : 'bg-[#141420]/70 text-[#A1A1B5] hover:text-[#F5F3FF] border border-white/[0.06]'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Students Directory Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
          <span className="text-xs font-medium text-[#A1A1B5]">
            Querying student directory records...
          </span>
        </div>
      ) : students.length === 0 ? (
        <div className="py-16 text-center black-glass rounded-3xl p-8 space-y-3 z-10 relative">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#8B5CF6]/10 text-[#B9A0FF] flex items-center justify-center border border-[#8B5CF6]/20">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#F5F3FF]">
            No scholars match your filters
          </h3>
          <p className="text-xs text-[#A1A1B5] max-w-md mx-auto">
            Try adjusting your search query, selecting "All Departments", or resetting filters.
          </p>
          <div className="pt-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white violet-glow-btn transition cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
        >
          <AnimatePresence>
            {students.map((student) => (
              <StudentCard
                key={student._id}
                student={student}
                onGiveFeedback={(st) => setActiveFeedbackStudent(st)}
                onViewDetails={(st) => setActiveDetailStudent(st)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 relative z-10">
          <span className="text-xs text-[#A1A1B5]">
            Page <strong className="text-[#F5F3FF] font-mono">{page}</strong> of{' '}
            <strong className="text-[#F5F3FF] font-mono">{totalPages}</strong> ({totalStudents} scholars)
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold black-glass text-[#F5F3FF] hover:border-[#8B5CF6]/40 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
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
      )}

      {/* Feedback Submission Modal */}
      <FeedbackModal
        isOpen={!!activeFeedbackStudent}
        onClose={() => setActiveFeedbackStudent(null)}
        student={activeFeedbackStudent}
        onSuccess={handleFeedbackSuccess}
      />

      {/* Feedback Details Portfolio Modal */}
      <FeedbackDetailModal
        isOpen={!!activeDetailStudent}
        onClose={() => setActiveDetailStudent(null)}
        student={activeDetailStudent}
        onGiveFeedback={(st) => setActiveFeedbackStudent(st)}
      />
    </div>
  );
};

export default StudentDashboard;
