const express = require('express');
const router = express.Router();
const { getCustomers } = require('../controllers/customerController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, admin, getCustomers);

module.exports = router;
