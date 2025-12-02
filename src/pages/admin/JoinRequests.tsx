import { JoinRequestsManagement } from '@/components/admin/JoinRequestsManagement';

export function JoinRequests() {
  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
      <main className="flex-1 p-4 md:p-8 max-w-full overflow-x-hidden">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl text-gray-900 mb-2">Join Requests</h1>
          <p className="text-sm md:text-base text-gray-600">
            Manage team join requests from players looking to join your teams
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <JoinRequestsManagement />
        </div>
      </main>
    </div>
  );
}
