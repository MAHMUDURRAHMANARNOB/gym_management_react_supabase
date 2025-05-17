// // src/pages/Signup.tsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Box, TextField, Button, Typography, Paper } from '@mui/material';
// import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
// import { signup } from '../api/api';
// import { AxiosError } from 'axios';

// function Signup() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     try {
//       await signup(email, password, 'admin'); // Default role as 'user'
//       navigate('/');
//     } catch (err) {
//       const axiosError = err as AxiosError<{ error: string }>;
//       const errorMessage = axiosError.response?.data?.error || 'Signup failed. Please try again.';
//       setError(errorMessage);
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
//           Sign Up
//         </Typography>
//         <form onSubmit={handleSignup}>
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
//             Sign Up
//           </Button>
//         </form>
//         <Button
//           onClick={() => navigate('/login')}
//           color="secondary"
//           fullWidth
//           sx={{ mt: 2 }}
//         >
//           Already have an account? Login
//         </Button>
//       </Paper>
//     </Box>
//   );
// }

// export default Signup;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';
import { signup } from '../api/api';
import { AxiosError } from 'axios';

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-3">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-6 w-6 text-[#800000]" />
            <CardTitle className="text-2xl font-bold text-[#800000]">
              Gym Management
            </CardTitle>
          </div>
          <h2 className="text-xl font-semibold text-center">
            Sign Up
          </h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#800000]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="border-[#800000] focus:ring-[#800000]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#800000]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="border-[#800000] focus:ring-[#800000]"
              />
            </div>
            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}
            <Button
              onClick={handleSignup}
              className="w-full bg-[#800000] hover:bg-[#600000] text-white"
            >
              Sign Up
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="w-full border-[#800000] text-[#800000] hover:bg-[#800000] hover:text-white"
            >
              Already have an account? Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Signup;