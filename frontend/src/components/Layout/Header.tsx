import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, CreditCard, X } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'error';
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Bureau Downtime',
    message: 'Experian is currently experiencing downtime. Using cached data.',
    type: 'warning',
    timestamp: '2025-03-21T10:30:00',
    read: false
  },
  {
    id: '2',
    title: 'Score Discrepancy',
    message: 'Significant variance detected in latest credit check for John Smith.',
    type: 'error',
    timestamp: '2025-03-21T09:45:00',
    read: false
  },
  {
    id: '3',
    title: 'System Update',
    message: 'New risk assessment algorithm will be deployed in 24 hours.',
    type: 'info',
    timestamp: '2025-03-21T08:15:00',
    read: true
  }
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/lookup?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100';
      case 'error':
        return 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100';
      default:
        return 'bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <CreditCard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Unified Credit System</h1>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl w-full sm:mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Enter Borrower ID or Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </form>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Modal */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Notifications</h2>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-200 dark:border-gray-700 ${
                        notification.read ? 'opacity-75' : ''
                      } ${getNotificationColor(notification.type)}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <span className="text-xs">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{notification.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}