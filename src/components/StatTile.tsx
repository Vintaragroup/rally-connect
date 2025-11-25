interface StatTileProps {
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: "up" | "down" | "neutral";
  variant?: "primary" | "secondary";
  color?: "default" | "success" | "error" | "warning";
}

export function StatTile({ 
  label, 
  value, 
  sublabel, 
  trend,
  variant = "primary",
  color = "default"
}: StatTileProps) {
  const getTrendIcon = () => {
    if (trend === "up") return "↗";
    if (trend === "down") return "↘";
    return "→";
  };

  const getColorClasses = () => {
    switch (color) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      default:
        return "bg-[var(--color-bg-elevated)] border-[var(--color-border)]";
    }
  };

  return (
    <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 border ${getColorClasses()}`}>
      <div className="text-xs sm:text-sm text-[var(--color-text-secondary)] mb-1 sm:mb-2">
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <div className={`font-semibold ${variant === "primary" ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
          {value}
        </div>
        {trend && (
          <span className={`text-sm ${
            trend === "up" ? "text-green-600" : 
            trend === "down" ? "text-red-600" : 
            "text-gray-500"
          }`}>
            {getTrendIcon()}
          </span>
        )}
      </div>
      {sublabel && (
        <div className="text-xs text-[var(--color-text-tertiary)] mt-1">
          {sublabel}
        </div>
      )}
    </div>
  );
}
