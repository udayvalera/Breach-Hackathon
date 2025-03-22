import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  FileText,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  CreditCard
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/lookup', icon: Search, label: 'Credit Lookup' },
  { path: '/reports', icon: FileText, label: 'Reports' },
  { path: '/help', icon: HelpCircle, label: 'Help' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-200 ${
          collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={() => setCollapsed(true)}
      />

      <div className="flex relative">
        {/* Sidebar */}
        <aside 
          className={`bg-black text-white shadow-lg transition-all duration-300 fixed lg:relative z-40
            ${collapsed ? 'w-16 -translate-x-full lg:translate-x-0' : 'w-64'}`}
        >
          <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className="p-4 border-b border-gray-800">
              {collapsed ? (
                <div className="flex justify-center">
                  <CreditCard className="h-8 w-8" />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6" />
                  <h1 className="text-xl font-semibold">UniCred</h1>
                </div>
              )}
            </div>

            <nav className="flex-1 overflow-y-auto px-2 pt-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 transition-colors rounded-lg my-1
                    ${isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-800'}
                    ${collapsed ? 'justify-center' : ''}`
                  }
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Toggle Button - Positioned outside the sidebar */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-6 -right-4 bg-black text-white p-2 rounded-full shadow-md z-50 hover:bg-gray-800 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </>
  );
}