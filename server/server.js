const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();
// middleware
app.use(cors());
app.use(express.json());
// ================== Load ROUTES ==================
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const paymentRoutes = require('./routes/payment');

// ================== Finished ROUTES ==================

// ================== MONGODB CONNECTION ==================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
// ================== Finished MONGODB CONNECTION ==================
// ================== USE ROUTES ==================
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/payment', paymentRoutes);
app.get('/s', (req, res) => res.send({ message: 'Server is running' }));
// ================== Finished USE ROUTES ==================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));