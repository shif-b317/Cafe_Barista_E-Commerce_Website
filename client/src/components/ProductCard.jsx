import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating to details page
    addToCart(product);
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -8, scale: 1.01, boxShadow: '0 12px 30px -4px rgba(232, 197, 192, 0.4)' }}
      className="bg-[#F7F1E6] rounded-[2rem] border border-[#4E5A46]/10 shadow-soft overflow-hidden group flex flex-col justify-between h-full transition-shadow duration-300"
    >
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden aspect-square">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          {product.isFeatured && (
            <span className="bg-[#A3AE9A] text-[#F7F1E6] text-[9px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full font-cute shadow-sm">
              Featured
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#C26D53] text-[#F7F1E6] text-[9px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full font-cute shadow-sm">
              Best Seller
            </span>
          )}
          {product.isTrending && (
            <span className="bg-[#8FA1B2] text-[#F7F1E6] text-[9px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full font-cute shadow-sm">
              Trending
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleLike}
          className="absolute top-4 right-4 z-10 bg-[#F7F1E6]/90 hover:bg-[#F7F1E6] text-[#C26D53] p-2.5 rounded-full shadow-sm hover:scale-110 active:scale-90 transition-all duration-200"
          title="Add to Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-300 ${
              liked ? 'fill-[#C26D53] text-[#C26D53]' : 'text-[#C26D53]/70'
            }`}
          />
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#4E5A46]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Info Content */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#4E5A46]/60 mb-2">
            <span className="font-cute font-semibold tracking-widest uppercase text-[10px] text-[#4E5A46]/70">{product.category}</span>
            <div className="flex items-center gap-1 font-cute font-bold text-[#4E5A46]">
              <Star className="w-3.5 h-3.5 fill-[#C26D53] text-[#C26D53]" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>
 
          {/* Product Title */}
          <Link to={`/product/${product._id}`} className="block group-hover:text-[#C26D53] transition-colors duration-200">
            <h3 className="font-cute text-base font-bold tracking-tight text-[#4E5A46] line-clamp-1 mb-1.5">
              {product.name}
            </h3>
          </Link>
 
          {/* Description */}
          <p className="text-xs text-[#4E5A46]/75 line-clamp-2 mb-2 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Cute Tag */}
          <div className="mb-4">
            <span className="font-handwritten text-2xl text-[#C26D53] leading-none">made with love &hearts;</span>
          </div>
        </div>
 
        {/* Pricing and Action */}
        <div className="flex items-center justify-between pt-2.5 border-t border-[#4E5A46]/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#4E5A46]/50 uppercase font-cute font-bold tracking-wider">Price</span>
            <span className="text-base font-cute font-bold text-[#4E5A46]">₹{product.price.toFixed(2)}</span>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 bg-[#C26D53] hover:bg-[#C26D53]/90 text-[#F7F1E6] px-5 py-2.5 rounded-full text-xs font-cute font-bold shadow-sm transition-all duration-200 group-hover:shadow-md"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
