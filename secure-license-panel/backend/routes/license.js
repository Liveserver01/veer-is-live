// routes/license.js
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const License = require('../models/license');

// 🎯 License Generate API
router.post('/generate', async (req, res) => {
    try {
        const { prefix, deviceId, days, maxDevices } = req.body;

        if (!prefix || !deviceId || !days) {
            return res.status(400).json({ success: false, message: "❌ prefix, deviceId aur days required hai" });
        }

        // 1. Random license key generate karo
        const rawKey = `${prefix}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

        // 2. Hash the key
        const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

        // 3. Expiry date set
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + parseInt(days));

        // 4. Check duplicate
        const exists = await License.findOne({ keyHash });
        if (exists) {
            return res.status(400).json({ success: false, message: "❌ Key already exists, dobara try karo" });
        }

        // 5. Save to DB
        const license = new License({
            keyHash,
            devices: [deviceId],
            maxDevices: maxDevices || 1,
            expiresAt
        });

        await license.save();

        // 6. Response
        res.json({
            success: true,
            message: "✅ License generate ho gaya",
            licenseKey: rawKey,  // ⚠️ Ye user ko dikhana hai, DB me hash save hota hai
            expiresAt,
            maxDevices: license.maxDevices
        });

    } catch (err) {
        console.error("❌ License generate error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
