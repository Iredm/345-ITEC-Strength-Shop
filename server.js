const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// Serve welcome page as default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Server is running!');
  console.log('\nFrontend:');
  console.log(`   📱 http://localhost:${PORT}`);
  console.log(`   🔑 Login: http://localhost:${PORT}/login`);
  console.log(`   🛒 Checkout: http://localhost:${PORT}/checkout`);
  
  console.log('\nAPI Endpoints:');
  console.log(`   👤 Register: http://localhost:${PORT}/api/auth/register`);
  console.log(`   🔐 Login: http://localhost:${PORT}/api/auth/login`);
  console.log(`   🛒 Cart: http://localhost:${PORT}/api/cart`);
  console.log(`   📦 Orders: http://localhost:${PORT}/api/orders`);
}); 