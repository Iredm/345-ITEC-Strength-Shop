const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const CARTS_FILE = path.join(DATA_DIR, 'carts.json');

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        // Initialize carts file if it doesn't exist
        try {
            await fs.access(CARTS_FILE);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(CARTS_FILE, JSON.stringify([], null, 2));
            }
        }
    } catch (error) {
        console.error('Error ensuring data directory:', error);
        throw error;
    }
}

// Read carts from file
async function readCarts() {
    try {
        const data = await fs.readFile(CARTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await ensureDataDir();
            return [];
        }
        console.error('Error reading carts:', error);
        throw error;
    }
}

// Write carts to file
async function writeCarts(carts) {
    try {
        await ensureDataDir();
        await fs.writeFile(CARTS_FILE, JSON.stringify(carts, null, 2));
    } catch (error) {
        console.error('Error writing carts:', error);
        throw error;
    }
}

class Cart {
    constructor({ userId, items = [] }) {
        this.id = Date.now().toString();
        this.userId = userId;
        this.items = items;
        this.total = this.calculateTotal();
        this.updatedAt = new Date();
    }

    calculateTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    static async findOne(query) {
        try {
            await ensureDataDir();
            const carts = await readCarts();
            console.log('Finding cart with query:', query);
            console.log('Available carts:', carts);
            
            const cart = carts.find(cart => {
                // Convert both IDs to strings for comparison
                const cartUserId = String(cart.userId);
                const queryUserId = String(query.userId);
                return cartUserId === queryUserId;
            });
            
            console.log('Found cart:', cart);
            return cart;
        } catch (error) {
            console.error('Error finding cart:', error);
            throw error;
        }
    }

    async save() {
        try {
            await ensureDataDir();
            const carts = await readCarts();
            console.log('Current carts:', carts);
            console.log('Saving cart:', this);
            
            const existingCartIndex = carts.findIndex(c => String(c.userId) === String(this.userId));
            
            this.total = this.calculateTotal();
            this.updatedAt = new Date();
            
            if (existingCartIndex >= 0) {
                console.log('Updating existing cart at index:', existingCartIndex);
                carts[existingCartIndex] = this;
            } else {
                console.log('Adding new cart');
                carts.push(this);
            }
            
            await writeCarts(carts);
            console.log('Cart saved successfully');
            return this;
        } catch (error) {
            console.error('Error saving cart:', error);
            throw error;
        }
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            items: this.items,
            total: this.total,
            updatedAt: this.updatedAt
        };
    }
}

// Initialize data directory and file
ensureDataDir().catch(error => {
    console.error('Failed to initialize data directory:', error);
    process.exit(1);
});

module.exports = Cart; 