import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Eye, Calendar, Loader2, ArrowRightLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderManagement = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchAllOrdersList = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.data);
    } catch (error) {
      console.error('Error fetching admin orders list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchAllOrdersList();
    }
  }, [user, isAdmin]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev =>
        prev.map(ord => (ord._id === orderId ? { ...ord, status: newStatus } : ord))
      );
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

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

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-8 h-8 text-[#C26D53] animate-spin" />
        <span className="text-sm text-[#4E5A46]/60">Retrieving kitchen order sheets...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 min-h-screen">
      
      {/* Header Grid */}
      <div className="border-b border-[#4E5A46]/10 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#C26D53] uppercase">Administrative Area</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#4E5A46] mt-1">Orders Tracker</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/dashboard"
            className="px-4 py-2 bg-[#E8C5C0]/40 text-[#4E5A46] hover:bg-[#E8C5C0]/65 rounded-full text-xs font-semibold transition-all duration-200"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-[#E8C5C0]/40 text-[#4E5A46] hover:bg-[#E8C5C0]/65 rounded-full text-xs font-semibold transition-all duration-200"
          >
            Products Catalog
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2 bg-[#C26D53] text-[#F7F1E6] rounded-full text-xs font-semibold shadow-sm"
          >
            Orders Feed
          </Link>
        </div>
      </div>

      {/* Main Order Tracker Board */}
      <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 sm:p-8 shadow-soft">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-[#4E5A46]/60 italic font-light text-xs">
            No customer order history exists in the registry.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#4E5A46]/10 text-[#4E5A46]/60 font-semibold uppercase tracking-wider">
                  <th className="pb-3.5 pl-2">Ticket ID</th>
                  <th className="pb-3.5">Customer details</th>
                  <th className="pb-3.5">Items Ordered</th>
                  <th className="pb-3.5">Bill Total</th>
                  <th className="pb-3.5">Current Status</th>
                  <th className="pb-3.5">Change Status</th>
                  <th className="pb-3.5 pr-2 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord._id} className="border-b border-[#4E5A46]/5 hover:bg-[#E8C5C0]/10 transition-colors duration-150">
                    
                    {/* ID */}
                    <td className="py-4 pl-2 font-mono font-bold text-[#4E5A46]">
                      #{ord._id.slice(-8)}
                    </td>

                    {/* Customer */}
                    <td className="py-4 text-[#4E5A46]/90">
                      <div>
                        <p className="font-semibold">{ord.user?.name || 'Guest User'}</p>
                        <p className="text-3xs text-[#4E5A46]/50 mt-0.5">{ord.user?.email || 'N/A'}</p>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-4 text-[#4E5A46]/80 font-light">
                      <div className="line-clamp-2 max-w-xs leading-relaxed">
                        {ord.items.map(it => `${it.name} (x${it.quantity})`).join(', ')}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-4 text-[#C26D53] font-bold">
                      ₹{ord.totalAmount.toFixed(2)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${getStatusColor(ord.status)}`}>
                        {ord.status}
                      </span>
                    </td>

                    {/* Change Status Dropdown */}
                    <td className="py-4">
                      <div className="flex items-center gap-1">
                        {updatingId === ord._id ? (
                          <Loader2 className="w-3.5 h-3.5 text-[#C26D53] animate-spin" />
                        ) : (
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                            className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-full py-1 px-3 text-[10px] font-semibold text-[#4E5A46] focus:outline-none focus:ring-1 focus:ring-[#C26D53]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Baking">Baking</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        )}
                      </div>
                    </td>

                    {/* Actions link */}
                    <td className="py-4 text-right pr-2">
                      <Link
                        to={`/order-tracking/${ord._id}`}
                        className="inline-flex items-center gap-1 bg-[#4E5A46] hover:bg-[#4E5A46]/90 text-[#F7F1E6] px-3.5 py-2 rounded-full font-semibold transition-all shadow-sm hover:shadow"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Link>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default OrderManagement;
