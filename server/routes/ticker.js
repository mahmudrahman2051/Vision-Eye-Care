const express = require('express');
const router = express.Router();
const tickerController = require('../controllers/tickerController');

// Public route to fetch active marquee ticker settings
router.get('/', tickerController.getTickerSettings);

module.exports = router;
