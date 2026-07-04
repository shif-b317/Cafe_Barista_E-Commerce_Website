import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../utils/api';
import {
  Eye,
  Calendar,
  Loader2,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Truck,
  Flame,
  Clock,
  MapPin,
  Phone,
  User,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrderManagement = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Search & Filter state
  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest'); // newest / oldest

  // Order Details Modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
    fetchAllOrdersList();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev =>
        prev.map(ord => (ord._id === orderId ? { ...ord, status: newStatus } : ord))
      );
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Preparing': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Baking': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Out for Delivery': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Preparing': return <Flame className="w-4 h-4 text-amber-600" />;
      case 'Baking': return <Flame className="w-4 h-4 text-orange-600" />;
      case 'Out for Delivery': return <Truck className="w-4 h-4 text-blue-600" />;
      case 'Delivered': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'Cancelled': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  // Filtered & Sorted Orders
  const filteredOrders = orders.filter(ord => {
    const orderId = ord._id.toLowerCase();
    const customerName = ord.user?.name?.toLowerCase() || '';
    const customerEmail = ord.user?.email?.toLowerCase() || '';
    
    const matchesSearch = orderId.includes(search.toLowerCase()) || 
                          customerName.includes(search.toLowerCase()) || 
                          customerEmail.includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || ord.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-8 h-8 text-[#C26D53] animate-spin" />
        <span className="text-sm text-[#4E5A46]/60 font-serif italic">Loading order files...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 min-h-screen relative">
      
      {/* Header Panel */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-2xs font-extrabold tracking-widest text-[#C26D53] uppercase font-sans">Queue</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4E5A46] mt-0.5">Order Management</h1>
        </div>
      </div>

      {/* Search & Filter Panel */}
      <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-5 flex flex-col md:flex-row gap-4 justify-between items-center shadow-soft">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by customer, email or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#E8C5C0]/15 focus:bg-[#E8C5C0]/25 border border-[#4E5A46]/10 focus:border-[#C26D53] rounded-2xl text-xs outline-none placeholder-[#4E5A46]/40 transition-all"
          />
          <Search className="w-4.5 h-4.5 text-[#4E5A46]/45 absolute left-3.5 top-3" />
        </div>

        {/* Filter & Sort */}
        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-[#4E5A46]/60" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl text-xs outline-none text-[#4E5A46] font-semibold focus:border-[#C26D53]"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="Baking">Baking</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Sorting */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ArrowUpDown className="w-4 h-4 text-[#4E5A46]/60" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2.5 bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl text-xs outline-none text-[#4E5A46] font-semibold focus:border-[#C26D53]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List Board */}
      <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 sm:p-8 shadow-soft">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-14 text-[#4E5A46]/60 italic font-light text-xs">
            No order tickets found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#4E5A46]/10 text-[#4E5A46]/60 font-extrabold uppercase tracking-wider">
                  <th className="pb-3.5 pl-2">Ticket ID</th>
                  <th className="pb-3.5">Customer Details</th>
                  <th className="pb-3.5">Recipes Ordered</th>
                  <th className="pb-3.5">Bill Amount</th>
                  <th className="pb-3.5">Current Status</th>
                  <th className="pb-3.5">Action Status</th>
                  <th className="pb-3.5 pr-2 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4E5A46]/5">
                {filteredOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#E8C5C0]/10 transition-colors">
                    
                    {/* ID */}
                    <td className="py-4 pl-2 font-mono font-bold text-[#4E5A46]">
                      #{ord._id.slice(-8)}
                    </td>

                    {/* Customer */}
                    <td className="py-4 text-[#4E5A46]/90">
                      <div>
                        <p className="font-bold text-sm">{ord.user?.name || 'Guest User'}</p>
                        <p className="text-[10px] text-[#4E5A46]/60 mt-0.5">{ord.user?.email || 'N/A'}</p>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-4 text-[#4E5A46]/80 font-medium">
                      <div className="line-clamp-2 max-w-xs leading-relaxed">
                        {ord.items.map(it => `${it.name} (x${it.quantity})`).join(', ')}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-4 text-[#C26D53] font-bold text-sm">
                      ₹{ord.totalAmount.toFixed(2)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold ${getStatusColor(ord.status)}`}>
                        {getStatusIcon(ord.status)}
                        {ord.status}
                      </span>
                    </td>

                    {/* Change Status Dropdown */}
                    <td className="py-4">
                      <div className="flex items-center gap-1">
                        {updatingId === ord._id ? (
                          <Loader2 className="w-4 h-4 text-[#C26D53] animate-spin" />
                        ) : (
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                            className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-full py-1.5 px-3 text-[10px] font-bold text-[#4E5A46] focus:outline-none focus:border-[#C26D53]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Baking">Baking</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        )}
                      </div>
                    </td>

                    {/* Inspect link */}
                    <td className="py-4 text-right pr-2">
                      <button
                        onClick={() => handleOpenDetails(ord)}
                        className="inline-flex items-center gap-1 bg-[#4E5A46] hover:bg-[#4E5A46]/95 text-[#F7F1E6] px-3.5 py-1.5 rounded-full font-bold transition-all shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal Overlay */}
      <AnimatePresence>
        {modalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/45"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#F7F1E6] border border-[#4E5A46]/15 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative z-10 space-y-6 shadow-2xl overflow-y-auto max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-[#4E5A46]/10 pb-4">
                <div>
                  <span className="text-2xs font-extrabold text-[#C26D53] uppercase tracking-wider">Ticket details</span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#4E5A46] mt-0.5">Order #{selectedOrder._id}</h3>
                  <div className="flex items-center gap-1.5 mt-1.5 text-3xs text-[#4E5A46]/60 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-[#E8C5C0]/40 text-[#4E5A46] hover:bg-[#E8C5C0]/65 p-2 rounded-full transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Grid info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-b border-[#4E5A46]/10 pb-6">
                {/* Customer info */}
                <div className="space-y-3">
                  <h4 className="font-serif font-bold text-[#C26D53] uppercase tracking-wider text-2xs">Customer Profile</h4>
                  <div className="space-y-2 bg-[#E8C5C0]/10 p-4 rounded-2xl border border-[#4E5A46]/5">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#4E5A46]/60" />
                      <span className="font-bold">{selectedOrder.user?.name || 'Guest User'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#4E5A46]/70">
                      <span className="font-semibold">{selectedOrder.user?.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery details */}
                <div className="space-y-3">
                  <h4 className="font-serif font-bold text-[#C26D53] uppercase tracking-wider text-2xs">Shipping Destination</h4>
                  <div className="space-y-2 bg-[#E8C5C0]/10 p-4 rounded-2xl border border-[#4E5A46]/5">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#4E5A46]/60 mt-0.5" />
                      <div>
                        <p className="font-semibold">{selectedOrder.shippingAddress?.address}</p>
                        <p className="font-semibold text-[#4E5A46]/70">{selectedOrder.shippingAddress?.city} - {selectedOrder.shippingAddress?.zipCode}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#4E5A46]/60" />
                      <span className="font-bold">{selectedOrder.shippingAddress?.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-[#C26D53] uppercase tracking-wider text-2xs">Items Summary</h4>
                <div className="divide-y divide-[#4E5A46]/5 bg-[#E8C5C0]/10 border border-[#4E5A46]/5 rounded-2xl overflow-hidden px-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-[#4E5A46]">{item.name}</p>
                        <span className="text-[10px] text-[#4E5A46]/60">₹{item.price.toFixed(2)} each</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#4E5A46]">Qty: {item.quantity}</span>
                        <p className="font-bold text-[#C26D53] mt-0.5">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer pricing / Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#E8C5C0]/20 p-5 rounded-3xl border border-[#4E5A46]/5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#4E5A46]">
                  <CreditCard className="w-4.5 h-4.5 text-[#C26D53]" />
                  <span>Payment: {selectedOrder.paymentMethod || 'Mock Card Payment'}</span>
                </div>
                <div className="text-right w-full sm:w-auto">
                  <span className="text-3xs uppercase tracking-wider text-[#4E5A46]/60 font-bold block">Total Invoice Bill</span>
                  <span className="text-xl font-serif font-extrabold text-[#C26D53] block">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Update status inside Modal */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-[#4E5A46]/10 pt-4 text-xs font-bold">
                <span className="text-2xs uppercase tracking-wider text-[#4E5A46]/60 font-bold">Update Order Status:</span>
                <div className="flex gap-2 w-full sm:w-auto">
                  {['Preparing', 'Baking', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedOrder._id, status)}
                      disabled={updatingId !== null}
                      className={`px-3 py-1.5 rounded-full border text-[10px] transition-all ${
                        selectedOrder.status === status
                          ? 'bg-[#C26D53] text-[#F7F1E6] border-[#C26D53]'
                          : 'bg-[#F7F1E6] hover:bg-[#E8C5C0]/35 text-[#4E5A46] border-[#4E5A46]/15'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default OrderManagement;
