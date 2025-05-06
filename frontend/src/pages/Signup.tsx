// src/pages/Signup.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { signup } from '../api/api';
import { AxiosError } from 'axios';

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signup(email, password, 'admin'); // Default role as 'user'
      navigate('/');
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      const errorMessage = axiosError.response?.data?.error || 'Signup failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#f5f5f5',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
          <FitnessCenterIcon sx={{ color: '#800000', mr: 1 }} />
          <Typography variant="h5" color="#800000">
            Gym Management
          </Typography>
        </Box>
        <Typography variant="h6" align="center" mb={3}>
          Sign Up
        </Typography>
        <form onSubmit={handleSignup}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            placeholder="Enter your email"
            InputLabelProps={{
              sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } },
            }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            placeholder="Enter your password"
            InputLabelProps={{
              sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } },
            }}
          />
          {error && (
            <Typography color="error" align="center" mt={2}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Sign Up
          </Button>
        </form>
        <Button
          onClick={() => navigate('/login')}
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Already have an account? Login
        </Button>
      </Paper>
    </Box>
  );
}

export default Signup;