// server/routes/dashboard.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get user's dashboard data
router.get('/user-stats', auth, async (req, res) => {
  try {
    const activeListings = await Item.find({ 
      seller: req.user._id,
      status: 'active'
    }).count();

    const completedTransactions = await Transaction.find({
      $or: [{ seller: req.user._id }, { buyer: req.user._id }],
      status: 'completed'
    }).count();

    const recentListings = await Item.find({ seller: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentTransactions = await Transaction.find({
      $or: [{ seller: req.user._id }, { buyer: req.user._id }]
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('item');

    res.json({
      activeListings,
      completedTransactions,
      recentListings,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's listings
router.get('/listings', auth, async (req, res) => {
  try {
    const listings = await Item.find({ seller: req.user._id })
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ seller: req.user._id }, { buyer: req.user._id }]
    })
      .sort({ createdAt: -1 })
      .populate('item buyer seller');

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;