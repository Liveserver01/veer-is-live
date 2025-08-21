const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
  keyHash: { type: String, required: true, unique: true },  // 🔑 hashed license key
  userId: { type: String, required: true },                 // user assigned
  maxDevices: { type: Number, default: 1 },                 // कितने devices allow
  devices: [{ type: String }],                              // device IDs
  expiresAt: { type: Date },                                // expiry date
}, { timestamps: true });

module.exports = mongoose.model('License', licenseSchema);
