const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

// Define routes for authentication

router.post('/fetchImages', imageController.fetchImages);

router.post('/fetchImage', imageController.fetchImage);

router.post('/fetchCategories', imageController.fetchCategories);

router.post('/createImage', imageController.createImage);


module.exports = router;
