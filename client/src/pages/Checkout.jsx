import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { CreditCard, MapPin, Phone, User, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { user, loading: authLoading } = useAuth();
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Redirect if guest
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=checkout');
    }
  }, [user, authLoading, navigate]);

  // Form states
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  
  // Card states
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  // Calculations
  const tax = cartSubtotal * 0.05;
  const delivery = cartSubtotal >= 300.00 || cartSubtotal === 0 ? 0.00 : 40.00;
  const grandTotal = cartSubtotal + tax + delivery;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError('Your shopping cart is empty.');
      return;
    }

    if (!address || !city || !zipCode || !phone) {
      setError('Please fill in all shipping details.');
      return;
    }

    if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
      setError('Please complete the mock payment card details.');
      return;
    }

    setPlacingOrder(true);
    setError('');

    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          product: item.product,
          quantity: item.quantity
        })),
        shippingAddress: {
          address,
          city,
          zipCode,
          phone
        }
      };

      const res = await api.post('/orders', orderPayload);
      const placedOrder = res.data.data;
      
      // Reset cart and navigate
      clearCart();
      navigate(`/order-tracking/${placedOrder._id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (authLoading || placingOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-8 h-8 text-[#C26D53] animate-spin" />
        <span className="text-sm text-[#4E5A46]/60">
          {placingOrder ? 'Polishing your recipe and routing order...' : 'Authenticating guest profile...'}
        </span>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <h2 className="font-serif text-2xl text-[#4E5A46]">Checkout Empty</h2>
        <p className="text-sm text-[#4E5A46]/60">You have no gourmet bakery items to check out.</p>
        <Link to="/shop" className="inline-block bg-[#C26D53] text-[#F7F1E6] px-6 py-2.5 rounded-full text-xs font-semibold">
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Title */}
      <div className="flex items-center gap-4">
        <Link to="/cart" className="text-[#4E5A46] hover:text-[#C26D53]">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#4E5A46] tracking-tight">Checkout Details</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side forms (Address and payment) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Shipping Address */}
          <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft space-y-4">
            <h2 className="font-serif text-lg font-semibold text-[#4E5A46] flex items-center gap-2 border-b border-[#4E5A46]/10 pb-3">
              <MapPin className="w-5 h-5 text-[#C26D53]" />
              Delivery Location
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-2xs text-[#4E5A46]/60 uppercase font-semibold">Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Apartment, suite, street name"
                  className="w-full bg-[#E8C5C0]/20 border border-[#4E5A46]/10 rounded-xl py-2 px-3 text-sm text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs text-[#4E5A46]/60 uppercase font-semibold">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. San Francisco"
                  className="w-full bg-[#E8C5C0]/20 border border-[#4E5A46]/10 rounded-xl py-2 px-3 text-sm text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs text-[#4E5A46]/60 uppercase font-semibold">Zip / Postal Code</label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="e.g. 94103"
                  className="w-full bg-[#E8C5C0]/20 border border-[#4E5A46]/10 rounded-xl py-2 px-3 text-sm text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-2xs text-[#4E5A46]/60 uppercase font-semibold">Contact Phone</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 87634 56297"
                    className="w-full bg-[#E8C5C0]/20 border border-[#4E5A46]/10 rounded-xl py-2 pl-10 pr-3 text-sm text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53]"
                  />
                  <Phone className="w-3.5 h-3.5 text-[#4E5A46]/50 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Premium Mock Payment */}
          <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft space-y-4">
            <h2 className="font-serif text-lg font-semibold text-[#4E5A46] flex items-center gap-2 border-b border-[#4E5A46]/10 pb-3">
              <CreditCard className="w-5 h-5 text-[#C26D53]" />
              Artisanal Payment
            </h2>

            <p className="text-2xs text-[#C26D53] italic">
              * Sandboxed demo transaction. Enter any dummy credit card digits to satisfy the billing module.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-2xs text-[#4E5A46]/60 uppercase font-semibold">Cardholder Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name printed on card"
                    className="w-full bg-[#E8C5C0]/20 border border-[#4E5A46]/10 rounded-xl py-2 pl-10 pr-3 text-sm text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53]"
                  />
                  <User className="w-3.5 h-3.5 text-[#4E5A46]/50 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-2xs text-[#4E5A46]/60 uppercase font-semibold">Card Number</label>
                <input
                  type="text"
                  required
                  maxLength="19"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                  placeholder="4111 2222 3333 4444"
                  className="w-full bg-[#E8C5C0]/20 border border-[#4E5A46]/10 rounded-xl py-2 px-3 text-sm text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs text-[#4E5A46]/60 uppercase font-semibold">Expiration Date</label>
                <input
                  type="text"
                  required
                  maxLength="5"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full bg-[#E8C5C0]/20 border border-[#4E5A46]/10 rounded-xl py-2 px-3 text-sm text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs text-[#4E5A46]/60 uppercase font-semibold">CVV / Security Code</label>
                <input
                  type="password"
                  required
                  maxLength="3"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                  placeholder="123"
                  className="w-full bg-[#E8C5C0]/20 border border-[#4E5A46]/10 rounded-xl py-2 px-3 text-sm text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53]"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Side summary */}
        <div className="space-y-6">
          <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft space-y-6">
            <h2 className="font-serif text-xl font-semibold text-[#4E5A46] border-b border-[#4E5A46]/10 pb-4">
              Invoice Summary
            </h2>

            {/* List items briefly */}
            <div className="max-h-48 overflow-y-auto space-y-3.5 pr-2">
              {cartItems.map((item) => (
                <div key={item.product} className="flex justify-between text-xs text-[#4E5A46]/75">
                  <span className="line-clamp-1">{item.name} <span className="font-bold">x{item.quantity}</span></span>
                  <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#4E5A46]/10 pt-4 space-y-3.5 text-xs text-[#4E5A46]/75">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>State Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{delivery === 0 ? 'Free' : `₹${delivery.toFixed(2)}`}</span>
              </div>
            </div>

            <div className="border-t border-[#4E5A46]/10 pt-4 flex justify-between items-end text-[#4E5A46]">
              <span className="font-serif text-sm font-semibold">Total Amount</span>
              <span className="text-lg font-bold text-[#C26D53]">₹{grandTotal.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#C26D53] hover:bg-[#C26D53]/90 text-[#F7F1E6] font-semibold py-4 rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Authorize & Order
            </button>

          </div>
        </div>

      </form>
    </div>
  );
};

export default Checkout;
