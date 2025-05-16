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

import { getIncome, IncomeInterface } from '@/api/api'; // Assuming api.ts is in this path


import { FaChartLine, FaCoins, FaLine, FaMoneyBill, FaUsers } from 'react-icons/fa'; // Example: Using Font Awesome user icon


const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

function Dashboard() {
    const { email, role } = useTypedSelector((state) => state.auth);
    const [totalIncome, setTotalIncome] = useState<number | null>(null);
    const [incomeData, setIncomeData] = useState<IncomeInterface[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [loadingPayments, setLoadingPayments] = useState(true);
    const [loadingExpenses, setLoadingExpenses] = useState(true);
    const [loadingIncome, setLoadingIncome] = useState(true);

    const [error, setError] = useState<string>('');

    const totalPayments = payments.reduce((sum, payment) => sum + (payment.amount_paid || 0), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

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
//         setError('');
//       } catch (err) {
//         const axiosError = err as AxiosError<{ message: string }>;
//         setError(axiosError.response?.data?.message || 'Failed to fetch dashboard data');
//         console.error('Error fetching dashboard data:', err);
//       } finally {
//         setLoadingMembers(false);
//         setLoadingPayments(false);
//         setLoadingExpenses(false);
//       }
//     };
//     fetchData();
//   }, [email, role]);

    useEffect(() => {
    const fetchData = async () => {
      try {
        if (role !== 'admin') {
          console.log('Access denied: User is not an admin');
          setLoadingMembers(false);
          setLoadingPayments(false);
          setLoadingExpenses(false);
          setLoadingIncome(false);
          return;
        }
        setLoadingMembers(true);
        setLoadingPayments(true);
        setLoadingExpenses(true);
        setLoadingIncome(true);
        const [membersData, paymentsData, expensesData, incomeData] = await Promise.all([
          getMembers(email),
          getPayments(email),
          getExpenses(email),
          getIncome(email),
        ]);
        setMembers(membersData || []);
        setPayments(paymentsData || []);
        setExpenses(expensesData || []);
        setIncomeData(incomeData || []);
        setTotalIncome(incomeData.reduce((sum: number, income: IncomeInterface) => sum + (income.amount || 0), 0));
        setError('');
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || 'Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoadingMembers(false);
        setLoadingPayments(false);
        setLoadingExpenses(false);
        setLoadingIncome(false);
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
        <Card className="border hover:scale-105 transition-transform shadow-md">
            <CardContent className="p-6">
            <div className="flex items-center mb-2 justify-between">
                <h2 className="text-lg font-semibold" style={{ color: 'grey' }}>Total Members</h2>
                <div className="flex items-center">
                    <FaUsers size={24} color="grey" />
                </div>
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
                    style={{ color: 'grey' }}
                >
                    All Members
                </RouterLink>
                </>
            )}
            </CardContent>
        </Card>
        
        <Card className="border hover:scale-105 transition-transform shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center mb-2 justify-between">
              <h2 className="text-lg font-semibold" style={{ color: 'grey' }}>Total Income</h2>
              <div className="flex items-center">
                <FaChartLine size={24} color="grey" />
              </div>
            </div>
            {loadingIncome ? (
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
                <p className="text-3xl font-bold text-primary mb-2">৳ {totalIncome?.toFixed(2) || '0.00'}</p>
                <RouterLink
                  to="/income"
                  className="text-primary hover:underline"
                  style={{ color: 'grey' }}
                >
                  View Income
                </RouterLink>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border hover:scale-105 transition-transform shadow-md">
            <CardContent className="p-6">
                <div className="flex items-center mb-2 justify-between">
                    <h2 className="text-lg font-semibold" style={{ color: 'grey' }}>Payments</h2>
                    <div className="flex items-center">
                        <FaMoneyBill size={24} color="grey" />
                    </div>
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
                    style={{ color: 'grey' }}
                    >
                    View Payments
                    </RouterLink>
                </>
                )}
            </CardContent>
        </Card>

        <Card className="border hover:scale-105 transition-transform shadow-md">
            <CardContent className="p-4">
                <div className="flex items-center mb-2 justify-between">
                <h2 className="text-lg font-semibold" style={{ color: 'grey' }}>Total Expenses</h2>
                <div className="flex items-center">
                    <FaCoins size={24} color="grey" />
                </div>
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
                    style={{ color: 'grey' }}
                    >
                    View Expenses
                    </RouterLink>
                </>
                )}
            </CardContent>
        </Card>
      </div>

    <div className="mt-10">
        <Card>
            <CardContent>
                <div className='m-4 py-4'>
                    <text className="text-3xl font-semibold text-primary block mb-2 ">Monthly Overview</text>
                    <text className="text-lg font-regular text-primary block mb-2" style={{color:'gray'}}>Revenue vs Expenses for the last months.</text>
                </div>
            
            
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