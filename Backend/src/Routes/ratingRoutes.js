const express = require('express');
const router = express.Router();
const ratingController = require('../Controllers/ratingController');
const { authenticateToken } = require('../Tokens/tokens');

router.post('/rateImage', authenticateToken, ratingController.addRating);
router.post('/save', authenticateToken, ratingController.saveRatings);

module.exports = router;
