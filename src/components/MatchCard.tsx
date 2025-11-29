import { MapPin, Clock } from "lucide-react";
import { StatusChip } from "./StatusChip";
import { SportIcon } from "./SportIcon";
import { Badge } from "./ui/badge";

interface MatchCardProps {
  time: string;
  homeTeam: string;
  awayTeam: string;
  location: string;
  status: "scheduled" | "completed" | "forfeited" | "rescheduled" | "live";
  sport: "bocce" | "pickleball" | "padel";
  score?: string;
  isHighlighted?: boolean;
  onClick?: () => void;
}

export function MatchCard({
  time,
  homeTeam,
  awayTeam,
  location,
  status,
  sport,
  score,
  isHighlighted = false,
  onClick,
}: MatchCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-[var(--color-bg-elevated)] rounded-2xl p-3 sm:p-4 shadow-sm cursor-pointer transition-all hover:shadow-md ${
        isHighlighted ? "border-2 border-[var(--color-accent)] shadow-lg" : "border border-[var(--color-border)]"
      }`}
      aria-label={`Match: ${homeTeam} vs ${awayTeam} at ${location} on ${time}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[var(--color-text-tertiary)]" aria-hidden="true" />
          <span className="text-sm sm:text-base font-medium">{time}</span>
        </div>
        <Badge className={`${getSportColor(sport)} text-xs capitalize`}>
          {sport}
        </Badge>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="font-medium">{homeTeam}</span>
          {score && <span className="text-sm text-[var(--color-text-secondary)]">{score.split('–')[0]}</span>}
        </div>
        <div className="text-[var(--color-text-secondary)] text-sm">vs</div>
        <div className="flex items-center justify-between">
          <span className="font-medium">{awayTeam}</span>
          {score && <span className="text-sm text-[var(--color-text-secondary)]">{score.split('–')[1]}</span>}
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)] text-sm">
        <MapPin className="w-4 h-4" aria-hidden="true" />
        <span>{location}</span>
      </div>
    </button>
  );
}

function getSportColor(sport: "bocce" | "pickleball" | "padel"): string {
  switch (sport) {
    case "bocce":
      return "bg-[var(--color-bocce)]";
    case "pickleball":
      return "bg-[var(--color-pickleball)]";
    case "padel":
      return "bg-[var(--color-padel)]";
    default:
      return "bg-[var(--color-accent)]";
  }
}