const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get all customers with spending & order counts
// @route   GET /api/customers
// @access  Private/Admin
exports.getCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    // Search query for name or email
    let query = { role: 'user' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const totalCustomers = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Compute stats for each customer
    const customersData = [];
    for (const u of users) {
      const userOrders = await Order.find({ user: u._id, status: { $ne: 'Cancelled' } });
      const ordersCount = userOrders.length;
      const totalSpent = userOrders.reduce((sum, order) => sum + order.totalAmount, 0);

      // Get phone number from last shipping address
      let phone = 'N/A';
      if (userOrders.length > 0) {
        phone = userOrders[0].shippingAddress?.phone || 'N/A';
      }

      customersData.push({
        _id: u._id,
        name: u.name,
        email: u.email,
        phone,
        ordersCount,
        totalSpent,
        joinedDate: u.createdAt
      });
    }

    res.json({
      success: true,
      data: customersData,
      pagination: {
        page,
        limit,
        totalCustomers,
        totalPages: Math.ceil(totalCustomers / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
