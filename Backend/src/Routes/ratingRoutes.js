const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

router.post('/', ratingController.addRating);

module.exports = router;
