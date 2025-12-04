import { useState } from "react";
import { ChevronRight, Search, Hash } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SportIcon } from "../SportIcon";

interface JoinTeamScreenProps {
  onComplete: (team: { id: string; name: string } | null) => void;
  onBack: () => void;
}

export function JoinTeamScreen({ onComplete, onBack }: JoinTeamScreenProps) {
  const [searchMode, setSearchMode] = useState<"code" | "search">("code");
  const [inviteCode, setInviteCode] = useState("");
  // Team search is now powered by API
  const [searchQuery, setSearchQuery] = useState("");
  const searchResults: any[] = [];

  const handleJoinWithCode = (e: React.FormEvent) => {
    e.preventDefault();
    // Code validation should happen with API
    // For now, just complete the flow
    onComplete(null);
  };

  const handleJoinTeam = (team: { id: string; name: string }) => {
    onComplete(team);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] max-w-[390px] mx-auto">
      {/* Progress */}
      <div className="p-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= 3 ? "bg-[var(--color-primary)]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6">
        <div className="mb-6">
          <h1 className="mb-2">Join a team</h1>
          <p className="text-[var(--color-text-secondary)]">
            Enter your team's invite code or search for your team (optional)
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-[var(--color-bg-elevated)] rounded-xl p-1 flex gap-1 mb-6">
          <button
            onClick={() => setSearchMode("code")}
            className={`flex-1 py-2 rounded-lg text-sm transition-all ${
              searchMode === "code"
                ? "bg-[var(--color-bg)] shadow-sm"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            <Hash className="w-4 h-4 inline mr-1" />
            Enter Code
          </button>
          <button
            onClick={() => setSearchMode("search")}
            className={`flex-1 py-2 rounded-lg text-sm transition-all ${
              searchMode === "search"
                ? "bg-[var(--color-bg)] shadow-sm"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            <Search className="w-4 h-4 inline mr-1" />
            Search
          </button>
        </div>

        {/* Invite Code Entry */}
        {searchMode === "code" && (
          <form onSubmit={handleJoinWithCode} className="flex-1 flex flex-col">
            <div className="flex-1">
              <label className="block text-sm mb-3">Team Invite Code</label>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="h-14 text-center text-2xl tracking-widest"
                maxLength={6}
                required
              />
              <p className="text-xs text-[var(--color-text-secondary)] mt-2 text-center">
                Ask your team captain for the invite code
              </p>
            </div>

            <div className="space-y-3 mt-6">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={inviteCode.length < 6}
              >
                Join Team
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                onClick={() => onComplete(null)} 
                variant="outline" 
                className="w-full"
              >
                Skip for Now
              </Button>
              <Button onClick={onBack} variant="ghost" className="w-full">
                Back
              </Button>
            </div>
          </form>
        )}

        {/* Team Search */}
        {searchMode === "search" && (
          <div className="flex-1 flex flex-col">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                <Input
                  type="text"
                  placeholder="Search by team name or captain..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-12"
                />
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {searchQuery.length > 2 ? (
                searchResults.length > 0 ? (
                  searchResults.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => handleJoinTeam(team)}
                      className="w-full bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                        <SportIcon sport={team.sport as any} size={48} />
                        <div className="flex-1">
                          <h3 className="text-base mb-1">{team.name}</h3>
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            Captain: {team.captain} • {team.members} members
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[var(--color-text-secondary)]" />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-[var(--color-text-secondary)]">
                      No teams found. Try a different search.
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-[var(--color-text-secondary)] mx-auto mb-3 opacity-50" />
                  <p className="text-[var(--color-text-secondary)]">
                    Start typing to search for teams
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[var(--color-border)] mt-4 space-y-3">
              <Button 
                onClick={() => onComplete(null)} 
                variant="outline" 
                className="w-full"
              >
                Skip for Now
              </Button>
              <Button onClick={onBack} variant="ghost" className="w-full">
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
