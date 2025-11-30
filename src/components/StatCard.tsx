import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({
  icon: Icon,
  label,
  value,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-100',
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm text-gray-600 mb-1 truncate">{label}</p>
          <p className="text-xl md:text-3xl text-gray-900 mb-2">{value}</p>
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={`text-xs md:text-sm ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : '-'}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 hidden md:inline">vs last month</span>
            </div>
          )}
        </div>
        <div className={`${iconBgColor} ${iconColor} p-2 md:p-3 rounded-xl flex-shrink-0`}>
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </div>
    </div>
  );
}