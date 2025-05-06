// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector , TypedUseSelectorHook } from 'react-redux';
import { Typography, Box, Grid, CircularProgress, Card, CardContent, Link} from '@mui/material';
import { People as PeopleIcon, Payment as PaymentIcon, MoneyOff as MoneyOffIcon, Money, MoneyRounded, AttachMoney, SpeedRounded, AccountBalance, Paid, AccountBalanceWallet, AccountBalanceWalletRounded } from '@mui/icons-material';
import { getMembers, getPayments, getExpenses } from '../api/api';
import { RootState } from '../store/index';
import Members from './Members';

// Use TypedUseSelectorHook to type the selector
const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

function Dashboard() {
    
    const { email, role } = useTypedSelector((state) => state.auth); // Now TypeScript knows the type  const [members, setMembers] = useState([]);
    // const [payments, setPayments] = useState([]);
    // const [expenses, setExpenses] = useState([]);
    const [members, setMembers] = useState<any[]>([]); // Initialize members state
    const [payments, setPayments] = useState<any[]>([]); // Initialize payments state
    const [expenses, setExpenses] = useState<any[]>([]); // Initialize expenses state

    const [loadingMembers, setLoadingMembers] = useState(true); // Loading state for members
    const [loadingPayments, setLoadingPayments] = useState(true); // Loading state for payments
    const [loadingExpenses, setLoadingExpenses] = useState(true); // Loading state for expenses

    // Compute totals
    const totalPayments = payments.reduce((sum, payment) => sum + (payment.amount_paid || 0), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

  useEffect(() => {
    const fetchData = async () => {
        
      try {
        if (role !== 'admin') {
            console.log('Access denied: User is not an admin');
            setLoadingMembers(false);
          setLoadingPayments(false);
          setLoadingExpenses(false);
            return;
          }
          setLoadingMembers(true);
        setLoadingPayments(true);
        setLoadingExpenses(true);
          const membersData = await getMembers(email);
          const paymentsData = await getPayments(email);
          const expensesData = await getExpenses(email);
        setMembers(membersData || []);
        setPayments(paymentsData || []);
        setExpenses(expensesData || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }finally {
        setLoadingMembers(false);
        setLoadingPayments(false);
        setLoadingExpenses(false);
      }
    };
    fetchData();
  }, [email, role]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {/* Members Card */}
    
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ border: '1px solid #800000', '&:hover': { transform: 'scale(1.02)' } ,boxShadow: 3, transition: 'transform 0.2s',}}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PeopleIcon sx={{ color: '#800000', mr: 1 }} />
                <Typography variant="h6">Total Members</Typography>
              </Box>
              {loadingMembers ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <Typography variant="h4" color="#800000">
                                {members.length}
                            </Typography>
                            <Link
                                component={RouterLink}
                                to="/members"
                                sx={{ color: '#800000', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                            >
                                View Members
                            </Link>
              </>
            
            )}
              
            </CardContent>
          </Card>
        </Grid>

        {/* Payments Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ border: '1px solid #800000', '&:hover': { transform: 'scale(1.02)' } ,boxShadow: 3, transition: 'transform 0.2s',}}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AccountBalanceWalletRounded sx={{ color: '#800000', mr: 1 }} />
                <Typography variant="h6">Total Payments</Typography>
              </Box>
              {loadingPayments ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <Typography variant="h4" color="#800000">
                            ৳ {totalPayments.toFixed(2)}
                            </Typography>
                            <Link
                                component={RouterLink}
                                to="/payments"
                                sx={{ color: '#800000', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                            >
                                View Payments
                            </Link>
              </>
            
            )}
              
            </CardContent>
          </Card>
        </Grid>
        
        {/* Expenses Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ border: '1px solid #800000', '&:hover': { transform: 'scale(1.02)' } ,boxShadow: 3, transition: 'transform 0.2s',}}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Paid sx={{ color: '#800000', mr: 1 }} />
                <Typography variant="h6">Total Expense</Typography>
              </Box>
              {loadingExpenses ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <Typography variant="h4" color="#800000">
                            ৳ {totalExpenses.toFixed(2)}
                            </Typography>
                            <Link
                                component={RouterLink}
                                to="/expenses"
                                sx={{ color: '#800000', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                            >
                                View Expenses
                            </Link>
              </>
            
            )}
              
            </CardContent>
          </Card>
        </Grid>
        
      </Grid>
    </Box>
  );
}

export default Dashboard;