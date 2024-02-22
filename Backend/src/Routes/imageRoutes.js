const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

// Define routes for authentication
router.post('/getAll', imageController.getAll);

module.exports = router;
