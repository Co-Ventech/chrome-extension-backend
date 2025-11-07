const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
// const auth = require('../middleware/auth');

// Apply authentication to all routes
// router.use(auth);

// POST /api/leads
router.post('/', async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      // Ensure extractedFrom is properly set
      extractedFrom: req.body.extractedFrom || {
        platform: 'unknown',
        url: req.body.url || 'unknown'
      }
    };

    const lead = new Lead(leadData);
    await lead.save();

    res.status(201).json({
      success: true,
      message: 'Lead saved successfully',
      data: lead
    });
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save lead',
      details: error.message
    });
  }
});

// GET /api/leads 
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: leads,
      count: leads.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leads'
    });
  }
});

module.exports = router;