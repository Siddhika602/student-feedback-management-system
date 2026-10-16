import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Clock, CheckCircle, AlertTriangle, Star, Sparkles } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const EditFeedbackModal = ({ isOpen, onClose, feedback, onUpdated }) => {
  const [status, setStatus] = useState('Pending');
  const [adminNotes, setAdminNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (feedback) {
      setStatus(feedback.status || 'Pending');
      setAdminNotes(feedback.adminNotes || '');
    }
  }, [feedback]);

  if (!isOpen || !feedback) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.put(`/admin/feedback/${feedback._id}`, {
        status,
        adminNotes,
      });

      if (res.data.success) {
        toast.success('Feedback status & notes updated successfully!');
        if (onUpdated) onUpdated(res.data.feedback);
        onClose();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update feedback');
    } finally {
      setIsSaving(false);
    }
  };

  const statusOptions = [
    { value: 'Pending', label: 'Pending Review', icon: Clock, color: 'text-[#FBBF24]', border: 'border-[#FBBF24]/40', bg: 'bg-[#FBBF24]/10' },
    { value: 'Reviewed', label: 'Reviewed & Approved', icon: CheckCircle, color: 'text-[#34D399]', border: 'border-[#34D399]/40', bg: 'bg-[#34D399]/10' },
    { value: 'Action Taken', label: 'Action Taken', icon: CheckCircle, color: 'text-[#8B5CF6]', border: 'border-[#8B5CF6]/40', bg: 'bg-[#8B5CF6]/10' },
    { value: 'Flagged', label: 'Flagged / Violation', icon: AlertTriangle, color: 'text-rose-400', border: 'border-rose-500/40', bg: 'bg-rose-500/10' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Deep Translucent Backdrop */}
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
          className="relative w-full max-w-lg bg-[#0D0D15]/95 border border-white/[0.1] rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.85)] overflow-hidden z-10 flex flex-col"
        >
          {/* Subtle top violet glow highlight */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent" />

          {/* Header */}
          <div className="p-6 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center text-[#B9A0FF]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#F5F3FF]">
                  Moderate & Update Feedback
                </h2>
                <p className="text-[11px] font-mono text-[#A1A1B5]">
                  ID: {feedback._id}
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

          {/* Form */}
          <form onSubmit={handleSave} className="p-6 space-y-5">
            {/* Target Student Preview */}
            <div className="p-3.5 rounded-2xl bg-[#141420]/80 border border-white/[0.06] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={
                    feedback.studentId?.avatar ||
                    `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(feedback.studentId?.name || 'S')}`
                  }
                  alt={feedback.studentId?.name}
                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-[#8B5CF6]/30"
                />
                <div>
                  <span className="text-[#A1A1B5] block text-[10px] uppercase font-bold tracking-wider">Target Student</span>
                  <span className="font-bold text-[#F5F3FF]">
                    {feedback.studentId?.name || 'Student'} ({feedback.studentId?.rollNumber})
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[#A1A1B5] block text-[10px] uppercase font-bold tracking-wider">Rating</span>
                <span className="font-bold text-[#FBBF24] font-mono flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#FBBF24] inline" /> {feedback.ratings?.overall}.0
                </span>
              </div>
            </div>

            {/* Comment Preview */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#A1A1B5]">
                Student Comments
              </label>
              <p className="text-xs text-[#F5F3FF] p-3.5 rounded-2xl bg-[#141420]/60 border border-white/[0.05] italic leading-relaxed">
                "{feedback.comments}"
              </p>
            </div>

            {/* Workflow Status Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#A1A1B5] block">
                Workflow Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = status === opt.value;
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setStatus(opt.value)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? `${opt.bg} ${opt.border} text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]`
                          : 'border-white/[0.06] bg-[#141420]/40 text-[#A1A1B5] hover:bg-white/[0.04] hover:text-[#F5F3FF]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${opt.color}`} />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Admin Notes */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#A1A1B5] block">
                Internal Administrative Audit Notes
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add audit documentation, faculty review notes, or committee decisions..."
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs placeholder:text-[#6E6E85] resize-none outline-none leading-relaxed"
              />
            </div>

            {/* Action Buttons */}
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
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white violet-glow-btn disabled:opacity-50 transition cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditFeedbackModal;
