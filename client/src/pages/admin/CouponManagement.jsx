import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Plus, Edit2, Trash2, Loader2, Save, XCircle, AlertTriangle, Calendar, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  // Coupon form modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [couponId, setCouponId] = useState('');
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [minOrder, setMinOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, code: '' });

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      setCoupons(res.data.data);
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setCouponId('');
    setCode('');
    setDiscount('');
    setExpiryDate('');
    setMinOrder('0');
    setIsActive(true);
    setError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (cpn) => {
    setIsEditMode(true);
    setCouponId(cpn._id);
    setCode(cpn.code);
    setDiscount(cpn.discount.toString());
    
    // Format date to YYYY-MM-DD for date input
    const dateObj = new Date(cpn.expiryDate);
    const dateStr = dateObj.toISOString().split('T')[0];
    
    setExpiryDate(dateStr);
    setMinOrder(cpn.minOrder.toString());
    setIsActive(cpn.isActive);
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || !discount || !expiryDate) {
      setError('Please fill in all required fields.');
      return;
    }

    setActionLoading(true);
    setError('');

    const payload = {
      code: code.toUpperCase(),
      discount: parseFloat(discount),
      expiryDate,
      minOrder: parseFloat(minOrder) || 0,
      isActive
    };

    try {
      if (isEditMode) {
        const res = await api.put(`/coupons/${couponId}`, payload);
        if (res.data.success) {
          setCoupons(coupons.map(c => (c._id === couponId ? res.data.data : c)));
        }
      } else {
        const res = await api.post('/coupons', payload);
        if (res.data.success) {
          setCoupons([res.data.data, ...coupons]);
        }
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save coupon.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (cpn) => {
    setActionLoading(true);
    try {
      const res = await api.put(`/coupons/${cpn._id}`, { isActive: !cpn.isActive });
      if (res.data.success) {
        setCoupons(coupons.map(c => (c._id === cpn._id ? { ...c, isActive: !cpn.isActive } : c)));
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = (id, code) => {
    setDeleteModal({ show: true, id, code });
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/coupons/${deleteModal.id}`);
      setCoupons(coupons.filter(c => c._id !== deleteModal.id));
      setDeleteModal({ show: false, id: null, code: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete coupon.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-8 h-8 text-[#C26D53] animate-spin" />
        <span className="text-sm text-[#4E5A46]/60 font-serif italic">Loading coupons...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 min-h-screen relative">
      
      {/* Header Panel */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-2xs font-extrabold tracking-widest text-[#C26D53] uppercase font-sans">Promotions</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4E5A46] mt-0.5">Coupon Management</h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-1.5 bg-[#4E5A46] hover:bg-[#4E5A46]/95 text-[#F7F1E6] px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add Coupon
        </button>
      </div>

      {/* Main Board */}
      <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 sm:p-8 shadow-soft">
        {coupons.length === 0 ? (
          <div className="text-center py-12 text-[#4E5A46]/60 italic font-light text-xs">
            No active discount coupons found in the registry.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#4E5A46]/10 text-[#4E5A46]/60 font-extrabold uppercase tracking-wider">
                  <th className="pb-3.5 pl-2">Coupon Code</th>
                  <th className="pb-3.5">Discount Value</th>
                  <th className="pb-3.5">Min Order Require</th>
                  <th className="pb-3.5">Expiry Date</th>
                  <th className="pb-3.5">State Status</th>
                  <th className="pb-3.5 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4E5A46]/5">
                {coupons.map((cpn) => {
                  const isExpired = new Date(cpn.expiryDate) < new Date();
                  return (
                    <tr key={cpn._id} className="hover:bg-[#E8C5C0]/10 transition-colors">
                      
                      {/* Code */}
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-[#C26D53]" />
                          <span className="font-mono font-bold text-sm tracking-wider text-[#4E5A46] uppercase bg-[#E8C5C0]/35 px-2.5 py-1 rounded-xl">
                            {cpn.code}
                          </span>
                        </div>
                      </td>

                      {/* Discount */}
                      <td className="py-4 font-bold text-sm text-[#C26D53]">
                        {cpn.discount}% Off
                      </td>

                      {/* Min Order */}
                      <td className="py-4 font-semibold text-[#4E5A46]/85">
                        ₹{cpn.minOrder}
                      </td>

                      {/* Expiry */}
                      <td className="py-4 font-medium">
                        <div className="flex items-center gap-1.5 text-[#4E5A46]/80">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className={isExpired ? 'text-red-600 line-through font-bold' : ''}>
                            {new Date(cpn.expiryDate).toLocaleDateString()}
                          </span>
                          {isExpired && <span className="text-[8px] bg-red-100 text-red-700 px-1 py-0.5 rounded uppercase font-bold">Expired</span>}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4">
                        <button
                          onClick={() => handleToggleStatus(cpn)}
                          disabled={actionLoading}
                          className={`px-3 py-1 rounded-full border text-[10px] font-extrabold transition-all ${
                            cpn.isActive && !isExpired
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                          }`}
                        >
                          {cpn.isActive && !isExpired ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 text-right pr-2 space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(cpn)}
                          className="inline-flex items-center gap-1 bg-[#8FA1B2]/20 hover:bg-[#8FA1B2]/40 text-[#4E5A46] px-3.5 py-1.5 rounded-full font-bold transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(cpn._id, cpn.code)}
                          className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-3.5 py-1.5 rounded-full font-bold transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/45"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#F7F1E6] border border-[#4E5A46]/15 rounded-3xl p-6 sm:p-8 max-w-md w-full relative z-10 space-y-6 shadow-2xl"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-[#4E5A46]/10 pb-4">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#4E5A46]">
                    {isEditMode ? 'Edit Coupon' : 'Create Coupon'}
                  </h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-[#E8C5C0]/40 text-[#4E5A46] hover:bg-[#E8C5C0]/65 p-2 rounded-full transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-[10px] font-bold">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider pl-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. COZYCOFFEE20"
                    className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 px-4 text-xs text-[#4E5A46] focus:outline-none focus:border-[#C26D53] tracking-wide uppercase font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider pl-1">Discount Percentage (%) *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="20"
                    className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 px-4 text-xs text-[#4E5A46] focus:outline-none focus:border-[#C26D53] font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider pl-1">Minimum Order Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    placeholder="0"
                    className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 px-4 text-xs text-[#4E5A46] focus:outline-none focus:border-[#C26D53] font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider pl-1">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 px-4 text-xs text-[#4E5A46] focus:outline-none focus:border-[#C26D53] font-semibold"
                  />
                </div>

                {/* Status Toggle */}
                <div className="flex justify-between items-center py-2 border-t border-b border-[#4E5A46]/10">
                  <span className="text-2xs font-extrabold text-[#4E5A46]/70 uppercase tracking-wider pl-1">Active Status</span>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`px-4 py-2 rounded-2xl text-[10px] font-bold border transition-colors ${
                      isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 bg-[#E8C5C0]/30 hover:bg-[#E8C5C0]/50 rounded-full font-bold text-xs transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-[#C26D53] hover:bg-[#C26D53]/95 text-[#F7F1E6] font-semibold px-6 py-2.5 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Coupon
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModal({ show: false, id: null, code: '' })}
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
                <h3 className="font-serif text-lg font-bold text-[#4E5A46]">Delete Coupon Code</h3>
                <p className="text-xs text-[#4E5A46]/70 leading-relaxed">
                  Are you sure you want to permanently delete **"{deleteModal.code}"**? This promo code will be revoked.
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteModal({ show: false, id: null, code: '' })}
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

export default CouponManagement;
