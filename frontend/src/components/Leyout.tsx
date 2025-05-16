// // src/Leyout.tsx (rename to Layout.tsx if not already)
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
// import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, Box, Button } from '@mui/material';
// import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
// import { Link } from '@mui/material';
// import LogoutIcon from '@mui/icons-material/Logout';
// import { useDispatch } from 'react-redux';
// import { logout as logoutAction } from '../store/authSlice';

// interface LayoutProps {
//   children: React.ReactNode;
//   onLogout?: () => void; // Make optional and handle undefined
// }

// function Layout({ children, onLogout }: LayoutProps) {
//   const drawerWidth = 240;
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     dispatch(logoutAction()); // Dispatch logout action
//     if (onLogout) onLogout(); // Call the provided onLogout function if it exists
//     navigate('/login'); // Navigate to login page
//   };

//   return (
//     <Box sx={{ display: 'flex' }}>
//       {/* Sidebar */}
//       <Drawer
//         sx={{
//           width: drawerWidth,
//           flexShrink: 0,
//           '& .MuiDrawer-paper': {
//             width: drawerWidth,
//             boxSizing: 'border-box',
//             backgroundColor: '#1A1A1A',
//             color: '#FFFFFF',
//           },
//         }}
//         variant="permanent"
//         anchor="left"
//       >
//         <Box sx={{ p: 2, borderBottom: '1px solid #800000', display: 'flex', alignItems: 'center', gap: 1 }}>
//           <FitnessCenterIcon />
//           <Typography variant="h6">Natural Fitness</Typography>
//         </Box>
//         <List>
//           {[
//             { text: 'Dashboard', path: '/dashboard' },
//             { text: 'Members', path: '/members' },
//             { text: 'Payments', path: '/payments' },
//             { text: 'Expenses', path: '/expenses' },
//             { text: 'Supplements', path: '/supplements' }, // Added Supplements
//             { text: 'Income', path: '/income' }, // Added Income

//           ].map((item) => (
//             <ListItem
//               key={item.text}
//               sx={{
//                 '&:hover': { backgroundColor: '#800000' },
//               }}
//             >
//               <ListItemText>
//                 <Link
//                   component={RouterLink}
//                   to={item.path}
//                   sx={{ color: '#FFFFFF', textDecoration: 'none', '&:hover': { backgroundColor: '#800000' } }}
//                 >
//                   {item.text}
//                 </Link>
//               </ListItemText>
//             </ListItem>
//           ))}
//         </List>
//         <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid #800000' }}>
//           <Button
//             fullWidth
//             variant="contained"
//             color="secondary"
//             startIcon={<LogoutIcon />}
//             onClick={handleLogout}
//             sx={{ bgcolor: '#800000', '&:hover': { bgcolor: '#600000' } }}
//           >
//             Logout
//           </Button>
//         </Box>
//       </Drawer>

//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}
//       >
//         <AppBar position="static" sx={{ bgcolor: '#1A1A1A' }}>
//           <Toolbar>
//             <Typography variant="h6">Gym Management System</Typography>
//           </Toolbar>
//         </AppBar>
//         <Box sx={{ p: 3 }}>{children}</Box>
//       </Box>
//     </Box>
//   );
// }

// export default Layout;

import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../store/authSlice';

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

function Layout({ children, onLogout }: LayoutProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  const handleLogout = () => {
    dispatch(logoutAction());
    if (onLogout) onLogout();
    navigate('/login');
  };

  const navItems = [
    { text: 'Dashboard', path: '/dashboard' },
    { text: 'Members', path: '/members' },
    { text: 'Payments', path: '/payments' },
    { text: 'Expenses', path: '/expenses' },
    { text: 'Supplements', path: '/supplements' },
    { text: 'Income', path: '/income' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1A1A1A] text-white flex flex-col fixed h-full">
        <div className="p-4 border-b border-primary flex items-center gap-2">
          <svg
            className="w-6 h-6"
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
          <h1 className="text-lg font-semibold">Natural Fitness</h1>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2 p-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.text}>
                  <RouterLink
                    to={item.path}
                    className={`block p-2 text-white rounded transition-colors ${
                      isActive
                        ? 'bg-primary border-l-4 border-secondary'
                        : 'hover:bg-primary/120'
                    }`}
                  >
                    {item.text}
                  </RouterLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-2 border-t border-primary">
          <button
            onClick={handleLogout}
            className="w-full bg-primary hover:bg-primaryDark text-white py-2 rounded flex items-center justify-center gap-2 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-60 bg-white">
        <header className="bg-[#] p-4 shadow">
          {/* <h1 className="text-lg font-semibold text-white">Gym Management System</h1> */}
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

export default Layout;