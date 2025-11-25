interface SportIconProps {
  sport: "bocce" | "pickleball" | "padel";
  size?: number;
}

export function SportIcon({ sport, size = 24 }: SportIconProps) {
  const colors = {
    bocce: "var(--color-bocce)",
    pickleball: "var(--color-pickleball)",
    padel: "var(--color-padel)",
  };

  // Simple icon representations
  if (sport === "bocce") {
    return (
      <div 
        className="rounded-full flex items-center justify-center"
        style={{ 
          width: size, 
          height: size, 
          backgroundColor: colors.bocce,
          color: 'white'
        }}
      >
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>
    );
  }

  if (sport === "pickleball") {
    return (
      <div 
        className="rounded-lg flex items-center justify-center"
        style={{ 
          width: size, 
          height: size, 
          backgroundColor: colors.pickleball,
          color: 'white'
        }}
      >
        <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="9" />
          <circle cx="8" cy="8" r="1.5" fill="currentColor" />
          <circle cx="16" cy="8" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="8" cy="16" r="1.5" fill="currentColor" />
          <circle cx="16" cy="16" r="1.5" fill="currentColor" />
        </svg>
      </div>
    );
  }

  // Padel
  return (
    <div 
      className="rounded-lg flex items-center justify-center"
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: colors.padel,
        color: 'white'
      }}
    >
      <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="8" y="4" width="8" height="16" rx="4" />
        <line x1="12" y1="4" x2="12" y2="20" />
      </svg>
    </div>
  );
}
