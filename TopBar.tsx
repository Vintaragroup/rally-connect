import { Search, Bell, User, Menu, X } from 'lucide-react';

interface TopBarProps {
  title?: string;
  notificationCount?: number;
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function TopBar({ title, notificationCount = 0, onMenuToggle, isMobileMenuOpen = false }: TopBarProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle & Logo */}
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          )}
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">R</span>
            </div>
            <span className="text-sm text-gray-900">Admin</span>
          </div>
        </div>

        {/* Title or Search */}
        <div className="flex-1 min-w-0">
          {title ? (
            <h2 className="text-lg md:text-2xl text-gray-900 truncate">{title}</h2>
          ) : (
            <div className="relative max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search leagues, teams, players..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {/* Profile - Hidden on mobile, shown on tablet+ */}
          <button className="hidden md:flex items-center gap-3 p-2 pl-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="text-right">
              <p className="text-sm text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </button>
          
          {/* Profile Icon Only - Mobile */}
          <button className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}