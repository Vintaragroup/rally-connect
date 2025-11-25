import { useState } from "react";
import { TrendingUp, TrendingDown, Award, ChevronRight } from "lucide-react";
import { SportIcon } from "./SportIcon";
import { Button } from "./ui/button";

export function RatingsScreen() {
  const [selectedSport, setSelectedSport] = useState<"bocce" | "pickleball" | "padel">("bocce");
  const [timeRange, setTimeRange] = useState<"30d" | "season" | "all">("season");

  const ratings = {
    bocce: { current: 4.2, change: 0.3, trend: "up" as const },
    pickleball: { current: 3.8, change: -0.1, trend: "down" as const },
    padel: { current: 4.5, change: 0.5, trend: "up" as const },
  };

  const recentMatches = [
    {
      date: "Nov 13",
      opponent: "vs Haverford Bocce",
      result: "W 4–2",
      ratingChange: +0.2,
      yourRating: 4.2,
    },
    {
      date: "Nov 6",
      opponent: "vs Devon Bocce Club",
      result: "W 4–1",
      ratingChange: +0.1,
      yourRating: 4.0,
    },
    {
      date: "Oct 30",
      opponent: "vs Radnor Rollers",
      result: "L 2–4",
      ratingChange: -0.1,
      yourRating: 3.9,
    },
    {
      date: "Oct 23",
      opponent: "vs Wayne Bocce Society",
      result: "L 1–4",
      ratingChange: -0.2,
      yourRating: 4.0,
    },
    {
      date: "Oct 16",
      opponent: "vs Bryn Mawr Bocci",
      result: "W 4–0",
      ratingChange: +0.3,
      yourRating: 4.2,
    },
  ];

  const leaderboard = [
    { rank: 1, name: "Taylor Morgan", rating: 4.8, team: "Wayne Bocce Society" },
    { rank: 2, name: "Jordan Martinez", rating: 4.7, team: "Radnor Rollers" },
    { rank: 3, name: "Casey Williams", rating: 4.6, team: "Haverford Bocce" },
    { rank: 4, name: "Alex Rivera", rating: 4.2, isYou: true, team: "Merion Bocce Club" },
    { rank: 5, name: "Sam Thompson", rating: 4.1, team: "Devon Bocce Club" },
  ];

  const currentRating = ratings[selectedSport];

  const sports: Array<"bocce" | "pickleball" | "padel"> = ["bocce", "pickleball", "padel"];

  return (
    <div>
      {/* Header */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4 sticky top-0 z-10">
        <h1 className="mb-4">Ratings</h1>
        
        {/* Sport Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
                selectedSport === sport
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:bg-gray-200"
              }`}
            >
              <SportIcon sport={sport} size={20} />
              {sport.charAt(0).toUpperCase() + sport.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Your Rating Card */}
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-soft)] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm mb-2">Your {selectedSport} Rating</p>
              <div className="flex items-center gap-3">
                <span className="text-5xl font-semibold">{currentRating.current}</span>
                <div
                  className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                    currentRating.trend === "up"
                      ? "bg-green-500/20 text-green-100"
                      : "bg-red-500/20 text-red-100"
                  }`}
                >
                  {currentRating.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {currentRating.change > 0 ? "+" : ""}
                    {currentRating.change}
                  </span>
                </div>
              </div>
            </div>
            <Award className="w-8 h-8 text-white/60" />
          </div>

          {/* Chart */}
          <div className="h-24 flex items-end gap-1">
            {[3.9, 4.0, 3.9, 3.8, 4.0, 4.1, 4.2, 4.0, 4.2, 4.3, 4.2, 4.2].map((value, i) => (
              <div
                key={i}
                className="flex-1 bg-white/30 rounded-t hover:bg-white/40 transition-colors"
                style={{ height: `${(value / 5) * 100}%` }}
              />
            ))}
          </div>

          {/* Time Range */}
          <div className="flex gap-2 mt-4">
            {[
              { id: "30d", label: "30 Days" },
              { id: "season", label: "Season" },
              { id: "all", label: "All Time" },
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  timeRange === range.id
                    ? "bg-white/30 text-white"
                    : "text-white/60 hover:bg-white/10"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Impact */}
        <div>
          <h2 className="mb-3">Recent Impact</h2>
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl shadow-sm overflow-hidden">
            {recentMatches.map((match, index) => (
              <div
                key={index}
                className={`p-4 flex items-center justify-between ${
                  index !== recentMatches.length - 1 ? "border-b border-[var(--color-border)]" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {match.date}
                    </span>
                    <span className="text-xs text-[var(--color-text-secondary)]">•</span>
                    <span
                      className={`text-sm ${
                        match.result.startsWith("W") ? "text-[var(--color-success)]" : "text-red-600"
                      }`}
                    >
                      {match.result}
                    </span>
                  </div>
                  <div className="text-sm">{match.opponent}</div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${
                      match.ratingChange > 0 ? "text-[var(--color-success)]" : "text-red-600"
                    }`}
                  >
                    {match.ratingChange > 0 ? "+" : ""}
                    {match.ratingChange.toFixed(1)}
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)]">
                    {match.yourRating.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2>Division Leaderboard</h2>
            <button className="text-[var(--color-primary)] text-sm flex items-center gap-1">
              View all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl shadow-sm overflow-hidden">
            {leaderboard.map((player, index) => (
              <div
                key={index}
                className={`p-4 flex items-center gap-3 ${
                  index !== leaderboard.length - 1 ? "border-b border-[var(--color-border)]" : ""
                } ${player.isYou ? "bg-[var(--color-accent)]/10" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    player.rank <= 3
                      ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white"
                      : "bg-gray-100 text-[var(--color-text-secondary)]"
                  }`}
                >
                  {player.rank}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={player.isYou ? "font-medium" : ""}>{player.name}</span>
                    {player.isYou && (
                      <span className="text-xs bg-[var(--color-accent)] text-[var(--color-text-primary)] px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    {player.team}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-lg">{player.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h3 className="text-base text-blue-900 mb-2">How Ratings Work</h3>
          <p className="text-sm text-blue-700 leading-relaxed">
            Your rating is calculated based on match results, opponent ratings, and performance
            consistency. Win against higher-rated players to gain more points.
          </p>
          <Button variant="ghost" className="text-blue-700 hover:text-blue-900 mt-2 p-0 h-auto">
            Learn more about the rating system →
          </Button>
        </div>
      </div>
    </div>
  );
}
