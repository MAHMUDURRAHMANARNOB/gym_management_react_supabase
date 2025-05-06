// Defines /api/auth endpoints for user login and signup.

// src/routes/auth.js
const express = require('express');
const supabase = require('../config/supabase');
const router = express.Router();

// /api/auth/login: Authenticates users with Supabase, returns a JWT and user info (including role).
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', data.user.id)
            .single();
        if (userError) {
            return res.status(400).json({ error: userError.message });
        }
        res.json({
            token: data.session.access_token,
            user: { id: data.user.id, email: data.user.email, role: userData.role }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// /api/auth/signup: Registers new users, defaults role to receptionist if not specified.
router.post('/signup', async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { role: role || 'receptionist' } }
        });
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.json({ user: { id: data.user.id, email: data.user.email } });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

