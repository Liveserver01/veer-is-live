// routes/license.js
const express = require("express");
const router = express.Router();
const crypto = require("crypto");

let licenses = []; // in-memory storage

// 🔑 License Generate
router.post("/generate", (req, res) => {
  const { prefix, deviceId, days } = req.body;

  if (!prefix || !deviceId) {
    return res.status(400).json({
      success: false,
      message: "❌ Prefix aur Device ID required hai",
    });
  }

  // agar device already licensed hai
  const existing = licenses.find((l) => l.deviceId === deviceId);
  if (existing) {
    return res.json({
      success: true,
      message: "ℹ️ Device already licensed hai",
      key: existing.key,
      expiresAt: existing.expiresAt || null
    });
  }

  // random key generate
  const randomPart = crypto.randomBytes(6).toString("hex").toUpperCase(); // 12 chars
  const key = `${prefix}-${randomPart}`;

  // expiry calculate
  let expiresAt = null;
  if (days && Number(days) > 0) {
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Number(days));
  }

  const newLicense = {
    key,
    deviceId,
    createdAt: new Date(),
    expiresAt
  };

  licenses.push(newLicense);

  res.json({
    success: true,
    message: "✅ License generated successfully",
    key: newLicense.key,
    expiresAt
  });
});

// 🔎 Verify License
router.post("/verify", (req, res) => {
  const { key, deviceId } = req.body;

  const license = licenses.find(
    (l) => l.key === key && l.deviceId === deviceId
  );

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
});

module.exports = router;
