const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.db = null;
        this.init();
    }

    init() {
        const dbPath = path.join(__dirname, 'users.db');
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                console.log('Connected to SQLite database');
                this.createTables();
            }
        });
    }

    createTables() {
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_login DATETIME,
                active INTEGER DEFAULT 1
            )
        `;

        this.db.run(createUsersTable, (err) => {
            if (err) {
                console.error('Error creating users table:', err.message);
            } else {
                console.log('Users table ready');
            }
        });
    }

    // User Registration
    async createUser(name, email, hashedPassword) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
            );
            
            stmt.run([name, email, hashedPassword], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ 
                        id: this.lastID,
                        name,
                        email,
                        created_at: new Date().toISOString()
                    });
                }
            });
            
            stmt.finalize();
        });
    }

    // Find user by email
    async findUserByEmail(email) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM users WHERE email = ? AND active = 1',
                [email],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                }
            );
        });
    }

    // Update last login
    async updateLastLogin(userId) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
                [userId],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ changes: this.changes });
                    }
                }
            );
        });
    }

    // Get all users (for admin purposes)
    async getAllUsers() {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT id, name, email, created_at, last_login FROM users WHERE active = 1 ORDER BY created_at DESC',
                [],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    }

    // Close database connection
    close() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err.message);
                } else {
                    console.log('Database connection closed');
                }
            });
        }
    }
}

module.exports = new Database();