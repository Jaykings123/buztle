const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
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
    standardHeaders: true,
    legacyHeaders: false
});

const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper: Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper: Send OTP Email
const sendOTPEmail = async (email, otp) => {
    if (!process.env.RESEND_API_KEY) {
        console.log('⚠️ RESEND_API_KEY not set. OTP:', otp);
        return false;
    }

    try {
        const data = await resend.emails.send({
            from: 'Buztle <onboarding@resend.dev>', // Default testing domain
            to: email,
            subject: 'Verify your Buztle Account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #06b6d4; text-align: center;">Welcome to Buztle!</h2>
                    <p style="text-align: center; color: #555;">Please verify your email address to continue.</p>
                    <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #0891b2; letter-spacing: 5px; margin: 0;">${otp}</h1>
                        <p style="color: #666; font-size: 12px; margin-top: 10px;">This OTP is valid for 10 minutes.</p>
                    </div>
                    <p style="color: #888; font-size: 12px; text-align: center;">If you didn't request this, please ignore this email.</p>
                </div>
            `
        });
        console.log('✅ Email sent successfully:', data);
        return true;
    } catch (error) {
        console.error('❌ Email send error:', error);
        return false;
    }
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

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        const tokenWithExpiry = `${otp}|${otpExpires}`;

        // Create user (NOT verified yet)
        const user = await prisma.user.create({
            data: {
                phone,
                email,
                password: hashedPassword,
                name,
                role,
                isVerified: false,
                emailVerified: false,
                verificationToken: tokenWithExpiry
            }
        });

        // Send OTP Email
        await sendOTPEmail(email, otp);

        res.json({
            message: 'Registration successful! Please verify your email.',
            email: user.email,
            requiresVerification: true
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

        // Check verification
        if (!user.emailVerified) {
            return res.status(403).json({
                error: 'Email not verified',
                requiresVerification: true,
                email: user.email
            });
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

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        if (user.emailVerified) {
            return res.status(400).json({ error: 'Email already verified' });
        }

        if (!user.verificationToken) {
            return res.status(400).json({ error: 'No verification pending' });
        }

        const [storedOtp, expiry] = user.verificationToken.split('|');

        if (storedOtp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        if (Date.now() > parseInt(expiry)) {
            return res.status(400).json({ error: 'OTP expired' });
        }

        // Verify user
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null
            }
        });

        // Generate JWT
        const token = jwt.sign({ id: updatedUser.id, role: updatedUser.role }, JWT_SECRET);

        res.json({
            success: true,
            message: 'Email verified successfully!',
            token,
            user: {
                id: updatedUser.id,
                phone: updatedUser.phone,
                email: updatedUser.email,
                name: updatedUser.name,
                role: updatedUser.role,
                emailVerified: updatedUser.emailVerified
            }
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
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

        // Generate new OTP
        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000;
        const tokenWithExpiry = `${otp}|${otpExpires}`;

        await prisma.user.update({
            where: { id: user.id },
            data: {
                verificationToken: tokenWithExpiry
            }
        });

        await sendOTPEmail(email, otp);

        res.json({ success: true, message: 'New OTP sent!' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ error: 'Failed to resend OTP' });
    }
});

module.exports = router;
