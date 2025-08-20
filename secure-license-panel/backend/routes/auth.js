const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const License = require('../models/license');

const SECRET = 'YOUR_SECRET_KEY'; // JWT secret

// Validate license key + register device
router.post('/validate', async (req, res) => {
    const { key, deviceID } = req.body;
    const keyHash = crypto.createHash('sha256').update(key).digest('hex');

    const license = await License.findOne({ keyHash });
    if(!license) return res.status(400).json({ message: 'Invalid Key' });

    if(license.expiryDate && license.expiryDate < new Date())
        return res.status(400).json({ message: 'Key expired' });

    if(!license.usedDevices.includes(deviceID)) {
        if(license.usedDevices.length >= license.maxDevices)
            return res.status(400).json({ message: 'Device limit reached' });
        license.usedDevices.push(deviceID);
        await license.save();
    }

    const token = jwt.sign({ keyID: license._id, deviceID }, SECRET, { expiresIn: '12h' });
    res.json({ token });
});

module.exports = router;
