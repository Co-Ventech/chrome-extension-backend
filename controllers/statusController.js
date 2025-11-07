const Lead = require('../models/Lead');
const Job = require('../models/Job');

const statusController = {
    // Update lead status
    updateLeadStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            // Validate status
            const validStatuses = ["not_engaged", "applied", "engaged", "interview", "offer", "rejected", "onboard"];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
                });
            }

            // Find and update lead
            const lead = await Lead.findById(id);
            if (!lead) {
                return res.status(404).json({
                    success: false,
                    error: 'Lead not found'
                });
            }

            await lead.updateStatus(status);

            res.json({
                success: true,
                message: `Lead status updated to ${status}`,
                data: {
                    _id: lead._id,
                    status: lead.user.status,
                    updatedAt: lead.updatedAt
                }
            });

        } catch (error) {
            console.error('Error updating lead status:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update lead status',
                details: error.message
            });
        }
    },

    // Update job status
    updateJobStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            // Validate status
            const validStatuses = ["not_engaged", "applied", "engaged", "interview", "offer", "rejected", "onboard"];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
                });
            }

            // Find and update job
            const job = await Job.findById(id);
            if (!job) {
                return res.status(404).json({
                    success: false,
                    error: 'Job not found'
                });
            }

            await job.updateStatus(status);

            res.json({
                success: true,
                message: `Job status updated to ${status}`,
                data: {
                    _id: job._id,
                    status: job.job.status,
                    updatedAt: job.updatedAt
                }
            });

        } catch (error) {
            console.error('Error updating job status:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update job status',
                details: error.message
            });
        }
    },

    // Get all leads with optional status filter
    getAllLeads: async (req, res) => {
        try {
            const { status } = req.query;
            let filter = {};
            
            // Add status filter if provided
            if (status) {
                const validStatuses = ["not_engaged", "applied", "engaged", "interview", "offer", "rejected", "onboard"];
                if (!validStatuses.includes(status)) {
                    return res.status(400).json({
                        success: false,
                        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
                    });
                }
                filter['user.status'] = status;
            }

            const leads = await Lead.find(filter).sort({ createdAt: -1 });
            
            res.json({
                success: true,
                data: leads,
                count: leads.length,
                filters: status ? { status } : {}
            });

        } catch (error) {
            console.error('Error fetching leads:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch leads'
            });
        }
    },

    // Get all jobs with optional status filter  
    getAllJobs: async (req, res) => {
        try {
            const { status } = req.query;
            let filter = {};
            
            // Add status filter if provided
            if (status) {
                const validStatuses = ["not_engaged", "applied", "engaged", "interview", "offer", "rejected", "onboard"];
                if (!validStatuses.includes(status)) {
                    return res.status(400).json({
                        success: false,
                        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
                    });
                }
                filter['job.status'] = status;
            }

            const jobs = await Job.find(filter).sort({ createdAt: -1 });
            
            res.json({
                success: true,
                data: jobs,
                count: jobs.length,
                filters: status ? { status } : {}
            });

        } catch (error) {
            console.error('Error fetching jobs:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch jobs'
            });
        }
    }
};

module.exports = statusController;