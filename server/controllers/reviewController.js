const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate('product', 'name category image')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get product reviews
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, status: 'Approved' })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide all review details' });
    }

    const review = new Review({
      product: productId,
      user: req.user._id,
      rating,
      comment
    });

    const createdReview = await review.save();

    // Recalculate average rating for the product
    const reviews = await Review.find({ product: productId, status: 'Approved' });
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
      await Product.findByIdAndUpdate(productId, { rating: Number(avgRating.toFixed(1)) });
    }

    res.status(201).json({ success: true, data: createdReview });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update review status (Approve / Hide)
// @route   PUT /api/reviews/:id/status
// @access  Private/Admin
exports.updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Approved', 'Hidden'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.status = status;
    await review.save();

    // Recalculate average rating for the product
    const reviews = await Review.find({ product: review.product, status: 'Approved' });
    let avgRating = 4.5;
    if (reviews.length > 0) {
      avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
    }
    await Product.findByIdAndUpdate(review.product, { rating: Number(avgRating.toFixed(1)) });

    res.json({ success: true, data: review });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate average rating for the product
    const reviews = await Review.find({ product: productId, status: 'Approved' });
    let avgRating = 4.5;
    if (reviews.length > 0) {
      avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
    }
    await Product.findByIdAndUpdate(productId, { rating: Number(avgRating.toFixed(1)) });

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
