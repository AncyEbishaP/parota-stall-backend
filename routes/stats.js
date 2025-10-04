const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get today's statistics
router.get('/today', async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const orders = await Order.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
    
    const stats = {
      totalOrders: orders.length,
      activeOrders: orders.filter(o => o.status === 'active').length,
      deliveredOrders: orders.filter(o => o.status === 'delivered').length,
      cashTotal: orders
        .filter(o => o.paymentType === 'Cash')
        .reduce((sum, o) => sum + o.total, 0),
      upiTotal: orders
        .filter(o => o.paymentType === 'UPI')
        .reduce((sum, o) => sum + o.total, 0),
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0)
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;