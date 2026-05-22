import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, redirect
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all credentials.');
      return;
    }
    
    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate(redirect);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#F7F1E6] border border-[#4E5A46]/10 p-8 rounded-3xl shadow-premium w-full max-w-md space-y-6"
      >
        
        {/* Brand Icon and Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-[#E8C5C0]/40 rounded-full text-[#C26D53] mb-2">
            <Coffee className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-semibold text-[#4E5A46]">Welcome Back</h1>
          <p className="text-xs text-[#4E5A46]/60">Sign in to retrieve your favorites and track orders.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1">
            <label className="text-2xs text-[#4E5A46]/60 uppercase font-semibold">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#E8C5C0]/20 border border-[#4E5A46]/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53]"
              />
              <Mail className="w-4 h-4 text-[#4E5A46]/50 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <label className="text-2xs text-[#4E5A46]/60 uppercase font-semibold">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#E8C5C0]/20 border border-[#4E5A46]/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53]"
              />
              <Lock className="w-4 h-4 text-[#4E5A46]/50 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C26D53] hover:bg-[#C26D53]/90 text-[#F7F1E6] font-semibold py-3 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all duration-200 mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Enter Café'
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center pt-2 text-xs text-[#4E5A46]/75">
          <span>New to the Coffee House? </span>
          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="text-[#C26D53] font-semibold hover:underline"
          >
            Register Here
          </Link>
        </div>

      </motion.div>
    </div>
  );
};

export default Login;
