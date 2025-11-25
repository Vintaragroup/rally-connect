import { Bell, Check, X, Calendar, Users, Trophy, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface NotificationsScreenProps {
  onBack: () => void;
}

interface Notification {
  id: string;
  type: "match" | "team" | "achievement" | "alert";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionable?: boolean;
}

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n1",
      type: "alert",
      title: "Spot Available!",
      message: "A spot opened for Division 3, Pickleball. Join now before it fills up!",
      time: "5 min ago",
      read: false,
      actionable: true,
    },
    {
      id: "n2",
      type: "match",
      title: "Match Reminder",
      message: "Your match vs Radnor Rollers starts in 2 hours at Merion Cricket Club.",
      time: "2 hours ago",
      read: false,
      actionable: false,
    },
    {
      id: "n3",
      type: "team",
      title: "Lineup Confirmed",
      message: "Your captain has set the lineup for tonight's match. You're in position 2.",
      time: "4 hours ago",
      read: false,
      actionable: false,
    },
    {
      id: "n4",
      type: "achievement",
      title: "New Achievement! 🏆",
      message: "You've won 10 matches this season! Keep up the great work.",
      time: "1 day ago",
      read: true,
      actionable: false,
    },
    {
      id: "n5",
      type: "team",
      title: "Availability Request",
      message: "Your captain is requesting availability for next week's matches.",
      time: "1 day ago",
      read: true,
      actionable: true,
    },
    {
      id: "n6",
      type: "match",
      title: "Match Result",
      message: "Merion Bocce Club defeated Wayne Warriors 5-3. Great job team!",
      time: "2 days ago",
      read: true,
      actionable: false,
    },
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "match":
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case "team":
        return <Users className="w-5 h-5 text-purple-600" />;
      case "achievement":
        return <Trophy className="w-5 h-5 text-amber-600" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getIconBg = (type: Notification["type"]) => {
    switch (type) {
      case "match":
        return "bg-blue-100";
      case "team":
        return "bg-purple-100";
      case "achievement":
        return "bg-amber-100";
      case "alert":
        return "bg-red-100";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="text-[var(--color-text-secondary)]">
            ← Back
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1>Notifications</h1>
              {unreadCount > 0 && (
                <Badge className="bg-red-500">{unreadCount}</Badge>
              )}
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Stay updated with your league activity
            </p>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleMarkAllAsRead}
            >
              <Check className="w-4 h-4 mr-1" />
              Read all
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-8 text-center">
            <Bell className="w-12 h-12 text-[var(--color-text-tertiary)] mx-auto mb-3" />
            <p className="text-[var(--color-text-secondary)]">
              No notifications yet
            </p>
            <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
              We'll notify you about matches, team updates, and more
            </p>
          </div>
        ) : (
          <>
            {/* Unread Notifications */}
            {notifications.filter(n => !n.read).length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm px-2">New</h2>
                {notifications.filter(n => !n.read).map((notification) => (
                  <div
                    key={notification.id}
                    className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm border-l-4 border-[var(--color-primary)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full ${getIconBg(notification.type)} flex items-center justify-center flex-shrink-0`}>
                        {getIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-sm font-medium">{notification.title}</h3>
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[var(--color-text-tertiary)]">
                            {notification.time}
                          </span>
                          <div className="flex gap-2">
                            {notification.actionable && (
                              <Button size="sm" className="h-7 text-xs">
                                Take Action
                              </Button>
                            )}
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs text-[var(--color-primary)] hover:underline"
                            >
                              Mark as read
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Read Notifications */}
            {notifications.filter(n => n.read).length > 0 && (
              <div className="space-y-3 mt-6">
                <h2 className="text-sm px-2">Earlier</h2>
                {notifications.filter(n => n.read).map((notification) => (
                  <div
                    key={notification.id}
                    className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm opacity-75"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full ${getIconBg(notification.type)} flex items-center justify-center flex-shrink-0`}>
                        {getIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-sm font-medium">{notification.title}</h3>
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                          {notification.message}
                        </p>
                        <span className="text-xs text-[var(--color-text-tertiary)]">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
