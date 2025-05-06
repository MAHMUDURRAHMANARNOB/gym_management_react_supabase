// Defines /api/members endpoints to get and add members.

// src/routes/members.js
const express = require('express');
const supabase = require('../config/supabase');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get all active members (accessible to admins and receptionists)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('members')
            .select('id, gym_id, first_name, last_name, email, phone, package_type, status')
            .eq('status', 'Active');
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a member (admin only)
// POST /api/members: Adds a new member (admin only), validates required fields and constraints (e.g., package_type).
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const {
        gym_id,
        first_name,
        last_name,
        email,
        phone,
        package_type,
        status = 'Active',
        height,
        weight,
        chest,
        waist,
        hips,
        blood_group,
        bmi,
        goal = 'General Fitness',
        gender = 'Other'
    } = req.body;

    if (!gym_id || !first_name || !last_name || !email || !phone || !package_type) {
        return res.status(400).json({ error: 'Required fields: gym_id, first_name, last_name, email, phone, package_type' });
    }

    const validPackageTypes = ['Monthly', '3 Months', '6 Months', 'Yearly'];
    if (!validPackageTypes.includes(package_type)) {
        return res.status(400).json({ error: 'Invalid package_type. Must be one of: Monthly, 3 Months, 6 Months, Yearly' });
    }

    const validStatuses = ['Active', 'Inactive'];
    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be one of: Active, Inactive' });
    }

    const validGoals = ['Weight Loss', 'Muscle Gain', 'General Fitness', 'Other'];
    if (goal && !validGoals.includes(goal)) {
        return res.status(400).json({ error: 'Invalid goal. Must be one of: Weight Loss, Muscle Gain, General Fitness, Other' });
    }

    const validGenders = ['Male', 'Female', 'Other'];
    if (gender && !validGenders.includes(gender)) {
        return res.status(400).json({ error: 'Invalid gender. Must be one of: Male, Female, Other' });
    }

    try {
        const { data, error } = await supabase
            .from('members')
            .insert([{ gym_id, first_name, last_name, email, phone, package_type, status, height, weight, chest, waist, hips, blood_group, bmi, goal, gender }])
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