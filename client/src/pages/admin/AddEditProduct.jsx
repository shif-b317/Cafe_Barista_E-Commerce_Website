import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { ArrowLeft, Save, Loader2, Image, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const AddEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const isEditMode = !!id;

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('4.5');
  const [category, setCategory] = useState('Cakes');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  const [loadingProduct, setLoadingProduct] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Cakes',
    'Pastries',
    'Cupcakes',
    'Donuts',
    'Cookies',
    'Sandwiches',
    'Fries',
    'Pasta',
    'Pizza',
    'Burgers',
    'Noodles',
    'Quick Bites',
    'Coffee',
    'Tea',
    'Cold Beverages',
    'Desserts'
  ];

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  // Load product if editing
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (isEditMode && user && isAdmin) {
        try {
          const res = await api.get(`/products/${id}`);
          const p = res.data.data;
          setName(p.name);
          setPrice(p.price);
          setRating(p.rating);
          setCategory(p.category);
          setDescription(p.description);
          setImage(p.image);
          setIsFeatured(p.isFeatured);
          setIsTrending(p.isTrending);
          setIsBestSeller(p.isBestSeller);
        } catch (err) {
          console.error('Error loading product details for editing:', err);
          setError('Failed to load item recipe.');
        } finally {
          setLoadingProduct(false);
        }
      }
    };
    fetchProductDetails();
  }, [id, isEditMode, user, isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !category || !description || !image) {
      setError('Please fill in all required recipe fields.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      name,
      price: parseFloat(price),
      rating: parseFloat(rating) || 4.5,
      category,
      description,
      image,
      isFeatured,
      isTrending,
      isBestSeller
    };

    try {
      if (isEditMode) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save product recipe details.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loadingProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-8 h-8 text-[#C26D53] animate-spin" />
        <span className="text-sm text-[#4E5A46]/60">
          {isEditMode ? 'Loading product recipe...' : 'Setting up recipe form...'}
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Title Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/products" className="text-[#4E5A46] hover:text-[#C26D53]">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <span className="text-xs font-bold tracking-widest text-[#C26D53] uppercase">Administrative Area</span>
          <h1 className="font-serif text-3xl font-semibold text-[#4E5A46] mt-1">
            {isEditMode ? 'Modify Product Recipe' : 'Add New Cafe Delicacy'}
          </h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 sm:p-8 shadow-soft grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Name */}
        <div className="md:col-span-2 space-y-1">
          <label className="text-2xs text-[#4E5A46]/60 uppercase font-semibold">Treat / Coffee Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Lavender Infused Scone"
            className="w-full bg-[#E8C5C0]/20 border border-[#4E5A46]/10 rounded-xl py-2.5 px-4 text-sm text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53]"
          />
        </div>

        {/* Price */}
        <div className="space-y-1">
          <label className="text-2xs text-[#4E5A46]/60 uppercase font-semibold">Unit Price (₹) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[#E8C5C0]/20 border border-[#4E5A46]/10 rounded-xl py-2.5 px-4 text-sm text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53]"
          />
        </div>

        {/* Rating */}
        <div className="space-y-1">
          <label className="text-2xs text-[#4E5A46]/60 uppercase font-semibold">Initial Rating (1-5)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="4.5"
            className="w-full bg-[#E8C5C0]/20 border border-[#4E5A46]/10 rounded-xl py-2.5 px-4 text-sm text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53]"
          />
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label className="text-2xs text-[#4E5A46]/60 uppercase font-semibold">Menu Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#E8C5C0]/20 border border-[#4E5A46]/10 rounded-xl py-2.5 px-4 text-sm text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Image URL */}
        <div className="space-y-1">
          <label className="text-2xs text-[#4E5A46]/60 uppercase font-semibold">Image URL Link *</label>
          <div className="relative">
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-[#E8C5C0]/20 border border-[#4E5A46]/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53]"
            />
            <Image className="w-4 h-4 text-[#4E5A46]/50 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2 space-y-1">
          <label className="text-2xs text-[#4E5A46]/60 uppercase font-semibold">Recipe & Serving Description *</label>
          <textarea
            required
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed descriptions about ingredients, textures, size, etc."
            className="w-full bg-[#E8C5C0]/20 border border-[#4E5A46]/10 rounded-xl py-2.5 px-4 text-sm text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53] resize-none"
          />
        </div>

        {/* Promotional Checkboxes */}
        <div className="md:col-span-2 bg-[#A3AE9A]/15 border border-[#A3AE9A]/20 p-5 rounded-2xl space-y-3">
          <h4 className="font-serif text-xs font-semibold text-[#4E5A46] uppercase flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4 text-[#C26D53]" />
            Promotional Badging
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Featured */}
            <label className="flex items-center gap-2.5 text-xs text-[#4E5A46] cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#C26D53] border-[#4E5A46]/30 focus:ring-[#C26D53] bg-[#F7F1E6]"
              />
              <span>Show in Featured Section</span>
            </label>

            {/* Trending */}
            <label className="flex items-center gap-2.5 text-xs text-[#4E5A46] cursor-pointer">
              <input
                type="checkbox"
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
                className="w-4 h-4 rounded text-[#C26D53] border-[#4E5A46]/30 focus:ring-[#C26D53] bg-[#F7F1E6]"
              />
              <span>Show as Trending</span>
            </label>

            {/* Bestseller */}
            <label className="flex items-center gap-2.5 text-xs text-[#4E5A46] cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="w-4 h-4 rounded text-[#C26D53] border-[#4E5A46]/30 focus:ring-[#C26D53] bg-[#F7F1E6]"
              />
              <span>Tag as Bestseller</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="md:col-span-2 border-t border-[#4E5A46]/10 pt-4 flex justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-6 py-3 border border-[#4E5A46]/20 hover:bg-[#4E5A46]/5 text-[#4E5A46] rounded-full text-xs font-semibold transition-all duration-200"
          >
            Cancel
          </Link>
          
          <button
            type="submit"
            disabled={saving}
            className="bg-[#C26D53] hover:bg-[#C26D53]/90 text-[#F7F1E6] font-semibold px-8 py-3 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all duration-200"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Recipe
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddEditProduct;
