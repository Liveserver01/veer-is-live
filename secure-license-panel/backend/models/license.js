const mongoose = require("mongoose");

const licenseSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  prefix: { type: String, required: true },
  deviceId: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("License", licenseSchema);
