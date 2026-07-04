import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Save, Loader2, Settings, Mail, Phone, Clock, FileText, Truck, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Settings states
  const [cafeName, setCafeName] = useState('Café Barista');
  const [logo, setLogo] = useState('');
  const [contactEmail, setContactEmail] = useState('info@cafebarista.com');
  const [phone, setPhone] = useState('+91 8763456297');
  const [deliveryCharges, setDeliveryCharges] = useState('50');
  const [gstPercentage, setGstPercentage] = useState('5');
  const [openingHours, setOpeningHours] = useState('8:00 AM - 10:00 PM');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.success && res.data.data) {
          const s = res.data.data;
          setCafeName(s.cafeName || 'Café Barista');
          setLogo(s.logo || '');
          setContactEmail(s.contactEmail || 'info@cafebarista.com');
          setPhone(s.phone || '+91 8763456297');
          setDeliveryCharges(s.deliveryCharges.toString() || '50');
          setGstPercentage(s.gstPercentage.toString() || '5');
          setOpeningHours(s.openingHours || '8:00 AM - 10:00 PM');
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSaving(true);

    const payload = {
      cafeName,
      logo,
      contactEmail,
      phone,
      deliveryCharges: parseFloat(deliveryCharges) || 0,
      gstPercentage: parseFloat(gstPercentage) || 0,
      openingHours
    };

    try {
      const res = await api.put('/settings', payload);
      if (res.data.success) {
        setSuccessMsg('Cafe configuration settings updated successfully!');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-8 h-8 text-[#C26D53] animate-spin" />
        <span className="text-sm text-[#4E5A46]/60 font-serif italic">Loading configurations...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-8 space-y-8">
      {/* Title Panel */}
      <div>
        <span className="text-2xs font-extrabold tracking-widest text-[#C26D53] uppercase font-sans">Configuration</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4E5A46] mt-0.5">Settings</h1>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-3.5 rounded-2xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-3.5 rounded-2xl text-xs font-bold"
        >
          {successMsg}
        </motion.div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-[#F7F1E6] border border-[#4E5A46]/10 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
        
        {/* Cafe Information Header */}
        <div className="flex items-center gap-2.5 border-b border-[#4E5A46]/10 pb-4">
          <Settings className="w-5 h-5 text-[#C26D53]" />
          <h3 className="font-serif text-lg font-bold text-[#4E5A46]">Cafe Parameters</h3>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Cafe Name */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider pl-1">Cafe Name *</label>
            <input
              type="text"
              required
              value={cafeName}
              onChange={(e) => setCafeName(e.target.value)}
              placeholder="e.g. Café Barista"
              className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 px-4 text-xs text-[#4E5A46] focus:outline-none focus:border-[#C26D53]"
            />
          </div>

          {/* Logo URL */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider pl-1">Logo URL Link</label>
            <input
              type="url"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 px-4 text-xs text-[#4E5A46] focus:outline-none focus:border-[#C26D53]"
            />
          </div>

          {/* Contact Email */}
          <div className="space-y-1.5">
            <label className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider pl-1">Contact Email *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="info@cafebarista.com"
                className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 pl-10 pr-4 text-xs text-[#4E5A46] focus:outline-none focus:border-[#C26D53]"
              />
              <Mail className="w-4.5 h-4.5 text-[#4E5A46]/50 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider pl-1">Contact Number *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 8763456297"
                className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 pl-10 pr-4 text-xs text-[#4E5A46] focus:outline-none focus:border-[#C26D53]"
              />
              <Phone className="w-4.5 h-4.5 text-[#4E5A46]/50 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Delivery Fee */}
          <div className="space-y-1.5">
            <label className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider pl-1">Delivery Charges (₹) *</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                required
                value={deliveryCharges}
                onChange={(e) => setDeliveryCharges(e.target.value)}
                placeholder="50"
                className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 pl-10 pr-4 text-xs text-[#4E5A46] focus:outline-none focus:border-[#C26D53] font-semibold"
              />
              <Truck className="w-4.5 h-4.5 text-[#4E5A46]/50 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* GST % */}
          <div className="space-y-1.5">
            <label className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider pl-1">GST Tax Rate (%) *</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                required
                value={gstPercentage}
                onChange={(e) => setGstPercentage(e.target.value)}
                placeholder="5"
                className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 pl-10 pr-4 text-xs text-[#4E5A46] focus:outline-none focus:border-[#C26D53] font-semibold"
              />
              <FileText className="w-4.5 h-4.5 text-[#4E5A46]/50 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-2xs font-extrabold text-[#4E5A46]/60 uppercase tracking-wider pl-1">Store Opening Hours *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="e.g. 8:00 AM - 10:00 PM"
                className="w-full bg-[#E8C5C0]/15 border border-[#4E5A46]/10 rounded-2xl py-3 pl-10 pr-4 text-xs text-[#4E5A46] focus:outline-none focus:border-[#C26D53]"
              />
              <Clock className="w-4.5 h-4.5 text-[#4E5A46]/50 absolute left-3.5 top-3.5" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="border-t border-[#4E5A46]/10 pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#C26D53] hover:bg-[#C26D53]/95 text-[#F7F1E6] font-semibold px-8 py-3 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all duration-200"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default SettingsPage;
