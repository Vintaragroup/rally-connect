import { MessageSquare, Send } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { Button } from "./ui/button";

export function MessagesScreen() {
  const hasMessages = false;

  if (!hasMessages) {
    return (
      <div className="h-full flex flex-col">
        <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4">
          <h1>Messages</h1>
        </div>
        <EmptyState
          icon={MessageSquare}
          title="No messages yet"
          description="Team messages and announcements will appear here."
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4">
        <h1>Team Chat</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Merion Bocce Club
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Message bubbles would go here */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm flex-shrink-0">
            JC
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-medium text-sm">Jordan Chen</span>
              <span className="text-xs text-[var(--color-text-secondary)]">2:30 PM</span>
            </div>
            <div className="bg-[var(--color-bg-elevated)] rounded-2xl rounded-tl-sm p-3 text-sm">
              Can't wait for tonight's match! Let's get this W 🎯
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm flex-shrink-0">
            SP
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-medium text-sm">Sam Patel</span>
              <span className="text-xs text-[var(--color-text-secondary)]">2:45 PM</span>
            </div>
            <div className="bg-[var(--color-bg-elevated)] rounded-2xl rounded-tl-sm p-3 text-sm">
              I'll be there by 7:15. Should we practice before?
            </div>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 bg-[var(--color-bg-elevated)] border-t border-[var(--color-border)]">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <Button size="icon" className="rounded-full h-10 w-10">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
