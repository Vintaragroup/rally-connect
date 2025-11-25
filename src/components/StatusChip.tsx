interface StatusChipProps {
  status: "scheduled" | "completed" | "forfeited" | "rescheduled" | "live";
  size?: "sm" | "md";
}

export function StatusChip({ status, size = "md" }: StatusChipProps) {
  const styles = {
    scheduled: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    forfeited: "bg-red-100 text-red-700",
    rescheduled: "bg-amber-100 text-amber-700",
    live: "bg-[var(--color-accent)] text-green-900",
  };

  const labels = {
    scheduled: "Scheduled",
    completed: "Completed",
    forfeited: "Forfeited",
    rescheduled: "Rescheduled",
    live: "Live",
  };

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span className={`inline-flex items-center ${sizeClasses} rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
