import { Flame, TrendingUp } from "lucide-react";

interface WinStreakBadgeProps {
  streak: number;
  type: "win" | "loss";
}

export function WinStreakBadge({ streak, type }: WinStreakBadgeProps) {
  if (streak < 2) return null;

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold animate-pulse ${
        type === "win"
          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
          : "bg-gray-500 text-white"
      }`}
    >
      {type === "win" ? (
        <>
          <Flame className="w-3 h-3" />
          <span>{streak}W Streak</span>
        </>
      ) : (
        <>
          <TrendingUp className="w-3 h-3 rotate-180" />
          <span>{streak}L Streak</span>
        </>
      )}
    </div>
  );
}
