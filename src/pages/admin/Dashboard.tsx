import { useState, useEffect } from 'react';
import { StatCard } from '../../components/admin/StatCard';
import { QuickActionCard } from '../../components/admin/QuickActionCard';
import { ActivityItem } from '../../components/admin/ActivityItem';
import { Users, UserCircle, Trophy, Calendar, UserCheck, Plus, BarChart3 } from 'lucide-react';

interface AdminStats {
  totalPlayers: number;
  totalTeams: number;
  totalLeagues: number;
  totalSeasons: number;
  pendingCaptainRequests: number;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  actionBy?: string;
}

interface DashboardProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function Dashboard({ onMenuToggle, isMobileMenuOpen }: DashboardProps) {
  const [showCreateModal, setShowCreateModal] = useState<string | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalPlayers: 0,
    totalTeams: 0,
    totalLeagues: 0,
    totalSeasons: 0,
    pendingCaptainRequests: 0,
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '/api';
        
        // Fetch leagues
        const leaguesRes = await fetch(`${apiUrl}/leagues`);
        const leaguesData = leaguesRes.ok ? await leaguesRes.json() : [];
        
        // Fetch teams
        const teamsRes = await fetch(`${apiUrl}/teams`);
        const teamsData = teamsRes.ok ? await teamsRes.json() : [];
        
        // Fetch players
        const playersRes = await fetch(`${apiUrl}/players`);
        const playersData = playersRes.ok ? await playersRes.json() : [];
        
        // Update stats
        setAdminStats({
          totalPlayers: playersData.length || 0,
          totalTeams: teamsData.length || 0,
          totalLeagues: leaguesData.length || 0,
          totalSeasons: 0, // TODO: Add seasons endpoint
          pendingCaptainRequests: 0, // TODO: Add captain requests count endpoint
        });
        
        // For now, we'll keep recentActivities empty until we have an activity log endpoint
        setRecentActivities([]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
      <main className="flex-1 p-4 md:p-8 max-w-full overflow-x-hidden">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl text-gray-900 mb-2">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600">Welcome back! Here's what's happening across your leagues.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 mb-6 md:mb-8">
          <StatCard
            icon={UserCircle}
            label="Total Players"
            value={adminStats.totalPlayers.toLocaleString()}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            icon={Users}
            label="Total Teams"
            value={adminStats.totalTeams}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            icon={Trophy}
            label="Total Leagues"
            value={adminStats.totalLeagues}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-100"
          />
          <StatCard
            icon={Calendar}
            label="Total Seasons"
            value={adminStats.totalSeasons}
            iconColor="text-orange-600"
            iconBgColor="bg-orange-100"
          />
          <StatCard
            icon={UserCheck}
            label="Pending Requests"
            value={adminStats.pendingCaptainRequests}
            iconColor="text-red-600"
            iconBgColor="bg-red-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-base md:text-lg text-gray-900 mb-1">Quick Actions</h3>
              <p className="text-xs md:text-sm text-gray-600">Perform common administrative tasks</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
              <QuickActionCard
                icon={Trophy}
                label="Create League"
                onClick={() => setShowCreateModal('league')}
                color="blue"
              />
              <QuickActionCard
                icon={Calendar}
                label="Create Season"
                onClick={() => setShowCreateModal('season')}
                color="green"
              />
              <QuickActionCard
                icon={Users}
                label="Create Team"
                onClick={() => setShowCreateModal('team')}
                color="purple"
              />
              <QuickActionCard
                icon={UserCheck}
                label="Manage Captains"
                onClick={() => window.location.href = '/admin/captain-requests'}
                color="orange"
              />
              <QuickActionCard
                icon={Plus}
                label="Add Player"
                onClick={() => setShowCreateModal('player')}
                color="blue"
              />
              <QuickActionCard
                icon={BarChart3}
                label="View Analytics"
                onClick={() => alert('Analytics coming soon!')}
                color="green"
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg text-gray-900 mb-1">Recent Activity</h3>
              <p className="text-sm text-gray-600">Latest administrative actions</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200">
              {recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="px-4">
                  <ActivityItem activity={activity} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        {adminStats.pendingCaptainRequests > 0 && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 text-yellow-600 p-2.5 rounded-xl">
                <UserCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-yellow-900 mb-1">
                  {adminStats.pendingCaptainRequests} Pending Captain Request{adminStats.pendingCaptainRequests > 1 ? 's' : ''}
                </h4>
                <p className="text-sm text-yellow-700 mb-4">
                  You have captain requests waiting for approval. Review and approve them to help teams get organized.
                </p>
                <a
                  href="/admin/captain-requests"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors text-sm font-medium"
                >
                  Review Requests
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}