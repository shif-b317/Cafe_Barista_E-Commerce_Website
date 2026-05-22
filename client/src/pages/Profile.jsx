import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { User, ShoppingBag, Eye, Calendar, IndianRupee, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=profile');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (user) {
        try {
          const res = await api.get('/orders/myorders');
          setOrders(res.data.data);
        } catch (error) {
          console.error('Error fetching order history:', error);
        } finally {
          setLoadingOrders(false);
        }
      }
    };
    fetchMyOrders();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Preparing': return 'bg-[#E8C5C0]/40 text-[#4E5A46] border-[#E8C5C0]';
      case 'Baking': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Out for Delivery': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Delivered': return 'bg-[#A3AE9A]/20 text-[#4E5A46] border-[#A3AE9A]/40';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="w-8 h-8 border-4 border-[#C26D53] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#4E5A46]/60">Setting up your profile board...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 min-h-screen">
      {/* Page Header */}
      <div className="border-b border-[#4E5A46]/10 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#C26D53] uppercase">Welcome Back</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#4E5A46] mt-1">{user.name}</h1>
          <p className="text-xs text-[#4E5A46]/60 mt-1">{user.email} (Customer Portal)</p>
        </div>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200"
        >
          Sign Out of Account
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* User Card Info details */}
        <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft space-y-6">
          <h3 className="font-serif text-lg font-semibold text-[#4E5A46] flex items-center gap-2 border-b border-[#4E5A46]/10 pb-3">
            <User className="w-5 h-5 text-[#C26D53]" />
            Account Summary
          </h3>
          
          <div className="space-y-4 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[#4E5A46]/5">
              <span className="text-[#4E5A46]/60 font-medium">Customer Name</span>
              <span className="font-semibold text-[#4E5A46]">{user.name}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#4E5A46]/5">
              <span className="text-[#4E5A46]/60 font-medium">Email Address</span>
              <span className="font-semibold text-[#4E5A46]">{user.email}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[#4E5A46]/60 font-medium">Access Status</span>
              <span className="bg-[#A3AE9A]/20 text-[#4E5A46] px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px]">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Order History column list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
            <h3 className="font-serif text-xl font-semibold text-[#4E5A46] flex items-center gap-2 border-b border-[#4E5A46]/10 pb-4">
              <ShoppingBag className="w-5.5 h-5.5 text-[#C26D53]" />
              Your Order History
            </h3>

            {loadingOrders ? (
              <div className="text-center py-10 text-[#4E5A46]/60 text-sm">
                Fetching past receipts...
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 space-y-4 border border-dashed border-[#4E5A46]/20 rounded-2xl bg-[#E8C5C0]/10">
                <p className="text-sm text-[#4E5A46]/60 font-light">You haven't placed any orders with us yet.</p>
                <Link to="/shop" className="inline-block bg-[#C26D53] text-[#F7F1E6] px-6 py-2 rounded-full text-xs font-semibold">
                  Browse Kitchen Menu
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <motion.div
                    key={ord._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-[#4E5A46]/10 rounded-2xl p-5 bg-[#F7F1E6] hover:bg-[#E8C5C0]/15 transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-2xs text-[#4E5A46]/60">#{ord._id.slice(-8)}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusColor(ord.status)}`}>
                          {ord.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#4E5A46]/75">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(ord.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" /> {ord.totalAmount.toFixed(2)}</span>
                        <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> {ord.items.length} items</span>
                      </div>
                    </div>

                    <Link
                      to={`/order-tracking/${ord._id}`}
                      className="flex items-center gap-1 text-xs font-semibold bg-[#C26D53] hover:bg-[#C26D53]/90 text-[#F7F1E6] px-4 py-2 rounded-full shadow-sm hover:shadow"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Track Order
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
