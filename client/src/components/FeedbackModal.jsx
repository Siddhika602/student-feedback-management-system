import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import StarRating from './StarRating';
import api from '../services/api';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const categories = [
  'Academic Performance',
  'Project Collaboration',
  'Extracurricular Activities',
  'Leadership & Conduct',
  'General Feedback',
];

const presetTags = [
  'Helpful',
  'Great Communicator',
  'Team Player',
  'Punctual',
  'Creative Thinker',
  'Problem Solver',
  'Organized',
  'Leadership',
];

const FeedbackModal = ({ isOpen, onClose, student, onSuccess }) => {
  const [ratings, setRatings] = useState({
    overall: 5,
    academics: 5,
    collaboration: 5,
    communication: 5,
    punctuality: 5,
  });
  const [category, setCategory] = useState('Project Collaboration');
  const [comments, setComments] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedTags, setSelectedTags] = useState(['Team Player']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !student) return null;

  const handleRatingChange = (field, value) => {
    setRatings((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#8B5CF6', '#B9A0FF', '#22D3EE', '#34D399', '#FBBF24'],
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!comments || comments.trim().length < 5) {
      setErrorMessage('Please provide comments with at least 5 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        studentId: student._id,
        ratings,
        category,
        comments: comments.trim(),
        suggestions: suggestions.trim(),
        isAnonymous,
        tags: selectedTags,
      };

      const res = await api.post('/feedback', payload);
      if (res.data.success) {
        toast.success('Feedback submitted successfully!');
        triggerConfetti();
        if (onSuccess) onSuccess(res.data.feedback);
        onClose();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit feedback.');
      toast.error(err.message || 'Error submitting feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

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

          {/* Header Banner */}
          <div className="p-6 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3.5">
              <img
                src={
                  student.avatar ||
                  `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(student.name)}`
                }
                alt={student.name}
                className="w-11 h-11 rounded-xl object-cover ring-1 ring-[#8B5CF6]/40"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#F5F3FF]">
                    Submit Peer Evaluation
                  </h2>
                  <span className="text-[10px] px-2 py-0.2 rounded-full font-mono font-bold bg-[#8B5CF6]/15 text-[#B9A0FF] border border-[#8B5CF6]/30">
                    {student.rollNumber}
                  </span>
                </div>
                <p className="text-xs text-[#A1A1B5] mt-0.5">
                  Evaluating <strong className="text-[#F5F3FF]">{student.name}</strong> • {student.branch} ({student.semester})
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#A1A1B5] hover:text-[#F5F3FF] hover:bg-white/[0.06] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-2.5 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Overall Rating Section */}
            <div className="p-4 rounded-2xl bg-[#141422]/90 border border-[#8B5CF6]/25 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
              <div>
                <label className="text-xs font-bold text-[#F5F3FF] block uppercase tracking-wider">
                  Overall Evaluation Rating *
                </label>
                <span className="text-[11px] text-[#A1A1B5]">
                  Holistic assessment of collaboration & quality
                </span>
              </div>
              <StarRating
                rating={ratings.overall}
                onRatingChange={(val) => handleRatingChange('overall', val)}
                interactive={true}
                size="lg"
                showText={true}
              />
            </div>

            {/* Specific Evaluation Criteria */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#B9A0FF]">
                Detailed Multi-Criteria Evaluation
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-[#12121E]/80 border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#F5F3FF] block">
                      Academic Contribution
                    </span>
                    <span className="text-[10px] text-[#A1A1B5]">Subject depth & skills</span>
                  </div>
                  <StarRating
                    rating={ratings.academics}
                    onRatingChange={(val) => handleRatingChange('academics', val)}
                    interactive={true}
                    size="sm"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#12121E]/80 border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#F5F3FF] block">
                      Teamwork & Synergy
                    </span>
                    <span className="text-[10px] text-[#A1A1B5]">Coordination & effort</span>
                  </div>
                  <StarRating
                    rating={ratings.collaboration}
                    onRatingChange={(val) => handleRatingChange('collaboration', val)}
                    interactive={true}
                    size="sm"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#12121E]/80 border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#F5F3FF] block">
                      Communication
                    </span>
                    <span className="text-[10px] text-[#A1A1B5]">Clarity & responsiveness</span>
                  </div>
                  <StarRating
                    rating={ratings.communication}
                    onRatingChange={(val) => handleRatingChange('communication', val)}
                    interactive={true}
                    size="sm"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#12121E]/80 border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#F5F3FF] block">
                      Punctuality & Reliability
                    </span>
                    <span className="text-[10px] text-[#A1A1B5]">Deadlines & presence</span>
                  </div>
                  <StarRating
                    rating={ratings.punctuality}
                    onRatingChange={(val) => handleRatingChange('punctuality', val)}
                    interactive={true}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#A1A1B5] block">
                Evaluation Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                      category === cat
                        ? 'bg-[#8B5CF6]/25 text-white border border-[#8B5CF6]/50 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                        : 'bg-[#141420]/70 text-[#A1A1B5] hover:text-[#F5F3FF] border border-white/[0.06]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Comments Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#A1A1B5]">
                  Constructive Comments *
                </label>
                <span className="text-[10px] text-[#A1A1B5] font-mono">{comments.length} chars</span>
              </div>
              <textarea
                rows={3}
                required
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share your detailed feedback on their teamwork, strengths, lab contributions..."
                className="w-full px-4 py-3 rounded-xl glass-input text-xs placeholder:text-[#6E6E85] resize-none outline-none leading-relaxed"
              />
            </div>

            {/* Suggestions Textarea */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#A1A1B5] block">
                Suggestions for Growth (Optional)
              </label>
              <textarea
                rows={2}
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="Any recommendations, books, tools, or tips for upcoming milestones..."
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs placeholder:text-[#6E6E85] resize-none outline-none leading-relaxed"
              />
            </div>

            {/* Recognition Tags */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#A1A1B5] block">
                Recognition Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {presetTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-[10px] font-medium px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#8B5CF6]/30 text-[#F5F3FF] border border-[#8B5CF6]/50 shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                          : 'bg-[#141420]/60 text-[#A1A1B5] hover:bg-white/[0.04] border border-white/[0.05]'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className="pt-1">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-[#141422]/70 border border-white/[0.06] cursor-pointer hover:border-[#8B5CF6]/30 transition">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-[#8B5CF6] focus:ring-0 bg-[#0A0A10] border-white/20"
                />
                <div className="flex items-center gap-2 text-xs">
                  <Shield className="w-4 h-4 text-[#B9A0FF] shrink-0" />
                  <span className="text-[#F5F3FF] font-medium">
                    Submit as Anonymous Evaluation (Hides your name and email from peer)
                  </span>
                </div>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#A1A1B5] hover:text-[#F5F3FF] hover:bg-white/[0.04] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white violet-glow-btn disabled:opacity-50 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Evaluation'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FeedbackModal;
