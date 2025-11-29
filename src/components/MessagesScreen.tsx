import { MessageSquare, Send, WifiOff } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { Button } from "./ui/button";
import { useOnline } from "@/hooks/useOnline";
import { useState } from "react";

export function MessagesScreen() {
  const hasMessages = false;
  const isOnline = useOnline();
  const [messageText, setMessageText] = useState("");

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
      </div>

      {/* Offline indicator */}
      {!isOnline && (
        <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-600" />
          <p className="text-sm text-amber-700">Messages will send when you're back online</p>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 bg-[var(--color-bg-elevated)] border-t border-[var(--color-border)]">
        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="message-input" className="sr-only">Send a message</label>
          <input
            id="message-input"
            type="text"
            placeholder={isOnline ? "Type a message..." : "You're offline - messages will queue"}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={!isOnline}
            className="flex-1 px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Message text input"
          />
          <Button 
            size="icon" 
            className="rounded-full h-10 w-10"
            disabled={!isOnline}
            aria-label="Send message"
            title={!isOnline ? "You're offline - messages will send when online" : "Send message"}
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </Button>
        </form>
      </div>
    </div>
  );
}
