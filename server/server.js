const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Security: HTTP headers
app.use(helmet());

// CORS configuration for production
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Limit payload size

// Rate limiting for all API routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// Routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const applicationRoutes = require('./routes/applications');

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/applications', applicationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/', (req, res) => {
    res.send('Buztle API is running');
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
