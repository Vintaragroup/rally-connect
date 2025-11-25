import { TrendingUp, Users, ChevronRight, CalendarDays, BarChart3, ClipboardList, UserPlus } from "lucide-react";
import { MatchCard } from "./MatchCard";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface HomeScreenProps {
  onViewMatch: () => void;
  onViewAllSchedule?: () => void;
  onViewRatings?: () => void;
  isCaptain?: boolean;
  onBookCourt?: () => void;
  onViewWaitlist?: () => void;
  onViewAnalytics?: () => void;
  onSetAvailability?: () => void;
  onViewStandings?: () => void;
}

export function HomeScreen({ 
  onViewMatch, 
  onViewAllSchedule, 
  onViewRatings, 
  isCaptain = false,
  onBookCourt,
  onViewWaitlist,
  onViewAnalytics,
  onSetAvailability,
  onViewStandings 
}: HomeScreenProps) {
  const { user } = useAuth();
  
  // Get user first name and initials
  const getFirstName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getInitials = () => {
    if (user?.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      return (names[0][0] + (names[1]?.[0] || '')).toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  const firstName = getFirstName();
  const initials = getInitials();

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1>Home</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">
            Welcome back, {firstName}
          </p>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white text-sm sm:text-base">
          {initials}
        </div>
      </div>

      {/* Captain Actions */}
      {isCaptain && (
        <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <span className="text-amber-600">⭐</span>
            </div>
            <h3 className="text-base">Captain Actions</h3>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-sm border-[var(--color-border)]"
              onClick={onViewMatch}
            >
              Set Lineup
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-sm border-[var(--color-border)]"
              onClick={onSetAvailability}
            >
              Check Availability
            </Button>
          </div>
        </div>
      )}

      {/* Today's Match */}
      <div>
        <h2 className="mb-3">Today's Match</h2>
        <MatchCard
          time="7:30 PM"
          homeTeam="Merion Bocce Club"
          awayTeam="Radnor Rollers"
          location="Merion Cricket Club"
          status="scheduled"
          sport="bocce"
          isHighlighted
          onClick={onViewMatch}
        />
      </div>

      {/* This Week */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2>This Week</h2>
          <button className="text-[var(--color-primary)] text-sm flex items-center gap-1" onClick={onViewAllSchedule}>
            View all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <MatchCard
            time="Thu 6:00 PM"
            homeTeam="Your Pickleball Squad"
            awayTeam="Haverford Picklers"
            location="Devon Racquet Club"
            status="scheduled"
            sport="pickleball"
            onClick={onViewMatch}
          />
          <MatchCard
            time="Sat 10:00 AM"
            homeTeam="Aronimink Padel"
            awayTeam="Philadelphia Padel Club"
            location="Aronimink Golf Club"
            status="scheduled"
            sport="padel"
            onClick={onViewMatch}
          />
        </div>
      </div>

      {/* My Rating */}
      <div>
        <h2 className="mb-3">My Rating</h2>
        <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl font-semibold">4.2</span>
                <div className="flex items-center gap-1 text-[var(--color-success)]">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+0.3</span>
                </div>
              </div>
              <p className="text-[var(--color-text-secondary)] text-sm">
                Bocce Rating
              </p>
            </div>
          </div>
          
          {/* Simple sparkline */}
          <div className="h-16 flex items-end gap-1">
            {[3.8, 3.9, 3.7, 3.9, 4.0, 4.1, 4.0, 4.2].map((value, i) => (
              <div
                key={i}
                className="flex-1 bg-[var(--color-accent)] rounded-t opacity-70"
                style={{ height: `${(value / 5) * 100}%` }}
              />
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full mt-3 text-[var(--color-primary)]"
            onClick={onViewRatings}
          >
            View rating history
          </Button>
        </div>
      </div>

      {/* Team Snapshot */}
      <div>
        <h2 className="mb-3">Team Snapshot</h2>
        <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <span>🔴</span>
              </div>
              <div>
                <h3 className="text-base">Merion Bocce Club</h3>
                <p className="text-[var(--color-text-secondary)] text-xs">
                  Division 2 • Winter 24–25
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mb-3">
            <div>
              <div className="text-2xl font-semibold">2nd</div>
              <div className="text-[var(--color-text-secondary)] text-xs">of 8</div>
            </div>
            <div className="flex-1 h-px bg-[var(--color-border)]" />
            <div className="text-right">
              <div className="text-xl font-semibold">7–2</div>
              <div className="text-[var(--color-text-secondary)] text-xs">Record</div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-[var(--color-border)]">
            <div className="text-[var(--color-text-secondary)] text-sm flex-1">
              Last match:
            </div>
            <div className="text-sm font-medium text-[var(--color-success)]">
              W 4–1
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Role Based */}
      <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-base">Quick Actions</h3>
        </div>
        
        {/* Player Actions */}
        {!isCaptain && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onBookCourt}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--color-bg)] hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm">Book Court</span>
            </button>
            
            <button
              onClick={onViewWaitlist}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--color-bg)] hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm">Join Waitlist</span>
            </button>
          </div>
        )}
        
        {/* Captain Actions */}
        {isCaptain && (
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={onViewWaitlist}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--color-bg)] hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-center">Manage Waitlist</span>
            </button>
            
            <button
              onClick={onBookCourt}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--color-bg)] hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-center">Book Court</span>
            </button>
            
            <button
              onClick={onViewAnalytics}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--color-bg)] hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-center">Analytics</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}