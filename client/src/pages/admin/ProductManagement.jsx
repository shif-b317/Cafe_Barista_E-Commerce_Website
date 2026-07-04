import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Eye,
  EyeOff,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [categories, setCategories] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  // Delete Confirmation Modal state
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });

  const fetchProductsList = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.data);

      // Extract unique categories dynamically
      const uniqueCats = ['All', ...new Set(res.data.data.map(p => p.category))];
      setCategories(uniqueCats);
    } catch (error) {
      console.error('Error loading products list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  const handleToggleAvailability = async (id, currentVal) => {
    setActionLoading(true);
    try {
      const res = await api.put(`/products/${id}`, { isAvailable: !currentVal });
      if (res.data.success) {
        setProducts(products.map(p => (p._id === id ? { ...p, isAvailable: !currentVal } : p)));
      }
    } catch (error) {
      console.error('Failed to toggle availability:', error);
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
      await api.delete(`/products/${deleteModal.id}`);
      setProducts(products.filter(p => p._id !== deleteModal.id));
      setDeleteModal({ show: false, id: null, name: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete product.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-8 h-8 text-[#C26D53] animate-spin" />
        <span className="text-sm text-[#4E5A46]/60 font-serif italic">Loading pastries catalog...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 min-h-screen relative">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <span className="text-2xs font-extrabold tracking-widest text-[#C26D53] uppercase font-sans">Inventory</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4E5A46] mt-0.5">Product Management</h1>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-1.5 bg-[#4E5A46] hover:bg-[#4E5A46]/95 text-[#F7F1E6] px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-5 flex flex-col md:flex-row gap-4 justify-between items-center shadow-soft">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-[#E8C5C0]/15 focus:bg-[#E8C5C0]/25 border border-[#4E5A46]/10 focus:border-[#C26D53] rounded-2xl text-xs outline-none placeholder-[#4E5A46]/40 transition-all"
          />
          <Search className="w-4.5 h-4.5 text-[#4E5A46]/45 absolute left-3.5 top-3" />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Filter className="w-4 h-4 text-[#4E5A46]/60 hidden sm:block" />
          <span className="text-2xs uppercase tracking-wider font-bold text-[#4E5A46]/60 hidden sm:block">Category:</span>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
            className="w-full md:w-48 px-4 py-2.5 bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl text-xs outline-none text-[#4E5A46] font-semibold transition-all focus:border-[#C26D53]"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 sm:p-8 shadow-soft">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-14 text-[#4E5A46]/60 italic font-light text-xs">
            No recipes matched your search criteria.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#4E5A46]/10 text-[#4E5A46]/60 font-extrabold uppercase tracking-wider">
                    <th className="pb-3.5 pl-2">Photo</th>
                    <th className="pb-3.5">Name</th>
                    <th className="pb-3.5">Category</th>
                    <th className="pb-3.5">Price</th>
                    <th className="pb-3.5">Discount</th>
                    <th className="pb-3.5">Stock</th>
                    <th className="pb-3.5">Available</th>
                    <th className="pb-3.5 pr-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4E5A46]/5">
                  {currentProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-[#E8C5C0]/10 transition-colors">
                      <td className="py-3 pl-2">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#4E5A46]/10 bg-[#E8C5C0]/10 shadow-sm flex-shrink-0">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-3">
                        <div>
                          <p className="font-serif text-sm font-semibold text-[#4E5A46]">{p.name}</p>
                          <div className="flex gap-1.5 mt-0.5">
                            {p.isFeatured && <span className="bg-[#A3AE9A]/20 text-[#4E5A46] px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">Featured</span>}
                            {p.isBestSeller && <span className="bg-[#C26D53]/15 text-[#C26D53] px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">Bestseller</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-[#4E5A46]/85 font-medium">{p.category}</td>
                      <td className="py-3 font-bold text-[#4E5A46]">₹{p.price.toFixed(2)}</td>
                      <td className="py-3 text-[#C26D53] font-bold">{p.discount > 0 ? `${p.discount}% Off` : '—'}</td>
                      <td className="py-3 font-semibold">
                        <span className={`px-2 py-0.5 rounded-full ${p.stock < 10 ? 'bg-red-50 text-red-700' : 'text-[#4E5A46]'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleToggleAvailability(p._id, p.isAvailable)}
                          disabled={actionLoading}
                          className={`p-2 rounded-full transition-colors ${
                            p.isAvailable ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {p.isAvailable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="py-3 text-right pr-2 space-x-2">
                        <Link
                          to={`/admin/products/edit/${p._id}`}
                          className="inline-flex items-center gap-1 bg-[#8FA1B2]/20 hover:bg-[#8FA1B2]/40 text-[#4E5A46] px-3.5 py-1.5 rounded-full font-bold transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </Link>
                        
                        <button
                          onClick={() => confirmDelete(p._id, p.name)}
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2.5 pt-4 border-t border-[#4E5A46]/10">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3.5 py-2 bg-[#E8C5C0]/30 hover:bg-[#E8C5C0]/50 disabled:opacity-40 rounded-xl font-bold transition-all"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`w-9 h-9 rounded-xl font-bold transition-all ${
                      currentPage === i + 1 ? 'bg-[#C26D53] text-[#F7F1E6]' : 'bg-[#E8C5C0]/30 hover:bg-[#E8C5C0]/50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-2 bg-[#E8C5C0]/30 hover:bg-[#E8C5C0]/50 disabled:opacity-40 rounded-xl font-bold transition-all"
                >
                  Next
                </button>
              </div>
            )}
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
                <h3 className="font-serif text-lg font-bold text-[#4E5A46]">Confirm Recipe Deletion</h3>
                <p className="text-xs text-[#4E5A46]/70 leading-relaxed">
                  Are you sure you want to permanently delete **"{deleteModal.name}"**? This recipe will be gone forever.
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

export default ProductManagement;
