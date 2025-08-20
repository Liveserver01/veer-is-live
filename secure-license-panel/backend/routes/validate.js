const express = require('express');
const router = express.Router();

// Example validation route
router.post('/validate', (req, res) => {
  const { key, deviceID } = req.body;

  if (!key || !deviceID) {
    return res.status(400).json({ success: false, message: "Key aur DeviceID required hai" });
  }

  // Example: hardcoded check (baad me DB connect kar sakte ho)
  if (key === "404b336749e6db0d6f5e0119a80ca633") {
    return res.json({ success: true, message: "License valid hai", deviceID });
  } else {
    return res.status(401).json({ success: false, message: "Invalid license key" });
  }
});

module.exports = router;
