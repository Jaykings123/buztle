const { body, param, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array().map(e => ({
                field: e.path,
                message: e.msg
            }))
        });
    }
    next();
};

// Validation rules
const validationRules = {
    // User registration validation
    register: [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email address'),
        body('phone')
            .matches(/^[0-9]{10}$/)
            .withMessage('Phone number must be exactly 10 digits'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
        body('name')
            .trim()
            .isLength({ min: 2 })
            .withMessage('Name must be at least 2 characters long')
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage('Name should only contain letters and spaces'),
        body('role')
            .isIn(['ORGANIZER', 'VOLUNTEER'])
            .withMessage('Role must be either ORGANIZER or VOLUNTEER')
    ],

    // User login validation
    login: [
        body('identifier')
            .trim()
            .notEmpty()
            .withMessage('Email or phone is required'),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ],

    // Event creation validation
    createEvent: [
        body('title')
            .trim()
            .isLength({ min: 3, max: 100 })
            .withMessage('Title must be between 3 and 100 characters'),
        body('description')
            .trim()
            .isLength({ min: 10, max: 1000 })
            .withMessage('Description must be between 10 and 1000 characters'),
        body('date')
            .matches(/^\d{4}-\d{2}-\d{2}$/)
            .withMessage('Date must be in YYYY-MM-DD format')
            .custom((value) => {
                const date = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (date < today) {
                    throw new Error('Event date cannot be in the past');
                }
                return true;
            }),
        body('time')
            .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
            .withMessage('Time must be in HH:MM format (24-hour)'),
        body('location')
            .trim()
            .isLength({ min: 3, max: 200 })
            .withMessage('Location must be between 3 and 200 characters'),
        body('payDetails')
            .trim()
            .isLength({ min: 1, max: 100 })
            .withMessage('Pay details must be between 1 and 100 characters'),
        body('requirements')
            .trim()
            .isLength({ min: 3, max: 500 })
            .withMessage('Requirements must be between 3 and 500 characters')
    ],

    // Application validation
    createApplication: [
        body('eventId')
            .isInt({ min: 1 })
            .withMessage('Valid event ID is required')
    ],

    // Update application status
    updateApplicationStatus: [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Valid application ID is required'),
        body('status')
            .isIn(['ACCEPTED', 'REJECTED'])
            .withMessage('Status must be either ACCEPTED or REJECTED')
    ]
};

module.exports = { validate, validationRules };
