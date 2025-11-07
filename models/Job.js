const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // Job Information
  job: {
    title: { type: String, required: true },
    description: { type: String, default: null },
    datePosted: { type: Date, default: null },
    status: { 
      type: String, 
      enum: ["not_engaged", "applied", "engaged", "interview", "offer", "rejected", "onboard"],
      default: "not_engaged"
    },
    additionalInfo: { type: String, default: null }
  },
  
  // Company Information
  company: {
    name: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    email: { type: String, default: null },
    website: { type: String, default: null },
    // Add any other company details that might be extracted
    size: { type: String, default: null },
    industry: { type: String, default: null }
  },
  
  // Extraction Metadata
  extractedFrom: {
    platform: { type: String, required: true }, // e.g., "linkedin", "generic"
    url: { type: String, required: true },
    pageType: { type: String, default: "job_posting" }
  },
  
  // System Fields
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
});

// Update the updatedAt field before saving
// jobSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

jobSchema.methods.updateStatus = function(newStatus) {
    this.job.status = newStatus;
    this.updatedAt = Date.now();
    return this.save();
};

module.exports = mongoose.model('Job', jobSchema);