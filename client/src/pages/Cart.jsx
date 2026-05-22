import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartSubtotal } = useCart();
  const navigate = useNavigate();

  // Price calculations
  const taxRate = 0.05; // 5% cafe tax
  const tax = cartSubtotal * taxRate;
  const deliveryThreshold = 300.00;
  const deliveryFee = cartSubtotal >= deliveryThreshold || cartSubtotal === 0 ? 0.00 : 40.00;
  const total = cartSubtotal + tax + deliveryFee;

  const handleCheckoutRedirect = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center"
        >
          <div className="p-8 bg-[#E8C5C0]/35 rounded-full text-[#C26D53]">
            <ShoppingBag className="w-16 h-16" />
          </div>
        </motion.div>
        
        <h2 className="font-serif text-3xl font-semibold text-[#4E5A46]">Your serving tray is empty</h2>
        <p className="text-sm text-[#4E5A46]/60 max-w-md mx-auto font-light">
          It looks like you haven’t added any artisanal pastries or specialty coffees to your tray yet.
        </p>
        
        <Link
          to="/shop"
          className="inline-block bg-[#C26D53] hover:bg-[#C26D53]/90 text-[#F7F1E6] font-semibold px-8 py-3.5 rounded-full text-xs shadow-md transition-all duration-200"
        >
          Explore Cozy Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Title */}
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#4E5A46] tracking-tight">Your Tray Selection</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Items list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft space-y-6">
            
            {cartItems.map((item) => (
              <motion.div
                key={item.product}
                layout
                className="flex items-center gap-4 py-4 border-b border-[#4E5A46]/10 last:border-b-0 last:pb-0"
              >
                {/* Item Thumbnail */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-[#4E5A46]/10 shadow-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Info and Quantities */}
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
                  <div>
                    <h3 className="font-serif text-base font-semibold text-[#4E5A46] line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-[#C26D53] font-medium">₹{item.price.toFixed(2)} each</p>
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center border border-[#4E5A46]/20 rounded-full px-3 py-1 bg-[#F7F1E6] w-28 justify-between justify-self-start sm:justify-self-center">
                    <button
                      onClick={() => updateQuantity(item.product, item.quantity - 1)}
                      className="text-[#4E5A46] hover:text-[#C26D53]"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-semibold text-xs text-[#4E5A46]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product, item.quantity + 1)}
                      className="text-[#4E5A46] hover:text-[#C26D53]"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total item price & remove action */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full justify-self-start md:justify-self-end">
                    <span className="font-semibold text-sm text-[#4E5A46]">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product)}
                      className="text-[#4E5A46]/50 hover:text-red-700 p-1.5 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}

            {/* Clear Cart Button */}
            <div className="pt-2 border-t border-[#4E5A46]/10 flex justify-end">
              <button
                onClick={clearCart}
                className="flex items-center gap-1.5 text-xs text-[#4E5A46]/60 hover:text-red-700 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Selection
              </button>
            </div>

          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="space-y-6">
          <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft space-y-6">
            <h2 className="font-serif text-xl font-semibold text-[#4E5A46] border-b border-[#4E5A46]/10 pb-4">
              Billing Details
            </h2>

            <div className="space-y-3.5 text-sm text-[#4E5A46]/75">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#4E5A46]">₹{cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Local Tax (5%)</span>
                <span className="font-medium text-[#4E5A46]">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span className="font-medium text-[#4E5A46]">
                  {deliveryFee === 0 ? (
                    <span className="text-[#A3AE9A] font-semibold">Free Delivery</span>
                  ) : (
                    `₹${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              
              {/* Delivery discount notice */}
              {deliveryFee > 0 && (
                <div className="bg-[#E8C5C0]/20 border border-[#E8C5C0]/40 p-3 rounded-xl text-2xs text-[#C26D53] leading-relaxed">
                  Add <span className="font-bold">₹{(deliveryThreshold - cartSubtotal).toFixed(2)}</span> more to qualify for complimentary shipping!
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t border-[#4E5A46]/10 pt-4 flex justify-between items-end text-[#4E5A46]">
              <span className="font-serif text-base font-semibold">Total Amount</span>
              <span className="text-xl font-bold text-[#C26D53]">₹{total.toFixed(2)}</span>
            </div>

            {/* Checkout Action */}
            <button
              onClick={handleCheckoutRedirect}
              className="w-full bg-[#C26D53] hover:bg-[#C26D53]/90 text-[#F7F1E6] font-semibold py-4 rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Proceed to Table Order
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
