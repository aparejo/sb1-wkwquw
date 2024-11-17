import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Settings, Sun, Moon, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/auth';
import { useConfigStore } from '../../features/config/stores/configStore';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { name: companyName, logo: companyLogo } = useConfigStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/app" className="flex items-center gap-2">
              {companyLogo ? (
                <img 
                  src={companyLogo} 
                  alt={companyName}
                  className="h-8 w-auto"
                />
              ) : (
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {companyName}
                </span>
              )}
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <Bell className="h-5 w-5" />
            </button>

            <Link 
              to="/app/settings" 
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <Settings className="h-5 w-5" />
            </Link>

            <div className="relative ml-3 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.name || 'Usuario'}
                </span>
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}