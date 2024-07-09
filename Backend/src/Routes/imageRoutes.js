const express = require('express');
const router = express.Router();
const imageController = require('../Controllers/imageController');

// Define routes for images
router.post('/fetchImages', imageController.fetchImages);
router.post('/fetchImage', imageController.fetchImage);
router.post('/fetchCategories', imageController.fetchCategories);
router.post('/createImage', imageController.createImage);


module.exports = router;
