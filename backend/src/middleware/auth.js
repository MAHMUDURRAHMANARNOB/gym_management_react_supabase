// This file defines middleware functions to verify JWT tokens from Supabase and check user roles (e.g., admin access).

// src/middleware/auth.js
const supabase = require('../config/supabase');

//authMiddleware: Extracts the JWT from the Authorization header (format: Bearer <token>), verifies it with Supabase, and attaches the user to req.user.
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const { data, error } = await supabase.auth.getUser(token);
        if (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = data.user;
        next();
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};


// adminMiddleware: Checks if the user’s role in the users table is admin. Used to restrict certain endpoints (e.g., adding members) to admins.
const adminMiddleware = async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', req.user.id)
            .single();
        if (error || data.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { authMiddleware, adminMiddleware };