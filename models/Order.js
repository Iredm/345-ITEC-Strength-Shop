const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}

// Read orders from file
async function readOrders() {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

// Write orders to file
async function writeOrders(orders) {
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

class Order {
  constructor({ userId, items, total, shippingAddress, paymentInfo }) {
    this.id = Date.now().toString();
    this.userId = userId;
    this.items = items;
    this.total = total;
    this.shippingAddress = shippingAddress;
    this.paymentInfo = {
      cardNumber: paymentInfo.cardNumber.replace(/\s/g, '').slice(-4),
      expiry: paymentInfo.expiry,
      cvc: '***'
    };
    this.status = 'pending';
    this.createdAt = new Date();
  }

  static async findOne(query) {
    await ensureDataDir();
    const orders = await readOrders();
    return orders.find(order => 
      Object.keys(query).every(key => order[key] === query[key])
    );
  }

  static async find(query) {
    await ensureDataDir();
    const orders = await readOrders();
    return orders.filter(order => 
      Object.keys(query).every(key => order[key] === query[key])
    );
  }

  async save() {
    await ensureDataDir();
    const orders = await readOrders();
    const existingOrderIndex = orders.findIndex(o => o.id === this.id);
    
    if (existingOrderIndex >= 0) {
      orders[existingOrderIndex] = this;
    } else {
      orders.push(this);
    }
    
    await writeOrders(orders);
    return this;
  }
}

// Initialize data directory and file
ensureDataDir().catch(console.error);

module.exports = Order; 