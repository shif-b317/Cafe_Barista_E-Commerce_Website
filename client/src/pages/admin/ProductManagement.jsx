import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Plus, Edit2, Trash2, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductManagement = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchProductsList = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.data);
    } catch (error) {
      console.error('Error loading products list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchProductsList();
    }
  }, [user, isAdmin]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the recipe for "${name}"? This action cannot be undone.`)) {
      setActionLoading(true);
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete product.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-8 h-8 text-[#C26D53] animate-spin" />
        <span className="text-sm text-[#4E5A46]/60">Stocking the pastry counter catalog...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 min-h-screen">
      
      {/* Header Panel */}
      <div className="border-b border-[#4E5A46]/10 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#C26D53] uppercase">Administrative Area</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#4E5A46] mt-1">Product Catalog List</h1>
        </div>

        {/* Navigation / Add Button */}
        <div className="flex flex-wrap gap-2.5 items-center">
          <Link
            to="/admin/dashboard"
            className="px-4 py-2 bg-[#E8C5C0]/40 text-[#4E5A46] hover:bg-[#E8C5C0]/65 rounded-full text-xs font-semibold transition-all duration-200"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-[#C26D53] text-[#F7F1E6] rounded-full text-xs font-semibold shadow-sm"
          >
            Products Catalog
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2 bg-[#E8C5C0]/40 text-[#4E5A46] hover:bg-[#E8C5C0]/65 rounded-full text-xs font-semibold transition-all duration-200"
          >
            Orders Feed
          </Link>
          
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-1.5 bg-[#4E5A46] hover:bg-[#4E5A46]/90 text-[#F7F1E6] px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm hover:shadow transition-all duration-200 ml-2"
          >
            <Plus className="w-4 h-4" />
            Add New Treat
          </Link>
        </div>
      </div>

      {/* Main product list table */}
      <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 sm:p-8 shadow-soft">
        {products.length === 0 ? (
          <div className="text-center py-12 text-[#4E5A46]/60 italic font-light text-xs">
            No recipes in stock yet. Click "Add New Treat" to seed your first delicacy.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#4E5A46]/10 text-[#4E5A46]/60 font-semibold uppercase tracking-wider">
                  <th className="pb-3.5 pl-2">Display</th>
                  <th className="pb-3.5">Name</th>
                  <th className="pb-3.5">Category</th>
                  <th className="pb-3.5">Unit Price</th>
                  <th className="pb-3.5">Rating</th>
                  <th className="pb-3.5 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-[#4E5A46]/5 hover:bg-[#E8C5C0]/10 transition-colors duration-150">
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
                    <td className="py-3 text-[#C26D53] font-bold">₹{p.price.toFixed(2)}</td>
                    <td className="py-3 text-[#4E5A46]/80">{p.rating.toFixed(1)} / 5.0</td>
                    <td className="py-3 text-right pr-2 space-x-2">
                      <Link
                        to={`/admin/products/edit/${p._id}`}
                        className="inline-flex items-center gap-1 bg-[#8FA1B2]/20 hover:bg-[#8FA1B2]/40 text-[#4E5A46] px-3.5 py-2 rounded-full font-semibold transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-3.5 py-2 rounded-full font-semibold transition-all disabled:opacity-50"
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

    </div>
  );
};

export default ProductManagement;
