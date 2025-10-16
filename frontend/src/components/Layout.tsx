import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  LogOut,
  Menu,
  X,
  ClipboardList,
} from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (!user) return [];

    const commonItems = [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    if (user.role === UserRole.ADMIN) {
      return [
        ...commonItems,
        { path: '/teachers', label: 'Teachers', icon: Users },
        { path: '/students', label: 'Students', icon: GraduationCap },
        { path: '/classes', label: 'Classes', icon: BookOpen },
        { path: '/subjects', label: 'Subjects', icon: BookOpen },
        { path: '/teacher-assignments', label: 'Assignments', icon: ClipboardList },
        { path: '/attendance', label: 'Attendance', icon: Calendar },
      ];
    }

    if (user.role === UserRole.TEACHER) {
      return [
        ...commonItems,
        { path: '/my-classes', label: 'My Classes', icon: BookOpen },
        { path: '/my-students', label: 'My Students', icon: Users },
        { path: '/mark-attendance', label: 'Mark Attendance', icon: ClipboardList },
        { path: '/profile', label: 'Profile', icon: Users },
      ];
    }

    if (user.role === UserRole.STUDENT) {
      return [
        ...commonItems,
        { path: '/my-attendance', label: 'My Attendance', icon: Calendar },
        { path: '/profile', label: 'Profile', icon: Users },
      ];
    }

    return commonItems;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="ml-2 text-xl font-bold text-primary-600">
                School Management System
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user?.email} ({user?.role})
              </span>
              <Link
                to="/change-password"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Change Password
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transition-transform duration-200 ease-in-out z-30`}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;

