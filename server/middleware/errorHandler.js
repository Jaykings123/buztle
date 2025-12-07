// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
    // Log error for debugging (use proper logger in production)
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method
    });

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation failed',
            details: err.message
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
    }

    // Prisma errors
    if (err.code === 'P2002') {
        return res.status(400).json({ error: 'Duplicate entry. This record already exists.' });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({ error: 'Record not found' });
    }

    // Default error
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message
    });
};

module.exports = errorHandler;
