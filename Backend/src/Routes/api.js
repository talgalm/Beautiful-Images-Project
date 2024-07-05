const express = require('express');
const authRoutes = require('./authRoutes');
const ratingRoutes = require('./ratingRoutes');
const imageRoutes = require('./imageRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

// Mount authentication routes
router.use('/auth', authRoutes);

// Mount rating routes
router.use('/rate', ratingRoutes);

// Mount image routes
router.use('/images', imageRoutes);

// Mount admin routes
router.use('/admin', adminRoutes);

module.exports = router;
