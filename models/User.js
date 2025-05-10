const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
    }

    static async ensureDataDirectory() {
        const dataDir = path.join(__dirname, '..', 'data');
        try {
            await fs.access(dataDir);
        } catch {
            await fs.mkdir(dataDir);
        }
    }

    static async readUsers() {
        await this.ensureDataDirectory();
        const filePath = path.join(__dirname, '..', 'data', 'users.json');
        try {
            const data = await fs.readFile(filePath, 'utf8');
            const users = JSON.parse(data);
            return users.map(user => new User(user));
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }

    static async writeUsers(users) {
        await this.ensureDataDirectory();
        const filePath = path.join(__dirname, '..', 'data', 'users.json');
        await fs.writeFile(filePath, JSON.stringify(users, null, 2));
    }

    static async findByEmail(email) {
        const users = await this.readUsers();
        return users.find(user => user.email === email);
    }

    static async findById(id) {
        const users = await this.readUsers();
        return users.find(user => user.id === id);
    }

    static async create({ name, email, password }) {
        const users = await this.readUsers();
        
        // Check if user already exists
        if (users.some(user => user.email === email)) {
            throw new Error('User already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword
        });

        // Save user
        users.push(newUser);
        await this.writeUsers(users);

        return newUser;
    }

    async comparePassword(password) {
        return bcrypt.compare(password, this.password);
    }

    toJSON() {
        const obj = { ...this };
        delete obj.password;
        return obj;
    }
}

module.exports = User; 