const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const License = require('../models/license');

// 🔐 Key generate API (Admin use)
router.post('/generate', async (req, res) => {
    try {
        const { key, expiryDate, maxDevices } = req.body;

        if (!key) {
            return res.status(400).json({ success: false, message: "Key required hai" });
        }

        // Key ka hash nikaalo
        const keyHash = crypto.createHash('sha256').update(key).digest('hex');

        // Pehle se same key exist to nahi?
        const existing = await License.findOne({ keyHash });
        if (existing) {
            return res.status(400).json({ success: false, message: "Key already exists" });
        }

        // License save karo
        const license = new License({
            keyHash,
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            maxDevices: maxDevices || 1,
            usedDevices: []
        });

        await license.save();

        res.json({
            success: true,
            message: "✅ License generated successfully",
            key: key,  // ye user ko diya jaayega
            expiryDate,
            maxDevices
        });

    } catch (err) {
        console.error("❌ Error in /generate:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;
