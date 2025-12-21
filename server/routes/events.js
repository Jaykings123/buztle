const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');
const { validate, validationRules } = require('../middleware/validation');

const prisma = new PrismaClient();

// Create Event (Organizer only)
router.post('/', requireAuth, validationRules.createEvent, validate, async (req, res, next) => {
    if (req.user.role !== 'ORGANIZER') {
        return res.status(403).json({ error: 'Only organizers can create events' });
    }

    const { title, description, date, time, location, payDetails, requirements } = req.body;

    try {
        const event = await prisma.event.create({
            data: {
                organizerId: req.user.id,
                title,
                description,
                date,
                time,
                location,
                payDetails,
                requirements,
                status: 'OPEN'
            }
        });
        res.json(event);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: 'Failed to create event', details: error.message });
    }
});

// Get Organizer's Events (Optimized with Applications)
router.get('/my-events', requireAuth, async (req, res) => {
    if (req.user.role !== 'ORGANIZER') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const events = await prisma.event.findMany({
            where: { organizerId: req.user.id },
            include: {
                organizer: { select: { name: true, photoUrl: true, clerkId: true } },
                applications: {
                    include: { volunteer: true },
                    orderBy: { createdAt: 'desc' }
                },
                _count: {
                    select: { applications: { where: { status: 'ACCEPTED' } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(events);
    } catch (error) {
        console.error("Error fetching my events:", error);
        res.status(500).json({ error: 'Failed to fetch your events' });
    }
});

// List Events (Public)
router.get('/', async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            where: { status: 'OPEN' },
            include: {
                organizer: { select: { name: true, photoUrl: true, clerkId: true } },
                _count: {
                    select: { applications: { where: { status: 'ACCEPTED' } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Get Event Details
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const event = await prisma.event.findUnique({
            where: { id: parseInt(id) },
            include: {
                organizer: { select: { name: true, photoUrl: true } },
                _count: {
                    select: { applications: { where: { status: 'ACCEPTED' } } }
                }
            }
        });
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
});

// Cancel/Delete Event (Organizer only)
router.delete('/:id', requireAuth, async (req, res) => {
    if (req.user.role !== 'ORGANIZER') {
        return res.status(403).json({ error: 'Only organizers can cancel events' });
    }

    const { id } = req.params;

    try {
        // Verify ownership
        const event = await prisma.event.findUnique({
            where: { id: parseInt(id) }
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (event.organizerId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to cancel this event' });
        }

        // Delete all applications for this event first
        await prisma.application.deleteMany({
            where: { eventId: parseInt(id) }
        });

        // Delete the event
        await prisma.event.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Event canceled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to cancel event' });
    }
});

module.exports = router;
