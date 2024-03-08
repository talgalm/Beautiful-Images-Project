const express = require('express');
const router = express.Router();
const imageController = require('../Controllers/imageController');

// Define routes for authentication
router.post('/getAll', imageController.getAll);

router.post('/get', imageController.get);

router.post('/fetchImages', imageController.fetchImages);

router.post('/fetchImage', imageController.fetchImage);

router.post('/fetchSessionImages', imageController.fetchSessionImages);

module.exports = router;
