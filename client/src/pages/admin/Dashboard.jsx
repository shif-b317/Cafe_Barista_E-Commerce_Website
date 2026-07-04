import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import {
  IndianRupee,
  ShoppingBag,
  Database,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  ShoppingCart,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    lowStockProducts: 0,
    todaySales: 0
  });

  const [charts, setCharts] = useState({
    monthlySales: [],
    categoryStats: [],
    weeklyOrders: []
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, chartsRes, ordersRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/analytics/charts'),
          api.get('/orders')
        ]);

        if (statsRes.data.success) setStats(statsRes.data.data);
        if (chartsRes.data.success) setCharts(chartsRes.data.data);
        if (ordersRes.data.success) setRecentOrders(ordersRes.data.data.slice(0, 10));
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-10 bg-[#E8C5C0]/25 rounded-2xl w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-28 bg-[#E8C5C0]/20 rounded-3xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 bg-[#E8C5C0]/20 rounded-3xl lg:col-span-2" />
          <div className="h-80 bg-[#E8C5C0]/20 rounded-3xl" />
        </div>
      </div>
    );
  }

  // Color Palette Constants for Charts
  const COLORS = ['#C26D53', '#E8C5C0', '#A3AE9A', '#8FA1B2', '#4E5A46', '#D4A373'];

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Welcome & Stats Summary Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-2xs font-extrabold tracking-widest text-[#C26D53] uppercase font-sans">Dashboard</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4E5A46] mt-0.5">Welcome Back, Barista!</h1>
        </div>
      </div>

      {/* 1. STATISTIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft flex items-center gap-5 hover:border-[#C26D53]/40 transition-colors"
        >
          <div className="p-4 rounded-2xl bg-[#C26D53] text-[#F7F1E6] shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider">Gross Income</h4>
            <p className="text-2xl font-bold text-[#4E5A46] mt-0.5">₹{stats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </motion.div>

        {/* Total Orders */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft flex items-center gap-5 hover:border-[#C26D53]/40 transition-colors"
        >
          <div className="p-4 rounded-2xl bg-[#8FA1B2] text-[#F7F1E6] shrink-0">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider">Total Sales</h4>
            <p className="text-2xl font-bold text-[#4E5A46] mt-0.5">{stats.totalOrders} Orders</p>
          </div>
        </motion.div>

        {/* Active Products */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft flex items-center gap-5 hover:border-[#C26D53]/40 transition-colors"
        >
          <div className="p-4 rounded-2xl bg-[#A3AE9A] text-[#F7F1E6] shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider">Total Recipes</h4>
            <p className="text-2xl font-bold text-[#4E5A46] mt-0.5">{stats.totalProducts} Items</p>
          </div>
        </motion.div>

        {/* Active Customers */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft flex items-center gap-5 hover:border-[#C26D53]/40 transition-colors"
        >
          <div className="p-4 rounded-2xl bg-[#E8C5C0] text-[#4E5A46] shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider">Subscribers</h4>
            <p className="text-2xl font-bold text-[#4E5A46] mt-0.5">{stats.totalCustomers} Patrons</p>
          </div>
        </motion.div>

        {/* Pending Prep Queue */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.25 }}
          className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft flex items-center gap-5 hover:border-[#C26D53]/40 transition-colors"
        >
          <div className="p-4 rounded-2xl bg-amber-100 text-amber-700 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider">Kitchen Queue</h4>
            <p className="text-2xl font-bold text-[#4E5A46] mt-0.5">{stats.pendingOrders} Processing</p>
          </div>
        </motion.div>

        {/* Completed Deliveries */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft flex items-center gap-5 hover:border-[#C26D53]/40 transition-colors"
        >
          <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-700 shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider">Fulfilled Orders</h4>
            <p className="text-2xl font-bold text-[#4E5A46] mt-0.5">{stats.completedOrders} Delivered</p>
          </div>
        </motion.div>

        {/* Low Stock Items */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.35 }}
          className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft flex items-center gap-5 hover:border-[#C26D53]/40 transition-colors"
        >
          <div className="p-4 rounded-2xl bg-red-100 text-red-700 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider">Low Stock alert</h4>
            <p className="text-2xl font-bold text-[#4E5A46] mt-0.5">{stats.lowStockProducts} Items Alert</p>
          </div>
        </motion.div>

        {/* Today's Sales */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft flex items-center gap-5 hover:border-[#C26D53]/40 transition-colors"
        >
          <div className="p-4 rounded-2xl bg-blue-100 text-blue-700 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider">Today's Sales</h4>
            <p className="text-2xl font-bold text-[#4E5A46] mt-0.5">₹{stats.todaySales.toLocaleString('en-IN')}</p>
          </div>
        </motion.div>
      </div>

      {/* 2. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Sales Line Chart */}
        <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft lg:col-span-2 space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#4E5A46] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#C26D53]" />
            Monthly Revenue Growth
          </h3>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthlySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C26D53" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C26D53" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#4E5A46/10" vertical={false} />
                <XAxis dataKey="name" stroke="#4E5A46/60" />
                <YAxis stroke="#4E5A46/60" />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Area type="monotone" dataKey="Sales" stroke="#C26D53" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Wise Revenue Pie Chart */}
        <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#4E5A46] flex items-center gap-2">
            <Database className="w-5 h-5 text-[#C26D53]" />
            Category Share
          </h3>
          <div className="h-72 w-full flex flex-col justify-center items-center relative">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={charts.categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Category Custom Legends */}
            <div className="flex flex-wrap justify-center gap-3 text-[10px] font-bold text-[#4E5A46]/80 mt-2">
              {charts.categoryStats.map((entry, idx) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Orders Bar Chart */}
        <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft lg:col-span-3 space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#4E5A46] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C26D53]" />
            Weekly Activity Frequency
          </h3>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.weeklyOrders} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4E5A46/10" vertical={false} />
                <XAxis dataKey="day" stroke="#4E5A46/60" />
                <YAxis stroke="#4E5A46/60" />
                <Tooltip />
                <Bar dataKey="Orders" fill="#8FA1B2" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. RECENT ORDERS TABLE */}
      <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
        <div className="flex justify-between items-center border-b border-[#4E5A46]/10 pb-4">
          <h3 className="font-serif text-lg font-bold text-[#4E5A46] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#C26D53]" />
            Recent Kitchen Feed
          </h3>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-[#C26D53] hover:text-[#C26D53]/80 flex items-center gap-1.5 transition-colors"
          >
            Manage All Orders
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#4E5A46]/60 italic font-light">
            No orders placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#4E5A46]/10 text-[#4E5A46]/60 font-extrabold uppercase tracking-wider">
                  <th className="pb-3.5 pl-2">Order ID</th>
                  <th className="pb-3.5">Customer</th>
                  <th className="pb-3.5">Amount</th>
                  <th className="pb-3.5">Order Status</th>
                  <th className="pb-3.5">Date</th>
                  <th className="pb-3.5 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4E5A46]/5">
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#E8C5C0]/10 transition-colors">
                    <td className="py-4 pl-2 font-mono font-bold text-[#4E5A46]">#{ord._id.slice(-8)}</td>
                    <td className="py-4 text-[#4E5A46] font-medium">{ord.user?.name || 'Guest User'}</td>
                    <td className="py-4 text-[#C26D53] font-bold">₹{ord.totalAmount.toFixed(2)}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : ord.status === 'Cancelled'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-4 text-[#4E5A46]/75 font-medium">{new Date(ord.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 text-right pr-2">
                      <Link
                        to={`/admin/orders?search=${ord._id.slice(-8)}`}
                        className="inline-flex items-center gap-1 bg-[#4E5A46] hover:bg-[#4E5A46]/95 text-[#F7F1E6] px-3.5 py-1.5 rounded-full font-bold transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
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
