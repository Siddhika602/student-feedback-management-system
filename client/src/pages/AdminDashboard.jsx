import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Star,
  Clock,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Loader2,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import StatCard from '../components/StatCard';
import ExportCSVButton from '../components/ExportCSVButton';
import api from '../services/api';
import { Link } from 'react-router-dom';
import StarRating from '../components/StarRating';

const COLORS = ['#8B5CF6', '#B9A0FF', '#22D3EE', '#34D399', '#FBBF24'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Error fetching admin statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
        <span className="text-xs font-medium text-[#A1A1B5]">
          Synthesizing institutional metrics...
        </span>
      </div>
    );
  }

  const pendingCount =
    stats?.statusStats?.find((s) => s.status === 'Pending')?.count || 0;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-7 relative atmospheric-bg">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#B9A0FF] bg-[#8B5CF6]/10 px-2.5 py-1 rounded-full border border-[#8B5CF6]/25">
              ADMINISTRATION / INSTITUTIONAL ANALYTICS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F3FF] tracking-tight">
            Institutional Feedback Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1B5] mt-1">
            Real-time analytics, peer review distributions, and moderation workflows
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportCSVButton />
          <Link
            to="/admin/feedback"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white violet-glow-btn transition"
          >
            <span>Feedback Manager</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <StatCard
          title="Total Scholars"
          value={stats?.totalStudents || 0}
          icon={Users}
          trend="+12% Active"
          subtext="Enrolled across 6 departments"
          color="violet"
        />
        <StatCard
          title="Total Reviews"
          value={stats?.totalFeedback || 0}
          icon={MessageSquare}
          trend="+18% YoY"
          subtext="Peer & faculty evaluations"
          color="cyan"
        />
        <StatCard
          title="Overall Rating"
          value={`★ ${stats?.overallAvgRating || 4.8}`}
          icon={Star}
          trend="Top 5%"
          subtext="Campus-wide quality score"
          color="amber"
        />
        <StatCard
          title="Pending Moderation"
          value={pendingCount}
          icon={Clock}
          trend={pendingCount > 0 ? 'Action Required' : 'All Clear'}
          subtext="Awaiting review & notes"
          color="emerald"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Rating Distribution Chart */}
        <div className="black-glass-card rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#F5F3FF]">
                Rating Distribution
              </h2>
              <p className="text-[11px] text-[#A1A1B5]">
                Frequency breakdown across 1 to 5 star ratings
              </p>
            </div>
            <span className="text-[10px] font-bold font-mono text-[#FBBF24] bg-[#FBBF24]/10 px-2 py-0.5 rounded-md border border-[#FBBF24]/20">
              Score: {stats?.overallAvgRating || 0}/5.0
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.ratingBreakdown || []}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#A1A1B5' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#A1A1B5' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D0D15',
                    borderRadius: '14px',
                    borderColor: 'rgba(255,255,255,0.1)',
                    fontSize: '11px',
                    color: '#F5F3FF',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.8)'
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Feedback Count"
                  fill="#8B5CF6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div className="black-glass-card rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#F5F3FF]">
                Evaluation by Category
              </h2>
              <p className="text-[11px] text-[#A1A1B5]">
                Peer reviews grouped by academic & collaborative areas
              </p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {stats?.categoryStats?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryStats}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {stats.categoryStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D0D15',
                      borderRadius: '14px',
                      borderColor: 'rgba(255,255,255,0.1)',
                      fontSize: '11px',
                      color: '#F5F3FF',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.8)'
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px', paddingTop: '10px', color: '#A1A1B5' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-[#A1A1B5]">No category data available</span>
            )}
          </div>
        </div>

        {/* Branch-wise Feedback Breakdown */}
        <div className="black-glass-card rounded-3xl p-6 shadow-xl space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#F5F3FF]">
                Department Performance & Engagement
              </h2>
              <p className="text-[11px] text-[#A1A1B5]">
                Feedback activity and average ratings across academic branches
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.branchStats || []}
                margin={{ top: 10, right: 20, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="branch"
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 10, fill: '#A1A1B5' }}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#A1A1B5' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D0D15',
                    borderRadius: '14px',
                    borderColor: 'rgba(255,255,255,0.1)',
                    fontSize: '11px',
                    color: '#F5F3FF',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.8)'
                  }}
                />
                <Bar
                  dataKey="feedbackCount"
                  name="Feedback Submissions"
                  fill="#B9A0FF"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Recent Feedbacks Feed */}
      <div className="black-glass rounded-3xl p-6 shadow-xl space-y-4 relative z-10 border border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#F5F3FF]">
              Recent Feedback Activity
            </h2>
            <p className="text-[11px] text-[#A1A1B5]">
              Latest submissions received in the system
            </p>
          </div>
          <Link
            to="/admin/feedback"
            className="text-xs font-bold text-[#B9A0FF] hover:text-white hover:underline flex items-center gap-1 transition"
          >
            <span>View All Records in Manager</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {stats?.recentFeedbacks?.length === 0 ? (
            <p className="text-xs text-[#A1A1B5] text-center py-6">
              No recent feedback records.
            </p>
          ) : (
            stats?.recentFeedbacks?.map((fb) => (
              <div
                key={fb._id}
                className="p-4 rounded-2xl bg-[#141420]/70 border border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#8B5CF6]/30 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      fb.studentId?.avatar ||
                      `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(fb.studentId?.name || 'Student')}`
                    }
                    alt={fb.studentId?.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#8B5CF6]/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#F5F3FF]">
                        {fb.studentId?.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-[#B9A0FF]">
                        {fb.studentId?.rollNumber}
                      </span>
                    </div>
                    <p className="text-xs text-[#A1A1B5] line-clamp-1 mt-0.5">
                      "{fb.comments}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <StarRating rating={fb.ratings?.overall || 5} size="sm" />
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      fb.status === 'Reviewed'
                        ? 'bg-[#34D399]/10 text-[#34D399] border-[#34D399]/25'
                        : fb.status === 'Action Taken'
                        ? 'bg-[#8B5CF6]/15 text-[#B9A0FF] border-[#8B5CF6]/30'
                        : fb.status === 'Flagged'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                        : 'bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/25'
                    }`}
                  >
                    {fb.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
