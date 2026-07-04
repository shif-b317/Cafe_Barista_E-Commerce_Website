import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Users,
  FolderTree,
  Star,
  Ticket,
  TrendingUp,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronRight,
  Clock
} from 'lucide-react';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Close mobile menu on navigate
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch dynamic alert/notifications (e.g. low stock products and recent orders)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders')
        ]);

        const lowStock = productsRes.data.data.filter(p => p.stock < 10);
        const recentOrders = ordersRes.data.data.slice(0, 5);

        const list = [];
        lowStock.forEach(p => {
          list.push({
            id: `stock-${p._id}`,
            title: 'Low Stock Alert',
            message: `${p.name} has only ${p.stock} items remaining!`,
            time: 'Just now',
            type: 'warning'
          });
        });

        recentOrders.forEach(o => {
          list.push({
            id: `order-${o._id}`,
            title: 'New Order Placed',
            message: `Order of ₹${o.totalAmount.toFixed(2)} received from ${o.user?.name || 'Guest'}`,
            time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'info'
          });
        });

        setNotifications(list);
        setUnreadNotifications(list.length);
      } catch (err) {
        console.error('Error fetching admin notifications:', err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { name: 'Sales Analytics', path: '/admin/analytics', icon: TrendingUp },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const getPageTitle = () => {
    const matched = navItems.find(item => location.pathname.startsWith(item.path));
    return matched ? matched.name : 'Management Console';
  };

  const sidebarVariants = {
    open: { width: '260px', transition: { duration: 0.3 } },
    collapsed: { width: '80px', transition: { duration: 0.3 } }
  };

  return (
    <div className="flex h-screen bg-[#F7F1E6] overflow-hidden text-[#4E5A46] font-sans">
      
      {/* 1. DESKTOP SIDEBAR */}
      <motion.div
        className="hidden md:flex flex-col bg-[#E8C5C0]/30 border-r border-[#4E5A46]/10 relative h-full shrink-0"
        animate={sidebarOpen ? 'open' : 'collapsed'}
        variants={sidebarVariants}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#4E5A46]/10">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C26D53] flex items-center justify-center text-[#F7F1E6] font-serif text-lg font-bold">
              B
            </div>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-serif text-lg font-bold text-[#4E5A46] tracking-tight"
              >
                Barista <span className="text-[#C26D53] font-sans text-xs uppercase font-extrabold ml-1">Admin</span>
              </motion.span>
            )}
          </Link>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#C26D53] text-[#F7F1E6] shadow-sm'
                    : 'text-[#4E5A46]/80 hover:bg-[#E8C5C0]/50 hover:text-[#4E5A46]'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span className="whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-[#4E5A46]/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-sm font-semibold text-[#4E5A46]/80 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Collapsible toggle handler button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3.5 top-20 bg-[#F7F1E6] border border-[#4E5A46]/10 hover:border-[#4E5A46]/20 p-1.5 rounded-full shadow-sm"
        >
          <ChevronRight className={`w-4 h-4 text-[#4E5A46]/70 transition-transform duration-200 ${sidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </motion.div>

      {/* 2. MOBILE MENU DRAWER OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/45"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-72 bg-[#F7F1E6] h-full flex flex-col z-10 border-r border-[#4E5A46]/15 shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#4E5A46]/10">
                <Link to="/admin/dashboard" className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#C26D53] flex items-center justify-center text-[#F7F1E6] font-serif text-lg font-bold">
                    B
                  </div>
                  <span className="font-serif text-lg font-bold text-[#4E5A46]">Barista Admin</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#4E5A46] hover:bg-[#E8C5C0]/35 rounded-full"
                >
                  <X className="w-5.5 h-5.5" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-[#C26D53] text-[#F7F1E6]'
                          : 'text-[#4E5A46]/80 hover:bg-[#E8C5C0]/40'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-6 border-t border-[#4E5A46]/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-3 text-sm font-semibold text-[#4E5A46]/80 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Navbar */}
        <header className="bg-[#F7F1E6] border-b border-[#4E5A46]/10 h-16 shrink-0 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 md:hidden text-[#4E5A46] hover:bg-[#E8C5C0]/40 rounded-full transition-colors"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            <h2 className="font-serif text-lg font-bold text-[#4E5A46] hidden sm:block">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUnreadNotifications(0);
                }}
                className="p-2.5 text-[#4E5A46] hover:bg-[#E8C5C0]/40 rounded-full transition-colors relative"
              >
                <Bell className="w-5.5 h-5.5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#C26D53] text-[#F7F1E6] text-[10px] font-bold flex items-center justify-center rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    {/* Backdrop to close */}
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-[#F7F1E6] border border-[#4E5A46]/15 rounded-3xl shadow-xl z-50 py-4 max-h-[420px] overflow-y-auto"
                    >
                      <div className="flex items-center justify-between px-6 pb-3 border-b border-[#4E5A46]/10">
                        <span className="font-serif font-bold text-[#4E5A46]">Alert Center</span>
                        <span className="text-2xs uppercase tracking-wider text-[#C26D53] font-bold">{notifications.length} Alerts</span>
                      </div>
                      
                      <div className="divide-y divide-[#4E5A46]/5 px-2">
                        {notifications.length === 0 ? (
                          <div className="text-center py-10 text-xs text-[#4E5A46]/60 italic font-light">
                            No alerts in queue. Kitchen is fine!
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div key={notif.id} className="p-4 flex gap-3 hover:bg-[#E8C5C0]/15 rounded-2xl transition-colors">
                              <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                                notif.type === 'warning' ? 'bg-[#C26D53]' : 'bg-[#8FA1B2]'
                              }`} />
                              <div className="space-y-0.5">
                                <h5 className="text-xs font-bold text-[#4E5A46]">{notif.title}</h5>
                                <p className="text-[11px] text-[#4E5A46]/80 font-medium leading-relaxed">{notif.message}</p>
                                <span className="text-[9px] text-[#4E5A46]/50 block pt-1">{notif.time}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar / Quick Link */}
            <div className="flex items-center gap-3 pl-3 border-l border-[#4E5A46]/10">
              <div className="w-8.5 h-8.5 rounded-full bg-[#E8C5C0] text-[#4E5A46] font-extrabold flex items-center justify-center border border-[#4E5A46]/15">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-[#4E5A46] leading-none">{user?.name || 'Administrator'}</p>
                <span className="text-[10px] text-[#4E5A46]/60">Cafe Owner</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area Outlet */}
        <main className="flex-grow overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;
