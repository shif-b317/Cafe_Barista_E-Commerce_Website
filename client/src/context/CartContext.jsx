import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart
  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product === product._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product === product._id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prevItems,
        {
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: qty
        }
      ];
    });
  };

  // Remove item
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate stats
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartSubtotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
