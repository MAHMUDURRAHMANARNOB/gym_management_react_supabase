// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { useEffect, useState } from 'react';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import Members from './pages/Members';
// import MemberDetails from './pages/MemberDetails';
// import Payments from './pages/Payments';
// import PaymentDetails from './pages/PaymentDetails';
// import Expenses from './pages/Expenses';
// import Signup from './pages/Signup';
// import Layout from './components/Leyout';
// import Supplements from './pages/Supplimets';
// import Income from './pages/Income';
// import Assets from './pages/Assets';
// import { loginSuccess } from './store/authSlice';
// import { checkSession } from './api/api';

// function App() {
//   const { isAuthenticated } = useSelector((state: any) => state.auth);
//   const dispatch = useDispatch();
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const restoreSession = async () => {
//       try {
//         const userData = await checkSession();
//         if (userData) {
//           dispatch(loginSuccess({
//             userId: userData.id,
//             email: userData.email,
//             role: userData.role,
//           }));
//           localStorage.setItem('email', userData.email);
//         } else {
//           localStorage.removeItem('session');
//           localStorage.removeItem('email');
//         }
//       } catch (error) {
//         console.error('Session restore error:', error);
//         localStorage.removeItem('session');
//         localStorage.removeItem('email');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     restoreSession();
//   }, [dispatch]);

//   if (isLoading) {
//     return <div className="flex min-h-screen items-center justify-center bg-gray-100">Loading...</div>;
//   }

//   return (
//     <Routes>
//       <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
//       <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />
//       <Route
//         path="/dashboard"
//         element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Dashboard />}</Layout> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/members"
//         element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Members />}</Layout> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/member-details/:id"
//         element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<MemberDetails />}</Layout> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/payments"
//         element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Payments />}</Layout> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/payment-details/:id"
//         element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<PaymentDetails />}</Layout> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/expenses"
//         element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Expenses />}</Layout> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/supplements"
//         element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Supplements />}</Layout> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/income"
//         element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Income />}</Layout> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/assets"
//         element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Assets />}</Layout> : <Navigate to="/login" />}
//       />
//       <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
//     </Routes>
//   );
// }

// export default App;

import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import MemberDetails from './pages/MemberDetails';
import Payments from './pages/Payments';
import PaymentDetails from './pages/PaymentDetails';
import Expenses from './pages/Expenses';
import Signup from './pages/Signup';
import Layout from './components/Leyout';
import Supplements from './pages/Supplimets';
import Income from './pages/Income';
import Assets from './pages/Assets';
import Landing from './pages/landing_page/LandingPage';
import { loginSuccess } from './store/authSlice';
import { checkSession } from './api/api';

function App() {
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const userData = await checkSession();
        if (userData) {
          dispatch(loginSuccess({
            userId: userData.id,
            email: userData.email,
            role: userData.role,
          }));
          localStorage.setItem('email', userData.email);
        } else {
          localStorage.removeItem('session');
          localStorage.removeItem('email');
        }
      } catch (error) {
        console.error('Session restore error:', error);
        localStorage.removeItem('session');
        localStorage.removeItem('email');
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, [dispatch]);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-100">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />

      {/* Protected Routes with Layout */}
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/" />}>{<Dashboard />}</Layout> : <Navigate to="/" />}
      />
      <Route
        path="/members"
        element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/" />}>{<Members />}</Layout> : <Navigate to="/" />}
      />
      <Route
        path="/member-details/:id"
        element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/" />}>{<MemberDetails />}</Layout> : <Navigate to="/" />}
      />
      <Route
        path="/payments"
        element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/" />}>{<Payments />}</Layout> : <Navigate to="/" />}
      />
      <Route
        path="/payment-details/:id"
        element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/" />}>{<PaymentDetails />}</Layout> : <Navigate to="/" />}
      />
      <Route
        path="/expenses"
        element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/" />}>{<Expenses />}</Layout> : <Navigate to="/" />}
      />
      <Route
        path="/supplements"
        element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/" />}>{<Supplements />}</Layout> : <Navigate to="/" />}
      />
      <Route
        path="/income"
        element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/" />}>{<Income />}</Layout> : <Navigate to="/" />}
      />
      <Route
        path="/assets"
        element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/" />}>{<Assets />}</Layout> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;