const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getChartStats,
  getDetailedStats
} = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/auth');

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/charts', protect, admin, getChartStats);
router.get('/detailed', protect, admin, getDetailedStats);

module.exports = router;
