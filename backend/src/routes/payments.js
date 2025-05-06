// Defines /api/payments endpoints to get and add payments (admin only).

// src/routes/payments.js
const express = require('express');
const supabase = require('../config/supabase');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get all payments (admin only)
// GET /api/payments: Retrieves all payments (admin only, enforced by RLS and middleware).
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('payments')
            .select('id, member_id, gym_id, total_amount, amount_paid, is_fully_paid, payment_date, package_type, payment_method');
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a payment (admin only)
// POST /api/payments: Adds a new payment, calculates is_fully_paid based on amount_paid and total_amount.
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const { member_id, gym_id, total_amount, amount_paid, payment_date, package_type, payment_method } = req.body;
    if (!member_id || !gym_id || !total_amount || !amount_paid || !payment_date || !package_type || !payment_method) {
        return res.status(400).json({ error: 'All fields required: member_id, gym_id, total_amount, amount_paid, payment_date, package_type, payment_method' });
    }
    const is_fully_paid = amount_paid >= total_amount;
    try {
        const { data, error } = await supabase
            .from('payments')
            .insert([{ member_id, gym_id, total_amount, amount_paid, is_fully_paid, payment_date, package_type, payment_method }])
            .select();
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

