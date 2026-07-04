import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Coffee, ShieldAlert, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const { login, user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // If already logged in as admin, redirect immediately
  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setFormLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        // Fetch user from context (since context setUser updates asynchronously, we check local state)
        // Wait, context login returns success and updates context user.
        // Let's redirect in the useEffect above or check user role.
        // If the user isn't admin, context login still sets them in context. We must check role:
        // Wait, let's wait a moment and fetch updated auth state.
        // If login returns, the user profile is set. If not admin, logout and show error.
      } else {
        setErrorMsg(res.message);
        setFormLoading(false);
      }
    } catch (err) {
      setErrorMsg('Login failed. Please try again.');
      setFormLoading(false);
    }
  };

  // Check role after auth state changes
  useEffect(() => {
    if (user && !loading) {
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else if (user) {
        // Logged-in user is NOT an admin! Log out and show error.
        setErrorMsg('Access denied. You do not have administrator permissions.');
        setFormLoading(false);
      }
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F1E6] space-y-4">
        <div className="w-10 h-10 border-4 border-[#C26D53] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#4E5A46]/60 font-serif italic">Loading Admin console...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F1E6] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-8 sm:p-10 shadow-soft"
      >
        {/* Brand Logo & Heading */}
        <div className="text-center space-y-3 pb-8">
          <div className="w-12 h-12 bg-[#C26D53] text-[#F7F1E6] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-[#C26D53] uppercase font-sans">Administrative Portal</span>
            <h2 className="font-serif text-2xl font-bold text-[#4E5A46] mt-0.5">Owner Access Console</h2>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200/50 rounded-2xl flex items-start gap-3"
          >
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 font-medium leading-relaxed">{errorMsg}</p>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-2xs font-bold text-[#4E5A46]/70 uppercase tracking-wider pl-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@cafebarista.com"
              required
              className="w-full px-4 py-3 bg-[#E8C5C0]/15 focus:bg-[#E8C5C0]/25 border border-[#4E5A46]/10 focus:border-[#C26D53] focus:ring-0 rounded-2xl text-sm placeholder-[#4E5A46]/35 outline-none transition-all duration-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-2xs font-bold text-[#4E5A46]/70 uppercase tracking-wider pl-1">Secret Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-[#E8C5C0]/15 focus:bg-[#E8C5C0]/25 border border-[#4E5A46]/10 focus:border-[#C26D53] focus:ring-0 rounded-2xl text-sm placeholder-[#4E5A46]/35 outline-none transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="w-full mt-2 py-3.5 bg-[#C26D53] hover:bg-[#C26D53]/95 text-[#F7F1E6] font-semibold text-xs rounded-full flex items-center justify-center gap-2 tracking-wide uppercase transition-all duration-200 disabled:opacity-60 shadow-sm"
          >
            {formLoading ? (
              <div className="w-4 h-4 border-2 border-[#F7F1E6] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Open Console
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
