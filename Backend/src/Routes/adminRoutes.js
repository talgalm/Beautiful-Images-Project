const express = require('express');
const router = express.Router();

const AdminController = require('../Controllers/adminController');

router.post('/login', AdminController.adminLogin);
router.post('/allRatings', AdminController.allRatings);
router.post('/userRatings', AdminController.userRatings);
router.post('/imageRatings', AdminController.imageRatings);
router.post('/images', AdminController.getAllImages);

router.post('/generatePdf', AdminController.generateAndFetchPdfReport);
router.post('/generateCsvRatings', AdminController.generateAndFetchCsvRatings);
router.post('/generateCsvImages', AdminController.generateAndFetchCsvImages);
router.post('/generateCsvUsers', AdminController.generateAndFetchCsvUsers);
router.post('/participantsData',AdminController.participantsData);

module.exports = router;
