import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../store/authSlice';
import { useState } from 'react';
import nfgImage from '../assets/images/nfg.jpg';

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

function Layout({ children, onLogout }: LayoutProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    dispatch(logoutAction());
    if (onLogout) onLogout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { text: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { text: 'Members', path: '/members', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { text: 'Payments', path: '/payments', icon: 'M2 8a3 3 0 013-3h10a3 3 0 013 3v8a3 3 0 01-3 3H5a3 3 0 01-3-3V8zm9 4a1 1 0 00-1-1H6a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4z' },
    { text: 'Expenses', path: '/expenses', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { text: 'Supplements', path: '/supplements', icon: 'M19 11H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2zM5 11v8a2 2 0 002 2h10a2 2 0 002-2v-8' },
    { text: 'Income', path: '/income', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12h-6m-12 0h6' },
    { text: 'Assets', path: '/assets', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`bg-[#1A1A1A] text-white flex flex-col fixed h-full transition-all duration-300 ${isSidebarOpen ? 'w-60' : 'w-16'}`}>
        <div className="p-4 border-b border-primary flex items-center gap-2">
          <button onClick={toggleSidebar} className="mr-2">
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
                d={isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
          {isSidebarOpen && (
            <>
              <img src={nfgImage} alt="Natural Fitness Gym Logo" className="w-8 h-8 object-cover" />
              <h1 className="text-lg font-semibold">Natural Fitness</h1>
            </>
          )}
        </div>
        <nav className="flex-1">
          <ul className="space-y-2 p-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.text}>
                  <RouterLink
                    to={item.path}
                    className={`flex items-center gap-2 p-2 text-white rounded transition-colors ${
                      isActive
                        ? 'bg-primary border-l-4 border-secondary'
                        : 'hover:bg-primary/120'
                    }`}
                    title={isSidebarOpen ? '' : item.text}
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
                        d={item.icon}
                      />
                    </svg>
                    {isSidebarOpen && <span>{item.text}</span>}
                  </RouterLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-2 border-t border-primary">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 w-full bg-primary hover:bg-primaryDark text-white py-2 rounded justify-center transition-colors ${
              !isSidebarOpen && 'px-2'
            }`}
            title={isSidebarOpen ? '' : 'Logout'}
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
            {isSidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-60' : 'ml-16'} bg-white`}>
        <header className="bg-[#1A1A1A] p-4 shadow">
          <h1 className="text-lg font-semibold text-white">Gym Management System</h1>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

export default Layout;