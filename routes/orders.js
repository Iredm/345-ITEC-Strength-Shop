const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// Create order
router.post('/', auth, async (req, res) => {
    try {
        console.log('Creating order for user:', req.user.id);
        
        // Find user's cart
        const cart = await Cart.findOne({ userId: req.user.id });
        console.log('Found cart:', cart);
        
        if (!cart) {
            return res.status(400).json({ message: 'No cart found' });
        }
        
        if (!cart.items || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Validate payment information
        const { paymentInfo } = req.body;
        if (!paymentInfo || !paymentInfo.cardNumber || !paymentInfo.expiry || !paymentInfo.cvc) {
            return res.status(400).json({ message: 'Payment information is required' });
        }

        // Validate shipping address
        const { shippingAddress } = req.body;
        if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || 
            !shippingAddress.state || !shippingAddress.zipCode) {
            return res.status(400).json({ message: 'Shipping address is required' });
        }

        // Create new order
        const order = new Order({
            userId: req.user.id,
            items: cart.items,
            total: cart.calculateTotal(),
            shippingAddress,
            paymentInfo
        });

        console.log('Created order:', order);
        await order.save();
        console.log('Order saved successfully');

        // Clear cart after order is placed
        cart.items = [];
        cart.total = 0;
        await cart.save();
        console.log('Cart cleared successfully');

        res.status(201).json({
            message: 'Order placed successfully',
            order: {
                id: order.id,
                items: order.items,
                total: order.total,
                status: order.status,
                createdAt: order.createdAt
            }
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ 
            message: 'Failed to process order',
            error: error.message 
        });
    }
});

// Get user's orders
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get specific order
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findOne({ id: req.params.id, userId: req.user.id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 