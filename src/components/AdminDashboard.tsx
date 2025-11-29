import { AdminTabs } from './admin/AdminTabs';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage league rules, teams, players, analytics, and generate reports
          </p>
        </div>

        {/* Admin Tabs */}
        <AdminTabs />
      </div>
    </div>
  );
}
