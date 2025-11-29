import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm space-y-3 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      <div className="flex gap-2 pt-2">
        <div className="h-8 bg-gray-300 rounded w-24"></div>
        <div className="h-8 bg-gray-300 rounded w-32"></div>
      </div>
    </div>
  );
}

export function SkeletonMatchCard() {
  return (
    <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 bg-gray-300 rounded w-1/3"></div>
        <div className="h-5 bg-gray-300 rounded w-20"></div>
      </div>
      <div className="h-12 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-full"></div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-4 bg-gray-300 rounded flex-1"></div>
          <div className="h-4 bg-gray-300 rounded w-20"></div>
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export { Skeleton };
