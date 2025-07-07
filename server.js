require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration based on environment
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? ['https://bluelobsters.io', 'https://www.bluelobsters.io']
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:8080', 'file://'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname)));

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'BlueLobsters Auth Server is running',
        timestamp: new Date().toISOString()
    });
});

// User Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                error: 'Todos los campos son obligatorios' 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                error: 'La contraseña debe tener al menos 6 caracteres' 
            });
        }

        // Check if user already exists
        const existingUser = await db.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ 
                error: 'Ya existe una cuenta con este email' 
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const newUser = await db.createUser(name, email, hashedPassword);

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: newUser.id, 
                email: newUser.email, 
                name: newUser.name 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            },
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email y contraseña son obligatorios' 
            });
        }

        // Find user
        const user = await db.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ 
                error: 'Email o contraseña incorrectos' 
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                error: 'Email o contraseña incorrectos' 
            });
        }

        // Update last login
        await db.updateLastLogin(user.id);

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                name: user.name 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login exitoso',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
});

// Verify token endpoint (to check if user is still authenticated)
app.get('/api/auth/verify', verifyToken, (req, res) => {
    res.json({
        valid: true,
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        }
    });
});

// Get user profile (protected route)
app.get('/api/auth/profile', verifyToken, async (req, res) => {
    try {
        const user = await db.findUserByEmail(req.user.email);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                created_at: user.created_at,
                last_login: user.last_login
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Admin endpoint to get all users (for testing purposes)
app.get('/api/admin/users', verifyToken, async (req, res) => {
    try {
        const users = await db.getAllUsers();
        res.json({ users });
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog.html'));
});

app.get('/dojo', (req, res) => {
    res.sendFile(path.join(__dirname, 'dojo.html'));
});

app.get('/blog_post_001', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog_post_001.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 BlueLobsters Auth Server running on port ${PORT}`);
    console.log(`🌐 Access your site at: http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at: http://localhost:${PORT}/api/`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    db.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    db.close();
    process.exit(0);
});