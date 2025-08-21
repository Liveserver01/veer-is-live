// routes/license.js
const express = require("express");
const router = express.Router();
const crypto = require("crypto");

// In-memory storage (production me DB use karna)
let licenses = [];

// Generate License
router.post("/generate", (req, res) => {
  const { key, deviceId } = req.body;

  if (!key || !deviceId) {
    return res.status(400).json({
      success: false,
      message: "❌ Key aur Device ID required hai",
    });
  }

  // Check agar deviceId already registered hai
  const existing = licenses.find((l) => l.deviceId === deviceId);

  if (existing) {
    return res.json({
      success: true,
      message: "ℹ️ Device ke liye license already exist karta hai",
      key: existing.key,
    });
  }

  // New license banate hain
  const newLicense = {
    key,
    deviceId,
    createdAt: new Date(),
  };

  licenses.push(newLicense);

  res.json({
    success: true,
    message: "✅ License generated successfully",
    key: newLicense.key,
  });
});

// Verify License
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

  res.json({
    success: true,
    message: "✅ License valid hai",
  });
});

module.exports = router;
