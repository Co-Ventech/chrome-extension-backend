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
// Configure CORS so the server echoes the requesting origin. Using a
// wildcard (`"*"`) together with `credentials: true` is not allowed by
// browsers, and will cause preflight requests to fail (no Access-Control-Allow-Origin
// header will be returned). For content scripts running inside a page (e.g.
// LinkedIn) the request origin will be that page, so we allow the origin
// dynamically.
// app.use(cors());
const corsOptions = {
  origin: true,               // reflect request origin, allows any origin
  credentials: true,          // allow cookies/auth if needed
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure CORS headers are always present (explicit guard for preflight requests)
// Some serverless platforms or proxies can interfere with automatic CORS handling,
// so we set headers explicitly and short-circuit OPTIONS requests.
// app.use((req, res, next) => {
//     const origin = req.headers.origin || '*';
//     // Log origin and method for debugging CORS issues in production
//     console.log('🔁 CORS middleware - method:', req.method, 'origin:', req.headers.origin);
//     // If credentials are needed, reflect the origin instead of using '*'
//     if (origin && origin !== 'null') {
//         res.setHeader('Access-Control-Allow-Origin', origin);
//     } else {
//         res.setHeader('Access-Control-Allow-Origin', '*');
//     }
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

//     if (req.method === 'OPTIONS') {
//         // Preflight request, end here
//         return res.status(204).end();
//     }
//     next();
// });

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
