const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const License = require('../models/license');

// 🔑 Key validation
router.post('/validate', async (req, res) => {
    try {
        const { key, deviceId } = req.body;

        if (!key || !deviceId) {
            return res.status(400).json({ success: false, message: "❌ Key aur DeviceID required hai" });
        }

        // Key ka hash nikalo
        const keyHash = crypto.createHash('sha256').update(key).digest('hex');

        // DB me check karo
        const license = await License.findOne({ keyHash });
        if (!license) {
            return res.status(401).json({ success: false, message: "❌ Invalid License Key" });
        }

        // Expiry check
        if (license.expiresAt && new Date() > license.expiresAt) {
            return res.status(403).json({ success: false, message: "❌ License expired" });
        }

        // Device check
        if (!license.devices.includes(deviceId)) {
            if (license.devices.length >= license.maxDevices) {
                return res.status(403).json({ success: false, message: "❌ Device limit reached" });
            }
            license.devices.push(deviceId);
            await license.save();
        }

        res.json({
            success: true,
            message: "✅ License valid",
            userId: license.userId,
            expiresAt: license.expiresAt,
            devices: license.devices
        });

    } catch (err) {
        console.error("❌ Error in /validate:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;            }
            license.usedDevices.push(deviceID);
            await license.save();
        }

        // JWT token generate
        const token = jwt.sign(
            { keyID: license._id, deviceID },
            SECRET,
            { expiresIn: '12h' }
        );

        res.json({ success: true, token });

    } catch (err) {
        console.error("❌ Error in /validate:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;
