const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
// const auth = require('../middleware/auth');

// Apply authentication to all routes
// router.use(auth);

// POST /api/jobs 
router.post('/', async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      // Ensure extractedFrom is properly set
      extractedFrom: req.body.extractedFrom || {
        platform: 'unknown',
        url: req.body.url || 'unknown'
      }
    };

    const job = new Job(jobData);
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Job saved successfully',
      data: job
    });
  } catch (error) {
    console.error('Error saving job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save job',
      details: error.message
    });
  }
});

// GET /api/jobs 
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: jobs,
      count: jobs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch jobs'
    });
  }
});

module.exports = router;