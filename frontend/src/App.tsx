// // import { Routes, Route, Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom';
// // import { useEffect } from 'react';
// // import { useSelector } from 'react-redux';
// // import Dashboard from './pages/Dashboard';
// // import Members from './pages/Members';
// // import Payments from './pages/Payments';
// // import Expenses from './pages/Expenses';
// // import Login from './pages/Login';
// // import PaymentDetails from './pages/PaymentDetails';
// // import MemberDetails from './pages/MemberDetails';
// // import ProtectedRoute from './components/ProtectedRoute';
// // import Layout from './components/Leyout';
// // import { RootState } from './store';

// // function App() {
// //   const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
// //   const location = useLocation();
// //   const navigate = useNavigate();

// //   // Redirect to login if not authenticated and on a protected route
// //   useEffect(() => {
// //     if (!isAuthenticated && location.pathname !== '/login') {
// //       navigate('/login');
// //     }
// //   }, [isAuthenticated, location, navigate]);

// //   // ProtectedLayout now uses the Layout component with navigate
// //   const ProtectedLayout = () => {
// //     const navigate = useNavigate();
// //     return (
// //       <Layout onLogout={() => {
// //         navigate('/login');
// //       }}>
// //         <Outlet />
// //       </Layout>
// //     );
// //   };

// //   return (
// //     <Routes>
// //       <Route
// //         path="/login"
// //         element={isAuthenticated ? <Navigate to="/" /> : <Login />}
// //       />
// //       <Route element={<ProtectedRoute isAuthenticated={false} />}>
// //         <Route element={<ProtectedLayout />}>
// //           <Route path="/" element={<Dashboard />} />
// //           <Route path="/members" element={<Members />} />
// //           <Route path="/member-details/:id" element={<MemberDetails />} />
// //           <Route path="/payments" element={<Payments />} />
// //           <Route path="/payment-details/:id" element={<PaymentDetails />} />
// //           <Route path="/expenses" element={<Expenses />} />
// //         </Route>
// //       </Route>
// //       <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
// //     </Routes>
// //   );
// // }

// // export default App;

// // src/App.tsx
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import Members from './pages/Members';
// import MemberDetails from './pages/MemberDetails';
// import Payments from './pages/Payments';
// import PaymentDetails from './pages/PaymentDetails';
// import Expenses from './pages/Expenses';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/members" element={<Members />} />
//         <Route path="/member-details/:id" element={<MemberDetails />} />
//         <Route path="/payments" element={<Payments />} />
//         <Route path="/payment-details/:id" element={<PaymentDetails />} />
//         <Route path="/expenses" element={<Expenses />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
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

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//       <Route path="/members" element={<Members />} />
//       <Route path="/member-details/:id" element={<MemberDetails />} />
//       <Route path="/payments" element={<Payments />} />
//       <Route path="/payment-details/:id" element={<PaymentDetails />} />
//       <Route path="/expenses" element={<Expenses />} />
//     </Routes>
//   );
// }
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
  
        {/* Default Route */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    );
  }

export default App;