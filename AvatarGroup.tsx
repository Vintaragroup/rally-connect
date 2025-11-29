interface Avatar {
  id: string;
  name: string;
  avatar?: string;
}

interface AvatarGroupProps {
  avatars: Avatar[];
  max?: number;
}

export function AvatarGroup({ avatars, max = 3 }: AvatarGroupProps) {
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {displayAvatars.map((avatar) => (
        <div
          key={avatar.id}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-xs font-medium border-2 border-white overflow-hidden"
          title={avatar.name}
        >
          {avatar.avatar ? (
            <img src={avatar.avatar} alt={avatar.name} className="w-full h-full object-cover" />
          ) : (
            avatar.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
          )}
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
          +{remaining}
        </div>
      )}
    </div>
  );
}
