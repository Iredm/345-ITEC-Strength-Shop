const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// Predefined products list
const products = [
    { id: '1', name: "Custom Workout Plan", price: 29.99, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb0ZrN2V8nwG0tbmKSOxiFORahWM7ZBWRj4w&s", description: "Tailored workout programs to match your goals." },
    { id: '2', name: "Whey Protein Supplement", price: 49.99, img: "https://repfitness.com/cdn/shop/files/Protein_-_Lifestyle_-_6.jpg?v=1740694018&width=1445", description: "High-quality protein for muscle growth and recovery." },
    { id: '3', name: "Multi-Function Home Gym", price: 399.99, img: "http://sfhealthtech.com/cdn/shop/articles/resize-How-to-Setup-Home-Gym.jpg?v=1598866727", description: "Your complete workout setup for home." },
    { id: '4', name: "Resistance Bands Set", price: 19.99, img: "https://i5.walmartimages.com/seo/New-11-Piece-Resistance-Band-Set-Heavy-Duty-Yoga-Pilates-Abs-Exercise-Fitness-Workout-Bands_0371214a-7d43-4f19-ba27-ea3bd752f072.b81b750f2724c81c0989fdf12b0009a6.jpeg", description: "Portable and durable resistance band kit." },
    { id: '5', name: "Kettlebell Weight Set", price: 89.99, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdF4TS0ozgjeygkw15crLC9FshFsT7ZkTUUQ&s", description: "Perfect for strength and cardio training." },
    { id: '6', name: "Foam Roller Recovery Tool", price: 14.99, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu-vqByx1ONilq7NaGvbfdoZyP7O7BbDa4eQ&s", description: "Relieve tension and improve flexibility." }
];

// Get cart
router.get('/', auth, async (req, res) => {
    try {
        console.log('Getting cart for user:', req.user.id);
        let cart = await Cart.findOne({ userId: req.user.id });
        
        if (!cart) {
            console.log('No cart found, creating new cart');
            cart = new Cart({ userId: req.user.id });
            await cart.save();
        }
        
        res.json(cart);
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ error: 'Error getting cart' });
    }
});

// Add item to cart
router.post('/items', auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        if (!productId || !quantity) {
            return res.status(400).json({ error: 'Product ID and quantity are required' });
        }
        
        if (quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }
        
        // Validate product exists
        const product = products.find(p => p.id === productId);
        if (!product) {
            return res.status(400).json({ error: 'Invalid product' });
        }
        
        let cart = await Cart.findOne({ userId: req.user.id });
        
        if (!cart) {
            console.log('No cart found, creating new cart');
            cart = new Cart({ userId: req.user.id });
        } else {
            // Convert plain object to Cart instance
            cart = new Cart(cart);
        }
        
        const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
        
        if (existingItemIndex >= 0) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({
                productId,
                name: product.name,
                price: product.price,
                quantity
            });
        }
        
        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ error: 'Error adding item to cart' });
    }
});

// Remove item from cart
router.delete('/items/:productId', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id });
        
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        
        // Convert plain object to Cart instance
        cart = new Cart(cart);
        cart.items = cart.items.filter(item => item.productId !== req.params.productId);
        await cart.save();
        
        res.json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ error: 'Error removing item from cart' });
    }
});

// Update item quantity
router.put('/items/:productId', auth, async (req, res) => {
    try {
        const { quantity } = req.body;
        
        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'Valid quantity is required' });
        }
        
        let cart = await Cart.findOne({ userId: req.user.id });
        
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        
        // Convert plain object to Cart instance
        cart = new Cart(cart);
        const itemIndex = cart.items.findIndex(item => item.productId === req.params.productId);
        
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }
        
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        
        res.json(cart);
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ error: 'Error updating cart item' });
    }
});

// Clear cart
router.delete('/', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id });
        
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        
        // Convert plain object to Cart instance
        cart = new Cart(cart);
        cart.items = [];
        await cart.save();
        
        res.json(cart);
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Error clearing cart' });
    }
});

module.exports = router; 