import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/lookup', icon: Search, label: 'Credit Lookup' },
  { path: '/reports', icon: FileText, label: 'Reports' },
  { path: '/settings', icon: Settings, label: 'Settings' },
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

      {/* Sidebar */}
      <aside 
        className={`bg-card text-card-foreground shadow-lg transition-all duration-300 fixed lg:relative z-40
          ${collapsed ? 'w-16 -translate-x-full lg:translate-x-0' : 'w-64'}`}
      >
        <div className="flex flex-col h-full">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-4 hover:bg-accent flex justify-end"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-6 w-6" />
            ) : (
              <ChevronLeft className="h-6 w-6" />
            )}
          </button>

          <nav className="flex-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 transition-colors
                  ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}
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
    </>
  );
}