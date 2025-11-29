import { useState } from "react";
import { Users, Clock, ChevronRight, UserPlus, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface WaitlistScreenProps {
  onBack: () => void;
  isCaptain?: boolean;
}

interface WaitlistEntry {
  id: string;
  playerName: string;
  initials: string;
  rating: number;
  position: number;
  joinedAt: string;
  preferredPosition?: string;
}

export function WaitlistScreen({ onBack, isCaptain = false }: WaitlistScreenProps) {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);

  const [isOnWaitlist, setIsOnWaitlist] = useState(false);

  const handleJoinWaitlist = () => {
    setIsOnWaitlist(true);
  };

  const handleLeaveWaitlist = () => {
    setIsOnWaitlist(false);
  };

  const handleApprove = (id: string) => {
    setWaitlist(waitlist.filter(entry => entry.id !== id));
  };

  const handleDecline = (id: string) => {
    setWaitlist(waitlist.filter(entry => entry.id !== id));
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="text-[var(--color-text-secondary)]">
            ← Back
          </button>
        </div>
        <h1 className="mb-1">Waitlist</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Division 3 • Pickleball • Winter 24–25
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm mb-1 text-blue-900">
                {isCaptain ? "Manage Waitlist" : "Join the Waitlist"}
              </h3>
              <p className="text-sm text-blue-700">
                {isCaptain
                  ? "Review and approve players waiting to join your team or substitute for matches."
                  : "Get notified when a spot opens up. You'll have 24 hours to accept the invitation."}
              </p>
            </div>
          </div>
        </div>

        {/* Player View - Join Waitlist */}
        {!isCaptain && !isOnWaitlist && (
          <div className="space-y-3">
            <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm">
              <h2 className="mb-3">Available Spots</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Current Waitlist</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">
                      {waitlist.length} players waiting
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700">
                    Position #{waitlist.length + 1}
                  </Badge>
                </div>
              </div>
            </div>

            <Button onClick={handleJoinWaitlist} className="w-full" size="lg">
              <UserPlus className="w-5 h-5 mr-2" />
              Join Waitlist
            </Button>
          </div>
        )}

        {/* Player View - On Waitlist */}
        {!isCaptain && isOnWaitlist && (
          <div className="space-y-3">
            <div className="bg-[var(--color-accent)] bg-opacity-10 border border-[var(--color-accent)] rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-base mb-1">You're on the waitlist!</h3>
                  <div className="space-y-1 text-sm text-[var(--color-text-secondary)]">
                    <div>Position: #{waitlist.length + 1}</div>
                    <div>You'll be notified when a spot opens.</div>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="outline" onClick={handleLeaveWaitlist} className="w-full">
              Leave Waitlist
            </Button>
          </div>
        )}

        {/* Waitlist */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2>
              {isCaptain ? "Pending Requests" : "Current Waitlist"}
            </h2>
            <Badge variant="secondary">
              {waitlist.length} {waitlist.length === 1 ? "player" : "players"}
            </Badge>
          </div>

          {waitlist.length === 0 ? (
            <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-8 text-center">
              <Users className="w-12 h-12 text-[var(--color-text-tertiary)] mx-auto mb-3" />
              <p className="text-[var(--color-text-secondary)]">No players on waitlist</p>
            </div>
          ) : (
            <div className="space-y-3">
              {waitlist.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                        {entry.initials}
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[var(--color-accent)] text-[var(--color-text-primary)] flex items-center justify-center text-xs">
                        #{entry.position}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="font-medium mb-1">{entry.playerName}</div>
                      <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-2">
                        <span>Rating: {entry.rating}</span>
                        <span>•</span>
                        <span>{entry.preferredPosition}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
                        <Clock className="w-3 h-3" />
                        <span>Joined {entry.joinedAt}</span>
                      </div>
                    </div>

                    {isCaptain ? (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleApprove(entry.id)}
                          className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDecline(entry.id)}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Captain Actions */}
        {isCaptain && waitlist.length > 0 && (
          <div className="pt-2">
            <Button variant="outline" className="w-full">
              Notify All Players
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
