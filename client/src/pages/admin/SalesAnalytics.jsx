import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Loader2, TrendingUp, ShoppingBag, Users, Award, Percent, DollarSign } from 'lucide-react';
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

const SalesAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [charts, setCharts] = useState({ monthlySales: [], categoryStats: [], weeklyOrders: [] });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [detailedRes, chartsRes] = await Promise.all([
          api.get('/analytics/detailed'),
          api.get('/analytics/charts')
        ]);
        if (detailedRes.data.success) setData(detailedRes.data.data);
        if (chartsRes.data.success) setCharts(chartsRes.data.data);
      } catch (err) {
        console.error('Failed to load sales analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-8 h-8 text-[#C26D53] animate-spin" />
        <span className="text-sm text-[#4E5A46]/60 font-serif italic">Computing analytical metrics...</span>
      </div>
    );
  }

  const COLORS = ['#C26D53', '#E8C5C0', '#A3AE9A', '#8FA1B2', '#4E5A46', '#D4A373'];

  return (
    <div className="p-6 sm:p-8 space-y-8 min-h-screen">
      {/* Title Panel */}
      <div>
        <span className="text-2xs font-extrabold tracking-widest text-[#C26D53] uppercase font-sans">Business Intelligence</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4E5A46] mt-0.5">Sales Analytics</h1>
      </div>

      {/* Grid Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
        
        {/* Total Income */}
        <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft flex items-center gap-5">
          <div className="p-4 rounded-2xl bg-[#C26D53] text-[#F7F1E6]">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider">Accumulated Revenue</span>
            <p className="text-2xl font-bold text-[#4E5A46]">₹{data.revenue.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft flex items-center gap-5">
          <div className="p-4 rounded-2xl bg-[#8FA1B2] text-[#F7F1E6]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider">Total Invoices</span>
            <p className="text-2xl font-bold text-[#4E5A46]">{data.orders} Sales</p>
          </div>
        </div>

        {/* AOV */}
        <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft flex items-center gap-5">
          <div className="p-4 rounded-2xl bg-[#A3AE9A] text-[#F7F1E6]">
            <Award className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider">Average Order Value (AOV)</span>
            <p className="text-2xl font-bold text-[#4E5A46]">₹{data.averageOrderValue.toFixed(2)}</p>
          </div>
        </div>

        {/* Growth */}
        <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft flex items-center gap-5">
          <div className="p-4 rounded-2xl bg-[#E8C5C0] text-[#4E5A46]">
            <Percent className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider">Monthly Growth Rate</span>
            <p className={`text-2xl font-bold ${data.monthlyGrowth >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {data.monthlyGrowth >= 0 ? '+' : ''}{data.monthlyGrowth.toFixed(1)}%
            </p>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        
        {/* Sales Progression */}
        <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#4E5A46]">Monthly Gross Revenue Progression</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthlySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSalesAnalytics" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C26D53" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C26D53" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#4E5A46/10" vertical={false} />
                <XAxis dataKey="name" stroke="#4E5A46/60" />
                <YAxis stroke="#4E5A46/60" />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Area type="monotone" dataKey="Sales" stroke="#C26D53" strokeWidth={2} fillOpacity={1} fill="url(#colorSalesAnalytics)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share */}
        <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 shadow-soft space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#4E5A46]">Category Wise Revenue</h3>
          <div className="h-64 w-full flex justify-center items-center relative">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={charts.categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
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
            <div className="flex flex-wrap justify-center gap-3 text-[9px] font-bold text-[#4E5A46]/80 mt-1">
              {charts.categoryStats.map((entry, idx) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Top Sellers & Categories Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        
        {/* Top Selling Products */}
        <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#4E5A46] border-b border-[#4E5A46]/10 pb-4">
            Top Selling Recipes
          </h3>
          <div className="divide-y divide-[#4E5A46]/5">
            {data.topSellingProducts.map((p, idx) => (
              <div key={idx} className="py-3.5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-[#C26D53]">#{idx + 1}</span>
                  <span className="font-serif font-bold text-sm text-[#4E5A46]">{p.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#4E5A46]">{p.sales} Sold</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Categories */}
        <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#4E5A46] border-b border-[#4E5A46]/10 pb-4">
            Best Menu Segments
          </h3>
          <div className="divide-y divide-[#4E5A46]/5">
            {data.bestCategories.map((c, idx) => (
              <div key={idx} className="py-3.5 flex justify-between items-center">
                <span className="font-serif font-bold text-sm text-[#4E5A46]">{c.category}</span>
                <div className="text-right flex items-center gap-6">
                  <div>
                    <span className="text-[10px] text-[#4E5A46]/60 block font-semibold">Share Revenue</span>
                    <span className="font-bold text-[#C26D53]">₹{c.revenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-16">
                    <span className="text-[10px] text-[#4E5A46]/60 block font-semibold">Growth</span>
                    <span className={`font-bold ${c.growth >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                      {c.growth >= 0 ? '+' : ''}{c.growth}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default SalesAnalytics;
