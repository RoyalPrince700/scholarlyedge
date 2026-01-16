import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Initialize from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // 2. Fetch fresh user data from server to sync roles/details
    const fetchUserData = async () => {
      try {
        const response = await authAPI.getMe();
        if (response.data.success) {
          const freshUser = response.data.data;
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        }
      } catch (error) {
        console.error('Error fetching fresh user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navigation = user?.role?.toLowerCase() === 'admin' 
    ? [
        { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
        { name: 'Project Management', href: '/dashboard/projects', icon: FileText },
        { name: 'User Management', href: '/dashboard/users', icon: Users },
        { name: 'Financial Dashboard', href: '/dashboard/financial', icon: DollarSign },
      ]
    : [
        { name: 'My Projects', href: '/dashboard/writer', icon: LayoutDashboard },
        { name: 'My Earnings', href: '/dashboard/writer-finance', icon: DollarSign },
        { name: 'Profile', href: '/dashboard/profile', icon: User },
      ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#202123] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700/50">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center text-sm">SE</span>
            ScholarlyEdge
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-4 px-2 space-y-1">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    ${isActive(item.href) 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'}
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700/50 hover:text-white transition-colors duration-200"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">ScholarlyEdge Nexus</h1>
            <div className="w-6" /> {/* Spacer */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;