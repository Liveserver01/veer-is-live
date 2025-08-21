// routes/license.js
const express = require("express");
const router = express.Router();
const crypto = require("crypto");

let licenses = []; // in-memory (DB me save karna ho to mongoose use karna)

// 🔑 License Generate API
router.post("/generate", (req, res) => {
  const { prefix, deviceId } = req.body;

  if (!prefix || !deviceId) {
    return res.status(400).json({
      success: false,
      message: "❌ Prefix aur Device ID required hai",
    });
  }

  // random string generate
  const randomPart = crypto.randomBytes(6).toString("hex").toUpperCase(); // 12 chars
  const key = `${prefix}-${randomPart}`;

  // check agar device already registered hai
  const existing = licenses.find((l) => l.deviceId === deviceId);
  if (existing) {
    return res.json({
      success: true,
      message: "ℹ️ Device already licensed hai",
      key: existing.key,
    });
  }

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

// 🔎 Verify License API
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
