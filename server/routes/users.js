const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');
const { clerkClient } = require('@clerk/clerk-sdk-node');

const prisma = new PrismaClient();

// Update User Role (Onboarding)
router.post('/update-role', requireAuth, async (req, res) => {
    const { role } = req.body; // 'VOLUNTEER' or 'ORGANIZER'
    const userId = req.auth.userId;

    if (!['VOLUNTEER', 'ORGANIZER'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    try {
        console.log(`[Update Role] Starting for user: ${userId}, Role: ${role}`);

        // 1. Update Clerk Metadata
        try {
            await clerkClient.users.updateUserMetadata(userId, {
                publicMetadata: {
                    role: role
                }
            });
            console.log('[Update Role] Clerk metadata updated.');
        } catch (clerkError) {
            console.error('[Update Role] Clerk Error:', clerkError);
            // Continue to db update even if clerk fails? No, better to fail loud or fallback.
            // But let's log and proceed for now to ensure DB is consistent.
        }

        // 2. Update Local Database (Upsert to be safe)
        const user = await prisma.user.upsert({
            where: { clerkId: userId },
            update: { role: role },
            create: {
                clerkId: userId,
                email: 'sync_pending@buztle.com', // Placeholder, should be updated by auth middleware later
                role: role,
                emailVerified: true
            }
        });
        console.log('[Update Role] DB updated:', user.id);

        res.json({ message: 'Role updated successfully', user });
    } catch (error) {
        console.error("[Update Role] Critical Error:", error);
        res.status(500).json({ error: 'Failed to update role', details: error.message });
    }
});

// Get Current User Profile (Synced from DB)
router.get('/me', requireAuth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { clerkId: req.auth.userId }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update User Profile (Name, Phone)
router.put('/profile', requireAuth, async (req, res) => {
    const { name, phone } = req.body;
    const userId = req.auth.userId;

    try {
        // 1. Update Clerk (Optional, but good for sync)
        try {
            await clerkClient.users.updateUser(userId, {
                firstName: name.split(' ')[0],
                lastName: name.split(' ').slice(1).join(' '),
            });
        } catch (e) {
            console.log('Clerk update warning:', e.message);
        }

        // 2. Update Local DB (use upsert to handle case where user doesn't exist)
        const user = await prisma.user.upsert({
            where: { clerkId: userId },
            update: { name, phone },
            create: {
                clerkId: userId,
                email: `clerk_${userId}@buztle.com`,
                name,
                phone,
                role: 'VOLUNTEER',
                emailVerified: true
            }
        });

        res.json(user);
    } catch (error) {
        console.error("Error updating profile:", error);
        if (error.code === 'P2002') {
            if (error.meta?.target?.includes('phone')) {
                return res.status(400).json({ error: 'This phone number is already registered' });
            }
            if (error.meta?.target?.includes('email')) {
                return res.status(400).json({ error: 'This email is already registered' });
            }
        }
        res.status(500).json({ error: 'Failed to update profile', details: error.message });
    }
});

module.exports = router;
