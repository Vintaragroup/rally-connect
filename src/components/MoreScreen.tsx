import { 
  User, 
  Bell, 
  Settings, 
  HelpCircle, 
  Shield, 
  LogOut, 
  ChevronRight,
  Mail,
  Trophy,
  Users,
  ClipboardList,
  BarChart3,
  Award,
  TrendingUp,
  UserSearch,
  Image,
  DollarSign,
  MessageCircle,
  CalendarClock,
  MessageSquare,
  Settings2
} from "lucide-react";
import { SportIcon } from "./SportIcon";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface MoreScreenProps {
  onViewTeam?: () => void;
  onSignOut?: () => void;
  isCaptain?: boolean;
  isAssociationAdmin?: boolean;
  onManageRoster?: () => void;
  onSetLineups?: () => void;
  onViewAnalytics?: () => void;
  onViewNotifications?: () => void;
  onEditProfile?: () => void;
  onViewPreferences?: () => void;
  onViewAchievements?: () => void;
  onViewPersonalStats?: () => void;
  onViewPlayerDirectory?: () => void;
  onViewPhotoGallery?: () => void;
  onViewDuesPayment?: () => void;
  onViewTeamChat?: () => void;
  onViewPracticeScheduler?: () => void;
  onViewFeedback?: () => void;
  onViewSettings?: () => void;
  onViewMyStandings?: () => void;
  onViewDivisionStandings?: () => void;
  onViewAssociationAdmin?: () => void;
}

export function MoreScreen({ 
  onViewTeam, 
  onSignOut, 
  isCaptain = false,
  isAssociationAdmin = false,
  onManageRoster, 
  onSetLineups, 
  onViewAnalytics,
  onViewNotifications,
  onEditProfile,
  onViewPreferences,
  onViewAchievements,
  onViewPersonalStats,
  onViewPlayerDirectory,
  onViewPhotoGallery,
  onViewDuesPayment,
  onViewTeamChat,
  onViewPracticeScheduler,
  onViewFeedback,
  onViewSettings,
  onViewMyStandings,
  onViewDivisionStandings,
  onViewAssociationAdmin
}: MoreScreenProps) {
  const { user } = useAuth();
  const { user: currentUser } = useCurrentUser();
  
  // Use role-based admin status from currentUser if available, otherwise fall back to prop
  const isAdmin = currentUser?.isAdmin ?? isAssociationAdmin;
  const isCaptainRole = currentUser?.isCaptain ?? isCaptain;
  
  // Get user initials from email or name
  const getInitials = () => {
    if (user?.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      return (names[0][0] + (names[1]?.[0] || '')).toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  const profile = {
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
    email: user?.email || 'user@example.com',
    initials: getInitials(),
    roles: currentUser?.roles.map(r => r.charAt(0).toUpperCase() + r.slice(1)) || 
           (isAdmin ? ["Admin"] : isCaptainRole ? ["Captain"] : ["Player"]),
  };

  const myTeams: any[] = [];

  const captainTools = [
    { icon: Users, label: "Manage Roster", badge: null },
    { icon: ClipboardList, label: "Set Lineups", badge: null },
    { icon: BarChart3, label: "Team Analytics", badge: null },
  ];

  const menuSections = [
    {
      title: "Team Tools",
      items: [
        { icon: MessageCircle, label: "Team Chat", badge: "5" },
        { icon: CalendarClock, label: "Practice Scheduler", badge: null },
      ],
    },
    {
      title: "Performance",
      items: [
        { icon: Trophy, label: "My Standings", badge: null },
        { icon: TrendingUp, label: "My Stats", badge: null },
        { icon: Award, label: "Achievements", badge: "2" },
      ],
    },
    {
      title: "Community",
      items: [
        { icon: UserSearch, label: "Player Directory", badge: null },
        { icon: Image, label: "Photo Gallery", badge: null },
        { icon: DollarSign, label: "Dues & Payments", badge: null },
      ],
    },
    {
      title: "Account",
      items: [
        { icon: User, label: "Edit Profile", badge: null },
        { icon: Bell, label: "Notifications", badge: "3" },
        { icon: Settings, label: "Preferences", badge: null },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: MessageSquare, label: "Send Feedback", badge: null },
        { icon: HelpCircle, label: "Help & FAQ", badge: null },
        { icon: Shield, label: "Terms & Privacy", badge: null },
      ],
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4">
        <h1>More</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-soft)] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
              {profile.initials}
            </div>
            <div className="flex-1">
              <h2 className="text-white mb-1">{profile.name}</h2>
              <p className="text-white/80 text-sm mb-2">{profile.email}</p>
              <div className="flex gap-2">
                {profile.roles.map((role, index) => (
                  <span
                    key={index}
                    className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Button 
            variant="secondary" 
            className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 text-white"
            onClick={onEditProfile}
          >
            Edit Profile
          </Button>
        </div>

        {/* My Teams */}
        <div>
          <h2 className="mb-3">My Teams</h2>
          <div className="space-y-2">
            {myTeams.map((team, index) => (
              <button
                key={index}
                className="w-full bg-[var(--color-bg-elevated)] rounded-xl p-3 shadow-sm hover:shadow-md transition-all flex items-center gap-3 text-left"
                onClick={() => onViewTeam?.()}
              >
                <SportIcon sport={team.sport} size={32} />
                <div className="flex-1">
                  <div className="font-medium text-sm">{team.name}</div>
                  <div className="text-xs text-[var(--color-text-secondary)]">
                    {team.role}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--color-text-secondary)]" />
              </button>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <h3 className="text-base">Season Stats</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-semibold">20</div>
              <div className="text-xs text-[var(--color-text-secondary)]">Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-[var(--color-success)]">14</div>
              <div className="text-xs text-[var(--color-text-secondary)]">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold">70%</div>
              <div className="text-xs text-[var(--color-text-secondary)]">Win Rate</div>
            </div>
          </div>
        </div>

        {/* Captain Tools */}
        {isCaptain && (
          <div>
            <h3 className="text-sm text-[var(--color-text-secondary)] mb-2 px-2">
              Captain Tools
            </h3>
            <div className="bg-[var(--color-bg-elevated)] rounded-2xl shadow-sm overflow-hidden">
              {captainTools.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${
                      itemIndex !== captainTools.length - 1
                        ? "border-b border-[var(--color-border)]"
                        : ""
                    }`}
                    onClick={() => {
                      if (item.label === "Manage Roster") {
                        onManageRoster?.();
                      } else if (item.label === "Set Lineups") {
                        onSetLineups?.();
                      } else if (item.label === "Team Analytics") {
                        onViewAnalytics?.();
                      }
                    }}
                  >
                    <Icon className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Association Admin Tools */}
        {isAdmin && (
          <div>
            <h3 className="text-sm text-[var(--color-text-secondary)] mb-2 px-2">
              Admin Tools
            </h3>
            <div className="bg-[var(--color-bg-elevated)] rounded-2xl shadow-sm overflow-hidden">
              <button
                className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                onClick={onViewAssociationAdmin}
              >
                <Settings2 className="w-5 h-5 text-[var(--color-text-secondary)]" />
                <span className="flex-1">League Administration</span>
                <ChevronRight className="w-5 h-5 text-[var(--color-text-secondary)]" />
              </button>
            </div>
          </div>
        )}

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-sm text-[var(--color-text-secondary)] mb-2 px-2">
              {section.title}
            </h3>
            <div className="bg-[var(--color-bg-elevated)] rounded-2xl shadow-sm overflow-hidden">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${
                      itemIndex !== section.items.length - 1
                        ? "border-b border-[var(--color-border)]"
                        : ""
                    }`}
                    onClick={() => {
                      if (item.label === "Notifications") {
                        onViewNotifications?.();
                      } else if (item.label === "Preferences") {
                        onViewPreferences?.();
                      } else if (item.label === "Edit Profile") {
                        onEditProfile?.();
                      } else if (item.label === "Achievements") {
                        onViewAchievements?.();
                      } else if (item.label === "My Stats") {
                        onViewPersonalStats?.();
                      } else if (item.label === "My Standings") {
                        onViewMyStandings?.();
                      } else if (item.label === "Player Directory") {
                        onViewPlayerDirectory?.();
                      } else if (item.label === "Photo Gallery") {
                        onViewPhotoGallery?.();
                      } else if (item.label === "Dues & Payments") {
                        onViewDuesPayment?.();
                      } else if (item.label === "Team Chat") {
                        onViewTeamChat?.();
                      } else if (item.label === "Practice Scheduler") {
                        onViewPracticeScheduler?.();
                      } else if (item.label === "Send Feedback") {
                        onViewFeedback?.();
                      }
                    }}
                  >
                    <Icon className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* App Info */}
        <div className="text-center space-y-2">
          <div className="text-sm text-[var(--color-text-secondary)]">
            RallyOS Version 1.0.0
          </div>
          <div className="text-xs text-[var(--color-text-tertiary)]">
            Made for alternative sports leagues
          </div>
        </div>

        {/* Sign Out */}
        <Button
          variant="outline"
          className="w-full border-red-200 text-red-600 hover:bg-red-50"
          onClick={() => onSignOut?.()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}