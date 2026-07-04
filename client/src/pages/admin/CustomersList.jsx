import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Loader2, Search, User, Mail, Calendar, Phone, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalCustomers: 0 });

  // Profile modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchCustomers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/customers?page=${page}&limit=10&search=${search}`);
      if (res.data.success) {
        setCustomers(res.data.data);
        setPagination(res.data.pagination);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(1);
  }, [search]);

  const handlePageChange = (page) => {
    fetchCustomers(page);
  };

  const handleOpenProfile = (cust) => {
    setSelectedUser(cust);
    setModalOpen(true);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 min-h-screen relative">
      
      {/* Header Panel */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-2xs font-extrabold tracking-widest text-[#C26D53] uppercase font-sans">Directory</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4E5A46] mt-0.5">Customers Registry</h1>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-5 flex justify-between items-center shadow-soft">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#E8C5C0]/15 focus:bg-[#E8C5C0]/25 border border-[#4E5A46]/10 focus:border-[#C26D53] rounded-2xl text-xs outline-none placeholder-[#4E5A46]/40 transition-all"
          />
          <Search className="w-4.5 h-4.5 text-[#4E5A46]/45 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Main Board */}
      <div className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 sm:p-8 shadow-soft">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-14 space-y-4">
            <Loader2 className="w-8 h-8 text-[#C26D53] animate-spin" />
            <span className="text-sm text-[#4E5A46]/60 font-serif italic">Loading customers list...</span>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12 text-[#4E5A46]/60 italic font-light text-xs">
            No customers registered yet.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#4E5A46]/10 text-[#4E5A46]/60 font-extrabold uppercase tracking-wider">
                    <th className="pb-3.5 pl-2">Customer Profile</th>
                    <th className="pb-3.5">Contact No</th>
                    <th className="pb-3.5">Orders Frequency</th>
                    <th className="pb-3.5">Total Spent</th>
                    <th className="pb-3.5">Joined Date</th>
                    <th className="pb-3.5 pr-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4E5A46]/5">
                  {customers.map((cust) => (
                    <tr key={cust._id} className="hover:bg-[#E8C5C0]/10 transition-colors">
                      
                      {/* Profile details */}
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#E8C5C0] text-[#4E5A46] font-extrabold flex items-center justify-center border border-[#4E5A46]/15">
                            {cust.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#4E5A46]">{cust.name}</p>
                            <span className="text-[10px] text-[#4E5A46]/60 font-semibold">{cust.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 text-[#4E5A46]/95 font-semibold">
                        {cust.phone}
                      </td>

                      {/* Orders count */}
                      <td className="py-4 font-bold text-[#4E5A46]">
                        {cust.ordersCount} Orders
                      </td>

                      {/* Spent */}
                      <td className="py-4 text-[#C26D53] font-bold text-sm">
                        ₹{cust.totalSpent.toFixed(2)}
                      </td>

                      {/* Joined */}
                      <td className="py-4 text-[#4E5A46]/75 font-medium">
                        {new Date(cust.joinedDate).toLocaleDateString()}
                      </td>

                      {/* Action */}
                      <td className="py-4 text-right pr-2">
                        <button
                          onClick={() => handleOpenProfile(cust)}
                          className="inline-flex items-center gap-1 bg-[#4E5A46] hover:bg-[#4E5A46]/95 text-[#F7F1E6] px-4 py-2 rounded-full font-bold transition-all shadow-sm"
                        >
                          View Profile
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2.5 pt-4 border-t border-[#4E5A46]/10">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3.5 py-2 bg-[#E8C5C0]/30 hover:bg-[#E8C5C0]/50 disabled:opacity-40 rounded-xl font-bold transition-all"
                >
                  Prev
                </button>
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-9 h-9 rounded-xl font-bold transition-all ${
                      currentPage === i + 1 ? 'bg-[#C26D53] text-[#F7F1E6]' : 'bg-[#E8C5C0]/30 hover:bg-[#E8C5C0]/50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="px-3.5 py-2 bg-[#E8C5C0]/30 hover:bg-[#E8C5C0]/50 disabled:opacity-40 rounded-xl font-bold transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customer Profile Modal */}
      <AnimatePresence>
        {modalOpen && selectedUser && (
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
              className="bg-[#F7F1E6] border border-[#4E5A46]/15 rounded-3xl p-6 sm:p-8 max-w-sm w-full relative z-10 space-y-6 shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#E8C5C0] text-[#4E5A46] font-extrabold flex items-center justify-center border border-[#4E5A46]/15 mx-auto text-xl shadow-sm">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-[#4E5A46]">{selectedUser.name}</h3>
                <span className="text-2xs uppercase tracking-wider font-extrabold text-[#C26D53]">Registered Patron</span>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-[#4E5A46]/10 py-5 text-left text-xs font-semibold">
                <div className="space-y-1">
                  <span className="text-[#4E5A46]/60 text-[9px] uppercase tracking-wider block">Orders Frequency</span>
                  <p className="text-sm font-bold text-[#4E5A46] flex items-center gap-1.5">
                    <Award className="w-4.5 h-4.5 text-[#C26D53]" />
                    {selectedUser.ordersCount} Purchases
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[#4E5A46]/60 text-[9px] uppercase tracking-wider block">Total Spent</span>
                  <p className="text-sm font-bold text-[#C26D53]">₹{selectedUser.totalSpent.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Meta details list */}
              <div className="space-y-3.5 text-left text-xs font-medium text-[#4E5A46]/85">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#4E5A46]/50" />
                  <span>{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#4E5A46]/50" />
                  <span>{selectedUser.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#4E5A46]/50" />
                  <span>Joined on {new Date(selectedUser.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="w-full py-3 bg-[#4E5A46] hover:bg-[#4E5A46]/95 text-[#F7F1E6] rounded-full font-bold text-xs transition-colors shadow-sm"
              >
                Close Profile
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CustomersList;
