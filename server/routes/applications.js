const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/auth');
const { validate, validationRules } = require('../middleware/validation');

const prisma = new PrismaClient();

// Apply for Event (Volunteer only)
router.post('/', authenticateToken, validationRules.createApplication, validate, async (req, res, next) => {
    if (req.user.role !== 'VOLUNTEER') {
        return res.status(403).json({ error: 'Only volunteers can apply' });
    }

    const { eventId } = req.body;

    try {
        // Check if already applied
        const existing = await prisma.application.findFirst({
            where: {
                eventId: parseInt(eventId),
                volunteerId: req.user.id
            }
        });

        if (existing) {
            return res.status(400).json({ error: 'Already applied' });
        }

        const application = await prisma.application.create({
            data: {
                eventId: parseInt(eventId),
                volunteerId: req.user.id,
                status: 'PENDING'
            }
        });
        res.json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to apply' });
    }
});

// Get My Applications (Volunteer)
router.get('/my-applications', authenticateToken, async (req, res) => {
    try {
        const applications = await prisma.application.findMany({
            where: { volunteerId: req.user.id },
            include: { event: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

// Get Applications for Event (Organizer)
router.get('/event/:eventId', authenticateToken, async (req, res) => {
    const { eventId } = req.params;

    try {
        // Verify ownership
        const event = await prisma.event.findUnique({
            where: { id: parseInt(eventId) }
        });

        if (!event || event.organizerId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const applications = await prisma.application.findMany({
            where: { eventId: parseInt(eventId) },
            include: { volunteer: { select: { name: true, phone: true, photoUrl: true, isVerified: true } } }
        });
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

// Update Application Status (Organizer)
router.patch('/:id', authenticateToken, validationRules.updateApplicationStatus, validate, async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body; // ACCEPTED, REJECTED

    try {
        const application = await prisma.application.findUnique({
            where: { id: parseInt(id) },
            include: { event: true }
        });

        if (!application) return res.status(404).json({ error: 'Application not found' });

        if (application.event.organizerId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const updated = await prisma.application.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update application' });
    }
});

// Cancel Application (Volunteer only)
router.delete('/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'VOLUNTEER') {
        return res.status(403).json({ error: 'Only volunteers can cancel applications' });
    }

    const { id } = req.params;

    try {
        const application = await prisma.application.findUnique({
            where: { id: parseInt(id) }
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        if (application.volunteerId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to cancel this application' });
        }

        // Only allow canceling pending applications
        if (application.status !== 'PENDING') {
            return res.status(400).json({ error: 'Can only cancel pending applications' });
        }

        await prisma.application.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Application canceled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to cancel application' });
    }
});

module.exports = router;
