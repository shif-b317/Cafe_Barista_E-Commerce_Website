const express = require('express');
const router = express.Router();
const {
  getReviews,
  getProductReviews,
  createReview,
  updateReviewStatus,
  deleteReview
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, admin, getReviews)
  .post(protect, createReview);

router.route('/product/:productId')
  .get(getProductReviews);

router.route('/:id')
  .delete(protect, admin, deleteReview);

router.route('/:id/status')
  .put(protect, admin, updateReviewStatus);

module.exports = router;
