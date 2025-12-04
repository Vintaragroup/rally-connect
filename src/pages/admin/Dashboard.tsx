import { useState, useEffect } from 'react';
import { StatCard } from '../../components/admin/StatCard';
import { QuickActionCard } from '../../components/admin/QuickActionCard';
import { ActivityItem } from '../../components/admin/ActivityItem';
import { Users, UserCircle, Trophy, Calendar, UserCheck, Plus, BarChart3, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

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
  const [leagueStep, setLeagueStep] = useState(1);
  const [sports, setSports] = useState<{ id: string; name: string }[]>([]);
  const [leagueData, setLeagueData] = useState({
    sportId: '',
    sportName: '',
    gender: '', // 'mixed', 'mens', 'womans'
    name: '',
    teams: [] as { name: string; theme?: string }[],
  });
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

  // Fetch sports when league modal opens
  useEffect(() => {
    if (showCreateModal === 'league') {
      const fetchSports = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || '/api';
          const res = await fetch(`${apiUrl}/sports`);
          if (res.ok) {
            const data = await res.json();
            setSports(data || []);
          }
        } catch (err) {
          console.error('Error fetching sports:', err);
          toast.error('Failed to load sports');
        }
      };
      fetchSports();
    }
  }, [showCreateModal]);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
      <main className={`flex-1 p-4 md:p-8 max-w-full overflow-x-hidden transition-all ${showCreateModal ? 'blur-sm' : ''}`}>
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
                onClick={() => setShowCreateModal('captains')}
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
                onClick={() => setShowCreateModal('analytics')}
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

        {/* Create Modals */}
        {showCreateModal === 'league' && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-lg overflow-hidden">
              {/* Progress Steps */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <div className="flex items-center justify-between mb-6">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                          step < leagueStep
                            ? 'bg-green-500 text-white'
                            : step === leagueStep
                            ? 'bg-white text-blue-600'
                            : 'bg-blue-400 text-white'
                        }`}
                      >
                        {step < leagueStep ? <Check className="w-5 h-5" /> : step}
                      </div>
                      {step < 4 && (
                        <div
                          className={`flex-1 h-1 mx-2 ${
                            step < leagueStep ? 'bg-green-500' : 'bg-blue-400'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-white text-base font-semibold">
                  {leagueStep === 1 && 'Step 1: Select Sport'}
                  {leagueStep === 2 && 'Step 2: Choose League Type'}
                  {leagueStep === 3 && 'Step 3: Name Your League'}
                  {leagueStep === 4 && 'Step 4: Add Teams'}
                </p>
              </div>

              {/* Modal Content */}
              <div className="p-8 max-h-96 overflow-y-auto">
                {/* Step 1: Select Sport */}
                {leagueStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Select a Sport</h3>
                      <p className="text-gray-600">Choose which sport this league will feature.</p>
                    </div>
                    <select
                      value={leagueData.sportId}
                      onChange={(e) => {
                        const selectedSport = sports.find((s) => s.id === e.target.value);
                        if (selectedSport) {
                          setLeagueData({ ...leagueData, sportId: e.target.value, sportName: selectedSport.name });
                        }
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-base"
                    >
                      <option value="">-- Select a Sport --</option>
                      {sports.map((sport) => (
                        <option key={sport.id} value={sport.id}>
                          {sport.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Step 2: League Gender */}
                {leagueStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">League Type for {leagueData.sportName}</h3>
                      <p className="text-gray-600">
                        {leagueData.sportName === 'Bocce'
                          ? "Bocce is always mixed gender."
                          : `Choose the gender composition for your ${leagueData.sportName} league.`}
                      </p>
                    </div>
                    <select
                      value={leagueData.gender}
                      onChange={(e) => setLeagueData({ ...leagueData, gender: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-base"
                    >
                      {leagueData.sportName === 'Bocce' ? (
                        <>
                          <option value="">-- Select League Type --</option>
                          <option value="mixed">Mixed Gender</option>
                        </>
                      ) : (
                        <>
                          <option value="">-- Select League Type --</option>
                          <option value="mens">Men's League</option>
                          <option value="womans">Women's League</option>
                          <option value="mixed">Mixed Gender League</option>
                        </>
                      )}
                    </select>
                  </div>
                )}

                {/* Step 3: League Name */}
                {leagueStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Name Your League</h3>
                      <p className="text-gray-600 mb-4">
                        {leagueData.gender === 'mens'
                          ? "Men's"
                          : leagueData.gender === 'womans'
                          ? "Women's"
                          : 'Mixed'}{' '}
                        {leagueData.sportName} League
                      </p>
                      <input
                        type="text"
                        placeholder="e.g., Downtown Bocce League, Spring Pickleball Series"
                        value={leagueData.name}
                        onChange={(e) => setLeagueData({ ...leagueData, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-base"
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Add Teams */}
                {leagueStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Add Teams</h3>
                      <p className="text-gray-600">Create the initial teams for your league. You can add more teams later.</p>
                    </div>

                    <div className="space-y-3 max-h-40 overflow-y-auto">
                      {leagueData.teams.map((team, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center border border-gray-200">
                          <div>
                            <p className="font-semibold text-gray-900">{team.name}</p>
                            {team.theme && <p className="text-sm text-gray-600">Theme: {team.theme}</p>}
                          </div>
                          <button
                            onClick={() =>
                              setLeagueData({
                                ...leagueData,
                                teams: leagueData.teams.filter((_, i) => i !== idx),
                              })
                            }
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Team Name</label>
                        <input
                          type="text"
                          placeholder="e.g., Eagles, Dragons"
                          id="teamName"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Team Theme (Optional)</label>
                        <select
                          id="teamTheme"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                          <option value="">No theme</option>
                          <option value="college">College Names (Texas, UCLA, Duke...)</option>
                          <option value="city">City Names (Austin, Seattle, Denver...)</option>
                          <option value="movie">Movie References (Jaws, Matrix, Inception...)</option>
                          <option value="animal">Animals (Eagles, Tigers, Bears...)</option>
                          <option value="mythology">Mythology (Titans, Phoenix, Kraken...)</option>
                        </select>
                      </div>
                      <button
                        onClick={() => {
                          const teamNameEl = document.getElementById('teamName') as HTMLInputElement;
                          const themeEl = document.getElementById('teamTheme') as HTMLSelectElement;
                          if (teamNameEl.value.trim()) {
                            setLeagueData({
                              ...leagueData,
                              teams: [
                                ...leagueData.teams,
                                { name: teamNameEl.value, theme: themeEl.value },
                              ],
                            });
                            teamNameEl.value = '';
                            themeEl.value = '';
                          }
                        }}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Team
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-8 py-4 flex gap-3 justify-end border-t">
                <button
                  onClick={() => {
                    setShowCreateModal(null);
                    setLeagueStep(1);
                    setLeagueData({
                      sportId: '',
                      sportName: '',
                      gender: '',
                      name: '',
                      teams: [],
                    });
                  }}
                  className="px-6 py-2 text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                {leagueStep > 1 && (
                  <button
                    onClick={() => setLeagueStep(leagueStep - 1)}
                    className="px-6 py-2 text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    Back
                  </button>
                )}
                {leagueStep < 3 && (
                  <button
                    onClick={() => {
                      if (leagueStep === 1 && !leagueData.sportId) {
                        toast.error('Please select a sport');
                        return;
                      }
                      if (leagueStep === 2 && !leagueData.gender) {
                        toast.error('Please select a league type');
                        return;
                      }
                      setLeagueStep(leagueStep + 1);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                {leagueStep === 3 && (
                  <button
                    onClick={() => {
                      if (!leagueData.name.trim()) {
                        toast.error('Please enter a league name');
                        return;
                      }
                      setLeagueStep(4);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                {leagueStep === 4 && (
                  <button
                    onClick={() => {
                      if (!leagueData.name.trim()) {
                        toast.error('Please enter a league name');
                        return;
                      }
                      // TODO: Submit league creation to API
                      toast.success(`League "${leagueData.name}" created successfully!`);
                      setShowCreateModal(null);
                      setLeagueStep(1);
                      setLeagueData({
                        sportId: '',
                        sportName: '',
                        gender: '',
                        name: '',
                        teams: [],
                      });
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    <Check className="w-4 h-4" />
                    Create League
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {showCreateModal === 'season' && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Create New Season</h2>
              <div className="space-y-4 mb-6">
                <p className="text-gray-600">Start a new season within your league. Define the start and end dates, schedule format, and playoff rules.</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700"><strong>Tip:</strong> Seasons help organize tournaments and matches chronologically.</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(null)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showCreateModal === 'team' && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Create New Team</h2>
              <div className="space-y-4 mb-6">
                <p className="text-gray-600">Create a new team within a league. Assign a captain and set roster limits for your team.</p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-sm text-purple-700"><strong>Tip:</strong> Teams can have multiple divisions and play different sports.</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(null)}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showCreateModal === 'player' && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Add New Player</h2>
              <div className="space-y-4 mb-6">
                <p className="text-gray-600">Register a new player in your system. Players can join teams and participate in matches once registered.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700"><strong>Tip:</strong> Players can be added individually or in bulk through CSV import.</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(null)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showCreateModal === 'captains' && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Manage Captains</h2>
              <div className="space-y-4 mb-6">
                <p className="text-gray-600">Manage team captains, review captain requests, and handle team leadership transitions.</p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm text-orange-700"><strong>Tip:</strong> Use the "League Administration" panel to handle all captain-related tasks.</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(null)}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showCreateModal === 'analytics' && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Analytics & Reports</h2>
              <div className="space-y-4 mb-6">
                <p className="text-gray-600">View comprehensive analytics including player performance, team statistics, match results, and seasonal trends.</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700"><strong>Tip:</strong> Analytics help you make data-driven decisions about your league management.</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(null)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}