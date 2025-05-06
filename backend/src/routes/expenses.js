// Defines /api/expenses endpoints to get and add expenses (admin only).

// src/routes/expenses.js
const express = require('express');
const supabase = require('../config/supabase');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get all expenses (admin only)
// GET /api/expenses: Retrieves all expenses (admin only).
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('expenses')
            .select('id, category, amount, expense_date, description');
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add an expense (admin only)
// POST /api/expenses: Adds a new expense, validates required fields.
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const { category, amount, expense_date, description } = req.body;
    if (!category || !amount || !expense_date) {
        return res.status(400).json({ error: 'Category, amount, and date required' });
    }
    try {
        const { data, error } = await supabase
            .from('expenses')
            .insert([{ category, amount, expense_date, description }])
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