interface StatusBadgeProps {
  status: string;
  type?: 'status' | 'role' | 'sport';
}

export function StatusBadge({ status, type = 'status' }: StatusBadgeProps) {
  const getStyles = () => {
    if (type === 'role') {
      const roleStyles: Record<string, string> = {
        admin: 'bg-purple-100 text-purple-700',
        captain: 'bg-blue-100 text-blue-700',
        player: 'bg-gray-100 text-gray-700',
      };
      return roleStyles[status.toLowerCase()] || 'bg-gray-100 text-gray-700';
    }

    if (type === 'sport') {
      const sportStyles: Record<string, string> = {
        bocce: 'bg-amber-100 text-amber-700',
        pickleball: 'bg-green-100 text-green-700',
        padel: 'bg-indigo-100 text-indigo-700',
      };
      return sportStyles[status.toLowerCase()] || 'bg-gray-100 text-gray-700';
    }

    // Default status styles
    const statusStyles: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      upcoming: 'bg-blue-100 text-blue-700',
      completed: 'bg-gray-100 text-gray-700',
      scheduled: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-orange-100 text-orange-700',
      cancelled: 'bg-red-100 text-red-700',
      suspended: 'bg-red-100 text-red-700',
      archived: 'bg-gray-100 text-gray-700',
    };

    return statusStyles[status.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getStyles()}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </span>
  );
}
