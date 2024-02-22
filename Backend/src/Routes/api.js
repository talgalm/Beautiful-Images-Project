const express = require('express');
const authRoutes = require('./authRoutes');
const ratingRoutes = require('./ratingRoutes');
const imageRoutes = require('./imageRoutes');


const router = express.Router();

// Mount authentication routes
router.use('/auth', authRoutes);

// Mount rating routes
router.use('/rate', ratingRoutes);

// Mount image routes
router.use('/images', imageRoutes);

module.exports = router;
