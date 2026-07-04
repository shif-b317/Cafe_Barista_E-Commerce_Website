import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Plus, Edit2, Trash2, Loader2, Save, XCircle, AlertTriangle, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setCategoryId('');
    setName('');
    setImage('');
    setDescription('');
    setIsActive(true);
    setError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setIsEditMode(true);
    setCategoryId(cat._id);
    setName(cat.name);
    setImage(cat.image);
    setDescription(cat.description || '');
    setIsActive(cat.isActive);
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !image) {
      setError('Please fill in all required fields.');
      return;
    }

    setActionLoading(true);
    setError('');

    const payload = { name, image, description, isActive };

    try {
      if (isEditMode) {
        const res = await api.put(`/categories/${categoryId}`, payload);
        if (res.data.success) {
          setCategories(categories.map(c => (c._id === categoryId ? res.data.data : c)));
        }
      } else {
        const res = await api.post('/categories', payload);
        if (res.data.success) {
          setCategories([...categories, res.data.data]);
        }
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save category.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (cat) => {
    setActionLoading(true);
    try {
      const res = await api.put(`/categories/${cat._id}`, { isActive: !cat.isActive });
      if (res.data.success) {
        setCategories(categories.map(c => (c._id === cat._id ? { ...c, isActive: !cat.isActive } : c)));
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = (id, name) => {
    setDeleteModal({ show: true, id, name });
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/categories/${deleteModal.id}`);
      setCategories(categories.filter(c => c._id !== deleteModal.id));
      setDeleteModal({ show: false, id: null, name: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete category.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-8 h-8 text-[#C26D53] animate-spin" />
        <span className="text-sm text-[#4E5A46]/60 font-serif italic">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 min-h-screen relative">
      
      {/* Header Panel */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-2xs font-extrabold tracking-widest text-[#C26D53] uppercase font-sans">Sections</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4E5A46] mt-0.5">Category Management</h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-1.5 bg-[#4E5A46] hover:bg-[#4E5A46]/95 text-[#F7F1E6] px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Main Board */}
      <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 sm:p-8 shadow-soft">
        {categories.length === 0 ? (
          <div className="text-center py-12 text-[#4E5A46]/60 italic font-light text-xs">
            No categories defined yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <motion.div
                key={cat._id}
                whileHover={{ y: -3 }}
                className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl overflow-hidden shadow-soft flex flex-col justify-between"
              >
                {/* Category Cover */}
                <div className="h-40 w-full relative">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <h3 className="font-serif text-lg font-bold text-white leading-tight">{cat.name}</h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                  <p className="text-xs text-[#4E5A46]/85 font-medium leading-relaxed flex-grow">
                    {cat.description || 'No description provided.'}
                  </p>

                  <div className="flex justify-between items-center pt-2">
                    {/* Active Status */}
                    <button
                      onClick={() => handleToggleStatus(cat)}
                      disabled={actionLoading}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-extrabold transition-all ${
                        cat.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                      }`}
                    >
                      {cat.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </button>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEditModal(cat)}
                        className="p-2 bg-[#8FA1B2]/20 hover:bg-[#8FA1B2]/40 text-[#4E5A46] rounded-full transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(cat._id, cat.name)}
                        className="p-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
                    {isEditMode ? 'Edit Category' : 'Create Category'}
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
                  <label className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider pl-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Pastries"
                    className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 px-4 text-xs text-[#4E5A46] focus:outline-none focus:border-[#C26D53]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider pl-1">Image URL *</label>
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 px-4 text-xs text-[#4E5A46] focus:outline-none focus:border-[#C26D53]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider pl-1">Description</label>
                  <textarea
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explain category specialties..."
                    className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 px-4 text-xs text-[#4E5A46] focus:outline-none focus:border-[#C26D53] resize-none"
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
                    Save Category
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
              onClick={() => setDeleteModal({ show: false, id: null, name: '' })}
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
                <h3 className="font-serif text-lg font-bold text-[#4E5A46]">Delete Category</h3>
                <p className="text-xs text-[#4E5A46]/70 leading-relaxed">
                  Are you sure you want to permanently delete **"{deleteModal.name}"** category? This cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteModal({ show: false, id: null, name: '' })}
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

export default CategoryManagement;
