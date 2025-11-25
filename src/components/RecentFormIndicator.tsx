interface RecentFormIndicatorProps {
  results: ("W" | "L")[];
  maxResults?: number;
}

export function RecentFormIndicator({ results, maxResults = 5 }: RecentFormIndicatorProps) {
  const recentResults = results.slice(-maxResults);

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-[var(--color-text-secondary)] mr-1">Form:</span>
      <div className="flex gap-1">
        {recentResults.map((result, index) => (
          <div
            key={index}
            className={`w-6 h-6 rounded flex items-center justify-center text-xs font-semibold transition-all hover:scale-110 ${
              result === "W"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
            title={result === "W" ? "Win" : "Loss"}
          >
            {result}
          </div>
        ))}
      </div>
    </div>
  );
}
