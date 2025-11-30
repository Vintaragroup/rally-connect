import { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: string;
}

export function QuickActionCard({
  icon: Icon,
  label,
  onClick,
  color = 'blue',
}: QuickActionCardProps) {
  const colorClasses: Record<string, { bg: string; text: string; hover: string }> = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      hover: 'hover:bg-blue-200',
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      hover: 'hover:bg-green-200',
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      hover: 'hover:bg-purple-200',
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      hover: 'hover:bg-orange-200',
    },
  };

  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white border border-gray-200 rounded-2xl ${classes.hover} transition-all hover:shadow-md w-full`}
    >
      <div className={`${classes.bg} ${classes.text} p-2 md:p-3 rounded-xl flex-shrink-0`}>
        <Icon className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <span className="text-xs md:text-sm font-medium text-gray-900 text-left truncate">{label}</span>
    </button>
  );
}