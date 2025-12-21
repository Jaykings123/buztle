const express = require('express');
const router = express.Router();

// Auth is now handled by Clerk (Frontend) and Middleware (Backend).
// This file is kept as a placeholder if we need custom auth-related endpoints 
// (e.g., syncing role updates manually, though middleware handles upsert).

module.exports = router;
