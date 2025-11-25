interface MiniTrendChartProps {
  data: number[];
  label: string;
  color?: "primary" | "success" | "error";
  height?: number;
}

export function MiniTrendChart({ 
  data, 
  label, 
  color = "primary",
  height = 40 
}: MiniTrendChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const getColor = () => {
    switch (color) {
      case "success":
        return "#10b981";
      case "error":
        return "#dc2626";
      default:
        return "var(--color-primary)";
    }
  };

  // Generate SVG path for sparkline
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      <div className="text-xs text-[var(--color-text-secondary)]">{label}</div>
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        style={{ height: `${height}px` }}
        className="w-full"
      >
        <polyline
          points={points}
          fill="none"
          stroke={getColor()}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Fill area under the line */}
        <polyline
          points={`0,100 ${points} 100,100`}
          fill={getColor()}
          fillOpacity="0.1"
        />
      </svg>
      <div className="flex justify-between text-xs text-[var(--color-text-tertiary)]">
        <span>Week 1</span>
        <span>Week {data.length}</span>
      </div>
    </div>
  );
}
