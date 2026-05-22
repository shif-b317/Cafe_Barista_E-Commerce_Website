import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Coffee, ArrowRight, Quote, Heart, Star, Compass, Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Filter items for frontpage showcasing
  const featuredCakes = products.filter(p => p.category === 'Cakes').slice(0, 4);
  const freshPastries = products.filter(p => p.category === 'Pastries').slice(0, 4);
  const coffeeSpecials = products.filter(p => p.category === 'Coffee').slice(0, 4);

  const testimonials = [
    {
      name: 'Eleanora Vance',
      role: 'Pastry Connoisseur',
      quote: 'The Velvet Raspberry Cocoa Gateau is a masterpiece. It strikes the perfect balance between cocoa bitterness and fresh fruit tartness. Absolute luxury.',
      rating: 5
    },
    {
      name: 'Dr. Arthur Sterling',
      role: 'Regular Visitor',
      quote: 'There is something healing about sinking into their corduroy armchairs with an Iced Lavender Oat Milk Latte. A true cozy sanctuary.',
      rating: 5
    },
    {
      name: 'Clara Montaigne',
      role: 'Food Photographer',
      quote: 'The sourdough croissants are laminated to perfection. Flaky layers that melt, with that distinct buttery crumb. Visually and sensorially beautiful.',
      rating: 5
    }
  ];

  const instagramPhotos = [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400'
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 bg-gradient-to-b from-[#E8C5C0]/30 via-[#F7F1E6] to-[#F7F1E6] overflow-hidden">
        {/* Organic background blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#E8C5C0]/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#A3AE9A]/15 blur-3xl" />

        {/* Floating Sparkles for Cute Vibe */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 15, -15, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 right-1/4 text-[#C26D53]/60 hidden md:block"
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -10, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-32 left-1/3 text-[#A3AE9A]/70 hidden md:block"
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 left-12 text-[#E8C5C0]/80 hidden md:block"
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 py-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-center lg:text-left"
          >
            <span className="text-[11px] font-cute font-bold tracking-widest uppercase text-[#C26D53] bg-[#C26D53]/10 px-4 py-2 rounded-full inline-block">
              ✨ Artisanal Bakery & Specialty Coffee ✨
            </span>
            <div className="space-y-1">
              <span className="font-handwritten text-4xl text-[#C26D53] block mb-2 font-normal">
                welcome to our sweet little sanctuary...
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-cute font-bold tracking-tight text-[#4E5A46] leading-[1.15]">
                Cozy Moments <br />
                <span className="italic text-[#C26D53] font-light font-serif">Freshly Baked</span> <br />
                With Love.
              </h1>
            </div>
            <p className="text-[#4E5A46]/75 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-cute font-medium leading-relaxed">
              Step out of the rush and into our warm sanctuary. We bake yummy pastries, custom cupcakes, and pull gourmet coffee just for you! 🥐☕
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/shop"
                className="bg-[#C26D53] hover:bg-[#C26D53]/90 text-[#F7F1E6] px-8 py-4 rounded-full font-cute font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                Explore Menu ✨
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#about"
                className="border border-[#4E5A46]/20 bg-[#F7F1E6]/50 hover:bg-[#4E5A46]/5 text-[#4E5A46] px-8 py-4 rounded-full font-cute font-bold transition-all duration-200"
              >
                Our Story ♡
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Elegant organic shape frame */}
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-premium border-4 border-[#F7F1E6]">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800"
                alt="Cozy Cafe Barista Interior"
                className="w-full h-full object-cover hover:scale-102 transition-transform duration-700"
              />
            </div>
            
            {/* Overlay card */}
            <div className="absolute -bottom-6 -left-6 bg-[#F7F1E6] border border-[#4E5A46]/10 p-6 rounded-3xl shadow-premium hidden sm:flex items-center gap-4 max-w-xs">
              <div className="p-3 bg-[#E8C5C0]/55 rounded-2xl text-[#C26D53]">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-[#4E5A46] font-semibold text-sm">Voted Best Bakery</h4>
                <p className="text-2xs text-[#4E5A46]/60 mt-0.5">District Culinary Guild Awards 2026</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Featured Categories Showrooms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Cakes */}
        {featuredCakes.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-end justify-between border-b border-[#4E5A46]/10 pb-4">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-[#C26D53]">Decadent Delights</span>
                <h2 className="text-3xl sm:text-4xl font-semibold text-[#4E5A46] font-serif mt-1">Featured Cakes</h2>
              </div>
              <Link to="/shop?category=Cakes" className="text-sm font-medium text-[#C26D53] hover:text-[#C26D53]/80 flex items-center gap-1">
                View all Cakes <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredCakes.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Pastries */}
        {freshPastries.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-end justify-between border-b border-[#4E5A46]/10 pb-4">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-[#C26D53]">Warm from the Oven</span>
                <h2 className="text-3xl sm:text-4xl font-semibold text-[#4E5A46] font-serif mt-1">Fresh Pastries</h2>
              </div>
              <Link to="/shop?category=Pastries" className="text-sm font-medium text-[#C26D53] hover:text-[#C26D53]/80 flex items-center gap-1">
                View all Pastries <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {freshPastries.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Coffee */}
        {coffeeSpecials.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-end justify-between border-b border-[#4E5A46]/10 pb-4">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-[#C26D53]">Golden Brews</span>
                <h2 className="text-3xl sm:text-4xl font-semibold text-[#4E5A46] font-serif mt-1">Coffee Specials</h2>
              </div>
              <Link to="/shop?category=Coffee" className="text-sm font-medium text-[#C26D53] hover:text-[#C26D53]/80 flex items-center gap-1">
                View all Coffee <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {coffeeSpecials.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. About Section */}
      <section id="about" className="bg-[#E8C5C0]/20 py-20 border-y border-[#4E5A46]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-video lg:aspect-square rounded-[2rem] overflow-hidden shadow-premium">
            <img
              src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=800"
              alt="Artisanal Baking Process"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <span className="text-xs font-bold tracking-widest uppercase text-[#C26D53]">Our Heritage</span>
            <h2 className="text-4xl sm:text-5xl font-semibold text-[#4E5A46] font-serif leading-tight">
              Slow Fermented, <br />
              <span className="italic text-[#C26D53] font-light">Stoneground</span> Ingredients.
            </h2>
            <p className="text-sm sm:text-base text-[#4E5A46]/80 leading-relaxed font-light">
              At Café Barista, we believe that the finest flavors emerge from patience. Our sourdough starters are aged for days, creating complex profiles and textures. We source organic stoneground wheat directly from regenerative local growers, ensuring every loaf and croissant supports our land.
            </p>
            <p className="text-sm sm:text-base text-[#4E5A46]/80 leading-relaxed font-light">
              Our coffee program is equally fastidious. We source single-origin arabica micro-lots and roast them in small batches to preserve their delicate floral and fruity notes. It is a slow, methodical ritual, crafted for your daily pleasure.
            </p>
            
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="flex gap-3">
                <div className="text-[#C26D53] mt-1"><Compass className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-serif text-[#4E5A46] font-semibold text-sm">Sustainably Sourced</h4>
                  <p className="text-xs text-[#4E5A46]/60 mt-1">100% fair trade and organic ingredients.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-[#C26D53] mt-1"><Heart className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-serif text-[#4E5A46] font-semibold text-sm">Baked with Soul</h4>
                  <p className="text-xs text-[#4E5A46]/60 mt-1">Traditional recipes passed down generations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-widest uppercase text-[#C26D53]">Warm Encounters</span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#4E5A46] font-serif">Stories from our Guests</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#F7F1E6] border border-[#4E5A46]/10 p-8 rounded-3xl shadow-soft flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex text-[#C26D53]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-[#4E5A46] italic font-light text-sm leading-relaxed">
                  "{t.quote}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-[#4E5A46]/5">
                <div className="p-2 bg-[#E8C5C0]/40 rounded-full text-[#4E5A46]">
                  <Quote className="w-4 h-4 fill-current text-[#C26D53]" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#4E5A46]">{t.name}</h4>
                  <p className="text-2xs text-[#4E5A46]/60 uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Instagram Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-[#C26D53]">Gallery</span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#4E5A46] font-serif mt-1">@cafebarista_cozy</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPhotos.map((url, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              className="aspect-square rounded-2xl overflow-hidden shadow-soft border border-[#4E5A46]/10 group relative"
            >
              <img
                src={url}
                alt="Instagram pastry layout"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#4E5A46]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-[#F7F1E6] text-xs font-medium tracking-wide">View Post</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
