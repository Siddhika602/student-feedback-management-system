import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import MyFeedback from './pages/MyFeedback';
import AdminDashboard from './pages/AdminDashboard';
import AdminFeedbackList from './pages/AdminFeedbackList';
import NotFound from './pages/NotFound';

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#07070B] text-[#F5F3FF] transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public / Landing route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Student / Peer routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-feedback"
            element={
              <ProtectedRoute>
                <MyFeedback />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminFeedbackList />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Futuristic Black Glass Footer */}
      <footer className="border-t border-white/[0.06] py-6 px-4 text-center text-xs text-[#A1A1B5] black-glass mt-auto relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#F5F3FF]">
              CampusVoice
            </span>
            <span className="text-white/20">—</span>
            <span className="text-[11px] text-[#A1A1B5]">Student Feedback & Peer Evaluation System</span>
          </div>
          <div className="text-[11px] font-mono text-[#A1A1B5]">
            Obsidian Black Glassmorphism • React + Tailwind + Express + MongoDB
          </div>
        </div>
      </footer>

      {/* Sleek Toaster Notification System with Obsidian Violet Styling */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0D0D15',
            color: '#F5F3FF',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 500,
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(139, 92, 246, 0.25)',
          },
          success: {
            iconTheme: {
              primary: '#8B5CF6',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
