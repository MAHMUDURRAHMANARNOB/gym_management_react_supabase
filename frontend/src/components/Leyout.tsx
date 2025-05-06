// src/Leyout.tsx (rename to Layout.tsx if not already)
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, Box, Button } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { Link } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../store/authSlice';

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void; // Make optional and handle undefined
}

function Layout({ children, onLogout }: LayoutProps) {
  const drawerWidth = 240;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutAction()); // Dispatch logout action
    if (onLogout) onLogout(); // Call the provided onLogout function if it exists
    navigate('/login'); // Navigate to login page
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#1A1A1A',
            color: '#FFFFFF',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #800000', display: 'flex', alignItems: 'center', gap: 1 }}>
          <FitnessCenterIcon />
          <Typography variant="h6">Natural Fitness</Typography>
        </Box>
        <List>
          {[
            { text: 'Dashboard', path: '/dashboard' },
            { text: 'Members', path: '/members' },
            { text: 'Payments', path: '/payments' },
            { text: 'Expenses', path: '/expenses' },
          ].map((item) => (
            <ListItem
              key={item.text}
              sx={{
                '&:hover': { backgroundColor: '#800000' },
              }}
            >
              <ListItemText>
                <Link
                  component={RouterLink}
                  to={item.path}
                  sx={{ color: '#FFFFFF', textDecoration: 'none', '&:hover': { backgroundColor: '#800000' } }}
                >
                  {item.text}
                </Link>
              </ListItemText>
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid #800000' }}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ bgcolor: '#800000', '&:hover': { bgcolor: '#600000' } }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}
      >
        <AppBar position="static" sx={{ bgcolor: '#1A1A1A' }}>
          <Toolbar>
            <Typography variant="h6">Gym Management System</Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}

export default Layout;