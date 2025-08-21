// routes/verify.js
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const License = require('../models/license');

// 🔎 License Verify API
router.post('/verify', async (req, res) => {
    try {
        const { key, deviceId } = req.body;

        if (!key || !deviceId) {
            return res.status(400).json({ success: false, message: "❌ Key aur DeviceID required hai" });
        }

        // 🔑 Hash nikalo
        const keyHash = crypto.createHash('sha256').update(key).digest('hex');

        // DB se license lao
        const license = await License.findOne({ keyHash });
        if (!license) {
            return res.status(401).json({ success: false, message: "❌ Invalid license key" });
        }

        // ✅ Expiry check
        if (license.expiresAt && license.expiresAt < new Date()) {
            return res.status(401).json({ success: false, message: "❌ License expired" });
        }

        // ✅ Device check
        if (!license.devices.includes(deviceId)) {
            if (license.devices.length >= license.maxDevices) {
                return res.status(403).json({ success: false, message: "❌ Device limit reached" });
            }
            // Naya device add karo
            license.devices.push(deviceId);
            await license.save();
        }

        res.json({
            success: true,
            message: "✅ License valid hai",
            expiresAt: license.expiresAt,
            devices: license.devices
        });

    } catch (err) {
        console.error("❌ Error in /verify:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;
