const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Custom Middleware to Sync Clerk User with Database
// This runs AFTER ClerkExpressRequireAuth validates the token
const syncUserToDb = async (req, res, next) => {
    try {
        const { userId, claims } = req.auth; // 'req.auth' is populated by Clerk middleware

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: No user ID found' });
        }

        // Upsert User: Create if not exists, Update if exists
        // We use the 'clerkId' field to link them
        const user = await prisma.user.upsert({
            where: { clerkId: userId },
            update: {
                email: claims.email_public_metadata?.email || claims.sub, // Fallback if needed
                // We might not get all details from the token claims depending on config
                // Ideally, we just ensure the record exists so foreign keys work
            },
            create: {
                clerkId: userId,
                email: claims.email_public_metadata?.email || `clerk_${userId}@buztle.com`, // Temp email if missing
                role: claims.public_metadata?.role || 'VOLUNTEER',
                emailVerified: true // Clerk handles this
            }
        });

        // Attach DB user to request for downstream routes
        req.user = user;
        next();
    } catch (error) {
        console.error("Error syncing user to DB:", error);
        res.status(500).json({ error: 'Internal Server Error during User Sync' });
    }
};

// Export the combined middleware stack
// 1. Verify Token (Clerk)
// 2. Sync to DB (Prisma)
module.exports = {
    requireAuth: [
        ClerkExpressRequireAuth({
            // Placeholder for Secret Key if not in env, though SDK usually looks for CLERK_SECRET_KEY
            // validTokens: ...
        }),
        syncUserToDb
    ]
};
