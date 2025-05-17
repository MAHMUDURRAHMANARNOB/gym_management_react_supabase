// // src/pages/Login.tsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { Box, TextField, Button, Typography, Paper, CircularProgress } from '@mui/material';
// import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
// import { loginSuccess as loginAction } from '../store/authSlice';
// import { login } from '../api/api';
// import { AxiosError } from 'axios';

// function Login() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false); // Add loading state

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true); // Start loading
//     try {
//       const response = await login(email, password);
//       console.log('Login response:', JSON.stringify(response, null, 2));
//       dispatch(loginAction({
//         userId: response.user.id,
//         email: response.user.email,
//         role: response.user.role,
//       }));
//       navigate('/dashboard');
//     } catch (err: any) {
//       setError(err.response?.data?.error || err.message || 'Failed to login');
//     } finally{
//         setLoading(false); // Stop loading (whether success or failure))
//   }};

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
//           type="submit"
//           variant="contained"
//           color="primary"
//           fullWidth
//           sx={{ mt: 2 }}
//           disabled={loading} // Disable button while loading
//         >
//           {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
//         </Button>
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

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { loginSuccess as loginAction } from '../store/authSlice';
// import { login } from '../api/api';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// function Login() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(''); // Clear previous errors
//     try {
//       const response = await login(email, password);
//       console.log('Login response:', JSON.stringify(response, null, 2));
//       dispatch(loginAction({
//         userId: response.user.id,
//         email: response.user.email,
//         role: response.user.role,
//       }));
//       navigate('/dashboard');
//     } catch (err: any) {
//       setError(err.response?.data?.error || err.message || 'Failed to login');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <Card className="w-full max-w-md p-6 shadow-lg">
//         <CardHeader className="text-center">
//           <div className="flex items-center justify-center mb-4">
//             <svg
//               className="w-8 h-8 text-primary mr-2"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M12 6v6h4m-4 6v-6H8m-2-6h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2z"
//               />
//             </svg>
//             <CardTitle className="text-2xl font-bold text-primary">Natural Fitness GYM</CardTitle>
//           </div>
//           <h2 className="text-xl font-semibold text-gray-700">Login</h2>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleLogin} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <Input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 required
//                 className="border-gray-300 focus:border-primary focus:ring-primary"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <Input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 required
//                 className="border-gray-300 focus:border-primary focus:ring-primary"
//               />
//             </div>
//             {error && (
//               <p className="text-red-500 bg-red-50 p-2 rounded text-center">
//                 {error}
//               </p>
//             )}
//             <Button
//               type="submit"
//               className="w-full bg-primary hover:bg-primaryDark"
//               disabled={loading}
//             >
//               {loading ? (
//                 <svg
//                   className="animate-spin h-5 w-5 mr-2"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                     fill="none"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                   />
//                 </svg>
//               ) : null}
//               Login
//             </Button>
//           </form>
//           <Button
//             variant="outline"
//             onClick={() => navigate('/signup')}
//             className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-white"
//           >
//             Don't have an account? Sign Up
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default Login;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { login } from '../api/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login(email, password);
      console.log('Login response:', JSON.stringify(response, null, 2));
      dispatch(loginSuccess({
        userId: response.user.id,
        email: response.user.email,
        role: response.user.role,
      }));
      localStorage.setItem('session', JSON.stringify(response.session));
      localStorage.setItem('email', response.user.email);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-primary mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6h4m-4 6v-6H8m-2-6h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2z"
              />
            </svg>
            <CardTitle className="text-2xl font-bold text-primary">Natural Fitness GYM</CardTitle>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Login</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>
            {error && (
              <p className="text-red-500 bg-red-50 p-2 rounded text-center">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primaryDark"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : null}
              Login
            </Button>
          </form>
          <Button
            variant="outline"
            onClick={() => navigate('/signup')}
            className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-white"
          >
            Don't have an account? Sign Up
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
