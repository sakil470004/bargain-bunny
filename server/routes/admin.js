// server/routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// Middleware to check admin role
const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get basic admin stats
router.get('/stats', [auth, isAdmin], async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: 'user' });
    const itemCount = await Item.countDocuments();
    const transactionCount = await Transaction.countDocuments();

    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('buyer seller item');

    res.json({
      stats: {
        userCount,
        itemCount,
        transactionCount
      },
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get users list with basic metrics
router.get('/users', [auth, isAdmin], async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .lean();

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;