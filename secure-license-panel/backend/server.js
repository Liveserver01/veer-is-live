const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const generateRoutes = require('./routes/generate');
const verifyRoutes = require('./routes/verify');   // ✅ Add this

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use('/api/license', generateRoutes);   // License generate ke liye
app.use('/api/auth', authRoutes);          // Auth / validate ke liye
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/verify', verifyRoutes);      // ✅ Verify route

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
