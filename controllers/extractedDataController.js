const ExtractedData = require('../models/ExtractedData');

// Save extracted data from Chrome extension
exports.saveExtractedData = async (req, res) => {
    try {
        console.log('📥 Received data from extension:', {
            type: req.body.type,
            platform: req.body.platform,
            url: req.body.url
        });

        // Create new extracted data document
        const extractedData = new ExtractedData({
            type: req.body.type,
            platform: req.body.platform || 'linkedin',
            url: req.body.url,
            extractedFields: req.body, // Store all data in extractedFields
            extractedBy: req.user._id.toString(),
            metadata: {
                extensionVersion: req.body.extractionMetadata?.extractorVersion || '2.0.0',
                dataVersion: '2.0'
            }
        });

        await extractedData.save();
        
        console.log('✅ Data saved successfully with ID:', extractedData._id);
        
        res.status(201).json({
            success: true,
            message: 'Data saved successfully',
            data: extractedData.getSummary()
        });
    } catch (error) {
        console.error('❌ Save error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save data',
            details: error.message
        });
    }
};

// Get all extracted data for user
exports.getAllExtractedData = async (req, res) => {
    try {
        const { type, platform, page = 1, limit = 50 } = req.query;
        
        const query = { extractedBy: req.user._id.toString() };
        if (type) query.type = type;
        if (platform) query.platform = platform;

        const data = await ExtractedData.find(query)
            .sort({ extractedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await ExtractedData.countDocuments(query);

        res.json({
            success: true,
            data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('❌ Get data error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch data'
        });
    }
};

// Get extraction statistics
exports.getExtractionStats = async (req, res) => {
    try {
        const stats = await ExtractedData.aggregate([
            { 
                $match: { 
                    extractedBy: req.user._id.toString() 
                } 
            },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                    lastExtracted: { $max: '$extractedAt' }
                }
            }
        ]);

        const summary = {
            totalProfiles: 0,
            totalCompanies: 0,
            totalJobs: 0,
            totalRecords: 0
        };

        stats.forEach(stat => {
            summary.totalRecords += stat.count;
            if (stat._id === 'linkedin_profile') summary.totalProfiles = stat.count;
            if (stat._id === 'linkedin_company') summary.totalCompanies = stat.count;
            if (stat._id === 'linkedin_job') summary.totalJobs = stat.count;
        });

        res.json({
            success: true,
            data: {
                summary,
                byType: stats,
                generatedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('❌ Stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get statistics'
        });
    }
};