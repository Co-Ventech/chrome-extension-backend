const express = require('express');
const router = express.Router();
const extractedDataController = require('../controllers/extractedDataController');
const auth = require('../middleware/auth');

// Apply authentication to all routes
router.use(auth);

// POST /api/extracted-data - Save data from Chrome extension
router.post('/', extractedDataController.saveExtractedData);

// GET /api/extracted-data - Get all extracted data for user
router.get('/', extractedDataController.getAllExtractedData);

// GET /api/extracted-data/stats - Get extraction statistics
router.get('/stats', extractedDataController.getExtractionStats);

module.exports = router;