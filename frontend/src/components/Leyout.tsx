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
    { text: 'Assets', path: '/assets' }, // Added Assets nav item

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