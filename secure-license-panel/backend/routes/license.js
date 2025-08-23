// routes/license.js
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const License = require('../models/license');

router.post('/generate', async (req, res) => {
    try {
        const { prefix, deviceId, days, maxDevices } = req.body;

        console.log("📥 Request Body:", req.body); // DEBUGGING ke liye

        if (!prefix || !days) {
            return res.status(400).json({ success: false, message: "❌ prefix aur days required hai" });
        }

        // Random key
        const rawKey = `${prefix}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
        const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

        // Expiry
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + parseInt(days));

        // Duplicate check
        const exists = await License.findOne({ keyHash });
        if (exists) {
            return res.status(400).json({ success: false, message: "❌ Key already exists, try again" });
        }

        // License object
        const licenseData = {
            keyHash,
            maxDevices: maxDevices || 1,
            expiresAt,
        };

        // Agar deviceId aaya hai to devices me daalo
        if (deviceId) {
            licenseData.devices = [deviceId];
        }

        const license = new License(licenseData);
        await license.save();

        res.json({
            success: true,
            message: "✅ License generate ho gaya",
            licenseKey: rawKey,   // user ko dikhana hai
            expiresAt,
            maxDevices: license.maxDevices
        });

    } catch (err) {
        console.error("❌ License generate error:", err.message);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

module.exports = router;
