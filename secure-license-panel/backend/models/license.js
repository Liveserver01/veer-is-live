// routes/license.js
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const License = require("../models/license");  // DB Model import

// 🔑 License Generate
router.post("/generate", async (req, res) => {
  try {
    const { prefix, deviceId, days } = req.body;

    if (!prefix || !deviceId) {
      return res.status(400).json({
        success: false,
        message: "❌ Prefix aur Device ID required hai",
      });
    }

    // Device already licensed hai?
    let existing = await License.findOne({ deviceId });
    if (existing) {
      return res.json({
        success: true,
        message: "ℹ️ Device already licensed hai",
        key: existing.key,
        expiresAt: existing.expiresAt || null
      });
    }

    // Random key generate
    const randomPart = crypto.randomBytes(6).toString("hex").toUpperCase(); // 12 chars
    const key = `${prefix}-${randomPart}`;

    // Expiry calculate
    let expiresAt = null;
    if (days && Number(days) > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + Number(days));
    }

    // DB me save
    const newLicense = new License({
      key,
      deviceId,
      createdAt: new Date(),
      expiresAt
    });

    await newLicense.save();

    res.json({
      success: true,
      message: "✅ License generated successfully",
      key: newLicense.key,
      expiresAt
    });

  } catch (err) {
    console.error("❌ Error in /generate:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 🔎 Verify License
router.post("/verify", async (req, res) => {
  try {
    const { key, deviceId } = req.body;

    const license = await License.findOne({ key, deviceId });

    if (!license) {
      return res.status(400).json({
        success: false,
        message: "❌ Invalid license or device",
      });
    }

    // expiry check
    if (license.expiresAt && new Date() > license.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "⏳ License expired ho gaya",
      });
    }

    res.json({
      success: true,
      message: "✅ License valid hai",
      key: license.key,
      expiresAt: license.expiresAt || null
    });

  } catch (err) {
    console.error("❌ Error in /verify:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
