import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Import Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import AddEditProduct from './pages/admin/AddEditProduct';
import OrderManagement from './pages/admin/OrderManagement';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen bg-[#F7F1E6] text-[#4E5A46] font-sans selection:bg-[#E8C5C0] selection:text-[#4E5A46]">
          {/* Main Navigation */}
          <Navbar />

          {/* Primary View Area */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Routes */}
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-tracking/:id" element={<OrderTracking />} />
              <Route path="/profile" element={<Profile />} />

              {/* Protected Admin Routes */}
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/products" element={<ProductManagement />} />
              <Route path="/admin/products/new" element={<AddEditProduct />} />
              <Route path="/admin/products/edit/:id" element={<AddEditProduct />} />
              <Route path="/admin/orders" element={<OrderManagement />} />

              {/* Catch-all fallback */}
              <Route path="*" element={
                <div className="max-w-md mx-auto text-center py-32 space-y-4">
                  <h2 className="font-serif text-3xl font-bold">404 Not Found</h2>
                  <p className="text-sm opacity-70">The page you are looking for does not exist.</p>
                  <Link to="/" className="inline-block bg-[#C26D53] text-[#F7F1E6] px-6 py-2.5 rounded-full text-xs font-semibold">
                    Return Home
                  </Link>
                </div>
              } />
            </Routes>
          </main>

          {/* Site Footer */}
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

// Inline fallback Link export just in case
import { Link } from 'react-router-dom';

export default App;
