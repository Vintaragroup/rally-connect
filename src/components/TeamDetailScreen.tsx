import { useState } from "react";
import { Trophy, Calendar, MessageSquare, ChevronRight } from "lucide-react";
import { SportIcon } from "./SportIcon";
import { Button } from "./ui/button";
import { MatchCard } from "./MatchCard";

interface TeamDetailScreenProps {
  onViewMatch: () => void;
  isCaptain?: boolean;
}

export function TeamDetailScreen({ onViewMatch, isCaptain = false }: TeamDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<"roster" | "schedule" | "standings">("roster");

  const roster = [
    { name: "Alex Rivera", rating: 4.2, role: "Captain", initials: "AR", isYou: true },
    { name: "Jordan Chen", rating: 4.0, role: "Player", initials: "JC" },
    { name: "Sam Patel", rating: 3.8, role: "Player", initials: "SP" },
    { name: "Riley Thompson", rating: 3.7, role: "Player", initials: "RT" },
    { name: "Morgan Lee", rating: 3.5, role: "Player", initials: "ML" },
    { name: "Cameron Smith", rating: 3.4, role: "Player", initials: "CS" },
  ];

  const standings = [
    { position: 1, team: "Wayne Bocce Society", record: "8–1", points: 24 },
    { position: 2, team: "Merion Bocce Club", record: "7–2", points: 21, isYourTeam: true },
    { position: 3, team: "Radnor Rollers", record: "6–3", points: 18 },
    { position: 4, team: "Haverford Bocce", record: "5–4", points: 15 },
    { position: 5, team: "Bryn Mawr Bocci", record: "4–5", points: 12 },
    { position: 6, team: "Devon Bocce Club", record: "3–6", points: 9 },
    { position: 7, team: "Ardmore Rollers", record: "2–7", points: 6 },
    { position: 8, team: "Gladwyne Bocce", record: "1–8", points: 3 },
  ];

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4">
        <div className="flex items-start gap-3 mb-4">
          <SportIcon sport="bocce" size={48} />
          <div className="flex-1">
            <h1 className="mb-1">Merion Bocce Club</h1>
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
            <Button className="w-full mb-2">
              Manage Roster
            </Button>
          )}
          
          {roster.map((player, index) => (
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
          ))}

          <Button variant="outline" className="w-full border-[var(--color-border)] mt-4">
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
              <MatchCard
                time="Today 7:30 PM"
                homeTeam="Merion Bocce Club"
                awayTeam="Radnor Rollers"
                location="Merion Cricket Club"
                status="scheduled"
                sport="bocce"
                onClick={onViewMatch}
              />
              <MatchCard
                time="Sat 2:00 PM"
                homeTeam="Merion Bocce Club"
                awayTeam="Wayne Bocce Society"
                location="Merion Cricket Club"
                status="scheduled"
                sport="bocce"
                onClick={onViewMatch}
              />
            </div>
          </div>

          <div>
            <div className="text-sm text-[var(--color-text-secondary)] mb-2 mt-6">Recent</div>
            <div className="space-y-3">
              <MatchCard
                time="Nov 13, 7:30 PM"
                homeTeam="Haverford Bocce"
                awayTeam="Merion Bocce Club"
                location="Haverford Reserve"
                status="completed"
                sport="bocce"
                score="2–4"
                onClick={onViewMatch}
              />
            </div>
          </div>

          <Button variant="outline" className="w-full border-[var(--color-border)] mt-4">
            View Full Schedule
          </Button>
        </div>
      )}

      {/* Standings Tab */}
      {activeTab === "standings" && (
        <div className="p-4">
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
    </div>
  );
}