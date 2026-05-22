import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, User, LogOut, Menu, X, Coffee, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#F7F1E6]/95 backdrop-blur-md border-b border-[#4E5A46]/10 text-[#4E5A46] shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <Coffee className="w-6 h-6 text-[#C26D53] group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-serif text-2xl font-semibold tracking-wide text-[#4E5A46]">
                Café Barista
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="font-medium text-[#4E5A46] hover:text-[#C26D53] transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Admin Badge/Link */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1 bg-[#A3AE9A]/20 text-[#4E5A46] px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-[#A3AE9A]/40 transition-colors duration-200"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-[#4E5A46] hover:text-[#C26D53] transition-colors duration-200"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-[#F7F1E6] transform translate-x-1/2 -translate-y-1/2 bg-[#C26D53] rounded-full"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* User Dropdown / Auth Link */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 font-medium hover:text-[#C26D53] focus:outline-none transition-colors duration-200"
                >
                  <User className="w-5 h-5 text-[#C26D53]" />
                  <span>{user.name.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#F7F1E6] border border-[#4E5A46]/10 shadow-premium py-1 ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2.5 text-sm text-[#4E5A46] hover:bg-[#E8C5C0]/40 transition-colors duration-200"
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-[#C26D53] hover:bg-[#C26D53]/90 text-[#F7F1E6] px-5 py-2.5 rounded-full font-medium shadow-sm transition-all duration-200 text-sm"
              >
                Log In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-[#4E5A46]">
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-2xs font-bold leading-none text-[#F7F1E6] transform translate-x-1/2 -translate-y-1/2 bg-[#C26D53] rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#4E5A46] hover:text-[#C26D53] focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#F7F1E6] border-t border-[#4E5A46]/10 px-4 pt-2 pb-6 space-y-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-medium text-[#4E5A46] hover:bg-[#E8C5C0]/40 transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-[#4E5A46] bg-[#A3AE9A]/20 hover:bg-[#A3AE9A]/40 transition-colors duration-200"
              >
                Admin Panel
              </Link>
            )}

            {user ? (
              <div className="pt-4 border-t border-[#4E5A46]/10 space-y-2">
                <div className="px-3 py-1 text-xs text-[#4E5A46]/60">Logged in as {user.name}</div>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-xl text-base font-medium text-[#4E5A46] hover:bg-[#E8C5C0]/40 transition-colors duration-200"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-base font-medium text-red-700 hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center bg-[#C26D53] hover:bg-[#C26D53]/90 text-[#F7F1E6] px-4 py-3 rounded-full font-medium transition-all duration-200 text-sm"
              >
                Log In
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
