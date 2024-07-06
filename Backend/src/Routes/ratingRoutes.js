const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticateToken } = require('../tokens/tokens');

// Define routes for ratings
router.post('/rateImage', authenticateToken, ratingController.changeRating);
router.post('/save', authenticateToken, ratingController.saveRatings);

module.exports = router;
