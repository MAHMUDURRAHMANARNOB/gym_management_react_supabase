import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY);

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'User-Email'],
}));

app.use(express.json());

// Supabase client setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL or SUPABASE_KEY is missing in .env file');
}
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware to check if the user is an admin
const checkAdminRole = async (req, res, next) => {
    const userEmail = req.headers['user-email'] || req.body.email;
    console.log('Checking role for email:', userEmail);
    if (!userEmail) {
        return res.status(401).json({ error: 'User email required' });
    }

    try {
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('email', userEmail)
        .single();
    if (userError) {
      console.error('User fetch error:', userError.message);
      return res.status(403).json({ error: `Failed to fetch user: ${userError.message}` });
    }
    if (!userData) {
      console.log('User not found for email:', userEmail);
      return res.status(403).json({ error: 'User not found' });
    }
    if (userData.role !== 'admin') {
        console.log('Role check failed:', userData.role);
        return res.status(403).json({ error: 'Access denied, admin role required' });
    }

    req.user = { email: userEmail, role: userData.role };
    console.log('Role check passed for email:', userEmail);
    next();
    } catch (err) {
    console.error('Role check error:', err);
    res.status(500).json({ error: 'Internal server error' });
    }
};

// Apply the role check to all protected routes
app.use('/api/members', checkAdminRole);
app.use('/api/payments', checkAdminRole);
app.use('/api/expenses', checkAdminRole);
app.use('/api/income', checkAdminRole);
app.use('/api/supplements_inventory', checkAdminRole);
app.use('/api/supplement_sales', checkAdminRole);
app.use('/api/assets', checkAdminRole);


// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) return res.status(400).json({ error: 'Invalid email or password' });

    const user = data.user;

    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
    console.log('User data from users table:', userData);
    if (userError) return res.status(400).json({ error: 'Error fetching user data' });

    res.json({ user: { id: user.id, email: user.email, role: userData.role || 'user' } });
    } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
    }
});

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
    try {
    const { email, password, role } = req.body;
    console.log('Signup attempt:', { email, role });

    if (!email || !password) {
        console.log('Missing email or password:', { email, password });
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    if (error) {
        console.error('Supabase signup error:', error);
        return res.status(400).json({ error: 'Error creating user: ' + error.message });
    }

    const { data: userData, error: insertError } = await supabase
        .from('users')
        .insert([{ id: data.user.id, email, role: role || 'user' }])
        .select()
        .single();
    if (insertError) {
        console.error('Supabase insert error:', insertError);
        return res.status(400).json({ error: 'Error saving user role: ' + insertError.message });
    }

    console.log('User created:', email);
    res.status(201).json({ message: 'User created', user: userData });
    } catch (err) {
    console.error('Signup route error:', err);
    res.status(500).json({ error: 'Internal server error' });
    }
});

// Members routes
app.get('/api/members', async (req, res) => {
    try {
    const { data, error } = await supabase.from('members').select('*');
    if (error) {
        console.error('Error fetching members:', error);
        return res.status(400).json({ error: error.message });
    }
    res.json(data);
    } catch (err) {
    console.error('Members route error:', err);
    res.status(500).json({ error: 'Internal server error' });
    }
});

// Get member by gymID
app.get('/api/members/gym/:gymId', async (req, res) => {
    try {
        const { gymId } = req.params;
        const { data, error } = await supabase
        .from('members')
        .select('id, first_name, last_name')
        .eq('gym_id', gymId);
        if (error) {
        console.error('Error fetching members by gym_id:', error);
        return res.status(400).json({ error: error.message });
        }
        res.json(data);
    } catch (err) {
        console.error('Members by gym_id fetch error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get member by ID
app.get('/api/members/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .eq('id', id)
            .single(); // Use .single() to expect one record
        if (error) {
            console.error('Error fetching member by ID:', error);
            return res.status(400).json({ error: error.message });
        }
        if (!data) {
            return res.status(404).json({ error: 'Member not found' });
        }
        res.json(data);
    } catch (err) {
        console.error('Member fetch by ID error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/members', async (req, res) => {
    const memberData = req.body;
    console.log('Inserting member data:', memberData);
    const { data, error } = await supabase.from('members').insert([memberData]).select();
    if (error) {
    console.error('Supabase error:', error);
    return res.status(400).json({ error: error.message });
    }
    res.status(201).json(data);
});

app.put('/api/members/:id', async (req, res) => {
    try {
    const { id } = req.params;
    const memberData = req.body;
    const { data, error } = await supabase
        .from('members')
        .update(memberData)
        .eq('id', id)
        .select();
    if (error) {
        console.error('Error updating member:', error);
        return res.status(400).json({ error: error.message });
    }
    if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Member not found' });
    }
    res.json(data);
    } catch (err) {
    console.error('Member update error:', err);
    res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/members/:id', async (req, res) => {
    try {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('members')
        .delete()
        .eq('id', id)
        .select();
    if (error) {
        console.error('Error deleting member:', error);
        return res.status(400).json({ error: error.message });
    }
    if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Member not found' });
    }
    res.json({ message: 'Member deleted', data });
    } catch (err) {
    console.error('Member delete error:', err);
    res.status(500).json({ error: 'Internal server error' });
    }
});

// Payments routes
app.get('/api/payments', async (req, res) => {
    try {
    const { data, error } = await supabase.from('payments').select('*');
    if (error) {
        console.error('Error fetching payments:', error);
        return res.status(400).json({ error: error.message });
    }
    res.json(data);
    } catch (err) {
    console.error('Payments route error:', err);
    res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/payments/:id', async (req, res) => {
    try {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', id)
        .single();
    if (error) {
        console.error('Error fetching payment:', error);
        return res.status(400).json({ error: error.message });
    }
    if (!data) {
        return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(data);
    } catch (err) {
    console.error('Payment fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/payments/member/:memberId', async (req, res) => {
    try {
    const { memberId } = req.params;
    const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('member_id', memberId);
    if (error) {
        console.error('Error fetching payments by member:', error);
        return res.status(400).json({ error: error.message });
    }
    res.json(data);
    } catch (err) {
    console.error('Payments by member fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
    }
});



// POST endpoint for adding a payment
app.post('/api/payments', async (req, res) => {
    const paymentData = req.body;
    console.log('Inserting payment data:', paymentData);
    const { data, error } = await supabase.from('payments').insert([paymentData]).select();
    if (error) {
    console.error('Supabase error:', error);
    return res.status(400).json({ error: error.message });
    }

// Record income from payment
    const incomeData = {
        source_type: 'member_payment',
        source_id: data[0].id,
        amount: paymentData.amount_paid,
        description: `Payment for ${paymentData.package_type} package`,
    };
    const { error: incomeError } = await supabase.from('income').insert([incomeData]);
    if (incomeError) {
        console.error('Income recording error:', incomeError);
    // Continue with payment success, log the error
    }

    res.status(201).json(data);
});

// Income routes
app.get('/api/income', async (req, res) => {
  try {
    const { data, error } = await supabase.from('income').select('*');
    if (error) {
      console.error('Error fetching income:', error);
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Income route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Supplements Inventory routes
app.get('/api/supplements_inventory', async (req, res) => {
  try {
    const { data, error } = await supabase.from('supplements_inventory').select('*');
    if (error) {
      console.error('Error fetching supplements inventory:', error);
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Supplements inventory route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/supplements_inventory', async (req, res) => {
  const inventoryData = req.body;
  console.log('Inserting supplement inventory data:', inventoryData);
  const { data, error } = await supabase.from('supplements_inventory').insert([inventoryData]).select();
  if (error) {
    console.error('Supabase error:', error);
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json(data);
});

app.put('/api/supplements_inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const inventoryData = req.body;
    const { data, error } = await supabase
      .from('supplements_inventory')
      .update(inventoryData)
      .eq('id', id)
      .select();
    if (error) {
      console.error('Error updating supplement inventory:', error);
      return res.status(400).json({ error: error.message });
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Supplement not found' });
    }
    res.json(data);
  } catch (err) {
    console.error('Supplement inventory update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Supplement Sales routes
app.get('/api/supplement_sales', async (req, res) => {
  try {
    const { data, error } = await supabase.from('supplement_sales').select('*');
    if (error) {
      console.error('Error fetching supplement sales:', error);
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Supplement sales route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/supplement_sales', async (req, res) => {
  const saleData = req.body;
  console.log('Inserting supplement sale data:', saleData);

  // Check and update inventory
  const { data: inventory, error: inventoryError } = await supabase
    .from('supplements_inventory')
    .select('quantity')
    .eq('id', saleData.supplement_id)
    .single();
  if (inventoryError || !inventory) {
    console.error('Inventory fetch error:', inventoryError);
    return res.status(400).json({ error: 'Supplement not found' });
  }
  if (inventory.quantity < saleData.quantity_sold) {
    return res.status(400).json({ error: 'Insufficient stock' });
  }

  const { data, error } = await supabase.from('supplement_sales').insert([saleData]).select();
  if (error) {
    console.error('Supabase error:', error);
    return res.status(400).json({ error: error.message });
  }

  // Update inventory quantity
  const newQuantity = inventory.quantity - saleData.quantity_sold;
  const { error: updateError } = await supabase
    .from('supplements_inventory')
    .update({ quantity: newQuantity, updated_at: new Date() })
    .eq('id', saleData.supplement_id);
  if (updateError) {
    console.error('Inventory update error:', updateError);
    // Continue with sale success, log the error
  }

  // Record income from sale
  const incomeData = {
    source_type: 'supplement_sale',
    source_id: data[0].id,
    amount: saleData.sale_price * saleData.quantity_sold,
    description: `Sale of ${saleData.quantity_sold} units of supplement ID ${saleData.supplement_id}`,
  };
  const { error: incomeError } = await supabase.from('income').insert([incomeData]);
  if (incomeError) {
    console.error('Income recording error:', incomeError);
    // Continue with sale success, log the error
  }

  res.status(201).json(data);
});

// get gym member details by gymid
app.get('/api/members/gym/:gymId', async (req, res) => {
    try {
        const { gymId } = req.params;
        const { data, error } = await supabase
        .from('members')
        .select('id, first_name, last_name')
        .eq('gym_id', gymId);
    if (error) {
        console.error('Error fetching members by gym_id:', error);
        return res.status(400).json({ error: error.message });
    }
    res.json(data);
    } catch (err) {
    console.error('Members by gym_id fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
    }
});

// Expenses routes
app.get('/api/expenses', async (req, res) => {
    try {
        const { data, error } = await supabase.from('expenses').select('*');
        if (error) {
        console.error('Error fetching expenses:', error);
        return res.status(400).json({ error: error.message });
    }
    res.json(data);
    } catch (err) {
    console.error('Expenses route error:', err);
    res.status(500).json({ error: 'Internal server error' });
    }
});

// POST endpoint for adding an expense
app.post('/api/expenses', async (req, res) => {
    const expenseData = req.body;
    console.log('Inserting expense data:', expenseData);
    const { data, error } = await supabase.from('expenses').insert([expenseData]).select();
    if (error) {
    console.error('Supabase error:', error);
    return res.status(400).json({ error: error.message });
    }
    res.status(201).json(data);
});

// Assets routes
app.get('/api/assets', async (req, res) => {
    try {
        const { data, error } = await supabase.from('assets').select('*');
        if (error) {
            console.error('Error fetching assets:', error);
            return res.status(400).json({ error: error.message });
        }
        res.json(data);
    } catch (err) {
        console.error('Assets route error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/assets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('assets')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            console.error('Error fetching asset:', error);
            return res.status(400).json({ error: error.message });
        }
        if (!data) {
            return res.status(404).json({ error: 'Asset not found' });
        }
        res.json(data);
    } catch (err) {
        console.error('Asset fetch error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/assets', async (req, res) => {
    try {
        const assetData = req.body;
        console.log('Inserting asset data:', assetData);
        // Calculate total_valuation
        assetData.total_valuation = (assetData.value * assetData.quantity).toFixed(2);
        const { data, error } = await supabase.from('assets').insert([assetData]).select();
        if (error) {
            console.error('Supabase error:', error);
            return res.status(400).json({ error: error.message });
        }
        res.status(201).json(data);
    } catch (err) {
        console.error('Asset creation error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/assets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const assetData = req.body;
        console.log('Updating asset data:', assetData);
        // Recalculate total_valuation if value or quantity is updated
        if (assetData.value && assetData.quantity) {
            assetData.total_valuation = (assetData.value * assetData.quantity).toFixed(2);
        }
        const { data, error } = await supabase
            .from('assets')
            .update(assetData)
            .eq('id', id)
            .select();
        if (error) {
            console.error('Error updating asset:', error);
            return res.status(400).json({ error: error.message });
        }
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Asset not found' });
        }
        res.json(data);
    } catch(err) {
        console.error('Asset update error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/assets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('assets')
            .delete()
            .eq('id', id)
            .select();
        if (error) {
            console.error('Error deleting asset:', error);
            return res.status(400).json({ error: error.message });
        }
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Asset not found' });
        }
        res.json({ message: 'Asset deleted', data });
    } catch (err) {
        console.error('Asset delete error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});