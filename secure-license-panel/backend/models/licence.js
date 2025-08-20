const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
    keyHash: String,
    maxDevices: Number,
    usedDevices: [String],
    expiryDate: Date,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('License', licenseSchema);
