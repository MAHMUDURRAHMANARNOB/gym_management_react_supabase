
// src/pages/Login.tsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { Box, TextField, Button, Typography, Paper } from '@mui/material';
// import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
// import { login as loginAction } from '../store/authSlice';
// import { login } from '../api/api';

// function Login() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     try {
//       const response = await login(email, password);
//       dispatch(loginAction({ token: response.token, role: response.user.role, userId: response.user.id }));
//       navigate('/dashboard');
//     } catch (err) {
//       setError('Login failed. Please try again.');
//     }
//   };

//   return (
//     <Box
//       sx={{
//         height: '100vh',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         bgcolor: '#f5f5f5',
//       }}
//     >
//       <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
//         <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
//           <FitnessCenterIcon sx={{ color: '#800000', mr: 1 }} />
//           <Typography variant="h5" color="#800000">
//             Gym Management
//           </Typography>
//         </Box>
//         <Typography variant="h6" align="center" mb={3}>
//           Login
//         </Typography>
//         <form onSubmit={handleLogin}>
//           <TextField
//             label="Email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             fullWidth
//             margin="normal"
//             required
//             placeholder="Enter your email"
//             InputLabelProps={{
//               sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } },
//             }}
//           />
//           <TextField
//             label="Password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             fullWidth
//             margin="normal"
//             required
//             placeholder="Enter your password"
//             InputLabelProps={{
//               sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } },
//             }}
//           />
//           {error && (
//             <Typography color="error" align="center" mt={2}>
//               {error}
//             </Typography>
//           )}
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             fullWidth
//             sx={{ mt: 3 }}
//           >
//             Login
//           </Button>
//         </form>
//         <Button
//           onClick={() => navigate('/signup')}
//           color="secondary"
//           fullWidth
//           sx={{ mt: 2 }}
//         >
//           Don't have an account? Sign Up
//         </Button>
//       </Paper>
//     </Box>
//   );
// }

// export default Login;

// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, TextField, Button, Typography, Paper, CircularProgress } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { loginSuccess as loginAction } from '../store/authSlice';
import { login } from '../api/api';
import { AxiosError } from 'axios';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await login(email, password);
      console.log('Login response:', JSON.stringify(response, null, 2));
      dispatch(loginAction({
        userId: response.user.id,
        email: response.user.email,
        role: response.user.role,
      }));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to login');
    } finally{
        setLoading(false); // Stop loading (whether success or failure))
  }};

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
          Login
        </Typography>
        <form onSubmit={handleLogin}>
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
          sx={{ mt: 2 }}
          disabled={loading} // Disable button while loading
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>
        </form>
        <Button
          onClick={() => navigate('/signup')}
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Don't have an account? Sign Up
        </Button>
      </Paper>
    </Box>
  );
}

export default Login;