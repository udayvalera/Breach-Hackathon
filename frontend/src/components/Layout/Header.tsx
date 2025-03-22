import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, CreditCard, X, Sun, Moon } from 'lucide-react';
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
// Removed unused imports for dropdown menu components
// Removed unused imports for card components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { Badge } from "../../components/ui/badge";

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

  const getNotificationBadge = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Warning</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Error</Badge>;
      default:
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Info</Badge>;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">Unified Credit System</h1>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter Borrower ID or Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9"
            />
          </div>
        </form>

        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle theme</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

        </div>
      </div>
    </header>
  );
}