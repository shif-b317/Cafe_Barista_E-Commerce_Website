import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Trash2, Loader2, Star, Eye, EyeOff, CheckCircle, AlertTriangle, ShieldCheck, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [ratingFilter, setRatingFilter] = useState('All');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data.data);
    } catch (err) {
      console.error('Failed to load reviews list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    setActionLoading(true);
    const newStatus = currentStatus === 'Approved' ? 'Hidden' : 'Approved';
    try {
      const res = await api.put(`/reviews/${id}/status`, { status: newStatus });
      if (res.data.success) {
        setReviews(reviews.map(r => (r._id === id ? { ...r, status: newStatus } : r)));
      }
    } catch (err) {
      console.error('Failed to toggle review status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteModal({ show: true, id });
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/reviews/${deleteModal.id}`);
      setReviews(reviews.filter(r => r._id !== deleteModal.id));
      setDeleteModal({ show: false, id: null });
    } catch (err) {
      console.error(err);
      alert('Failed to delete review.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered reviews
  const filteredReviews = reviews.filter(r => {
    return ratingFilter === 'All' || r.rating.toString() === ratingFilter;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-8 h-8 text-[#C26D53] animate-spin" />
        <span className="text-sm text-[#4E5A46]/60 font-serif italic">Loading customer reviews...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 min-h-screen relative">
      
      {/* Header Panel */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-2xs font-extrabold tracking-widest text-[#C26D53] uppercase font-sans">Patron Feedback</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4E5A46] mt-0.5">Reviews Management</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-5 flex justify-between items-center shadow-soft">
        <div className="flex items-center gap-2.5">
          <Filter className="w-4.5 h-4.5 text-[#4E5A46]/60" />
          <span className="text-2xs uppercase tracking-wider font-extrabold text-[#4E5A46]/60">Filter by Rating:</span>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-4 py-2.5 bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl text-xs outline-none text-[#4E5A46] font-semibold focus:border-[#C26D53]"
          >
            <option value="All">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Main Board */}
      <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 sm:p-8 shadow-soft">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 text-[#4E5A46]/60 italic font-light text-xs">
            No customer reviews match the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#4E5A46]/10 text-[#4E5A46]/60 font-extrabold uppercase tracking-wider">
                  <th className="pb-3.5 pl-2">Product</th>
                  <th className="pb-3.5">User</th>
                  <th className="pb-3.5">Rating</th>
                  <th className="pb-3.5">Comment</th>
                  <th className="pb-3.5">Status</th>
                  <th className="pb-3.5 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4E5A46]/5">
                {filteredReviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-[#E8C5C0]/10 transition-colors">
                    
                    {/* Product */}
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#4E5A46]/10 bg-[#E8C5C0]/10 shrink-0">
                          <img src={rev.product?.image} alt={rev.product?.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-serif font-bold text-xs text-[#4E5A46]">{rev.product?.name}</p>
                          <span className="text-[10px] text-[#4E5A46]/60 font-semibold">{rev.product?.category}</span>
                        </div>
                      </div>
                    </td>

                    {/* User */}
                    <td className="py-4 text-[#4E5A46]/90">
                      <div>
                        <p className="font-bold">{rev.user?.name || 'Guest User'}</p>
                        <p className="text-[10px] text-[#4E5A46]/50 mt-0.5">{rev.user?.email || 'N/A'}</p>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="py-4">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-[#C26D53] text-[#C26D53]' : 'text-[#4E5A46]/20'
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Comment */}
                    <td className="py-4 max-w-xs">
                      <p className="text-[#4E5A46]/90 font-medium leading-relaxed line-clamp-2">
                        "{rev.comment}"
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold ${
                        rev.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {rev.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 text-right pr-2 space-x-2">
                      <button
                        onClick={() => handleToggleStatus(rev._id, rev.status)}
                        disabled={actionLoading}
                        className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full font-bold transition-all ${
                          rev.status === 'Approved'
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {rev.status === 'Approved' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {rev.status === 'Approved' ? 'Hide' : 'Approve'}
                      </button>

                      <button
                        onClick={() => confirmDelete(rev._id)}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-3.5 py-1.5 rounded-full font-bold transition-all disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModal({ show: false, id: null })}
              className="fixed inset-0 bg-black/45"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#F7F1E6] border border-[#4E5A46]/15 rounded-3xl p-8 max-w-sm w-full relative z-10 space-y-6 shadow-2xl text-center"
            >
              <div className="w-12 h-12 bg-red-50 border border-red-200 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#4E5A46]">Delete Review</h3>
                <p className="text-xs text-[#4E5A46]/70 leading-relaxed">
                  Are you sure you want to permanently delete this customer review? This cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteModal({ show: false, id: null })}
                  className="px-5 py-2.5 bg-[#E8C5C0]/30 hover:bg-[#E8C5C0]/50 rounded-full font-bold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-[#F7F1E6] rounded-full font-bold text-xs transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ReviewsManagement;
