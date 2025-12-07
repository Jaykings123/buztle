const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Mock OTP Store (In memory for MVP)
const otpStore = {};

// Send OTP
router.post('/send-otp', async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number required' });

    // Generate Mock OTP
    const otp = '1234';
    otpStore[phone] = otp;
    console.log(`OTP for ${phone}: ${otp}`);

    res.json({ success: true, message: 'OTP sent successfully' });
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { phone, otp } = req.body;

    if (otpStore[phone] !== otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
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
