import { useState, useEffect } from "react";
import { Calendar, Filter, AlertCircle, Clock, Plus, Edit2, Trash2, CheckCircle, XCircle, WifiOff } from "lucide-react";
import { MatchCard } from "./MatchCard";
import { Button } from "./ui/button";
import { EmptyState } from "./EmptyState";
import { SkeletonMatchCard } from "./ui/skeleton";
import { apiService } from "../services/api";
import { useOnline } from "@/hooks/useOnline";
import { toast } from "sonner";

interface ScheduleScreenProps {
  onViewMatch: () => void;
  userRole?: "player" | "captain" | "admin" | null;
  isAdmin?: boolean;
  isCaptain?: boolean;
  isPlayer?: boolean;
}

interface Match {
  id: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  location: string;
  status: "scheduled" | "completed" | "forfeited" | "rescheduled" | "live";
  sport: "bocce" | "pickleball" | "padel";
  score?: string;
  date: string;
}

interface SchedulingRequest {
  id: string;
  type: "preference" | "conflict";
  dates: string[];
  reason?: string;
  status: "pending" | "approved" | "rejected";
  captainName?: string;
  teamName?: string;
}

interface AdminRequest extends SchedulingRequest {
  captainName: string;
  teamName: string;
  submittedAt?: string;
}

export function ScheduleScreen({ 
  onViewMatch, 
  userRole = "player",
  isAdmin = false,
  isCaptain = false,
  isPlayer = true
}: ScheduleScreenProps) {
  const isOnline = useOnline();
  // Derive role flags from userRole if not explicitly provided
  const effectiveIsAdmin = isAdmin || userRole === "admin";
  const effectiveIsCaptain = isCaptain || userRole === "captain";
  const effectiveIsPlayer = isPlayer || userRole === "player";
  const [activeView, setActiveView] = useState<"upcoming" | "past" | "all">("upcoming");
  const [selectedSport, setSelectedSport] = useState<"all" | "bocce" | "pickleball" | "padel">("all");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [schedulingType, setSchedulingType] = useState<"preference" | "conflict" | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [conflictReason, setConflictReason] = useState("");
  const [existingRequests, setExistingRequests] = useState<SchedulingRequest[]>([]);
  const [schedulingRequests, setSchedulingRequests] = useState<SchedulingRequest[]>([]);
  
  // Admin panel state
  const [adminTab, setAdminTab] = useState<"requests" | "manage">("requests");
  const [adminRequests, setAdminRequests] = useState<AdminRequest[]>([]);
  const [showCreateMatchModal, setShowCreateMatchModal] = useState(false);
  const [newMatch, setNewMatch] = useState({
    date: "",
    time: "",
    homeTeam: "",
    awayTeam: "",
    location: "",
    sport: "bocce" as "bocce" | "pickleball" | "padel",
  });

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await apiService.getMatches();
        if (response.data) {
          // Transform API response to match component format
          const transformedMatches = (response.data as any[]).map((match) => ({
            id: match.id,
            time: new Date(match.scheduledTime).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit' 
            }),
            homeTeam: match.homeTeam?.name || 'Unknown',
            awayTeam: match.awayTeam?.name || 'Unknown',
            location: match.location || 'TBD',
            status: match.status || 'scheduled',
            sport: match.sport?.name?.toLowerCase() || 'bocce',
            score: match.score,
            date: new Date(match.scheduledTime).toISOString().split('T')[0],
          }));
          setMatches(transformedMatches);
          setError(null);
        } else {
          setError(response.error || 'Failed to fetch matches');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching matches');
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const sports = [
    { id: "all", label: "All Sports" },
    { id: "bocce", label: "Bocce" },
    { id: "pickleball", label: "Pickleball" },
    { id: "padel", label: "Padel" },
  ];

  // Group matches by date
  const groupedByDate = matches.reduce((acc, match) => {
    const existingGroup = acc.find(g => g.date === match.date);
    if (existingGroup) {
      existingGroup.matches.push(match);
    } else {
      acc.push({ date: match.date, matches: [match] });
    }
    return acc;
  }, [] as { date: string; matches: Match[] }[]);

  // Filter by active view (upcoming/past/all) and sport
  const now = new Date();
  const filteredMatches = groupedByDate
    .map((dateGroup) => ({
      date: dateGroup.date,
      matches: dateGroup.matches.filter((match) => {
        const matchDate = new Date(match.date);
        const isPast = matchDate < now;
        const sportMatch = selectedSport === "all" || match.sport === selectedSport;
        
        if (activeView === "upcoming") return !isPast && sportMatch;
        if (activeView === "past") return isPast && sportMatch;
        return sportMatch;
      }),
    }))
    .filter((dateGroup) => dateGroup.matches.length > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-[var(--color-text-secondary)]">Loading matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  const handleSubmitSchedulingRequest = () => {
    if (selectedDates.length === 0) {
      toast.error("Please select at least one date");
      return;
    }

    if (schedulingType === "conflict" && !conflictReason.trim()) {
      toast.error("Please provide a reason for the conflict");
      return;
    }

    const request: SchedulingRequest = {
      id: Date.now().toString(),
      type: schedulingType!,
      dates: selectedDates,
      reason: conflictReason || undefined,
      status: "pending",
    };

    setExistingRequests([...existingRequests, request]);
    toast.success(
      schedulingType === "preference"
        ? "Preferred play dates submitted to admin!"
        : "Scheduling conflict reported to admin!"
    );

    setShowSchedulingModal(false);
    setSelectedDates([]);
    setConflictReason("");
    setSchedulingType(null);
  };

  const handleApproveRequest = (requestId: string) => {
    setAdminRequests(adminRequests.map(req =>
      req.id === requestId ? { ...req, status: "approved" } : req
    ));
    toast.success("Request approved!");
  };

  const handleRejectRequest = (requestId: string) => {
    setAdminRequests(adminRequests.map(req =>
      req.id === requestId ? { ...req, status: "rejected" } : req
    ));
    toast.success("Request rejected");
  };

  const handleCreateMatch = () => {
    if (!newMatch.date || !newMatch.time || !newMatch.homeTeam || !newMatch.awayTeam || !newMatch.location) {
      toast.error("Please fill in all fields");
      return;
    }

    const createdMatch: Match = {
      id: Date.now().toString(),
      date: newMatch.date,
      time: newMatch.time,
      homeTeam: newMatch.homeTeam,
      awayTeam: newMatch.awayTeam,
      location: newMatch.location,
      sport: newMatch.sport,
      status: "scheduled",
    };

    setMatches([...matches, createdMatch]);
    toast.success("Match created successfully!");
    setShowCreateMatchModal(false);
    setNewMatch({
      date: "",
      time: "",
      homeTeam: "",
      awayTeam: "",
      location: "",
      sport: "bocce",
    });
  };

  const handleDeleteMatch = (matchId: string) => {
    setMatches(matches.filter(m => m.id !== matchId));
    toast.success("Match deleted");
  };

  const displayMatches = filteredMatches;

  return (
    <div>
      {/* Segmented Control */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4 sticky top-0 z-10">
        <div className="bg-[var(--color-bg)] rounded-xl p-1 flex gap-1">
          {["upcoming", "past", "all"].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view as any)}
              className={`flex-1 py-2 rounded-lg text-sm transition-all ${
                activeView === view
                  ? "bg-[var(--color-bg-elevated)] shadow-sm"
                  : "text-[var(--color-text-secondary)]"
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {sports.map((sport) => (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id as any)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedSport === sport.id
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:bg-gray-200"
              }`}
            >
              {sport.label}
            </button>
          ))}
          <button className="px-4 py-2 rounded-full text-sm bg-[var(--color-bg)] text-[var(--color-text-secondary)] flex items-center gap-2">
            <Filter className="w-4 h-4" />
            More
          </button>
        </div>
      </div>

      {/* Admin Scheduling Panel - Only for users with Admin role */}
      {effectiveIsAdmin && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="font-medium text-blue-900">Admin Scheduling</h3>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setAdminTab("requests")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                adminTab === "requests"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              📋 Requests ({adminRequests.filter(r => r.status === "pending").length})
            </button>
            <button
              onClick={() => setAdminTab("manage")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                adminTab === "manage"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              ⚙️ Manage Matches
            </button>
          </div>

          {/* Requests Tab */}
          {adminTab === "requests" && (
            <div className="space-y-2">
              {adminRequests.filter(r => r.status === "pending").length === 0 ? (
                <p className="text-sm text-blue-600">No pending requests</p>
              ) : (
                adminRequests
                  .filter(r => r.status === "pending")
                  .map((req) => (
                    <div key={req.id} className="bg-white rounded-lg p-3 border border-blue-100">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-gray-800">{req.captainName}</div>
                          <div className="text-xs text-gray-600">{req.teamName}</div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                          req.type === "preference" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                        }`}>
                          {req.type === "preference" ? "📅 Preference" : "⚠️ Conflict"}
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Dates:</span> {req.dates.join(", ")}
                      </div>
                      {req.reason && (
                        <div className="text-sm text-gray-700 mb-2">
                          <span className="font-medium">Reason:</span> {req.reason}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveRequest(req.id)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-3 h-3" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}

          {/* Manage Matches Tab */}
          {adminTab === "manage" && (
            <div>
              <Button
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 mb-3"
                onClick={() => setShowCreateMatchModal(true)}
                disabled={!isOnline}
                title={!isOnline ? "You're offline - can't create matches" : "Create new match"}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Match
              </Button>
              {!isOnline && (
                <p className="text-xs text-amber-700 mb-3 flex items-center gap-1">
                  <WifiOff className="w-3 h-3" /> You're offline - match creation disabled
                </p>
              )}
              {matches.length === 0 ? (
                <p className="text-sm text-blue-600">No matches scheduled yet</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {matches.slice(0, 5).map((match) => (
                    <div key={match.id} className="bg-white rounded-lg p-2 border border-blue-100 flex items-start justify-between">
                      <div className="flex-1 text-sm">
                        <div className="font-medium">{match.homeTeam} vs {match.awayTeam}</div>
                        <div className="text-xs text-gray-600">{match.date} • {match.time}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteMatch(match.id)}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                        disabled={!isOnline}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Captain Scheduling Panel - Only for users with Captain role */}
      {effectiveIsCaptain && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-4 h-4 text-amber-600" />
            <h3 className="font-medium text-amber-900">Captain Tools</h3>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                setSchedulingType("preference");
                setShowSchedulingModal(true);
              }}
              className="w-full bg-amber-100 hover:bg-amber-200 text-amber-900 py-2 px-3 rounded-lg text-sm font-medium transition-colors text-left"
            >
              📅 Request Preferred Play Dates
            </button>
            <button
              onClick={() => {
                setSchedulingType("conflict");
                setShowSchedulingModal(true);
              }}
              className="w-full bg-red-100 hover:bg-red-200 text-red-900 py-2 px-3 rounded-lg text-sm font-medium transition-colors text-left"
            >
              ⚠️ Report Scheduling Conflict
            </button>

            {/* Show pending requests */}
            {schedulingRequests.filter(r => r.status === "pending").length > 0 && (
              <div className="mt-3 p-2 bg-white rounded border border-amber-200 text-xs">
                <div className="font-medium text-amber-900 mb-1">Pending Requests ({schedulingRequests.filter(r => r.status === "pending").length})</div>
                <div className="space-y-1 text-gray-700">
                  {schedulingRequests
                    .filter(r => r.status === "pending")
                    .map(req => (
                      <div key={req.id}>
                        {req.dates.join(", ")} - {req.type === "preference" ? "Preference" : "Conflict"}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Player Request Panel - Only for players who are NOT captains or admins */}
      {effectiveIsPlayer && !effectiveIsCaptain && !effectiveIsAdmin && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-3">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-4 h-4 text-green-600" />
            <h3 className="font-medium text-green-900">Request to Play</h3>
          </div>
          <p className="text-xs text-green-800 mb-2">
            Submit a request to play in a match. Your team captain will review and approve your participation.
          </p>
          <button
            onClick={() => {
              // This would open a match selection dialog in a real implementation
              toast.info("Select a match to request participation");
            }}
            className="w-full bg-green-100 hover:bg-green-200 text-green-900 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
          >
            🙋 Request to Play in Match
          </button>
        </div>
      )}

      {/* Match List */}
      {loading ? (
        <div className="p-4 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-4 h-4 text-[var(--color-text-secondary)]" />
              <h3 className="text-base text-[var(--color-text-secondary)]">Loading matches...</h3>
            </div>
            <div className="space-y-3">
              <SkeletonMatchCard />
              <SkeletonMatchCard />
              <SkeletonMatchCard />
            </div>
          </div>
        </div>
      ) : displayMatches.length > 0 ? (
        <div className="p-4 space-y-6">
          {displayMatches.map((group, groupIndex) => (
            <div key={groupIndex}>
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-4 h-4 text-[var(--color-text-secondary)]" />
                <h3 className="text-base text-[var(--color-text-secondary)]">
                  {group.date}
                </h3>
              </div>
              <div className="space-y-3">
                {group.matches.map((match, matchIndex) => (
                  <MatchCard
                    key={matchIndex}
                    {...match}
                    onClick={onViewMatch}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Load More */}
          <Button
            variant="outline"
            className="w-full border-[var(--color-border)]"
          >
            Load more matches
          </Button>
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No matches found"
          description={`No ${selectedSport === "all" ? "" : selectedSport + " "}matches found. Try changing the filters or view.`}
        />
      )}

      {/* Scheduling Request Modal */}
      {showSchedulingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {schedulingType === "preference" ? "Request Preferred Play Dates" : "Report Scheduling Conflict"}
              </h2>
              <button
                onClick={() => setShowSchedulingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Date Selection */}
              <div>
                <h3 className="font-medium mb-3">
                  {schedulingType === "preference" ? "Select preferred dates:" : "Select dates with conflicts:"}
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {matches.slice(0, 8).map((match) => (
                    <button
                      key={match.id}
                      onClick={() => {
                        setSelectedDates(
                          selectedDates.includes(match.date)
                            ? selectedDates.filter(d => d !== match.date)
                            : [...selectedDates, match.date]
                        );
                      }}
                      className={`p-3 rounded-lg text-sm border-2 transition-all ${
                        selectedDates.includes(match.date)
                          ? "border-[var(--color-primary)] bg-blue-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="font-medium">{match.date}</div>
                      <div className="text-xs text-gray-600">{match.time}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason for Conflict */}
              {schedulingType === "conflict" && (
                <div>
                  <label className="block font-medium mb-2">Why is this a conflict?</label>
                  <textarea
                    value={conflictReason}
                    onChange={(e) => setConflictReason(e.target.value)}
                    placeholder="e.g., Team event, travel plans, unavailable player..."
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowSchedulingModal(false);
                    setSelectedDates([]);
                    setConflictReason("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmitSchedulingRequest}
                >
                  Submit Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Match Modal */}
      {showCreateMatchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Create New Match</h2>
              <button
                onClick={() => setShowCreateMatchModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Date */}
              <div>
                <label className="block font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={newMatch.date}
                  onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block font-medium mb-2">Time</label>
                <input
                  type="time"
                  value={newMatch.time}
                  onChange={(e) => setNewMatch({ ...newMatch, time: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Sport */}
              <div>
                <label className="block font-medium mb-2">Sport</label>
                <select
                  value={newMatch.sport}
                  onChange={(e) => setNewMatch({ ...newMatch, sport: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="bocce">Bocce</option>
                  <option value="pickleball">Pickleball</option>
                  <option value="padel">Padel</option>
                </select>
              </div>

              {/* Home Team */}
              <div>
                <label className="block font-medium mb-2">Home Team</label>
                <input
                  type="text"
                  placeholder="e.g., Merion Bocce Club"
                  value={newMatch.homeTeam}
                  onChange={(e) => setNewMatch({ ...newMatch, homeTeam: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Away Team */}
              <div>
                <label className="block font-medium mb-2">Away Team</label>
                <input
                  type="text"
                  placeholder="e.g., Radnor Rollers"
                  value={newMatch.awayTeam}
                  onChange={(e) => setNewMatch({ ...newMatch, awayTeam: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block font-medium mb-2">Location</label>
                <input
                  type="text"
                  placeholder="e.g., Merion Cricket Club"
                  value={newMatch.location}
                  onChange={(e) => setNewMatch({ ...newMatch, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateMatchModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handleCreateMatch}
                >
                  Create Match
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}