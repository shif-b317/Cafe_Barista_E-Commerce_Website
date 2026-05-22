import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { Star, ShoppingBag, ArrowLeft, Plus, Minus, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleIncrement = () => setQuantity(q => q + 1);
  const handleDecrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedMessage(true);
      setTimeout(() => setAddedMessage(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="w-8 h-8 border-4 border-[#C26D53] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#4E5A46]/60">Setting up the serving tray...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <h2 className="font-serif text-2xl text-[#4E5A46]">Product Not Found</h2>
        <p className="text-sm text-[#4E5A46]/60">The recipe details or café item you are searching for is unavailable.</p>
        <Link to="/shop" className="inline-block bg-[#C26D53] text-[#F7F1E6] px-6 py-2.5 rounded-full text-xs font-semibold">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Back to Shop Link */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-semibold text-[#4E5A46] hover:text-[#C26D53] transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Menu
      </button>

      {/* Main product block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Product Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-square bg-[#F7F1E6] rounded-[2.5rem] overflow-hidden border border-[#4E5A46]/10 shadow-premium"
        >
          {/* Tag Badges */}
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
            {product.isFeatured && (
              <span className="bg-[#A3AE9A] text-[#F7F1E6] text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
                Featured Selection
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-[#C26D53] text-[#F7F1E6] text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
                Bestseller
              </span>
            )}
          </div>

          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Right Side: Product Metadata & Actions */}
        <div className="space-y-6 lg:pl-6 font-cute">
          <div className="space-y-2">
            {/* Category tag and ratings */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-cute font-bold tracking-widest text-[#C26D53] uppercase">{product.category}</span>
              <div className="flex items-center gap-1 bg-[#F7F1E6] border border-[#4E5A46]/10 px-3 py-1 rounded-full text-xs font-cute font-bold text-[#4E5A46]">
                <Star className="w-3.5 h-3.5 fill-[#C26D53] text-[#C26D53]" />
                <span>{product.rating.toFixed(1)} / 5.0 Rating</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-cute font-bold text-[#4E5A46] tracking-tight">
              {product.name}
            </h1>

            <div className="text-2xl sm:text-3xl font-cute font-bold text-[#C26D53] pt-2">
              ₹{product.price.toFixed(2)}
            </div>
          </div>

          <div className="border-t border-[#4E5A46]/10 pt-4">
            <h3 className="text-xs font-cute font-bold text-[#4E5A46] uppercase tracking-wider mb-2">Description</h3>
            <p className="text-sm text-[#4E5A46]/80 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          {/* Delivery & Prep badges */}
          <div className="grid grid-cols-2 gap-4 border-t border-b border-[#4E5A46]/10 py-4 text-xs font-cute font-bold text-[#4E5A46]/75">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A3AE9A]" />
              <span>Baked Fresh Daily ♡</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#8FA1B2]" />
              <span>Local Delivery (45m) 🚀</span>
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 font-cute">
            
            {/* Quantity Selector */}
            <div className="flex items-center justify-between border border-[#4E5A46]/20 rounded-full px-4 py-2 sm:py-3 w-full sm:w-36 bg-[#F7F1E6]">
              <button
                onClick={handleDecrement}
                className="text-[#4E5A46] hover:text-[#C26D53] p-1.5 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm text-[#4E5A46]">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="text-[#4E5A46] hover:text-[#C26D53] p-1.5 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Submit Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="bg-[#C26D53] hover:bg-[#C26D53]/90 text-[#F7F1E6] font-bold px-8 py-3.5 rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 w-full"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart ✨
            </button>

          </div>

          {/* Added to cart notification callback */}
          {addedMessage && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-[#4E5A46] font-bold bg-[#A3AE9A]/20 border border-[#A3AE9A]/30 py-2.5 px-4 rounded-xl text-center font-cute"
            >
              Added {quantity} x "{product.name}" to your cart! ♡
            </motion.p>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
