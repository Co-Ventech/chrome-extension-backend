const mongoose = require('mongoose');

const ExtractedDataSchema = new mongoose.Schema({
    // Data identification
    type: { 
        type: String, 
        required: true,
        enum: ['linkedin_profile', 'linkedin_company', 'linkedin_job', 'upwork_job', 'other']
    },
    platform: { 
        type: String, 
        required: true,
        default: 'linkedin'
    },
    url: { 
        type: String, 
        required: true 
    },
    
    // Extracted fields - flexible structure for Chrome extension data
    extractedFields: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    
    // Metadata
    extractedBy: { 
        type: String,
        required: true
    },
    extractedAt: { 
        type: Date, 
        default: Date.now 
    },
    
    // Additional metadata
    metadata: {
        userAgent: String,
        extensionVersion: String,
        dataVersion: { type: String, default: '2.0' }
    },
    
    // Search and filtering
    tags: [String],
    notes: String,
    
    // Status
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, {
    timestamps: true,
    collection: 'extracted_data'
});

// Indexes for better query performance
ExtractedDataSchema.index({ extractedBy: 1, extractedAt: -1 });
ExtractedDataSchema.index({ type: 1, platform: 1 });
ExtractedDataSchema.index({ url: 1 });

// Method to get summary
ExtractedDataSchema.methods.getSummary = function() {
    return {
        id: this._id,
        type: this.type,
        platform: this.platform,
        url: this.url,
        extractedAt: this.extractedAt,
        fieldsCount: Object.keys(this.extractedFields || {}).length
    };
};

module.exports = mongoose.model('ExtractedData', ExtractedDataSchema);