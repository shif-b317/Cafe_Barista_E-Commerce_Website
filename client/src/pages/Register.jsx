import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Loader2, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all registration fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    setLoading(true);
    setError('');

    const res = await register(name, email, password);
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
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-[#E8C5C0]/40 rounded-full text-[#C26D53] mb-2">
            <Coffee className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-semibold text-[#4E5A46]">Join the House</h1>
          <p className="text-xs text-[#4E5A46]/60">Create an account to begin tracking your sweet deliveries.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name input */}
          <div className="space-y-1">
            <label className="text-2xs text-[#4E5A46]/60 uppercase font-semibold">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Eleanor Vance"
                className="w-full bg-[#E8C5C0]/20 border border-[#4E5A46]/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53]"
              />
              <User className="w-4 h-4 text-[#4E5A46]/50 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

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
                placeholder="Must be 6+ chars"
                className="w-full bg-[#E8C5C0]/20 border border-[#4E5A46]/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53]"
              />
              <Lock className="w-4 h-4 text-[#4E5A46]/50 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Confirm Password input */}
          <div className="space-y-1">
            <label className="text-2xs text-[#4E5A46]/60 uppercase font-semibold">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
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
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 text-xs text-[#4E5A46]/75">
          <span>Already registered? </span>
          <Link
            to={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="text-[#C26D53] font-semibold hover:underline"
          >
            Log In here
          </Link>
        </div>

      </motion.div>
    </div>
  );
};

export default Register;
