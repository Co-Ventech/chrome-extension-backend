require('dotenv').config({ path: '.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

// Debug: Check if env variables are loaded
console.log('🔧 Environment Check:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Loaded (first 50 chars)' : 'NOT LOADED');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'NOT LOADED');

// MongoDB Connection with cloud database
const mongoURI = process.env.MONGODB_URI;
console.log('🔗 Connecting to MongoDB Atlas...');

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ MongoDB Atlas connected successfully!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 Please check:');
    console.log('   1. Your MongoDB Atlas password in .env file');
    console.log('   2. Network access in MongoDB Atlas dashboard');
    console.log('   3. Database name in connection string');
});

// Middleware
app.use(helmet());
app.use(cors({
    origin: ['chrome-extension://*', 'http://localhost:*', 'http://127.0.0.1:*'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Import routes
const extractedDataRoutes = require('./routes/extractedData');
const authRoutes = require('./routes/auth');

// Routes
app.use('/api/extracted-data', extractedDataRoutes);
app.use('/api/auth', authRoutes);

// Health check with database status
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

// Demo endpoint for quick testing
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

// Error handling middleware
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

app.listen(PORT, () => {
    console.log(`🚀 Chrome Extension Backend running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth routes: http://localhost:${PORT}/api/auth`);
    console.log(`📊 Data routes: http://localhost:${PORT}/api/extracted-data`);
    console.log(`🗄️  Database: MongoDB Atlas`);
});