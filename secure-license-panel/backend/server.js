const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://Virendra1123:<db_password>@veer.i0s9uuu.mongodb.net/?retryWrites=true&w=majority&appName=veer', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
