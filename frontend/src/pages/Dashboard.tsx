// // src/pages/Dashboard.tsx
// import { useEffect, useState } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
// import { useSelector , TypedUseSelectorHook } from 'react-redux';
// import { Typography, Box, Grid, CircularProgress, Card, CardContent, Link} from '@mui/material';
// import { People as PeopleIcon, Payment as PaymentIcon, MoneyOff as MoneyOffIcon, Money, MoneyRounded, AttachMoney, SpeedRounded, AccountBalance, Paid, AccountBalanceWallet, AccountBalanceWalletRounded } from '@mui/icons-material';
// import { getMembers, getPayments, getExpenses } from '../api/api';
// import { RootState } from '../store/index';
// import Members from './Members';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// // Use TypedUseSelectorHook to type the selector
// const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

// function Dashboard() {
    
//     const { email, role } = useTypedSelector((state) => state.auth); // Now TypeScript knows the type  const [members, setMembers] = useState([]);
//     // const [payments, setPayments] = useState([]);
//     // const [expenses, setExpenses] = useState([]);
//     const [members, setMembers] = useState<any[]>([]); // Initialize members state
//     const [payments, setPayments] = useState<any[]>([]); // Initialize payments state
//     const [expenses, setExpenses] = useState<any[]>([]); // Initialize expenses state

//     const [loadingMembers, setLoadingMembers] = useState(true); // Loading state for members
//     const [loadingPayments, setLoadingPayments] = useState(true); // Loading state for payments
//     const [loadingExpenses, setLoadingExpenses] = useState(true); // Loading state for expenses

//     // Compute totals
//     const totalPayments = payments.reduce((sum, payment) => sum + (payment.amount_paid || 0), 0);
//     const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

//   useEffect(() => {
//     const fetchData = async () => {
        
//       try {
//         if (role !== 'admin') {
//             console.log('Access denied: User is not an admin');
//             setLoadingMembers(false);
//           setLoadingPayments(false);
//           setLoadingExpenses(false);
//             return;
//           }
//           setLoadingMembers(true);
//         setLoadingPayments(true);
//         setLoadingExpenses(true);
//           const membersData = await getMembers(email);
//           const paymentsData = await getPayments(email);
//           const expensesData = await getExpenses(email);
//         setMembers(membersData || []);
//         setPayments(paymentsData || []);
//         setExpenses(expensesData || []);
//       } catch (err) {
//         console.error('Error fetching dashboard data:', err);
//       }finally {
//         setLoadingMembers(false);
//         setLoadingPayments(false);
//         setLoadingExpenses(false);
//       }
//     };
//     fetchData();
//   }, [email, role]);

//   // Process Payments data: Aggregate total_amount by month
//   const paymentsByMonth = payments.reduce((acc, payment) => {
//     // Extract YYYY-MM from payment_date
//     const date = payment.payment_date.slice(0, 7); // e.g., "2025-05"
//     if (!acc[date]) {
//       acc[date] = 0;
//     }
//     acc[date] += payment.total_amount;
//     return acc;
//   }, {} as Record<string, number>);

//   const paymentsChartData = Object.keys(paymentsByMonth)
//     .sort()
//     .map((date) => ({
//       date,
//       Income: paymentsByMonth[date],
//     }));

//   // Process Expenses data: Aggregate amount by month
//   const expensesByMonth = expenses.reduce((acc, expense) => {
//     // Extract YYYY-MM from expense_date
//     const date = expense.expense_date.slice(0, 7); // e.g., "2025-05"
//     if (!acc[date]) {
//       acc[date] = 0;
//     }
//     acc[date] += expense.amount;
//     return acc;
//   }, {} as Record<string, number>);

//   const expensesChartData = Object.keys(expensesByMonth)
//     .sort()
//     .map((date) => ({
//       date,
//       Expense: expensesByMonth[date],
//     }));

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Dashboard
//       </Typography>
//       <Grid container spacing={3} justifyContent="center">
//         {/* Members Card */}
    
//         <Grid item xs={12} sm={6} md={4}>
//           <Card sx={{ border: '1px solid #800000', '&:hover': { transform: 'scale(1.02)' } ,boxShadow: 3, transition: 'transform 0.2s',}}>
//             <CardContent>
//               <Box display="flex" alignItems="center" mb={2}>
//                 <PeopleIcon sx={{ color: '#800000', mr: 1 }} />
//                 <Typography variant="h6">Total Members</Typography>
//               </Box>
//               {loadingMembers ? (
//                         <CircularProgress />
//                     ) : (
//                         <>
//                             <Typography variant="h4" color="#800000">
//                                 {members.length}
//                             </Typography>
//                             <Link
//                                 component={RouterLink}
//                                 to="/members"
//                                 sx={{ color: '#800000', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
//                             >
//                                 View Members
//                             </Link>
//               </>
            
//             )}
              
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Payments Card */}
//         <Grid item xs={12} sm={6} md={4}>
//           <Card sx={{ border: '1px solid #800000', '&:hover': { transform: 'scale(1.02)' } ,boxShadow: 3, transition: 'transform 0.2s',}}>
//             <CardContent>
//               <Box display="flex" alignItems="center" mb={2}>
//                 <AccountBalanceWalletRounded sx={{ color: '#800000', mr: 1 }} />
//                 <Typography variant="h6">Total Payments</Typography>
//               </Box>
//               {loadingPayments ? (
//                         <CircularProgress />
//                     ) : (
//                         <>
//                             <Typography variant="h4" color="#800000">
//                             ৳ {totalPayments.toFixed(2)}
//                             </Typography>
//                             <Link
//                                 component={RouterLink}
//                                 to="/payments"
//                                 sx={{ color: '#800000', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
//                             >
//                                 View Payments
//                             </Link>
//               </>
            
//             )}
              
//             </CardContent>
//           </Card>
//         </Grid>
        
//         {/* Expenses Card */}
//         <Grid item xs={12} sm={6} md={4}>
//           <Card sx={{ border: '1px solid #800000', '&:hover': { transform: 'scale(1.02)' } ,boxShadow: 3, transition: 'transform 0.2s',}}>
//             <CardContent>
//               <Box display="flex" alignItems="center" mb={2}>
//                 <Paid sx={{ color: '#800000', mr: 1 }} />
//                 <Typography variant="h6">Total Expense</Typography>
//               </Box>
//               {loadingExpenses ? (
//                         <CircularProgress />
//                     ) : (
//                         <>
//                             <Typography variant="h4" color="#800000">
//                             ৳ {totalExpenses.toFixed(2)}
//                             </Typography>
//                             <Link
//                                 component={RouterLink}
//                                 to="/expenses"
//                                 sx={{ color: '#800000', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
//                             >
//                                 View Expenses
//                             </Link>
//               </>
            
//             )}
              
//             </CardContent>
//           </Card>
//         </Grid>
        
//       </Grid>

//       <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }} padding={6}>
//         {/* Payments (Income) Chart */}
//         <Card sx={{ flex: 1, minWidth: 400 }}>
//           <CardContent>
//             <Typography variant="h6" mb={2}>
//               Income Over Time
//             </Typography>
//             <Box sx={{ height: 300 }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={paymentsChartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} />
//                   <Tooltip formatter={(value: number) => `$${value}`} />
//                   <Legend />
//                   <Line type="monotone" dataKey="Income" stroke="#8884d8" activeDot={{ r: 8 }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </Box>
//           </CardContent>
//         </Card>

//         {/* Expenses Chart */}
//         <Card sx={{ flex: 1, minWidth: 400 }}>
//           <CardContent>
//             <Typography variant="h6" mb={2}>
//               Expenses Over Time
//             </Typography>
//             <Box sx={{ height: 300 }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={expensesChartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} />
//                   <Tooltip formatter={(value: number) => `$${value}`} />
//                   <Legend />
//                   <Line type="monotone" dataKey="Expense" stroke="#82ca9d" activeDot={{ r: 8 }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </Box>
//           </CardContent>
//         </Card>
//       </Box>
      
//     </Box>
    
    
//   );
// }

// export default Dashboard;
// import { useEffect, useState } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
// import { useSelector, TypedUseSelectorHook } from 'react-redux';
// import { getMembers, getPayments, getExpenses } from '../api/api';
// import { AxiosError } from 'axios';
// import { RootState } from '../store/index';
// import {
//   Card,
//   CardContent,
// } from '@/components/ui/card';

// const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

// function Dashboard() {
//   const { email, role } = useTypedSelector((state) => state.auth);
//   const [members, setMembers] = useState<any[]>([]);
//   const [payments, setPayments] = useState<any[]>([]);
//   const [expenses, setExpenses] = useState<any[]>([]);
//   const [loadingMembers, setLoadingMembers] = useState(true);
//   const [loadingPayments, setLoadingPayments] = useState(true);
//   const [loadingExpenses, setLoadingExpenses] = useState(true);
//   const [error, setError] = useState<string>(''); // Added error state

//   const totalPayments = payments.reduce((sum, payment) => sum + (payment.amount_paid || 0), 0);
//   const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (role !== 'admin') {
//           console.log('Access denied: User is not an admin');
//           setLoadingMembers(false);
//           setLoadingPayments(false);
//           setLoadingExpenses(false);
//           return;
//         }
//         setLoadingMembers(true);
//         setLoadingPayments(true);
//         setLoadingExpenses(true);
//         const [membersData, paymentsData, expensesData] = await Promise.all([
//           getMembers(email),
//           getPayments(email),
//           getExpenses(email),
//         ]);
//         setMembers(membersData || []);
//         setPayments(paymentsData || []);
//         setExpenses(expensesData || []);
//         setError(''); // Clear error on success
//       } catch (err) {
//         const axiosError = err as AxiosError<{ message: string }>;
//         setError(axiosError.response?.data?.message || 'Failed to fetch dashboard data'); // Set error message
//         console.error('Error fetching dashboard data:', err);
//       } finally {
//         setLoadingMembers(false);
//         setLoadingPayments(false);
//         setLoadingExpenses(false);
//       }
//     };
//     fetchData();
//   }, [email, role]);

//   const paymentsByMonth = payments.reduce((acc, payment) => {
//     const date = payment.payment_date.slice(0, 7);
//     if (!acc[date]) acc[date] = 0;
//     acc[date] += payment.total_amount;
//     return acc;
//   }, {} as Record<string, number>);

//   const paymentsChartData = Object.keys(paymentsByMonth)
//     .sort()
//     .map((date) => ({ date, Income: paymentsByMonth[date] }));

//   const expensesByMonth = expenses.reduce((acc, expense) => {
//     const date = expense.expense_date.slice(0, 7);
//     if (!acc[date]) acc[date] = 0;
//     acc[date] += expense.amount;
//     return acc;
//   }, {} as Record<string, number>);

//   const expensesChartData = Object.keys(expensesByMonth)
//     .sort()
//     .map((date) => ({ date, Expense: expensesByMonth[date] }));

//   return (
//     <div className="p-6 bg-white min-h-screen">
//       <h1 className="text-3xl font-bold text-primary mb-6">Dashboard</h1>

//       {error && <p className="text-red-500 bg-red-50 p-2 rounded mb-4">{error}</p>}

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//         <Card className="border border-primary hover:scale-105 transition-transform shadow-md">
//           <CardContent className="flex flex-col items-center p-4">
//             <div className="flex items-center mb-2">
//               <svg
//                 className="w-6 h-6 text-primary mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 100-4 2 2 0 000 4z"
//                 />
//               </svg>
//               <h2 className="text-lg font-semibold">Total Members</h2>
//             </div>
//             {loadingMembers ? (
//               <div className="flex justify-center">
//                 <svg
//                   className="animate-spin h-8 w-8 text-primary"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                   <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
//                 </svg>
//               </div>
//             ) : (
//               <>
//                 <p className="text-3xl font-bold text-primary mb-2">{members.length}</p>
//                 <RouterLink
//                   to="/members"
//                   className="text-primary hover:underline"
//                 >
//                   View Members
//                 </RouterLink>
//               </>
//             )}
//           </CardContent>
//         </Card>

//         <Card className="border border-primary hover:scale-105 transition-transform shadow-md">
//           <CardContent className="flex flex-col items-center p-4">
//             <div className="flex items-center mb-2">
//               <svg
//                 className="w-6 h-6 text-primary mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-9c-1.657 0-3-.895-3-2s1.343-2 3-2 3.001.895 3.001 2-1.344 2-3.001 2zm6-4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z"
//                 />
//               </svg>
//               <h2 className="text-lg font-semibold">Total Payments</h2>
//             </div>
//             {loadingPayments ? (
//               <div className="flex justify-center">
//                 <svg
//                   className="animate-spin h-8 w-8 text-primary"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                   <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
//                 </svg>
//               </div>
//             ) : (
//               <>
//                 <p className="text-3xl font-bold text-primary mb-2">৳ {totalPayments.toFixed(2)}</p>
//                 <RouterLink
//                   to="/payments"
//                   className="text-primary hover:underline"
//                 >
//                   View Payments
//                 </RouterLink>
//               </>
//             )}
//           </CardContent>
//         </Card>

//         <Card className="border border-primary hover:scale-105 transition-transform shadow-md">
//           <CardContent className="flex flex-col items-center p-4">
//             <div className="flex items-center mb-2">
//               <svg
//                 className="w-6 h-6 text-primary mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M9 14l6-6m-6 6l6 6m-6-6v12m6-12v12m-12-6h12"
//                 />
//               </svg>
//               <h2 className="text-lg font-semibold">Total Expenses</h2>
//             </div>
//             {loadingExpenses ? (
//               <div className="flex justify-center">
//                 <svg
//                   className="animate-spin h-8 w-8 text-primary"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                   <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
//                 </svg>
//               </div>
//             ) : (
//               <>
//                 <p className="text-3xl font-bold text-primary mb-2">৳ {totalExpenses.toFixed(2)}</p>
//                 <RouterLink
//                   to="/expenses"
//                   className="text-primary hover:underline"
//                 >
//                   View Expenses
//                 </RouterLink>
//               </>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-6">
//         <Card className="flex-1 min-w-[400px]">
//           <CardContent>
//             <h2 className="text-lg font-semibold mb-4">Income Over Time</h2>
//             <div style={{ height: 300 }}>
//               {/* Placeholder for Recharts LineChart */}
//               <p className="text-center text-gray-500">Chart placeholder (Recharts integration needed)</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="flex-1 min-w-[400px]">
//           <CardContent>
//             <h2 className="text-lg font-semibold mb-4">Expenses Over Time</h2>
//             <div style={{ height: 300 }}>
//               {/* Placeholder for Recharts LineChart */}
//               <p className="text-center text-gray-500">Chart placeholder (Recharts integration needed)</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { getMembers, getPayments, getExpenses } from '../api/api';
import { AxiosError } from 'axios';
import { RootState } from '../store/index';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

function Dashboard() {
  const { email, role } = useTypedSelector((state) => state.auth);
  const [members, setMembers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [error, setError] = useState<string>('');

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
        const [membersData, paymentsData, expensesData] = await Promise.all([
          getMembers(email),
          getPayments(email),
          getExpenses(email),
        ]);
        setMembers(membersData || []);
        setPayments(paymentsData || []);
        setExpenses(expensesData || []);
        setError('');
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || 'Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoadingMembers(false);
        setLoadingPayments(false);
        setLoadingExpenses(false);
      }
    };
    fetchData();
  }, [email, role]);

  const paymentsByMonth = payments.reduce((acc, payment) => {
    const date = payment.payment_date.slice(0, 7);
    if (!acc[date]) acc[date] = 0;
    acc[date] += payment.total_amount;
    return acc;
  }, {} as Record<string, number>);

  const paymentsChartData = Object.keys(paymentsByMonth)
    .sort()
    .map((date) => ({ date, Income: paymentsByMonth[date] }));

  const expensesByMonth = expenses.reduce((acc, expense) => {
    const date = expense.expense_date.slice(0, 7);
    if (!acc[date]) acc[date] = 0;
    acc[date] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const expensesChartData = Object.keys(expensesByMonth)
    .sort()
    .map((date) => ({ date, Expense: expensesByMonth[date] }));

    const allMonths = Array.from(
        new Set([...Object.keys(paymentsByMonth), ...Object.keys(expensesByMonth)])
        ).sort();

    const monthlyOverviewChartData = allMonths.map((date) => ({
        date,
        Revenue: paymentsByMonth[date] || 0,
        Expense: expensesByMonth[date] || 0,
    }));

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6">Dashboard</h1>

      {error && <p className="text-red-500 bg-red-50 p-2 rounded mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="border border-primary hover:scale-105 transition-transform shadow-md">
          <CardContent className="flex flex-col items-center p-4">
            <div className="flex items-center mb-2">
              <svg
                className="w-6 h-6 text-primary mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
              <h2 className="text-lg font-semibold">Total Members</h2>
            </div>
            {loadingMembers ? (
              <div className="flex justify-center">
                <svg
                  className="animate-spin h-8 w-8 text-primary"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </div>
            ) : (
              <>
                <p className="text-3xl font-bold text-primary mb-2">{members.length}</p>
                <RouterLink
                  to="/members"
                  className="text-primary hover:underline"
                >
                  View Members
                </RouterLink>
              </>
            )}
          </CardContent>
        </Card>
        

        <Card className="border border-primary hover:scale-105 transition-transform shadow-md">
          <CardContent className="flex flex-col items-center p-4">
            <div className="flex items-center mb-2">
              <svg
                className="w-6 h-6 text-primary mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-9c-1.657 0-3-.895-3-2s1.343-2 3-2 3.001.895 3.001 2-1.344 2-3.001 2zm6-4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z"
                />
              </svg>
              <h2 className="text-lg font-semibold">Total Payments</h2>
            </div>
            {loadingPayments ? (
              <div className="flex justify-center">
                <svg
                  className="animate-spin h-8 w-8 text-primary"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </div>
            ) : (
              <>
                <p className="text-3xl font-bold text-primary mb-2">৳ {totalPayments.toFixed(2)}</p>
                <RouterLink
                  to="/payments"
                  className="text-primary hover:underline"
                >
                  View Payments
                </RouterLink>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border border-primary hover:scale-105 transition-transform shadow-md">
            <CardContent className="flex flex-col items-center p-4">
            <div className="flex items-center mb-2">
                <svg
                className="w-6 h-6 text-primary mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 14l6-6m-6 6l6 6m-6-6v12m6-12v12m-12-6h12"
                />
                </svg>
                <h2 className="text-lg font-semibold">Total Expenses</h2>
            </div>
            {loadingExpenses ? (
                <div className="flex justify-center">
                <svg
                    className="animate-spin h-8 w-8 text-primary"
                    viewBox="0 0 24 24"
                >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                </div>
            ) : (
                <>
                <p className="text-3xl font-bold text-primary mb-2">৳ {totalExpenses.toFixed(2)}</p>
                <RouterLink
                    to="/expenses"
                    className="text-primary hover:underline"
                >
                    View Expenses
                </RouterLink>
                </>
            )}
            </CardContent>
        </Card>
      </div>
{/* 
    <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 min-w-[400px]">
        <CardContent>
            <h2 className="text-lg font-semibold mb-4">Income Over Time</h2>
            {paymentsChartData.length > 0 ? (
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={paymentsChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                    }}
                    formatter={(value) => [`৳ ${value}`, 'Income']}
                    />
                    <Legend />
                    <Line
                    type="monotone"
                    dataKey="Income"
                    stroke="#198C8C"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    />
                </LineChart>
                </ResponsiveContainer>
            </div>
            ) : (
            <p className="text-center text-gray-500 h-[300px] flex items-center justify-center">
                No income data available
            </p>
            )}
        </CardContent>
        </Card>

        <Card className="flex-1 min-w-[400px]">
        <CardContent>
            <h2 className="text-lg font-semibold mb-4">Expenses Over Time</h2>
            {expensesChartData.length > 0 ? (
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={expensesChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                    }}
                    formatter={(value) => [`৳ ${value}`, 'Expense']}
                    />
                    <Legend />
                    <Line
                    type="monotone"
                    dataKey="Expense"
                    stroke="#198C8C"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    />
                </LineChart>
                </ResponsiveContainer>
            </div>
            ) : (
            <p className="text-center text-gray-500 h-[300px] flex items-center justify-center">
                No expense data available
            </p>
            )}
        </CardContent>
        </Card>
    </div> */}

    <div className="mt-10">
        <Card>
            <CardContent>
            <h2 className="text-lg font-semibold mb-4">Monthly Overview</h2>
            {monthlyOverviewChartData.length > 0 ? (
                <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    data={monthlyOverviewChartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                        formatter={(value: number, name: string) => [`৳ ${value}`, name]}
                        contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        }}
                    />
                    <Legend />
                    <Bar dataKey="Revenue" fill="#198C8C" name="Revenue" barSize={30} />
                    <Bar dataKey="Expense" fill="orange" name="Expense" barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
                </div>
            ) : (
                <p className="text-center text-gray-500 h-[300px] flex items-center justify-center">
                No data available for monthly overview
                </p>
            )}
            </CardContent>
        </Card>
</div>

    </div>
    
  );
}

export default Dashboard;