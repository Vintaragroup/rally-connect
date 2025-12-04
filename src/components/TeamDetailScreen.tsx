import { useState } from "react";
import { Trophy, Calendar, MessageSquare, ChevronRight, Users, Settings, Clock, Share2 } from "lucide-react";
import { SportIcon } from "./SportIcon";
import { Button } from "./ui/button";
import { MatchCard } from "./MatchCard";
import { EmptyState } from "./EmptyState";
import { TeamSettingsModal } from "./TeamSettingsModal";
import { PendingJoinRequests } from "./PendingJoinRequests";
import TeamInvitationModal from "./TeamInvitationModal";

interface TeamDetailScreenProps {
  onViewMatch: () => void;
  onViewTeamChat?: () => void;
  onViewTeamReport?: () => void;
  isCaptain?: boolean;
  isAssociationAdmin?: boolean;
  teamId?: string;
  userId?: string;
  currentPlayerCount?: number;
  minPlayersNeeded?: number;
  isLookingForPlayers?: boolean;
  teamName?: string;
}

export function TeamDetailScreen({ 
  onViewMatch, 
  onViewTeamChat, 
  onViewTeamReport, 
  isCaptain = false, 
  isAssociationAdmin = false,
  teamId: propTeamId,
  userId: propUserId,
  currentPlayerCount: propCurrentPlayerCount,
  minPlayersNeeded: propMinPlayersNeeded,
  isLookingForPlayers: propIsLookingForPlayers,
  teamName: propTeamName
}: TeamDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<"roster" | "schedule" | "standings">("roster");
  const [showTeamSettings, setShowTeamSettings] = useState(false);
  const [showPendingRequests, setShowPendingRequests] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);

  // Use provided data or API calls - no fallback to hardcoded values
  const teamId = propTeamId;
  const userId = propUserId;
  const currentPlayerCount = propCurrentPlayerCount ?? 0;
  const minPlayersNeeded = propMinPlayersNeeded ?? 0;
  const isLookingForPlayers = propIsLookingForPlayers ?? false;
  const teamName = propTeamName || "Team";

  // Show loading or empty state if no data provided
  if (!teamId || !propTeamName) {
    return (
      <div className="pb-6 p-4 text-center">
        <p className="text-[var(--color-text-secondary)]">No team data provided</p>
      </div>
    );
  }

  const roster: any[] = [];

  const standings: any[] = [];

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4">
        <div className="flex items-start gap-3 mb-4">
          <SportIcon sport="bocce" size={48} />
          <div className="flex-1">
            <h1 className="mb-1">{teamName}</h1>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Division 2 • Winter 24–25
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-[var(--color-bg)] rounded-xl p-4 flex items-center justify-around">
          <div className="text-center">
            <div className="text-2xl font-semibold text-[var(--color-primary)]">2nd</div>
            <div className="text-xs text-[var(--color-text-secondary)]">Standing</div>
          </div>
          <div className="w-px h-10 bg-[var(--color-border)]" />
          <div className="text-center">
            <div className="text-2xl font-semibold">7–2</div>
            <div className="text-xs text-[var(--color-text-secondary)]">Record</div>
          </div>
          <div className="w-px h-10 bg-[var(--color-border)]" />
          <div className="text-center">
            <div className="text-2xl font-semibold">21</div>
            <div className="text-xs text-[var(--color-text-secondary)]">Points</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] px-4 py-2 sticky top-0 z-10">
        <div className="flex gap-1">
          {[
            { id: "roster", label: "Roster" },
            { id: "schedule", label: "Schedule" },
            { id: "standings", label: "Standings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 text-sm transition-colors relative ${
                activeTab === tab.id
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)]"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Tab */}
      {activeTab === "roster" && (
        <div className="p-4 space-y-3">
          {isCaptain && (
            <div className="space-y-2">
              <Button 
                className="w-full"
                onClick={() => setShowTeamSettings(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Team Settings & Recruitment
              </Button>
              <Button 
                variant="outline"
                className="w-full border-[var(--color-border)]"
                onClick={() => setShowPendingRequests(true)}
              >
                <Clock className="w-4 h-4 mr-2" />
                Pending Join Requests
              </Button>
              <Button 
                variant="outline"
                className="w-full border-[var(--color-border)]"
                onClick={() => setShowInvitationModal(true)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Generate Invitation Code
              </Button>
            </div>
          )}
          
          {roster.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No roster yet"
              description="Team members will appear here once they're added."
            />
          ) : (
            roster.map((player, index) => (
            <div
              key={index}
              className={`bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm ${
                player.isYou ? "ring-2 ring-[var(--color-accent)]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                  {player.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{player.name}</span>
                    {player.isYou && (
                      <span className="text-xs bg-[var(--color-accent)] text-[var(--color-text-primary)] px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                    {player.role === "Captain" && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        ⭐ Captain
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    Rating: {player.rating}
                  </div>
                </div>
              </div>
            </div>
            ))
          )}

          <Button variant="outline" className="w-full border-[var(--color-border)] mt-4" onClick={onViewTeamChat}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Team Chat
          </Button>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === "schedule" && (
        <div className="p-4 space-y-3">
          <div>
            <div className="text-sm text-[var(--color-text-secondary)] mb-2">Upcoming</div>
            <div className="space-y-3">
              {roster.length === 0 && (
                <EmptyState
                  icon={Calendar}
                  title="No upcoming matches"
                  description="Schedule will appear once matches are scheduled."
                />
              )}
            </div>
          </div>

          <Button variant="outline" className="w-full border-[var(--color-border)] mt-4">
            View Full Schedule
          </Button>
        </div>
      )}

      {/* Standings Tab */}
      {activeTab === "standings" && (
        <div className="p-4 space-y-3">
          <Button variant="outline" className="w-full border-[var(--color-border)]" onClick={onViewTeamReport}>
            <Trophy className="w-4 h-4 mr-2" />
            View Team Report
          </Button>
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl shadow-sm overflow-hidden">
            {standings.map((team, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-4 ${
                  index !== standings.length - 1 ? "border-b border-[var(--color-border)]" : ""
                } ${team.isYourTeam ? "bg-[var(--color-accent)]/10" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    team.position <= 3
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-[var(--color-text-secondary)]"
                  }`}
                >
                  {team.position}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={team.isYourTeam ? "font-medium" : ""}>
                      {team.team}
                    </span>
                    {team.isYourTeam && (
                      <span className="text-xs bg-[var(--color-accent)] text-[var(--color-text-primary)] px-2 py-0.5 rounded-full">
                        Your Team
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                    {team.record}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{team.points}</div>
                  <div className="text-xs text-[var(--color-text-secondary)]">pts</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <Trophy className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-blue-900 mb-1">
                  Playoff Picture
                </div>
                <p className="text-xs text-blue-700">
                  Top 4 teams advance to playoffs. You're currently in position!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Settings Modal */}
      {showTeamSettings && (
        <TeamSettingsModal
          teamId={teamId}
          teamName={teamName}
          currentPlayerCount={currentPlayerCount}
          minPlayersNeeded={minPlayersNeeded}
          isLookingForPlayers={isLookingForPlayers}
          userId={userId}
          onClose={() => setShowTeamSettings(false)}
          onSuccess={() => {
            // Refresh team data if needed
            console.log("Team settings updated");
          }}
        />
      )}

      {/* Pending Join Requests Modal */}
      {showPendingRequests && (
        <PendingJoinRequests
          teamId={teamId}
          teamName={teamName}
          onClose={() => setShowPendingRequests(false)}
          onSuccess={() => {
            // Refresh pending requests
            console.log("Join request processed");
          }}
        />
      )}

      {/* Team Invitation Modal */}
      <TeamInvitationModal
        isOpen={showInvitationModal}
        teamId={teamId}
        teamName={teamName}
        userId={userId || ''}
        onClose={() => setShowInvitationModal(false)}
      />
    </div>
  );
}