const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Global search across products, orders, and customers
// @route   GET /api/search/global
// @access  Private/Admin
exports.globalSearch = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please provide a search query' });
    }

    // 1. Search Products
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);

    // 2. Search Customers
    const customers = await User.find({
      role: 'user',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).limit(10).select('-password');

    // 3. Search Orders
    // Check if query is a valid MongoDB ObjectId or hex string
    let orderQuery = {};
    if (query.match(/^[0-9a-fA-F]{24}$/)) {
      orderQuery = { _id: query };
    } else {
      // Find users matching query first to find their orders
      const matchingUsers = await User.find({
        name: { $regex: query, $options: 'i' }
      });
      const userIds = matchingUsers.map(u => u._id);
      
      orderQuery = {
        $or: [
          { user: { $in: userIds } },
          { 'items.name': { $regex: query, $options: 'i' } },
          { 'shippingAddress.phone': { $regex: query, $options: 'i' } }
        ]
      };
    }

    const orders = await Order.find(orderQuery)
      .populate('user', 'name email')
      .limit(10)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        products,
        customers,
        orders
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
