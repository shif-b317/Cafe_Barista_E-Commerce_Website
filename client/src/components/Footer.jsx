import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#4E5A46] text-[#F7F1E6] pt-16 pb-8 border-t border-[#F7F1E6]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Coffee className="w-6 h-6 text-[#E8C5C0]" />
              <span className="font-serif text-2xl font-semibold tracking-wide">Café Barista</span>
            </div>
            <p className="text-[#F7F1E6]/75 text-sm leading-relaxed">
              Crafting cozy moments and artisanal delicacies. Every pastry is baked fresh, every coffee bean is roasted to perfection, and every visit is treated as coming home.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="#" className="hover:text-[#E8C5C0] transition-colors duration-200" aria-label="Instagram">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="hover:text-[#E8C5C0] transition-colors duration-200" aria-label="Facebook">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-medium mb-4 text-[#E8C5C0]">Our Categories</h3>
            <ul className="space-y-2.5 text-sm text-[#F7F1E6]/75">
              <li><Link to="/shop?category=Coffee" className="hover:text-[#E8C5C0] transition-colors duration-200">Artisanal Coffee</Link></li>
              <li><Link to="/shop?category=Cakes" className="hover:text-[#E8C5C0] transition-colors duration-200">Gourmet Cakes</Link></li>
              <li><Link to="/shop?category=Pastries" className="hover:text-[#E8C5C0] transition-colors duration-200">Fresh Pastries</Link></li>
              <li><Link to="/shop?category=Sandwiches" className="hover:text-[#E8C5C0] transition-colors duration-200">Warm Sandwiches</Link></li>
              <li><Link to="/shop?category=Desserts" className="hover:text-[#E8C5C0] transition-colors duration-200">Fine Desserts</Link></li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-serif text-lg font-medium mb-4 text-[#E8C5C0]">Hours of Comfort</h3>
            <ul className="space-y-2.5 text-sm text-[#F7F1E6]/75">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span>7:00 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>8:00 AM - 9:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>8:00 AM - 6:00 PM</span>
              </li>
              <li className="mt-4 pt-3 border-t border-[#F7F1E6]/10 text-xs italic text-[#E8C5C0]">
                * Kitchen closes 30 mins prior to close.
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#E8C5C0]">Newsletter</h3>
            <p className="text-xs text-[#F7F1E6]/75">
              Subscribe to receive cozy stories, event details, and seasonal menu previews.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#F7F1E6]/10 border border-[#F7F1E6]/25 rounded-full px-4 py-2 text-sm text-[#F7F1E6] placeholder-[#F7F1E6]/50 focus:outline-none focus:ring-1 focus:ring-[#E8C5C0] focus:border-[#E8C5C0] w-full"
              />
              <button
                type="submit"
                className="bg-[#C26D53] hover:bg-[#C26D53]/90 text-[#F7F1E6] px-4 py-2 rounded-full text-xs font-semibold shadow transition-all duration-200"
              >
                Join
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-[#A3AE9A] font-semibold animate-pulse">
                Welcome to the family! Check your inbox soon.
              </p>
            )}
            <div className="pt-2 space-y-2 text-xs text-[#F7F1E6]/75">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E8C5C0]" />
                <span>Suratkal ,Mangaluru</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E8C5C0]" />
                <span>+91 8763456297</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom footer */}
        <div className="border-t border-[#F7F1E6]/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#F7F1E6]/60">
          <p>© {new Date().getFullYear()} Café Barista. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-4 md:mt-0">
            Made with <Heart className="w-3 h-3 text-[#C26D53] fill-current" /> for a warm, cozy day.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
