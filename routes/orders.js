const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all active orders
router.get('/active', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all delivered orders
router.get('/delivered', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'delivered' }).sort({ deliveredAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { items, orderType, paymentType, total } = req.body;
    
    // Generate order number
    const orderNumber = `ORD${Date.now().toString().slice(-8)}`;
    
    const order = new Order({
      orderNumber,
      items,
      orderType,
      paymentType,
      total,
      status: 'active'
    });

    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark order as delivered
router.patch('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'delivered',
        deliveredAt: new Date()
      },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;