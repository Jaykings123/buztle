const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Twilio Setup (optional - falls back to mock if not configured)
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    const twilio = require('twilio');
    twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );
}

// OTP Store (In memory for MVP)
const otpStore = {};

// Send OTP
router.post('/send-otp', async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number required' });

    // Generate OTP (6-digit for production, 1234 for dev)
    const isDevelopment = !twilioClient || process.env.NODE_ENV === 'development';
    const otp = isDevelopment ? '1234' : Math.floor(100000 + Math.random() * 900000).toString();

    // Store with 5-minute expiration
    otpStore[phone] = {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000
    };

    console.log(`OTP for ${phone}: ${otp}`);

    // Send SMS via Twilio if configured
    if (!isDevelopment && twilioClient) {
        try {
            await twilioClient.messages.create({
                body: `Your Buztle verification code is: ${otp}. Valid for 5 minutes.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: `+91${phone}` // Adjust country code as needed
            });
            console.log(`SMS sent to ${phone}`);
        } catch (error) {
            console.error('Twilio SMS error:', error);
            return res.status(500).json({ error: 'Failed to send OTP' });
        }
    }

    res.json({ success: true, message: 'OTP sent successfully' });
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { phone, otp } = req.body;

    const stored = otpStore[phone];

    // Check if OTP exists
    if (!stored || stored.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Check expiration
    if (Date.now() > stored.expiresAt) {
        delete otpStore[phone];
        return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
    }

    // Clear OTP
    delete otpStore[phone];

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { phone } });

    if (user) {
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
        return res.json({ token, user, isNewUser: false });
    } else {
        return res.json({ isNewUser: true });
    }
});

// Register
router.post('/register', async (req, res) => {
    const { phone, name, role, photoUrl, idCardUrl } = req.body;

    try {
        const user = await prisma.user.create({
            data: {
                phone,
                name,
                role, // ORGANIZER or VOLUNTEER
                photoUrl,
                idCardUrl,
                isVerified: false // Default to false
            }
        });

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
        res.json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

module.exports = router;
