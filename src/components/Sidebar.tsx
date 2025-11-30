import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Trophy,
  Calendar,
  Grid3x3,
  Users,
  UserCircle,
  CalendarRange,
  Settings,
  ArrowLeft,
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface SidebarProps {
  pendingRequests?: number;
  onExitAdmin?: () => void;
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

export function Sidebar({ pendingRequests = 0, onExitAdmin, isMobileMenuOpen = false, onMobileMenuClose }: SidebarProps) {
  const navItems: NavItem[] = [
    {
      path: '/admin',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      path: '/admin/captain-requests',
      label: 'Captain Requests',
      icon: <UserCheck className="w-5 h-5" />,
      badge: pendingRequests,
    },
    {
      path: '/admin/leagues',
      label: 'Leagues',
      icon: <Trophy className="w-5 h-5" />,
    },
    {
      path: '/admin/seasons',
      label: 'Seasons',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      path: '/admin/divisions',
      label: 'Divisions',
      icon: <Grid3x3 className="w-5 h-5" />,
    },
    {
      path: '/admin/teams',
      label: 'Teams',
      icon: <Users className="w-5 h-5" />,
    },
    {
      path: '/admin/players',
      label: 'Players',
      icon: <UserCircle className="w-5 h-5" />,
    },
    {
      path: '/admin/schedule',
      label: 'Schedule',
      icon: <CalendarRange className="w-5 h-5" />,
    },
    {
      path: '/admin/settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleNavClick = () => {
    // Close mobile menu when a nav item is clicked
    if (onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileMenuClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200 
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">R</span>
            </div>
            <div>
              <h1 className="text-gray-900">RallyOS</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          {onExitAdmin && (
            <button
              onClick={() => {
                onExitAdmin();
                if (onMobileMenuClose) onMobileMenuClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to App</span>
            </button>
          )}
          <div className="text-xs text-gray-500 text-center">
            RallyOS Admin v1.0
          </div>
        </div>
      </aside>
    </>
  );
}