// routes/generate.js
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const License = require('../models/license');

// 🔐 License Generate API (Admin use only)
router.post('/generate', async (req, res) => {
    try {
        const { prefix, expiryDate, maxDevices } = req.body;

        if (!prefix) {
            return res.status(400).json({ success: false, message: "❌ Prefix required hai" });
        }

        // 🔑 Random key banaye
        const randomPart = crypto.randomBytes(6).toString("hex").toUpperCase();
        const key = `${prefix}-${randomPart}`;

        // Key hash
        const keyHash = crypto.createHash('sha256').update(key).digest('hex');

        // Duplicate check
        const existing = await License.findOne({ keyHash });
        if (existing) {
            return res.status(400).json({ success: false, message: "❌ Key already exists, dobara try karo" });
        }

        // Save in DB
        const license = new License({
            keyHash,
            expiresAt: expiryDate ? new Date(expiryDate) : null,
            maxDevices: maxDevices || 1,
            devices: []
        });

        await license.save();

        res.json({
            success: true,
            message: "✅ License generated successfully",
            key: key,  // ⚠️ Original key return hoga
            expiryDate,
            maxDevices
        });

    } catch (err) {
        console.error("❌ Error in /generate:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;
