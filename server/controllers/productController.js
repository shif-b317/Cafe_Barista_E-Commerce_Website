const Product = require('../models/Product');

// @desc    Get all products (with optional search, category filter)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = {};

    // Apply category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Apply search filter (name or description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let productsQuery = Product.find(query);

    // Apply sorting
    if (sort) {
      if (sort === 'price_asc') {
        productsQuery = productsQuery.sort({ price: 1 });
      } else if (sort === 'price_desc') {
        productsQuery = productsQuery.sort({ price: -1 });
      } else if (sort === 'rating') {
        productsQuery = productsQuery.sort({ rating: -1 });
      } else {
        productsQuery = productsQuery.sort({ createdAt: -1 });
      }
    } else {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }

    const products = await productsQuery;

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const { name, price, rating, category, description, image, isFeatured, isTrending, isBestSeller } = req.body;

    const product = new Product({
      name,
      price,
      rating: rating || 4.5,
      category,
      description,
      image,
      isFeatured: isFeatured || false,
      isTrending: isTrending || false,
      isBestSeller: isBestSeller || false
    });

    const createdProduct = await product.save();
    res.status(201).json({ success: true, data: createdProduct });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, rating, category, description, image, isFeatured, isTrending, isBestSeller } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.rating = rating !== undefined ? rating : product.rating;
      product.category = category || product.category;
      product.description = description || product.description;
      product.image = image || product.image;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isTrending = isTrending !== undefined ? isTrending : product.isTrending;
      product.isBestSeller = isBestSeller !== undefined ? isBestSeller : product.isBestSeller;

      const updatedProduct = await product.save();
      res.json({ success: true, data: updatedProduct });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Product removed successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
