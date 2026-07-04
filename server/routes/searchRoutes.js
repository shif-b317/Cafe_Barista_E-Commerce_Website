const express = require('express');
const router = express.Router();
const { globalSearch } = require('../controllers/searchController');
const { protect, admin } = require('../middleware/auth');

router.get('/global', protect, admin, globalSearch);

module.exports = router;
