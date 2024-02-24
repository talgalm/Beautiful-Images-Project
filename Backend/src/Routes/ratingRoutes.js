const express = require('express');
const router = express.Router();
const ratingController = require('../Controllers/ratingController');

router.post('/rateImage', ratingController.addRating);

module.exports = router;
