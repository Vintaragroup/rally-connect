import { useState, useEffect } from 'react';
import { Dashboard } from '../pages/admin/Dashboard';
import { CaptainRequests } from '../pages/admin/CaptainRequests';
import { JoinRequests } from '../pages/admin/JoinRequests';
import { Leagues } from '../pages/admin/Leagues';
import { Seasons } from '../pages/admin/Seasons';
import { Divisions } from '../pages/admin/Divisions';
import { Teams } from '../pages/admin/Teams';
import { Players } from '../pages/admin/Players';
import { Schedule } from '../pages/admin/Schedule';
import { Settings } from '../pages/admin/Settings';
import { TopBar } from './admin/TopBar';
import { apiService } from '../services/api';

interface AdminLayoutProps {
  onExit?: () => void;
}

export function AdminLayout({ onExit }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [pendingCaptainRequests, setPendingCaptainRequests] = useState(0);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        // Placeholder - captain requests API method will be added
        // For now, just set to 0
        setPendingCaptainRequests(0);
      } catch (err) {
        console.error('Error fetching captain requests:', err);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    handleMobileMenuClose();
  };

  // Get page title based on current page
  const getPageTitle = () => {
    const titles: Record<string, string> = {
      dashboard: '',
      'captain-requests': 'Captain Requests',
      'join-requests': 'Join Requests',
      leagues: 'Leagues',
      seasons: 'Seasons',
      divisions: 'Divisions',
      teams: 'Teams',
      players: 'Players',
      schedule: 'Schedule',
      settings: 'Settings',
    };
    return titles[currentPage] || '';
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'captain-requests':
        return <CaptainRequests />;
      case 'join-requests':
        return <JoinRequests />;
      case 'leagues':
        return <Leagues />;
      case 'seasons':
        return <Seasons />;
      case 'divisions':
        return <Divisions />;
      case 'teams':
        return <Teams />;
      case 'players':
        return <Players />;
      case 'schedule':
        return <Schedule />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        handleMobileMenuClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  return (
    <div className="relative flex h-screen w-screen bg-gray-50 overflow-hidden">
      {/* Main Content Area - Flex column with TopBar, overlay nav, and page content */}
      <div className="relative flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* TopBar with menu toggle - Always visible */}
        <TopBar 
          title={getPageTitle()}
          notificationCount={pendingCaptainRequests}
          onMenuToggle={handleMenuToggle}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {/* Overlay nav panel under header (burger-controlled) */}
        {isMobileMenuOpen && (
          <div className="absolute inset-x-0 top-full z-40 bg-white border-b border-gray-200 shadow-md">
            <AdminSidebarContent
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onExit={onExit}
              onMobileMenuClose={handleMobileMenuClose}
              pendingCaptainRequests={pendingCaptainRequests}
            />
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

interface AdminSidebarContentProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onExit?: () => void;
  onMobileMenuClose?: () => void;
  pendingCaptainRequests: number;
}

function AdminSidebarContent({ 
  currentPage, 
  onPageChange, 
  onExit,
  onMobileMenuClose,
  pendingCaptainRequests
}: AdminSidebarContentProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'captain-requests', label: 'Captain Requests', icon: '✓', badge: pendingCaptainRequests },
    { id: 'leagues', label: 'Leagues', icon: '🏆' },
    { id: 'seasons', label: 'Seasons', icon: '📅' },
    { id: 'divisions', label: 'Divisions', icon: '⊞' },
    { id: 'teams', label: 'Teams', icon: '👥' },
    { id: 'players', label: 'Players', icon: '👤' },
    { id: 'schedule', label: 'Schedule', icon: '📆' },
    { id: 'settings', label: 'Settings', icon: '⚙' },
  ];

  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">R</span>
          </div>
          <div>
            <h1 className="text-gray-900 font-semibold">RallyOS</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onPageChange(item.id);
              onMobileMenuClose?.();
            }}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all text-left ${
              currentPage === item.id
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            {item.badge && item.badge > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {onExit && (
          <button
            onClick={onExit}
            className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-left"
          >
            <span>←</span>
            <span>Exit Admin</span>
          </button>
        )}
      </div>
    </>
  );
}
