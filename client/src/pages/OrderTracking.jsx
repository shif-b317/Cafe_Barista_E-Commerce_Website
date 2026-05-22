import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Clock, MapPin, CheckCircle, Flame, Coffee, Bike, CheckSquare, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrderStatus = async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.data);
    } catch (error) {
      console.error('Error fetching order status:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrderStatus();

    // Auto-poll the status every 10 seconds for a premium real-time experience
    const interval = setInterval(() => {
      fetchOrderStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, [id]);

  const statuses = [
    { name: 'Pending', label: 'Order Placed', desc: 'We have received your order and sent it to the barista.', icon: CheckSquare },
    { name: 'Preparing', label: 'Preparing Coffee', desc: 'Espresso shots are being pulled and ingredients prepped.', icon: Coffee },
    { name: 'Baking', label: 'Baking Fresh', desc: 'Warm buns and delicious croissants are in the oven.', icon: Flame },
    { name: 'Out for Delivery', label: 'Out for Delivery', desc: 'Your cozy order is on its way to your doorstep.', icon: Bike },
    { name: 'Delivered', label: 'Delivered', desc: 'Handed over warm. Enjoy your Café Barista treats!', icon: CheckCircle }
  ];

  const getStatusIndex = (currentStatus) => {
    return statuses.findIndex(s => s.name === currentStatus);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="w-8 h-8 border-4 border-[#C26D53] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#4E5A46]/60">Locating your order timeline...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <h2 className="font-serif text-2xl text-[#4E5A46]">Order Not Found</h2>
        <p className="text-sm text-[#4E5A46]/60">We cannot locate the requested order ticket.</p>
        <Link to="/shop" className="inline-block bg-[#C26D53] text-[#F7F1E6] px-6 py-2.5 rounded-full text-xs font-semibold">
          Explore Menu
        </Link>
      </div>
    );
  }

  const currentStatusIdx = getStatusIndex(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 min-h-screen">
      
      {/* Header and refresh */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#4E5A46]/10 pb-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#C26D53] uppercase">Real-Time Kitchen Feed</span>
          <h1 className="font-serif text-3xl font-semibold text-[#4E5A46] mt-1">Track Order Progress</h1>
          <p className="text-xs text-[#4E5A46]/60 mt-1">Ticket ID: <span className="font-mono font-semibold">{order._id}</span></p>
        </div>

        <button
          onClick={() => fetchOrderStatus(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 bg-[#E8C5C0]/40 text-[#4E5A46] hover:bg-[#E8C5C0]/60 px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-200"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Status'}
        </button>
      </div>

      {/* Main progress panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Left column: timeline tracker */}
        <div className="md:col-span-2 bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 sm:p-8 shadow-soft">
          <div className="relative border-l border-[#4E5A46]/20 pl-8 ml-4 space-y-10">
            {statuses.map((status, index) => {
              const IconComponent = status.icon;
              const isCompleted = index < currentStatusIdx;
              const isActive = index === currentStatusIdx;
              const isFuture = index > currentStatusIdx;

              return (
                <div key={status.name} className="relative">
                  {/* Circle Indicator on timeline line */}
                  <div
                    className={`absolute -left-[45px] top-0.5 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 z-10 ${
                      isCompleted
                        ? 'bg-[#A3AE9A] border-[#A3AE9A] text-[#F7F1E6]'
                        : isActive
                        ? 'bg-[#C26D53] border-[#C26D53] text-[#F7F1E6] ring-4 ring-[#C26D53]/25 animate-pulse'
                        : 'bg-[#F7F1E6] border-[#4E5A46]/20 text-[#4E5A46]/40'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Content details */}
                  <div className="space-y-1">
                    <h3
                      className={`font-serif text-base font-semibold ${
                        isActive
                          ? 'text-[#C26D53]'
                          : isCompleted
                          ? 'text-[#4E5A46]'
                          : 'text-[#4E5A46]/40'
                      }`}
                    >
                      {status.label}
                    </h3>
                    <p
                      className={`text-xs ${
                        isFuture ? 'text-[#4E5A46]/30' : 'text-[#4E5A46]/75'
                      } font-light leading-relaxed`}
                    >
                      {status.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Delivery detail summary */}
        <div className="space-y-6">
          {/* Est Delivery card */}
          <div className="bg-[#4E5A46] text-[#F7F1E6] rounded-3xl p-6 shadow-soft space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#E8C5C0] flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Delivery Estimate
            </h3>
            
            <div>
              <p className="text-3xl font-bold tracking-tight text-[#F7F1E6]">
                {order.status === 'Delivered' ? (
                  'Delivered'
                ) : (
                  new Date(order.estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                )}
              </p>
              <p className="text-2xs text-[#F7F1E6]/60 mt-1 uppercase tracking-wider font-bold">
                {order.status === 'Delivered' ? 'Delivery finalized' : 'Estimated time of arrival'}
              </p>
            </div>
            
            <div className="border-t border-[#F7F1E6]/10 pt-4 flex gap-2 text-xs">
              <MapPin className="w-4 h-4 text-[#E8C5C0] flex-shrink-0" />
              <div className="text-[#F7F1E6]/85 font-light">
                <p className="font-semibold">{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                <p className="mt-1 text-2xs opacity-75">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>

          {/* Items checklist */}
          <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft space-y-4">
            <h3 className="font-serif text-base font-semibold text-[#4E5A46]">Items Ordered</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.product} className="flex justify-between text-xs text-[#4E5A46]/85">
                  <span className="font-light">{item.name} <span className="font-semibold">x{item.quantity}</span></span>
                  <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#4E5A46]/10 pt-3 flex justify-between items-end text-[#4E5A46] font-semibold text-sm">
              <span>Total Paid</span>
              <span className="text-[#C26D53] font-bold">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderTracking;
