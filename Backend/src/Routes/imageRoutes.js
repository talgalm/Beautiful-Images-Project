const express = require('express');
const router = express.Router();
const imageController = require('../Controllers/imageController');

// Define routes for authentication

router.post('/fetchImages', imageController.fetchImages);

router.post('/fetchImage', imageController.fetchImage);


module.exports = router;
