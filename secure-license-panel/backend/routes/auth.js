const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const router = express.Router();
const License = require("../models/license");

const SECRET = process.env.JWT_SECRET || "supersecret"; // 🔑 JWT secret

// 🔑 License validation
router.post("/validate", async (req, res) => {
  try {
    const { key, deviceId } = req.body;

    if (!key || !deviceId) {
      return res
        .status(400)
        .json({ success: false, message: "❌ Key aur DeviceID required hai" });
    }

    // Key ka hash nikalo
    const keyHash = crypto.createHash("sha256").update(key).digest("hex");

    // DB me check karo
    const license = await License.findOne({ key: key }); // 👈 Agar tumhare schema me sirf key hai to key use karo
    if (!license) {
      return res
        .status(401)
        .json({ success: false, message: "❌ Invalid License Key" });
    }

    // Expiry check
    if (license.expiresAt && new Date() > license.expiresAt) {
      return res
        .status(403)
        .json({ success: false, message: "❌ License expired" });
    }

    // Device check
    if (!license.devices.includes(deviceId)) {
      if (license.devices.length >= license.maxDevices) {
        return res
          .status(403)
          .json({ success: false, message: "❌ Device limit reached" });
      }
      license.devices.push(deviceId);
      await license.save();
    }

    // ✅ JWT token generate
    const token = jwt.sign(
      { licenseId: license._id, deviceId },
      SECRET,
      { expiresIn: "12h" }
    );

    res.json({
      success: true,
      message: "✅ License valid",
      token,
      userId: license.userId,
      expiresAt: license.expiresAt,
      devices: license.devices,
    });
  } catch (err) {
    console.error("❌ Error in /validate:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
