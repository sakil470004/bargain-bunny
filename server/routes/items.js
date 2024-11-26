const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth'); // We'll create this next

// Get all items
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      condition,
      minPrice,
      maxPrice,
      sortBy
    } = req.query;

    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (condition) {
      query.condition = condition;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'priceAsc':
        sort = { price: 1 };
        break;
      case 'priceDesc':
        sort = { price: -1 };
        break;
      default: // newest
        sort = { createdAt: -1 };
    }

    const items = await Item.find(query)
      .sort(sort)
      .populate('seller', 'username');

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('seller', 'username');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create item (protected route)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, price, location, condition, category,images } = req.body;
    
    const newItem = new Item({
      title,
      description,
      price,
      location,
      condition,
      category,
      images,
      seller: req.user.id // Will come from auth middleware
    });

    const savedItem = await newItem.save();
    await savedItem.populate('seller', 'username');
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update item (protected route)
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user owns the item
    if (item.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('seller', 'username');

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete item (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user owns the item
    if (item.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await item.remove();
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's items (protected route)
router.get('/user/items', auth, async (req, res) => {
  try {
    const items = await Item.find({ seller: req.user.id })
      .populate('seller', 'username')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;