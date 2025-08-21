const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const License = require('../models/license');

// 🔐 Key generate API (Admin use only)
router.post('/generate', async (req, res) => {
    try {
        const { key, expiryDate, maxDevices, userId } = req.body;

        if (!key || !userId) {
            return res.status(400).json({ success: false, message: "❌ Key aur UserID required hai" });
        }

        // 🔑 Hash nikalo
        const keyHash = crypto.createHash('sha256').update(key).digest('hex');

        // Duplicate key check
        const existing = await License.findOne({ keyHash });
        if (existing) {
            return res.status(400).json({ success: false, message: "❌ Key already exists" });
        }

        // Save in DB
        const license = new License({
            keyHash,
            userId,
            expiresAt: expiryDate ? new Date(expiryDate) : null,
            maxDevices: maxDevices || 1,
            devices: []
        });

        await license.save();

        res.json({
            success: true,
            message: "✅ License generated successfully",
            key: key,  // ⚠️ User ko original key hi milegi, hash nahi
            expiryDate,
            maxDevices
        });

    } catch (err) {
        console.error("❌ Error in /generate:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;            key: key,  // ye user ko diya jaayega
            expiryDate,
            maxDevices
        });

    } catch (err) {
        console.error("❌ Error in /generate:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;
