// middlewares/auth.js
require('dotenv').config();

function basicAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ success: false, message: "No credentials provided" });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (
        username === process.env.PANEL_USER &&
        password === process.env.PANEL_PASS
    ) {
        return next();
    }

    return res.status(403).json({ success: false, message: "Invalid credentials" });
}

module.exports = basicAuth;
