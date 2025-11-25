import { Bell, Calendar, Moon, Globe, Lock, Smartphone, Mail, Download, ChevronRight, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [notificationSettings, setNotificationSettings] = useState({
    matchReminders: true,
    matchReminder24h: true,
    matchReminder1h: true,
    lineupChanges: true,
    scoreUpdates: false,
    teamMessages: true,
    practiceReminders: true,
    availabilityRequests: true,
  });

  const [calendarSync, setCalendarSync] = useState({
    googleCalendar: false,
    appleCalendar: true,
    outlookCalendar: false,
    autoSync: true,
  });

  const [appSettings, setAppSettings] = useState({
    darkMode: false,
    compactView: false,
    showWeather: true,
    autoAvailability: false,
  });

  const handleNotificationToggle = (key: string) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    toast.success("Notification settings updated");
  };

  const handleCalendarToggle = (key: string) => {
    setCalendarSync(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    toast.success("Calendar settings updated");
  };

  const handleAppSettingToggle = (key: string) => {
    setAppSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    toast.success("App settings updated");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="text-[var(--color-text-secondary)]">
            ← Back
          </button>
        </div>
        <h1>Settings & Preferences</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Notifications Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-5 h-5 text-[var(--color-primary)]" />
            <h2>Notifications</h2>
          </div>
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl overflow-hidden shadow-sm">
            {/* Match Reminders */}
            <div className="p-4 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium mb-1">Match Reminders</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Get notified before your matches
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.matchReminders}
                  onCheckedChange={() => handleNotificationToggle("matchReminders")}
                />
              </div>
              {notificationSettings.matchReminders && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2 pl-4 border-l-2 border-blue-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">24 hours before</span>
                    <Switch
                      checked={notificationSettings.matchReminder24h}
                      onCheckedChange={() => handleNotificationToggle("matchReminder24h")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">1 hour before</span>
                    <Switch
                      checked={notificationSettings.matchReminder1h}
                      onCheckedChange={() => handleNotificationToggle("matchReminder1h")}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Other Notifications */}
            <div className="p-4 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium mb-1">Lineup Changes</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    When your captain updates the lineup
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.lineupChanges}
                  onCheckedChange={() => handleNotificationToggle("lineupChanges")}
                />
              </div>
            </div>

            <div className="p-4 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium mb-1">Score Updates</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Live score updates during matches
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.scoreUpdates}
                  onCheckedChange={() => handleNotificationToggle("scoreUpdates")}
                />
              </div>
            </div>

            <div className="p-4 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium mb-1">Team Messages</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    New messages in team chat
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.teamMessages}
                  onCheckedChange={() => handleNotificationToggle("teamMessages")}
                />
              </div>
            </div>

            <div className="p-4 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium mb-1">Practice Reminders</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Upcoming practice sessions
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.practiceReminders}
                  onCheckedChange={() => handleNotificationToggle("practiceReminders")}
                />
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium mb-1">Availability Requests</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    When captain requests your availability
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.availabilityRequests}
                  onCheckedChange={() => handleNotificationToggle("availabilityRequests")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Integration */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
            <h2>Calendar Sync</h2>
          </div>
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium mb-1">Google Calendar</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Sync matches and practices
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {calendarSync.googleCalendar && (
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                  <Switch
                    checked={calendarSync.googleCalendar}
                    onCheckedChange={() => handleCalendarToggle("googleCalendar")}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium mb-1">Apple Calendar</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Sync matches and practices
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {calendarSync.appleCalendar && (
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                  <Switch
                    checked={calendarSync.appleCalendar}
                    onCheckedChange={() => handleCalendarToggle("appleCalendar")}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium mb-1">Outlook Calendar</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Sync matches and practices
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {calendarSync.outlookCalendar && (
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                  <Switch
                    checked={calendarSync.outlookCalendar}
                    onCheckedChange={() => handleCalendarToggle("outlookCalendar")}
                  />
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium mb-1">Auto-Sync</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Automatically sync new events
                  </p>
                </div>
                <Switch
                  checked={calendarSync.autoSync}
                  onCheckedChange={() => handleCalendarToggle("autoSync")}
                />
              </div>
            </div>
          </div>

          {/* Calendar Export Button */}
          <Button
            variant="outline"
            className="w-full mt-3"
            onClick={() => toast.success("Calendar file downloaded!")}
          >
            <Download className="w-4 h-4 mr-2" />
            Download .ics File
          </Button>
        </div>

        {/* App Preferences */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Smartphone className="w-5 h-5 text-[var(--color-primary)]" />
            <h2>App Preferences</h2>
          </div>
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium mb-1">Dark Mode</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Use dark theme
                  </p>
                </div>
                <Switch
                  checked={appSettings.darkMode}
                  onCheckedChange={() => handleAppSettingToggle("darkMode")}
                />
              </div>
            </div>

            <div className="p-4 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium mb-1">Compact View</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Show more items on screen
                  </p>
                </div>
                <Switch
                  checked={appSettings.compactView}
                  onCheckedChange={() => handleAppSettingToggle("compactView")}
                />
              </div>
            </div>

            <div className="p-4 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium mb-1">Show Weather</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Display weather on match cards
                  </p>
                </div>
                <Switch
                  checked={appSettings.showWeather}
                  onCheckedChange={() => handleAppSettingToggle("showWeather")}
                />
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium mb-1">Auto Set Availability</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Mark as available when accepting calendar invites
                  </p>
                </div>
                <Switch
                  checked={appSettings.autoAvailability}
                  onCheckedChange={() => handleAppSettingToggle("autoAvailability")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Other Settings */}
        <div>
          <h2 className="mb-3">Other Settings</h2>
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => toast.info("Language settings coming soon!")}
              className="w-full p-4 border-b border-[var(--color-border)] flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[var(--color-text-secondary)]" />
                <div className="text-left">
                  <h3 className="text-sm font-medium">Language</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">English (US)</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-text-tertiary)]" />
            </button>

            <button
              onClick={() => toast.info("Privacy settings coming soon!")}
              className="w-full p-4 border-b border-[var(--color-border)] flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-[var(--color-text-secondary)]" />
                <div className="text-left">
                  <h3 className="text-sm font-medium">Privacy & Security</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">Manage data settings</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-text-tertiary)]" />
            </button>

            <button
              onClick={() => toast.info("Email preferences coming soon!")}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[var(--color-text-secondary)]" />
                <div className="text-left">
                  <h3 className="text-sm font-medium">Email Preferences</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">Manage email notifications</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-text-tertiary)]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
