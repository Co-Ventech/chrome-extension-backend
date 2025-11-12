require('dotenv').config({ path: '.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const app = express();

// Debug: Check if env variables are loaded
console.log('🔧 Environment Check:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Loaded (first 50 chars)' : 'NOT LOADED');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'NOT LOADED');

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
console.log('🔗 Connecting to MongoDB Atlas...');

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ MongoDB Atlas connected successfully!');
    try {
        console.log('📊 Database:', mongoose.connection.db.databaseName);
    } catch (e) {
        // ignore in serverless environments where db might not be immediately available
    }
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
});

// Middleware
app.use(helmet());
app.use(cors({
    origin: "*",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Import routes
const extractedDataRoutes = require('./routes/extractedData');
const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');
const jobRoutes = require('./routes/jobs');
const statusRoutes = require('./routes/status');

// Handle preflight
app.options('*', cors());

// Routes
app.use('/api/extracted-data', extractedDataRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api', statusRoutes);

// Health check
app.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.json({
        status: 'OK',
        message: 'Chrome Extension Backend is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        database: dbStatus,
        environment: process.env.NODE_ENV
    });
});

// Demo endpoint
app.post('/api/demo/save', (req, res) => {
    console.log('📥 Demo endpoint received:', req.body.type);
    res.json({
        success: true,
        message: 'Demo endpoint working! Database: ' + (mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'),
        receivedData: {
            type: req.body.type,
            fields: Object.keys(req.body).length
        }
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('🚨 Error:', err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`
    });
});

module.exports = app;
