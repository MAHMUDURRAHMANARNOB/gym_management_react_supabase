// // // src/App.tsx
// // import { Routes, Route, Navigate } from 'react-router-dom';
// // import { useSelector } from 'react-redux';
// // import Login from './pages/Login';
// // import Dashboard from './pages/Dashboard';
// // import Members from './pages/Members';
// // import MemberDetails from './pages/MemberDetails';
// // import Payments from './pages/Payments';
// // import PaymentDetails from './pages/PaymentDetails';
// // import Expenses from './pages/Expenses';
// // import Signup from './pages/Signup';
// // import Layout from './components/Leyout'; // Adjust the import path if needed
// // import Supplements from './pages/Supplimets'; // Import Supplements
// // import Income from './pages/Income'; // Import Income
// // import Assets from './pages/Assets';

// // function App() {
// //     const { isAuthenticated } = useSelector((state: any) => state.auth);
  
// //     return (
// //     <Routes>
// //         {/* Public Routes */}
// //         <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
// //         <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />

// //         {/* Protected Routes with Layout */}
// //         <Route
// //         path="/dashboard"
// //         element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Dashboard />}</Layout> : <Navigate to="/login" />}
// //         />
// //         <Route
// //         path="/members"
// //         element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Members />}</Layout> : <Navigate to="/login" />}
// //         />
// //         <Route
// //         path="/member-details/:id"
// //         element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<MemberDetails />}</Layout> : <Navigate to="/login" />}
// //         />
// //         <Route
// //         path="/payments"
// //         element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Payments />}</Layout> : <Navigate to="/login" />}
// //         />
// //         <Route
// //         path="/payment-details/:id"
// //         element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<PaymentDetails />}</Layout> : <Navigate to="/login" />}
// //         />
// //         <Route
// //         path="/expenses"
// //         element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Expenses />}</Layout> : <Navigate to="/login" />}
// //         />
// //         <Route
// //         path="/supplements"
// //         element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Supplements />}</Layout> : <Navigate to="/login" />}
// //         />
// //         <Route
// //             path="/income"
// //             element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Income />}</Layout> : <Navigate to="/login" />}
// //         />

// //         <Route
// //         path="/assets"
// //         element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Assets />}</Layout> : <Navigate to="/login" />}
// //         />

// //         {/* Default Route */}
// //         <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
// //     </Routes>
// //     );
// //   }

// // export default App;

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
// import { setAuth } from './store/authSlice';
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
//           dispatch(setAuth({ user: userData, isAuthenticated: true }));
//           localStorage.setItem('email', userData.email); // Ensure email is persisted
//         } else {
//           localStorage.removeItem('session');
//           localStorage.removeItem('email');
//           dispatch(setAuth({ user: null, isAuthenticated: false }));
//         }
//       } catch (error) {
//         console.error('Session restore error:', error);
//         localStorage.removeItem('session');
//         localStorage.removeItem('email');
//         dispatch(setAuth({ user: null, isAuthenticated: false }));
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     restoreSession();
//   }, [dispatch]);

//   if (isLoading) {
//     return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
//   }

//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
//       <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />

//       {/* Protected Routes with Layout */}
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

//       {/* Default Route */}
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
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />
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
      <Route
        path="/assets"
        element={isAuthenticated ? <Layout onLogout={() => <Navigate to="/login" />}>{<Assets />}</Layout> : <Navigate to="/login" />}
      />
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
