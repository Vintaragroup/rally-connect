import { TrendingUp, Users, ChevronRight, CalendarDays, BarChart3, ClipboardList, UserPlus, Star, Trophy, Bell, Activity, Award, X } from "lucide-react";
import { MatchCard } from "./MatchCard";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { apiService } from "@/services/apiService";
import { EmptyState } from "./EmptyState";

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
  const [userTeams, setUserTeams] = useState<any[]>([]);
  const [userMatches, setUserMatches] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [standings, setStandings] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        const response = await apiService.get('/teams');
        setUserTeams(response.data || []);
      } catch (error) {
        console.error('Failed to fetch user teams:', error);
        setUserTeams([]);
      }
    };
    fetchUserTeams();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoadingMatches(true);
        const response = await apiService.get('/matches');
        if (Array.isArray(response.data)) {
          const upcomingMatches = response.data
            .filter((m: any) => new Date(m.scheduledDate) > new Date())
            .slice(0, 2);
          setUserMatches(upcomingMatches);
        }
      } catch (error) {
        console.error('Failed to fetch matches:', error);
        setUserMatches([]);
      } finally {
        setLoadingMatches(false);
      }
    };
    if (userTeams.length > 0) {
      fetchMatches();
    } else {
      setLoadingMatches(false);
    }
  }, [userTeams]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const response = await apiService.get('/standings');
        if (Array.isArray(response.data)) {
          const topTeams = response.data.slice(0, 4);
          setStandings(topTeams);
        }
      } catch (error) {
        console.error('Failed to fetch standings:', error);
        setStandings([]);
      } finally {
        setLoadingStats(false);
      }
    };
    if (userTeams.length > 0) {
      fetchStats();
    } else {
      setLoadingStats(false);
    }
  }, [userTeams]);
  
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
            {userTeams.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="Join a team to see your schedule"
                description="Once you're part of a team, your upcoming matches will appear here."
              />
            ) : loadingMatches ? (
              <div className="text-center py-8 text-[var(--color-text-secondary)]">Loading matches...</div>
            ) : userMatches.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="No upcoming matches"
                description="Check back soon for scheduled games."
              />
            ) : (
              userMatches.map((match, idx) => (
                <MatchCard
                  key={idx}
                  time={new Date(match.scheduledDate).toLocaleDateString()}
                  homeTeam={match.homeTeamName || 'TBD'}
                  awayTeam={match.awayTeamName || 'TBD'}
                  location={match.location || 'TBD'}
                  sport={match.sport || 'bocce'}
                  status="scheduled"
                  onClick={onViewMatch}
                />
              ))
            )}
          </div>
        </div>

        {/* Performance Dashboard - 2 Column Layout */}
        {userTeams.length > 0 ? (
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
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-[var(--color-text-secondary)]">Rating</p>
                    <span className="text-xs font-bold text-green-600">Loading...</span>
                  </div>
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600">
                    —
                  </div>
                </div>
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
                  <p className="text-3xl font-bold text-green-600">—</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--color-text-secondary)]">Losses</p>
                  <p className="text-3xl font-bold text-red-500">—</p>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-0 transition-all duration-500"></div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Division Standings */}
        {userTeams.length > 0 ? (
          <div className="animate-fade-in">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Division Standings</h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">Your competitive position</p>
            </div>
            {loadingStats ? (
              <div className="text-center py-8 text-[var(--color-text-secondary)]">Loading standings...</div>
            ) : standings.length === 0 ? (
              <EmptyState
                icon={Trophy}
                title="No standings available"
                description="Standings will appear once matches are scheduled."
              />
            ) : (
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
                    {standings.map((team, idx) => (
                      <tr 
                        key={idx} 
                        className={`border-b border-[var(--color-border)] last:border-b-0 transition-colors duration-200 hover:bg-[var(--color-bg)]`}
                      >
                        <td className="py-3 px-4 font-bold text-[var(--color-text-primary)]">{idx + 1}</td>
                        <td className="py-3 px-4 font-semibold">{team.name || 'TBD'}</td>
                        <td className="py-3 px-4 text-center font-medium">—</td>
                        <td className="py-3 px-4 text-right font-bold">—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}

        {/* Recent Activity Feed */}
        {userTeams.length > 0 ? (
          <div className="animate-fade-in">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Recent Activity</h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">Updates from your teams</p>
            </div>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-[var(--color-text-secondary)]">
                  No recent activity yet
                </div>
              ) : (
                recentActivity.map((activity, idx) => (
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
                ))
              )}
            </div>
          </div>
        ) : null}

        {/* Team Snapshot */}
        {userTeams.length > 0 ? (
          <div className="animate-fade-in">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Team Snapshot</h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">Active team overview</p>
            </div>
            {userTeams.length > 0 && (
              <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center text-lg">
                      🔴
                    </div>
                    <div>
                      <h3 className="text-base font-bold">{userTeams[0]?.name || 'Your Team'}</h3>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{userTeams[0]?.division || 'Division TBD'} • {userTeams[0]?.season || 'Season TBD'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-[var(--color-border)]">
                  <div>
                    <p className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Standing</p>
                    <p className="text-2xl font-bold">— <span className="text-xs text-[var(--color-text-secondary)]">of —</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Record</p>
                    <p className="text-2xl font-bold">—</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <p className="text-sm text-[var(--color-text-secondary)]">No recent matches yet</p>
                </div>
              </div>
            )}
          </div>
        ) : null}

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