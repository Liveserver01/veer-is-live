const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },   // license key
  userId: { type: String, required: true },              // किस user को assign है
  maxDevices: { type: Number, default: 1 },              // कितने devices allow हैं
  devices: [{ type: String }],                           // device IDs list
  expiresAt: { type: Date },                             // expiry date
}, { timestamps: true });

module.exports = mongoose.model('License', licenseSchema);
