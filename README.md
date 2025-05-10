# Strength Shop - E-commerce Website

A full-stack e-commerce website for fitness equipment and supplements.

## Features

- User authentication (login/register)
- Product browsing
- Shopping cart functionality
- Checkout process
- Order management
- Responsive design

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: JSON file-based storage
- Authentication: JWT (JSON Web Tokens)

## Project Structure

```
strength-shop/
├── public/              # Static files
│   ├── index.html      # Home page
│   ├── login.html      # Login/Register page
│   └── checkout.html   # Checkout page
├── routes/             # API routes
│   ├── auth.js        # Authentication routes
│   ├── cart.js        # Cart routes
│   └── orders.js      # Order routes
├── models/            # Data models
│   ├── User.js       # User model
│   ├── Cart.js       # Cart model
│   └── Order.js      # Order model
├── middleware/        # Middleware functions
│   └── auth.js       # Authentication middleware
├── data/             # JSON data storage
├── server.js         # Main server file
└── package.json      # Project dependencies
```

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/strength-shop.git
cd strength-shop
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove item from cart
- `POST /api/orders` - Create new order

## License

MIT License 