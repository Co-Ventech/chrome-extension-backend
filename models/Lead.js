const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  // User Information (the person/lead being extracted)
  user: {
    name: { type: String, default: null },
    email: { type: String, default: null },
    website: { type: String, default: null },
    urls: [{ type: String }], // Array of links
    phoneNumber: { type: String, default: null },
    status: { 
      type: String, 
      enum: ["not_engaged", "applied", "engaged", "interview", "offer", "rejected", "onboard"],
      default: "not_engaged"
    }
  },
  
  // Company Information
  company: {
    name: { type: String, default: null },
    url: { type: String, default: null },
    email: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    website: { type: String, default: null },
    size: { type: String, default: null },
    otherUrls: [{ type: String }] // Array of additional company links
  },
  
  // Extraction Metadata
  extractedFrom: {
    platform: { type: String, required: true }, // e.g., "linkedin", "generic"
    url: { type: String, required: true },
    pageType: { type: String, default: null } // e.g., "profile", "company"
  },
  
  // System Fields
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
// leadSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

leadSchema.methods.updateStatus = function(newStatus) {
    this.user.status = newStatus;
    this.updatedAt = Date.now();
    return this.save();
};

module.exports = mongoose.model('Lead', leadSchema);