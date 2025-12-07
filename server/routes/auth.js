const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { validate, validationRules } = require('../middleware/validation');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Rate limits for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per window (increased for testing)
    message: 'Too many authentication attempts, please try again later',
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    // Trust proxy for Render deployment
    trustProxy: true
});

// Helper: Generate verification token
const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Helper: Send verification email (mock for now, can integrate with nodemailer)
const sendVerificationEmail = async (email, token) => {
    // TODO: Integrate with actual email service (nodemailer, SendGrid, etc.)
    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
    console.log(`
    ========================================
    VERIFICATION EMAIL (Mock)
    To: ${email}
    Link: ${verificationLink}
    ========================================
    `);
    // For now, just log the link. In production, send actual email.
    return true;
};

// Register with Email/Password
router.post('/register', validationRules.register, validate, async (req, res, next) => {
    const { phone, email, password, name, role } = req.body;



    try {
        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { phone },
                    { email }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                error: existingUser.email === email ? 'Email already registered' : 'Phone already registered'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user (email verified by default - no verification needed)
        const user = await prisma.user.create({
            data: {
                phone,
                email,
                password: hashedPassword,
                name,
                role,
                isVerified: false,
                emailVerified: true, // Auto-verify for now
                verificationToken: null
            }
        });

        // Generate JWT
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);

        res.json({
            token,
            user: {
                id: user.id,
                phone: user.phone,
                email: user.email,
                name: user.name,
                role: user.role,
                emailVerified: user.emailVerified
            },
            message: 'Registration successful! You can now login.'
        });
    } catch (error) {
        next(error); // Pass to error handler
    }
});

// Login with Email/Phone + Password
router.post('/login', authLimiter, validationRules.login, validate, async (req, res, next) => {
    const { identifier, password } = req.body; // identifier can be email or phone

    try {
        // Find user by email OR phone
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phone: identifier }
                ]
            }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);

        res.json({
            token,
            user: {
                id: user.id,
                phone: user.phone,
                email: user.email,
                name: user.name,
                role: user.role,
                emailVerified: user.emailVerified
            }
        });
    } catch (error) {
        next(error);
    }
});

// Verify Email
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: 'Verification token required' });
    }

    try {
        const user = await prisma.user.findFirst({
            where: { verificationToken: token }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification token' });
        }

        // Update user
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null
            }
        });

        res.json({ success: true, message: 'Email verified successfully! You can now login.' });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// Resend verification email
router.post('/resend-verification', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.emailVerified) {
            return res.status(400).json({ error: 'Email already verified' });
        }

        // Generate new token
        const verificationToken = generateVerificationToken();

        await prisma.user.update({
            where: { id: user.id },
            data: { verificationToken }
        });

        await sendVerificationEmail(email, verificationToken);

        res.json({ success: true, message: 'Verification email sent!' });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ error: 'Failed to resend verification email' });
    }
});

module.exports = router;
