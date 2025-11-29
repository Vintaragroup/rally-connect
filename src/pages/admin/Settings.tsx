import { Settings as SettingsIcon, Bell, Shield, Database, Users, Mail } from 'lucide-react';

interface SettingsProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function Settings({ onMenuToggle, isMobileMenuOpen }: SettingsProps) {
  const settingsGroups = [
    {
      title: 'General Settings',
      icon: SettingsIcon,
      items: [
        { label: 'Platform Name', value: 'RallyOS' },
        { label: 'Admin Email', value: 'admin@rallyos.com' },
        { label: 'Timezone', value: 'America/New_York' },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Email Notifications', value: 'Enabled' },
        { label: 'Captain Request Alerts', value: 'Enabled' },
        { label: 'Score Update Alerts', value: 'Enabled' },
      ],
    },
    {
      title: 'Access Control',
      icon: Shield,
      items: [
        { label: 'Two-Factor Authentication', value: 'Optional' },
        { label: 'Session Timeout', value: '30 minutes' },
        { label: 'Password Policy', value: 'Strong' },
      ],
    },
    {
      title: 'Data Management',
      icon: Database,
      items: [
        { label: 'Backup Frequency', value: 'Daily' },
        { label: 'Data Retention', value: '7 years' },
        { label: 'Export Format', value: 'CSV, JSON' },
      ],
    },
    {
      title: 'User Management',
      icon: Users,
      items: [
        { label: 'Auto-Approve Captains', value: 'Disabled' },
        { label: 'Player Self-Registration', value: 'Enabled' },
        { label: 'Team Transfer Approval', value: 'Required' },
      ],
    },
    {
      title: 'Email Configuration',
      icon: Mail,
      items: [
        { label: 'SMTP Server', value: 'Configured' },
        { label: 'From Address', value: 'noreply@rallyos.com' },
        { label: 'Email Templates', value: '12 active' },
      ],
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl text-gray-900 mb-2">Settings</h1>
          <p className="text-sm md:text-base text-gray-600">
            Configure platform settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {settingsGroups.map((group, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                <div className="bg-blue-100 text-blue-600 p-2.5 rounded-xl">
                  <group.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg text-gray-900">{group.title}</h3>
              </div>
              <div className="space-y-3">
                {group.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
}