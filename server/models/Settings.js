const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  cafeName: {
    type: String,
    default: 'Café Barista'
  },
  logo: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    default: 'info@cafebarista.com'
  },
  phone: {
    type: String,
    default: '+91 8763456297'
  },
  deliveryCharges: {
    type: Number,
    default: 50
  },
  gstPercentage: {
    type: Number,
    default: 5
  },
  openingHours: {
    type: String,
    default: '8:00 AM - 10:00 PM'
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
