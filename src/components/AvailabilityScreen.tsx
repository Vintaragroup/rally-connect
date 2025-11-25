import { Calendar, Check, X, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface AvailabilityScreenProps {
  onBack: () => void;
}

interface Match {
  id: string;
  date: string;
  day: string;
  time: string;
  opponent: string;
  location: string;
  availability: "available" | "unavailable" | "pending";
}

export function AvailabilityScreen({ onBack }: AvailabilityScreenProps) {
  const [matches, setMatches] = useState<Match[]>([
    {
      id: "m1",
      date: "Dec 18",
      day: "Wednesday",
      time: "7:30 PM",
      opponent: "Radnor Rollers",
      location: "Merion Cricket Club",
      availability: "available",
    },
    {
      id: "m2",
      date: "Dec 21",
      day: "Saturday",
      time: "2:00 PM",
      opponent: "Wayne Warriors",
      location: "Wayne Tennis Club",
      availability: "pending",
    },
    {
      id: "m3",
      date: "Dec 23",
      day: "Monday",
      time: "6:00 PM",
      opponent: "Haverford Hawks",
      location: "Haverford College",
      availability: "pending",
    },
    {
      id: "m4",
      date: "Dec 28",
      day: "Saturday",
      time: "4:30 PM",
      opponent: "Aronimink Aces",
      location: "Aronimink Golf Club",
      availability: "unavailable",
    },
    {
      id: "m5",
      date: "Jan 4",
      day: "Saturday",
      time: "1:00 PM",
      opponent: "Devon Dynamos",
      location: "Devon Racquet Club",
      availability: "pending",
    },
  ]);

  const handleSetAvailability = (matchId: string, availability: "available" | "unavailable") => {
    setMatches(matches.map(m => 
      m.id === matchId ? { ...m, availability } : m
    ));
  };

  const pendingCount = matches.filter(m => m.availability === "pending").length;
  const availableCount = matches.filter(m => m.availability === "available").length;
  const unavailableCount = matches.filter(m => m.availability === "unavailable").length;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="text-[var(--color-text-secondary)]">
            ← Back
          </button>
        </div>
        <div>
          <h1 className="mb-1">Set Availability</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Let your captain know when you can play
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[var(--color-bg-elevated)] rounded-xl p-3 text-center">
            <div className="text-xl mb-1">{availableCount}</div>
            <div className="text-xs text-[var(--color-text-secondary)]">Available</div>
          </div>
          <div className="bg-[var(--color-bg-elevated)] rounded-xl p-3 text-center">
            <div className="text-xl mb-1">{unavailableCount}</div>
            <div className="text-xs text-[var(--color-text-secondary)]">Unavailable</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
            <div className="text-xl mb-1">{pendingCount}</div>
            <div className="text-xs text-amber-700">Pending</div>
          </div>
        </div>

        {/* Info Card */}
        {pendingCount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm mb-1 text-blue-900">
                  {pendingCount} {pendingCount === 1 ? "match needs" : "matches need"} your response
                </h3>
                <p className="text-sm text-blue-700">
                  Please update your availability so your captain can set the lineup.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Matches */}
        <div>
          <h2 className="mb-3">Upcoming Matches</h2>
          <div className="space-y-3">
            {matches.map((match) => (
              <div
                key={match.id}
                className={`bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm ${
                  match.availability === "pending" ? "border-2 border-amber-200" : ""
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-center min-w-[60px]">
                    <div className="text-sm text-[var(--color-text-secondary)]">
                      {match.day}
                    </div>
                    <div className="text-lg font-medium">{match.date}</div>
                  </div>

                  <div className="flex-1">
                    <div className="font-medium mb-1">vs {match.opponent}</div>
                    <div className="text-sm text-[var(--color-text-secondary)] mb-1">
                      {match.time} • {match.location}
                    </div>

                    {match.availability === "available" && (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        ✓ Available
                      </Badge>
                    )}
                    {match.availability === "unavailable" && (
                      <Badge className="bg-red-100 text-red-700 text-xs">
                        ✗ Unavailable
                      </Badge>
                    )}
                    {match.availability === "pending" && (
                      <Badge className="bg-amber-100 text-amber-700 text-xs">
                        ⏱ Pending Response
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Availability Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={match.availability === "available" ? "default" : "outline"}
                    className={`flex-1 ${
                      match.availability === "available"
                        ? "bg-green-600 hover:bg-green-700"
                        : "border-green-200 text-green-700 hover:bg-green-50"
                    }`}
                    onClick={() => handleSetAvailability(match.id, "available")}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Available
                  </Button>
                  <Button
                    size="sm"
                    variant={match.availability === "unavailable" ? "default" : "outline"}
                    className={`flex-1 ${
                      match.availability === "unavailable"
                        ? "bg-red-600 hover:bg-red-700"
                        : "border-red-200 text-red-700 hover:bg-red-50"
                    }`}
                    onClick={() => handleSetAvailability(match.id, "unavailable")}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Unavailable
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        {pendingCount > 0 && (
          <Button className="w-full" size="lg">
            Submit Availability
          </Button>
        )}
      </div>
    </div>
  );
}
