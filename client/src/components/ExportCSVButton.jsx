import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ExportCSVButton = ({ className = '' }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/export-csv', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      const filename = `CampusVoice_Feedback_Report_${new Date().toISOString().slice(0, 10)}.csv`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Feedback dataset exported successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to export CSV report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`relative group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#F5F3FF] bg-[#12121E]/80 hover:bg-[#1A1A2B] border border-white/[0.08] hover:border-[#8B5CF6]/40 shadow-[0_4px_16px_rgba(0,0,0,0.5)] disabled:opacity-50 transition-all duration-200 cursor-pointer ${className}`}
    >
      {/* Subtle violet sheen on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#8B5CF6]/0 via-[#8B5CF6]/10 to-[#8B5CF6]/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B9A0FF]" />
      ) : (
        <Download className="w-3.5 h-3.5 text-[#B9A0FF] group-hover:scale-110 transition-transform" />
      )}
      <span>{loading ? 'Exporting...' : 'Export Report'}</span>
    </button>
  );
};

export default ExportCSVButton;
