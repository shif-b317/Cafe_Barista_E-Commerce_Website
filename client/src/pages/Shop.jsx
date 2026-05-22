import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get search parameters
  const activeCategory = searchParams.get('category') || 'All';
  const activeSearch = searchParams.get('search') || '';
  const activeSort = searchParams.get('sort') || 'newest';

  const categories = [
    'All',
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

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeCategory !== 'All') params.category = activeCategory;
        if (activeSearch) params.search = activeSearch;
        if (activeSort) params.sort = activeSort;

        const res = await api.get('/products', { params });
        setProducts(res.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [activeCategory, activeSearch, activeSort]);

  const handleCategorySelect = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set('search', query);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', e.target.value);
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 min-h-screen">
      
      {/* Header Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-cute font-bold tracking-widest uppercase text-[#C26D53]">Curated Selection</span>
        <h1 className="text-4xl sm:text-5xl font-cute font-bold text-[#4E5A46]">The Sweet Shop Menu 🍰</h1>
        <p className="text-sm font-cute font-medium text-[#4E5A46]/60 max-w-md mx-auto leading-relaxed">
          Browse our freshly baked goods, cozy warm drinks, and yummy treats prepared with love!
        </p>
      </div>

      {/* Search, Filter, Sort Row */}
      <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 p-6 rounded-3xl shadow-soft flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <input
            type="text"
            name="search"
            defaultValue={activeSearch}
            placeholder="Search cakes, coffee, tea..."
            className="w-full bg-[#E8C5C0]/20 border border-[#4E5A46]/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-[#4E5A46] placeholder-[#4E5A46]/50 focus:outline-none focus:ring-1 focus:ring-[#C26D53] focus:border-[#C26D53]"
          />
          <Search className="w-4 h-4 text-[#4E5A46]/50 absolute left-4 top-1/2 transform -translate-y-1/2" />
        </form>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <SlidersHorizontal className="w-4 h-4 text-[#4E5A46]/60" />
          <span className="text-xs text-[#4E5A46]/60 font-medium">Sort By:</span>
          <select
            value={activeSort}
            onChange={handleSortChange}
            className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-full py-2 px-4 text-xs font-semibold text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53]"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

      </div>

      {/* Horizontal Category Selector */}
      <div className="overflow-x-auto pb-3 scrollbar-hide">
        <div className="flex gap-2.5 md:flex-wrap md:justify-center min-w-max md:min-w-0 font-cute font-bold">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-5 py-2 rounded-full text-xs transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-[#C26D53] text-[#F7F1E6] shadow-sm hover:scale-105'
                  : 'bg-[#E8C5C0]/40 text-[#4E5A46] hover:bg-[#E8C5C0]/65 hover:scale-102'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Display Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader className="w-8 h-8 text-[#C26D53] animate-spin" />
          <span className="text-sm text-[#4E5A46]/60 font-light">Loading our cozy treats...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-32 space-y-4 border border-[#4E5A46]/10 rounded-3xl bg-[#E8C5C0]/10">
          <h3 className="font-serif text-xl font-semibold text-[#4E5A46]">No Treats Found</h3>
          <p className="text-sm text-[#4E5A46]/60 font-light">
            We couldn't find any products in "{activeCategory}" matching your search criteria.
          </p>
          <button
            onClick={() => setSearchParams({})}
            className="bg-[#C26D53] text-[#F7F1E6] px-6 py-2 rounded-full text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>
      )}

    </div>
  );
};

export default Shop;
