const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authMiddleware = require('./middleware/auth');  // ✅ yaha se auth middleware import

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const generateRoutes = require('./routes/generate');
const verifyRoutes = require('./routes/verify');   

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Protected Routes (sirf admin ke liye)
app.use('/api/license', authMiddleware, generateRoutes);
app.use('/api/auth', authMiddleware, authRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// ✅ Public Route (apps ke liye)
app.use('/api/verify', verifyRoutes);      

// ✅ MongoDB connect
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// ✅ Port setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
