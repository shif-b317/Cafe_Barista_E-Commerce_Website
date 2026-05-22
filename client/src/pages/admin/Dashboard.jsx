import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { IndianRupee, ShoppingBag, Database, Users, TrendingUp, Clock, Eye, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrdersCount: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user && isAdmin) {
        try {
          // Fetch orders and products in parallel
          const [ordersRes, productsRes] = await Promise.all([
            api.get('/orders'),
            api.get('/products')
          ]);

          const orders = ordersRes.data.data;
          const products = productsRes.data.data;

          // Compute statistics
          const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
          const totalOrders = orders.length;
          const totalProducts = products.length;
          const pendingOrdersCount = orders.filter(o => o.status !== 'Delivered').length;

          setStats({
            totalRevenue,
            totalOrders,
            totalProducts,
            pendingOrdersCount
          });

          setRecentOrders(orders.slice(0, 5));
        } catch (error) {
          console.error('Error fetching dashboard statistics:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDashboardData();
  }, [user, isAdmin]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="w-8 h-8 border-4 border-[#C26D53] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#4E5A46]/60">Brewing administrator dashboard...</span>
      </div>
    );
  }

  // Common styles
  const cardStyle = "bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft flex items-center gap-5";
  const iconBoxStyle = "p-4 rounded-2xl text-[#F7F1E6]";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 min-h-screen">
      
      {/* Dashboard Nav & Title */}
      <div className="border-b border-[#4E5A46]/10 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#C26D53] uppercase">Administrative Area</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#4E5A46] mt-1">Management Console</h1>
        </div>

        {/* Admin Navigation Links */}
        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/dashboard"
            className="px-4 py-2 bg-[#C26D53] text-[#F7F1E6] rounded-full text-xs font-semibold shadow-sm"
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
            className="px-4 py-2 bg-[#E8C5C0]/40 text-[#4E5A46] hover:bg-[#E8C5C0]/65 rounded-full text-xs font-semibold transition-all duration-200"
          >
            Orders Feed
          </Link>
        </div>
      </div>

      {/* Statistics Cards Grids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Revenue */}
        <motion.div whileHover={{ y: -3 }} className={cardStyle}>
          <div className={`${iconBoxStyle} bg-[#C26D53]`}>
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xs text-[#4E5A46]/60 uppercase font-bold tracking-wider">Gross Income</h4>
            <p className="text-2xl font-bold text-[#4E5A46] mt-0.5">₹{stats.totalRevenue.toFixed(2)}</p>
          </div>
        </motion.div>

        {/* Total Orders */}
        <motion.div whileHover={{ y: -3 }} className={cardStyle}>
          <div className={`${iconBoxStyle} bg-[#8FA1B2]`}>
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xs text-[#4E5A46]/60 uppercase font-bold tracking-wider">Total Sales</h4>
            <p className="text-2xl font-bold text-[#4E5A46] mt-0.5">{stats.totalOrders} Orders</p>
          </div>
        </motion.div>

        {/* Active Products */}
        <motion.div whileHover={{ y: -3 }} className={cardStyle}>
          <div className={`${iconBoxStyle} bg-[#A3AE9A]`}>
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xs text-[#4E5A46]/60 uppercase font-bold tracking-wider">Active Recipes</h4>
            <p className="text-2xl font-bold text-[#4E5A46] mt-0.5">{stats.totalProducts} Items</p>
          </div>
        </motion.div>

        {/* Active Prep orders */}
        <motion.div whileHover={{ y: -3 }} className={cardStyle}>
          <div className={`${iconBoxStyle} bg-[#E8C5C0] text-[#4E5A46]`}>
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xs text-[#4E5A46]/60 uppercase font-bold tracking-wider">Kitchen Queue</h4>
            <p className="text-2xl font-bold text-[#4E5A46] mt-0.5">{stats.pendingOrdersCount} In-Prep</p>
          </div>
        </motion.div>

      </div>

      {/* Bottom recent orders */}
      <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
        <h3 className="font-serif text-xl font-semibold text-[#4E5A46] flex items-center gap-2 border-b border-[#4E5A46]/10 pb-4">
          <TrendingUp className="w-5.5 h-5.5 text-[#C26D53]" />
          Recent Kitchen Activity
        </h3>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#4E5A46]/60 italic font-light">
            No transaction records found. Let’s place some dummy orders first!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#4E5A46]/10 text-[#4E5A46]/60 font-semibold uppercase tracking-wider">
                  <th className="pb-3.5 pl-2">Ticket ID</th>
                  <th className="pb-3.5">Customer</th>
                  <th className="pb-3.5">Placed On</th>
                  <th className="pb-3.5">Bill Amount</th>
                  <th className="pb-3.5">Progress</th>
                  <th className="pb-3.5 pr-2 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="border-b border-[#4E5A46]/5 hover:bg-[#E8C5C0]/10 transition-colors duration-150">
                    <td className="py-4 pl-2 font-mono font-bold text-[#4E5A46]">#{ord._id.slice(-8)}</td>
                    <td className="py-4 text-[#4E5A46] font-medium">{ord.user?.name || 'Guest User'}</td>
                    <td className="py-4 text-[#4E5A46]/85">{new Date(ord.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 text-[#C26D53] font-bold">₹{ord.totalAmount.toFixed(2)}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${
                        ord.status === 'Delivered'
                          ? 'bg-[#A3AE9A]/20 text-[#4E5A46] border-[#A3AE9A]/40'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-2">
                      <Link
                        to={`/order-tracking/${ord._id}`}
                        className="inline-flex items-center gap-1 bg-[#4E5A46] hover:bg-[#4E5A46]/90 text-[#F7F1E6] px-3.5 py-2 rounded-full font-semibold transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Check
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

export default Dashboard;
