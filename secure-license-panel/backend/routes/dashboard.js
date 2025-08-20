const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const License = require('../models/license');
const SECRET = 'YOUR_SECRET_KEY';

// Protected dashboard route
router.get('/', async (req, res) => {
    const token = req.headers['authorization'];
    if(!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, SECRET);
        const license = await License.findById(decoded.keyID);
        if(!license) return res.status(401).json({ message: 'Invalid token' });
        res.json({ message: 'Welcome to your dashboard', usedDevices: license.usedDevices.length });
    } catch(err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});

module.exports = router;
