const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');
const auth = require('../middleware/auth');

// Apply authentication to all routes (commented for now)
// router.use(auth);

// PUT /api/leads/:id/status - Update lead status
router.put('/leads/:id/status', statusController.updateLeadStatus);

// PUT /api/jobs/:id/status - Update job status  
router.put('/jobs/:id/status', statusController.updateJobStatus);

// GET /api/leads - Get all leads (with optional status filter)
router.get('/leads', statusController.getAllLeads);

// GET /api/jobs - Get all jobs (with optional status filter)
router.get('/jobs', statusController.getAllJobs);

module.exports = router;