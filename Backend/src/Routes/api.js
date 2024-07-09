const express = require('express');
const authRoutes = require('./authRoutes');
const ratingRoutes = require('./ratingRoutes');
const imageRoutes = require('./imageRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/rate', ratingRoutes);
router.use('/images', imageRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
