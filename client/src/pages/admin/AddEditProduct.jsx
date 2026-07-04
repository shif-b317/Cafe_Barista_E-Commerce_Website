import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Sparkles, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const AddEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('4.5');
  const [category, setCategory] = useState('Cakes');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [discount, setDiscount] = useState('0');
  const [stock, setStock] = useState('99');
  const [isAvailable, setIsAvailable] = useState(true);
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

  // Load product if editing
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (isEditMode) {
        try {
          const res = await api.get(`/products/${id}`);
          const p = res.data.data;
          setName(p.name);
          setPrice(p.price);
          setRating(p.rating);
          setCategory(p.category);
          setDescription(p.description);
          setImage(p.image);
          setDiscount(p.discount || '0');
          setStock(p.stock !== undefined ? p.stock : '99');
          setIsAvailable(p.isAvailable !== undefined ? p.isAvailable : true);
          setIsFeatured(p.isFeatured || false);
          setIsTrending(p.isTrending || false);
          setIsBestSeller(p.isBestSeller || false);
        } catch (err) {
          console.error('Error loading product details:', err);
          setError('Failed to load product details.');
        } finally {
          setLoadingProduct(false);
        }
      }
    };
    fetchProductDetails();
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !category || !description || !image) {
      setError('Please fill in all required fields.');
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
      discount: parseInt(discount) || 0,
      stock: parseInt(stock) || 0,
      isAvailable,
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
      setError(err.response?.data?.message || 'Failed to save product details.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-8 h-8 text-[#C26D53] animate-spin" />
        <span className="text-sm text-[#4E5A46]/60 font-serif italic">
          {isEditMode ? 'Loading product recipe...' : 'Setting up recipe form...'}
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      {/* Title Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/products" className="text-[#4E5A46] hover:text-[#C26D53]">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <span className="text-2xs font-extrabold tracking-widest text-[#C26D53] uppercase font-sans">Administrative Area</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4E5A46] mt-0.5">
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
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-2xs text-[#4E5A46]/60 uppercase font-extrabold tracking-wider pl-1">Product Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Belgian Chocolate Truffle Cake"
            className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 px-4 text-sm text-[#4E5A46] focus:outline-none focus:border-[#C26D53] transition-colors"
          />
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <label className="text-2xs text-[#4E5A46]/60 uppercase font-extrabold tracking-wider pl-1">Unit Price (₹) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 px-4 text-sm text-[#4E5A46] focus:outline-none focus:border-[#C26D53] transition-colors"
          />
        </div>

        {/* Discount */}
        <div className="space-y-1.5">
          <label className="text-2xs text-[#4E5A46]/60 uppercase font-extrabold tracking-wider pl-1">Discount (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="0"
            className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 px-4 text-sm text-[#4E5A46] focus:outline-none focus:border-[#C26D53] transition-colors"
          />
        </div>

        {/* Rating */}
        <div className="space-y-1.5">
          <label className="text-2xs text-[#4E5A46]/60 uppercase font-extrabold tracking-wider pl-1">Initial Rating (1-5)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="4.5"
            className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 px-4 text-sm text-[#4E5A46] focus:outline-none focus:border-[#C26D53] transition-colors"
          />
        </div>

        {/* Stock */}
        <div className="space-y-1.5">
          <label className="text-2xs text-[#4E5A46]/60 uppercase font-extrabold tracking-wider pl-1">Quantity in Stock *</label>
          <input
            type="number"
            min="0"
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="99"
            className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 px-4 text-sm text-[#4E5A46] focus:outline-none focus:border-[#C26D53] transition-colors"
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-2xs text-[#4E5A46]/60 uppercase font-extrabold tracking-wider pl-1">Menu Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 px-4 text-sm text-[#4E5A46] focus:outline-none focus:border-[#C26D53] transition-colors"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Availability Toggle */}
        <div className="space-y-1.5 flex flex-col justify-end pb-3 pl-1">
          <span className="text-2xs text-[#4E5A46]/60 uppercase font-extrabold tracking-wider">Availability Status</span>
          <button
            type="button"
            onClick={() => setIsAvailable(!isAvailable)}
            className={`w-full max-w-[200px] mt-2 py-2 px-4 border rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              isAvailable
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
            }`}
          >
            {isAvailable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {isAvailable ? 'Available to Order' : 'Out of Stock / Hide'}
          </button>
        </div>

        {/* Image URL */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-2xs text-[#4E5A46]/60 uppercase font-extrabold tracking-wider pl-1">Image URL Link *</label>
          <div className="relative">
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-[#4E5A46] focus:outline-none focus:border-[#C26D53] transition-colors"
            />
            <ImageIcon className="w-4.5 h-4.5 text-[#4E5A46]/50 absolute left-3.5 top-3.5" />
          </div>
        </div>

        {/* Image Preview Block */}
        {image && (
          <div className="md:col-span-2 space-y-2">
            <span className="text-2xs text-[#4E5A46]/60 uppercase font-extrabold tracking-wider pl-1">Image Preview</span>
            <div className="w-full max-w-sm h-48 border border-[#4E5A46]/10 bg-[#E8C5C0]/5 rounded-3xl overflow-hidden shadow-sm">
              <img
                src={image}
                alt="Product Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600';
                }}
              />
            </div>
          </div>
        )}

        {/* Description */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-2xs text-[#4E5A46]/60 uppercase font-extrabold tracking-wider pl-1">Product Description *</label>
          <textarea
            required
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Introduce details about ingredients, flavors, textures..."
            className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 px-4 text-sm text-[#4E5A46] focus:outline-none focus:border-[#C26D53] transition-colors resize-none"
          />
        </div>

        {/* Promotional Checkboxes */}
        <div className="md:col-span-2 bg-[#A3AE9A]/15 border border-[#A3AE9A]/20 p-5 rounded-3xl space-y-3">
          <h4 className="font-serif text-xs font-bold text-[#4E5A46] uppercase flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4.5 h-4.5 text-[#C26D53]" />
            Promotional Tags
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Featured */}
            <label className="flex items-center gap-2.5 text-xs text-[#4E5A46] cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4.5 h-4.5 rounded text-[#C26D53] border-[#4E5A46]/30 focus:ring-[#C26D53] bg-[#F7F1E6]"
              />
              <span>Show in Featured Slider</span>
            </label>

            {/* Trending */}
            <label className="flex items-center gap-2.5 text-xs text-[#4E5A46] cursor-pointer">
              <input
                type="checkbox"
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
                className="w-4.5 h-4.5 rounded text-[#C26D53] border-[#4E5A46]/30 focus:ring-[#C26D53] bg-[#F7F1E6]"
              />
              <span>Tag as Trending</span>
            </label>

            {/* Bestseller */}
            <label className="flex items-center gap-2.5 text-xs text-[#4E5A46] cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="w-4.5 h-4.5 rounded text-[#C26D53] border-[#4E5A46]/30 focus:ring-[#C26D53] bg-[#F7F1E6]"
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
            className="bg-[#C26D53] hover:bg-[#C26D53]/95 text-[#F7F1E6] font-semibold px-8 py-3 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all duration-200"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Product
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddEditProduct;
