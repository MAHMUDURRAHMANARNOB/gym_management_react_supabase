// import express from 'express';
// import cors from 'cors';
// import { createClient } from '@supabase/supabase-js';
// import dotenv from 'dotenv';

// dotenv.config();

// console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
// console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY);

// const app = express();
// const port = process.env.PORT || 3000;

// // Configure CORS
// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'User-Email'],
// }));

// app.use(express.json());

// // Supabase client setup
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;
// if (!supabaseUrl || !supabaseKey) {
//   throw new Error('SUPABASE_URL or SUPABASE_KEY is missing in .env file');
// }
// const supabase = createClient(supabaseUrl, supabaseKey);

// // Middleware to check if the user is an admin
// const checkAdminRole = async (req, res, next) => {
//   const userEmail = req.headers['user-email'] || req.body.email;
//   console.log('Checking role for email:', userEmail);
//   if (!userEmail) {
//     return res.status(401).json({ error: 'User email required' });
//   }

//   try {
//     const { data: userData, error: userError } = await supabase
//       .from('users')
//       .select('role')
//       .eq('email', userEmail)
//       .single();
//     if (userError || !userData) {
//       console.log('User fetch error:', userError?.message || 'User not found');
//       return res.status(403).json({ error: 'User not found' });
//     }
//     if (userData.role !== 'admin') {
//       console.log('Role check failed:', userData.role);
//       return res.status(403).json({ error: 'Access denied, admin role required' });
//     }

//     req.user = { email: userEmail, role: userData.role };
//     next();
//   } catch (err) {
//     console.error('Role check error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// // Apply the role check to all protected routes
// app.use('/api/members', checkAdminRole);
// app.use('/api/payments', checkAdminRole);
// app.use('/api/expenses', checkAdminRole);

// // Login endpoint
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });
//     if (error) return res.status(400).json({ error: 'Invalid email or password' });

//     const user = data.user;

//     const { data: userData, error: userError } = await supabase
//       .from('users')
//       .select('role')
//       .eq('id', user.id)
//       .single();
//     console.log('User data from users table:', userData);
//     if (userError) return res.status(400).json({ error: 'Error fetching user data' });

//     res.json({ user: { id: user.id, email: user.email, role: userData.role || 'user' } });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Signup endpoint
// app.post('/api/auth/signup', async (req, res) => {
//   try {
//     const { email, password, role } = req.body;
//     console.log('Signup attempt:', { email, role });

//     if (!email || !password) {
//       console.log('Missing email or password:', { email, password });
//       return res.status(400).json({ error: 'Email and password are required' });
//     }

//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//     });
//     if (error) {
//       console.error('Supabase signup error:', error);
//       return res.status(400).json({ error: 'Error creating user: ' + error.message });
//     }

//     const { data: userData, error: insertError } = await supabase
//       .from('users')
//       .insert([{ id: data.user.id, email, role: role || 'user' }])
//       .select()
//       .single();
//     if (insertError) {
//       console.error('Supabase insert error:', insertError);
//       return res.status(400).json({ error: 'Error saving user role: ' + insertError.message });
//     }

//     console.log('User created:', email);
//     res.status(201).json({ message: 'User created', user: userData });
//   } catch (err) {
//     console.error('Signup route error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Members routes
// app.get('/api/members', async (req, res) => {
//   try {
//     const { data, error } = await supabase.from('members').select('*');
//     if (error) {
//       console.error('Error fetching members:', error);
//       return res.status(400).json({ error: error.message });
//     }
//     res.json(data);
//   } catch (err) {
//     console.error('Members route error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.get('/api/members/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { data, error } = await supabase
//       .from('members')
//       .select('*')
//       .eq('id', id)
//       .single();
//     if (error) {
//       console.error('Error fetching member:', error);
//       return res.status(400).json({ error: error.message });
//     }
//     if (!data) {
//       return res.status(404).json({ error: 'Member not found' });
//     }
//     res.json(data);
//   } catch (err) {
//     console.error('Member fetch error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.post('/api/members', async (req, res) => {
//   const memberData = req.body;
//   const { data, error } = await supabase.from('members').insert([memberData]).select();
//   if (error) return res.status(400).json({ error: error.message });
//   res.status(201).json(data);
// });

// app.put('/api/members/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const memberData = req.body;
//     const { data, error } = await supabase
//       .from('members')
//       .update(memberData)
//       .eq('id', id)
//       .select();
//     if (error) {
//       console.error('Error updating member:', error);
//       return res.status(400).json({ error: error.message });
//     }
//     if (!data || data.length === 0) {
//       return res.status(404).json({ error: 'Member not found' });
//     }
//     res.json(data);
//   } catch (err) {
//     console.error('Member update error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.delete('/api/members/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { data, error } = await supabase
//       .from('members')
//       .delete()
//       .eq('id', id)
//       .select();
//     if (error) {
//       console.error('Error deleting member:', error);
//       return res.status(400).json({ error: error.message });
//     }
//     if (!data || data.length === 0) {
//       return res.status(404).json({ error: 'Member not found' });
//     }
//     res.json({ message: 'Member deleted', data });
//   } catch (err) {
//     console.error('Member delete error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Payments routes
// app.get('/api/payments', async (req, res) => {
//   try {
//     const { data, error } = await supabase.from('payments').select('*');
//     if (error) {
//       console.error('Error fetching payments:', error);
//       return res.status(400).json({ error: error.message });
//     }
//     res.json(data);
//   } catch (err) {
//     console.error('Payments route error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.get('/api/payments/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { data, error } = await supabase
//       .from('payments')
//       .select('*')
//       .eq('id', id)
//       .single();
//     if (error) {
//       console.error('Error fetching payment:', error);
//       return res.status(400).json({ error: error.message });
//     }
//     if (!data) {
//       return res.status(404).json({ error: 'Payment not found' });
//     }
//     res.json(data);
//   } catch (err) {
//     console.error('Payment fetch error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.get('/api/payments/member/:memberId', async (req, res) => {
//   try {
//     const { memberId } = req.params;
//     const { data, error } = await supabase
//       .from('payments')
//       .select('*')
//       .eq('member_id', memberId);
//     if (error) {
//       console.error('Error fetching payments by member:', error);
//       return res.status(400).json({ error: error.message });
//     }
//     res.json(data);
//   } catch (err) {
//     console.error('Payments by member fetch error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.post('/api/payments', async (req, res) => {
//   const paymentData = req.body;
//   const { data, error } = await supabase.from('payments').insert([paymentData]).select();
//   if (error) return res.status(400).json({ error: error.message });
//   res.status(201).json(data);
// });

// // Expenses routes
// app.get('/api/expenses', async (req, res) => {
//   try {
//     const { data, error } = await supabase.from('expenses').select('*');
//     if (error) {
//       console.error('Error fetching expenses:', error);
//       return res.status(400).json({ error: error.message });
//     }
//     res.json(data);
//   } catch (err) {
//     console.error('Expenses route error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.post('/api/expenses', async (req, res) => {
//   const expenseData = req.body;
//   const { data, error } = await supabase.from('expenses').insert([expenseData]).select();
//   if (error) return res.status(400).json({ error: error.message });
//   res.status(201).json(data);
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
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
    if (userError || !userData) {
      console.log('User fetch error:', userError?.message || 'User not found');
      return res.status(403).json({ error: 'User not found' });
    }
    if (userData.role !== 'admin') {
      console.log('Role check failed:', userData.role);
      return res.status(403).json({ error: 'Access denied, admin role required' });
    }

    req.user = { email: userEmail, role: userData.role };
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

app.get('/api/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Error fetching member:', error);
      return res.status(400).json({ error: error.message });
    }
    if (!data) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(data);
  } catch (err) {
    console.error('Member fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// app.post('/api/members', async (req, res) => {
//   console.log('Received member data:', req.body);
//   const { data, error } = await supabase.from('members').insert([req.body]).select();
//   if (error) {
//     console.error('Supabase error:', error);
//     return res.status(400).json({ error: error.message });
//   }
//   res.status(201).json(data);
// });
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
  res.status(201).json(data);
});

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});