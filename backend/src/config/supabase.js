// src/config/supabase.js
require('dotenv').config(); //require('dotenv').config() loads environment variables from .env.
const { createClient } = require('@supabase/supabase-js'); //createClient initializes a Supabase client using your SUPABASE_URL and SUPABASE_ANON_KEY.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase; //module.exports makes the client available for use in other files.