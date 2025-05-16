// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import MemberDetails from './pages/MemberDetails';
import Payments from './pages/Payments';
import PaymentDetails from './pages/PaymentDetails';
import Expenses from './pages/Expenses';
import Signup from './pages/Signup';
import Layout from './components/Leyout'; // Adjust the import path if needed
import Supplements from './pages/Supplimets'; // Import Supplements
import Income from './pages/Income'; // Import Income

function App() {
    const { isAuthenticated } = useSelector((state: any) => state.auth);
  
    return (
    <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />

        {/* Protected Routes with Layout */}
        <Route
        path="/dashboard"
        element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Dashboard />}</Layout> : <Navigate to="/login" />}
        />
        <Route
        path="/members"
        element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Members />}</Layout> : <Navigate to="/login" />}
        />
        <Route
        path="/member-details/:id"
        element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<MemberDetails />}</Layout> : <Navigate to="/login" />}
        />
        <Route
        path="/payments"
        element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Payments />}</Layout> : <Navigate to="/login" />}
        />
        <Route
        path="/payment-details/:id"
        element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<PaymentDetails />}</Layout> : <Navigate to="/login" />}
        />
        <Route
        path="/expenses"
        element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Expenses />}</Layout> : <Navigate to="/login" />}
        />
        <Route
        path="/supplements"
        element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Supplements />}</Layout> : <Navigate to="/login" />}
        />
        <Route
            path="/income"
            element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Income />}</Layout> : <Navigate to="/login" />}
        />

        {/* Default Route */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
    </Routes>
    );
  }

export default App;