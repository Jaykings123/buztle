const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// CORS configuration for production
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const applicationRoutes = require('./routes/applications');

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/', (req, res) => {
    res.send('Buztle API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
