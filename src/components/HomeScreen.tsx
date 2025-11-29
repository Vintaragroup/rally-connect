import { TrendingUp, Users, ChevronRight, CalendarDays, BarChart3, ClipboardList, UserPlus, Star, Trophy, Bell, Activity, Award, X } from "lucide-react";
import { MatchCard } from "./MatchCard";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

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
  const [dismissedNotifications, setDismissedNotifications] = useState<Set<number>>(new Set());
  
  const dismissNotification = (index: number) => {
    setDismissedNotifications(new Set([...dismissedNotifications, index]));
  };
  
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
    <div className="bg-gradient-to-b from-[var(--color-bg)] to-[var(--color-bg)] min-h-screen">
      <div className="space-y-6 p-3 sm:p-4 md:p-6 max-w-6xl mx-auto pb-24">
        
        {/* Header Section - Enhanced */}
        <div className="flex items-center justify-between pt-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Home</h1>
            <p className="text-[var(--color-text-secondary)] text-sm mt-2">
              Welcome back, <span className="font-medium text-[var(--color-text-primary)]">{firstName}</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-primary)] via-blue-500 to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            {initials}
          </div>
        </div>

        {/* Captain Actions - Enhanced */}
        {isCaptain && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200 shadow-sm animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <span className="text-amber-600">⭐</span>
              </div>
              <h3 className="text-base font-semibold">Captain Actions</h3>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-sm border-amber-200 hover:bg-amber-50"
                onClick={onViewMatch}
              >
                Set Lineup
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-sm border-amber-200 hover:bg-amber-50"
                onClick={onSetAvailability}
              >
                Check Availability
              </Button>
            </div>
          </div>
        )}

        {/* Notifications Banner - Compact & Dismissible */}
        <div className="space-y-2 animate-fade-in">
          {[
            { type: 'blue', title: 'Waitlist Approved', message: 'You\'ve been approved for "Thursday Night Bocce"' },
            { type: 'amber', title: 'Team Announcement', message: 'Practice moved to 7:00 PM this Sunday' },
          ].filter((_, idx) => !dismissedNotifications.has(idx)).map((notification, idx) => {
            const colorClasses = notification.type === 'blue' 
              ? 'bg-blue-50 border-blue-200 text-blue-900'
              : 'bg-amber-50 border-amber-200 text-amber-900';
            const iconColor = notification.type === 'blue' ? 'text-blue-600' : 'text-amber-600';
            
            return (
              <div key={idx} className={`${colorClasses} border-l-4 rounded-lg p-3 flex items-start gap-3 shadow-sm group hover:shadow-md transition-all duration-200`}>
                <div className={`w-8 h-8 rounded-full ${notification.type === 'blue' ? 'bg-blue-100' : 'bg-amber-100'} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Bell className={`w-4 h-4 ${iconColor}`} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{notification.title}</p>
                  <p className={`text-xs ${notification.type === 'blue' ? 'text-blue-800' : 'text-amber-800'} mt-0.5`}>{notification.message}</p>
                </div>
                <button 
                  onClick={() => dismissNotification(idx)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-white rounded-lg"
                  aria-label={`Dismiss notification: ${notification.title}`}
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Upcoming Matches - Primary */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">Upcoming Matches</h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">Next games to prepare for</p>
            </div>
            <button 
              onClick={onViewAllSchedule}
              className="text-sm font-semibold text-[var(--color-primary)] hover:text-blue-700 transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {[
              { date: 'Tomorrow • 6:00 PM', opponent: 'vs Rival Team', court: 'Court 3', highlight: true },
              { date: 'Dec 7 • 7:00 PM', opponent: 'vs Champions', court: 'Court 1', highlight: false },
            ].map((match, idx) => (
              <button
                key={idx}
                onClick={onViewMatch}
                className={`w-full rounded-2xl p-4 transition-all duration-300 transform hover:scale-102 hover:shadow-md ${
                  match.highlight 
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-sm' 
                    : 'bg-[var(--color-bg-elevated)] border border-transparent shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-left">
                    <CalendarDays className={`w-4 h-4 ${match.highlight ? 'text-blue-600' : 'text-[var(--color-text-secondary)]'}`} />
                    <span className={`text-sm font-semibold ${match.highlight ? 'text-blue-900' : ''}`}>{match.date}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--color-text-secondary)]" />
                </div>
                <div className="flex items-center justify-between text-left">
                  <div>
                    <p className="text-[var(--color-text-secondary)] text-xs">Your Team</p>
                    <p className="font-semibold">{match.opponent}</p>
                  </div>
                  <div className="text-right text-sm text-[var(--color-text-secondary)] font-medium">
                    {match.court}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Performance Dashboard - 2 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          
          {/* Your Rating - Gradient Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-5 border border-yellow-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-200 to-amber-200 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="text-base font-bold">Your Rating</h3>
                <p className="text-xs text-[var(--color-text-secondary)]">Multi-sport ranking</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { sport: 'Bocce', rating: '1,245', trend: '+12', color: 'from-orange-400 to-amber-400' },
                { sport: 'Pickleball', rating: '1,089', trend: '+5', color: 'from-yellow-400 to-orange-400' },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-[var(--color-text-secondary)]">{item.sport}</p>
                    <span className="text-xs font-bold text-green-600">↑ {item.trend}</span>
                  </div>
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600">
                    {item.rating}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Season Stats - Gradient Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-200 to-emerald-200 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <h3 className="text-base font-bold">Season Stats</h3>
                <p className="text-xs text-[var(--color-text-secondary)]">Current performance</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">Wins</p>
                <p className="text-3xl font-bold text-green-600">8</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">Losses</p>
                <p className="text-3xl font-bold text-red-500">3</p>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-8/12 transition-all duration-500"></div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">Win Rate</p>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">73%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Division Standings */}
        <div className="animate-fade-in">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Division Standings</h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">Your competitive position</p>
          </div>
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-[var(--color-border)]">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-secondary)]">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-secondary)]">Team</th>
                  <th className="text-center py-3 px-4 font-semibold text-[var(--color-text-secondary)]">W-L</th>
                  <th className="text-right py-3 px-4 font-semibold text-[var(--color-text-secondary)]">Pts</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rank: 1, name: 'Your Team', wl: '8-3', pts: 16, isYou: true },
                  { rank: 2, name: 'Champions', wl: '7-4', pts: 14, isYou: false },
                  { rank: 3, name: 'Rival Team', wl: '6-5', pts: 12, isYou: false },
                  { rank: 4, name: 'Rising Stars', wl: '5-6', pts: 10, isYou: false },
                ].map((team, idx) => (
                  <tr 
                    key={idx} 
                    className={`border-b border-[var(--color-border)] last:border-b-0 transition-colors duration-200 ${
                      team.isYou 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100' 
                        : 'hover:bg-[var(--color-bg)]'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-[var(--color-text-primary)]">{team.rank}</td>
                    <td className={`py-3 px-4 font-semibold ${team.isYou ? 'text-[var(--color-primary)]' : ''}`}>
                      {team.name} {team.isYou && '⭐'}
                    </td>
                    <td className="py-3 px-4 text-center font-medium">{team.wl}</td>
                    <td className="py-3 px-4 text-right font-bold">{team.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="animate-fade-in">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">Updates from your teams</p>
          </div>
          <div className="space-y-3">
            {[
              { icon: Trophy, color: 'from-green-400 to-emerald-400', title: 'Match Won', desc: 'Your Team defeated Rivals 11-8', time: '2 hours ago' },
              { icon: Users, color: 'from-purple-400 to-pink-400', title: 'New Member Joined', desc: 'Alex Rodriguez joined Your Team', time: '5 hours ago' },
              { icon: Award, color: 'from-yellow-400 to-orange-400', title: 'Achievement Unlocked', desc: 'You earned the "Hot Streak" badge (5 wins)', time: '1 day ago' },
              { icon: Activity, color: 'from-blue-400 to-cyan-400', title: 'Rating Update', desc: 'Bocce rating increased to 1,245 (+12 pts)', time: '2 days ago' },
            ].map((activity, idx) => (
              <div 
                key={idx}
                className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 flex items-start gap-3 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <activity.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold">{activity.title}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{activity.desc}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 font-medium">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Snapshot */}
        <div className="animate-fade-in">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Team Snapshot</h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">Active team overview</p>
          </div>
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center text-lg">
                  🔴
                </div>
                <div>
                  <h3 className="text-base font-bold">Merion Bocce Club</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Division 2 • Winter 24-25</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-[var(--color-border)]">
              <div>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Standing</p>
                <p className="text-2xl font-bold">2nd <span className="text-xs text-[var(--color-text-secondary)]">of 8</span></p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Record</p>
                <p className="text-2xl font-bold">7-2</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="text-sm text-[var(--color-text-secondary)]">Last match: <span className="font-semibold text-green-600">W 4-1</span></p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="animate-fade-in">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Quick Actions</h2>
          </div>
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-5 shadow-sm">
            {!isCaptain && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onBookCourt}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-center">Book Court</span>
                </button>
                
                <button
                  onClick={onViewWaitlist}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-center">Waitlist</span>
                </button>
              </div>
            )}
            
            {isCaptain && (
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={onViewWaitlist}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-center">Waitlist</span>
                </button>
                
                <button
                  onClick={onBookCourt}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-center">Book Court</span>
                </button>
                
                <button
                  onClick={onViewAnalytics}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-center">Analytics</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}