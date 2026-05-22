const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price must be greater than or equal to 0']
  },
  rating: {
    type: Number,
    default: 4.5,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: [
      'Cakes',
      'Pastries',
      'Cupcakes',
      'Donuts',
      'Cookies',
      'Sandwiches',
      'Fries',
      'Pasta',
      'Pizza',
      'Burgers',
      'Noodles',
      'Quick Bites',
      'Coffee',
      'Tea',
      'Cold beverages',
      'Cold Beverages',
      'Desserts',
      'Bakery items'
    ]
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description']
  },
  image: {
    type: String,
    required: [true, 'Please provide a product image URL']
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
