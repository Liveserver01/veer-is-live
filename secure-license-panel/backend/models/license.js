// models/license.js
const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
  keyHash: { type: String, required: true, unique: true }, // hashed license key
  maxDevices: { type: Number, default: 1 },                // कितने devices allow हैं
  devices: [{ type: String }],                             // device IDs list
  expiresAt: { type: Date },                               // expiry date
}, { timestamps: true });

module.exports = mongoose.model('License', licenseSchema);
