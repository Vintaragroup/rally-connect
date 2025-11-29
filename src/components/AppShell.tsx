import { ReactNode } from "react";
import { Home, Calendar, Users, TrendingUp, MoreHorizontal, Settings } from "lucide-react";
import { useCurrentUser } from "../hooks/useCurrentUser";

interface AppShellProps {
  children: ReactNode;
  activeTab?: "home" | "schedule" | "teams" | "ratings" | "more" | "admin";
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onTabChange?: (tab: "home" | "schedule" | "teams" | "ratings" | "more" | "admin") => void;
}

export function AppShell({ 
  children, 
  activeTab = "home", 
  title,
  showBack = false,
  onBack,
  onTabChange
}: AppShellProps) {
  const { user } = useCurrentUser();

  // Base tabs available to all users
  const baseTabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "teams", label: "Teams", icon: Users },
    { id: "ratings", label: "Ratings", icon: TrendingUp },
  ];

  // Add admin tab if user is an admin
  const tabs = user?.isAdmin 
    ? [...baseTabs, { id: "admin", label: "Admin", icon: Settings }]
    : baseTabs;

  // Always add More tab at the end
  tabs.push({ id: "more", label: "More", icon: MoreHorizontal });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] w-full mx-auto relative">
      <div className="app-container">
        {/* Top App Bar */}
        {title && (
          <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
            {showBack && (
              <button 
                onClick={onBack}
                className="p-1 -ml-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back to previous screen"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            <h1 className="text-lg">{title}</h1>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-20">
          {children}
        </div>

        {/* Bottom Navigation */}
        <nav 
          className="fixed bottom-0 left-0 right-0 bg-[var(--color-bg-elevated)] border-t border-[var(--color-border)] px-2 py-2 safe-area-inset-bottom"
          aria-label="Main navigation"
          role="navigation"
        >
          <div className="app-container mx-auto">
            <div className="flex items-center justify-around">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange?.(tab.id as any)}
                    className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                      isActive 
                        ? "text-[var(--color-primary)]" 
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    }`}
                    aria-label={tab.label}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                    <span className="text-xs sm:text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}