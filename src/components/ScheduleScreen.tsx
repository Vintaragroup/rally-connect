import { useState } from "react";
import { Calendar, Filter } from "lucide-react";
import { MatchCard } from "./MatchCard";
import { Button } from "./ui/button";
import { EmptyState } from "./EmptyState";

interface ScheduleScreenProps {
  onViewMatch: () => void;
}

export function ScheduleScreen({ onViewMatch }: ScheduleScreenProps) {
  const [activeView, setActiveView] = useState<"upcoming" | "past" | "all">("upcoming");
  const [selectedSport, setSelectedSport] = useState<"all" | "bocce" | "pickleball" | "padel">("all");

  const matches = [
    {
      date: "Today",
      matches: [
        {
          time: "7:30 PM",
          homeTeam: "Merion Bocce Club",
          awayTeam: "Radnor Rollers",
          location: "Merion Cricket Club",
          status: "scheduled" as const,
          sport: "bocce" as const,
        },
      ],
    },
    {
      date: "Thu, Nov 21",
      matches: [
        {
          time: "6:00 PM",
          homeTeam: "Your Pickleball Squad",
          awayTeam: "Haverford Picklers",
          location: "Devon Racquet Club",
          status: "scheduled" as const,
          sport: "pickleball" as const,
        },
      ],
    },
    {
      date: "Sat, Nov 23",
      matches: [
        {
          time: "10:00 AM",
          homeTeam: "Aronimink Padel",
          awayTeam: "Philadelphia Padel Club",
          location: "Aronimink Golf Club",
          status: "scheduled" as const,
          sport: "padel" as const,
        },
        {
          time: "2:00 PM",
          homeTeam: "Merion Bocce Club",
          awayTeam: "Wayne Bocce Society",
          location: "Merion Cricket Club",
          status: "scheduled" as const,
          sport: "bocce" as const,
        },
      ],
    },
  ];

  const sports = [
    { id: "all", label: "All Sports" },
    { id: "bocce", label: "Bocce" },
    { id: "pickleball", label: "Pickleball" },
    { id: "padel", label: "Padel" },
  ];

  // Filter matches based on selected sport
  const filteredMatches = matches.map((dateGroup) => ({
    date: dateGroup.date,
    matches: dateGroup.matches.filter(
      (match) => selectedSport === "all" || match.sport === selectedSport
    ),
  })).filter((dateGroup) => dateGroup.matches.length > 0);

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

      {/* Match List */}
      {filteredMatches.length > 0 ? (
        <div className="p-4 space-y-6">
          {filteredMatches.map((group, groupIndex) => (
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
    </div>
  );
}