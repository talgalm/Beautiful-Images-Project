const express = require('express');
const authRoutes = require('./authRoutes');
const ratingRoutes = require('./ratingRoutes');

const router = express.Router();

// Mount authentication routes
router.use('/auth', authRoutes);

// Mount rating routes
router.use('/rate', ratingRoutes);

module.exports = router;
