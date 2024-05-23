const express = require('express');
const router = express.Router();

const AdminController = require('../Controllers/adminController');

router.post('/login', AdminController.adminLogin);
router.post('/allRatings', AdminController.allRatings);
router.post('/userRatings', AdminController.userRatings);
router.post('/imageRatings', AdminController.imageRatings);


module.exports = router;
