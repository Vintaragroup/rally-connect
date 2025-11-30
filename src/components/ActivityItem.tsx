import { Activity } from '../../types/admin';
import { UserCheck, Edit, UserPlus, Trophy } from 'lucide-react';

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const getIcon = () => {
    switch (activity.type) {
      case 'captain_request':
        return <UserCheck className="w-5 h-5 text-blue-600" />;
      case 'score_override':
        return <Edit className="w-5 h-5 text-orange-600" />;
      case 'player_transfer':
        return <UserPlus className="w-5 h-5 text-purple-600" />;
      case 'team_created':
        return <Trophy className="w-5 h-5 text-green-600" />;
      default:
        return <UserCheck className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBgColor = () => {
    switch (activity.type) {
      case 'captain_request':
        return 'bg-blue-100';
      case 'score_override':
        return 'bg-orange-100';
      case 'player_transfer':
        return 'bg-purple-100';
      case 'team_created':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 24) {
      return `${hours}h ago`;
    }
    return `${days}d ago`;
  };

  return (
    <div className="flex items-start gap-3 md:gap-4 py-3 md:py-4">
      <div className={`${getBgColor()} p-2 md:p-2.5 rounded-xl flex-shrink-0`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs md:text-sm text-gray-900 mb-0.5 truncate">{activity.title}</p>
        <p className="text-xs md:text-sm text-gray-600 mb-1 line-clamp-2">{activity.description}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{formatTime(activity.timestamp)}</span>
          {activity.actionBy && (
            <>
              <span>•</span>
              <span className="truncate">by {activity.actionBy}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}