const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const License = require('../models/license');
const SECRET = require('dotenv').config();
const SECRET = process.env.SECRET_KEY;
const SECRET = 'YOUR_SECRET_KEY'; // JWT secret

// 🔑 License validate API
router.post('/validate', async (req, res) => {
    try {
        const { key, deviceID } = req.body;

        if(!key || !deviceID){
            return res.status(400).json({ success: false, message: "Key aur DeviceID required hai" });
        }

        // Key ka hash nikaalo
        const keyHash = crypto.createHash('sha256').update(key).digest('hex');

        // DB me license check karo
        const license = await License.findOne({ keyHash });
        if(!license){
            return res.status(400).json({ success: false, message: 'Invalid Key' });
        }

        // Expiry check karo
        if(license.expiryDate && license.expiryDate < new Date()){
            return res.status(400).json({ success: false, message: 'Key expired' });
        }

        // Device register karo
        if(!license.usedDevices.includes(deviceID)) {
            if(license.usedDevices.length >= license.maxDevices){
                return res.status(400).json({ success: false, message: 'Device limit reached' });
            }
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
