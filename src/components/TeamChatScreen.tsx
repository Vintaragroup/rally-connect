import { Send, Image, Smile, Users, Info, ChevronRight } from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface TeamChatScreenProps {
  onBack: () => void;
  teamName?: string;
}

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role?: "captain" | "player";
  isOnline?: boolean;
}

interface Message {
  id: string;
  sender: string;
  senderInitials: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  isCaptain?: boolean;
  isPinned?: boolean;
  reactions?: { emoji: string; count: number; hasReacted: boolean }[];
}

export function TeamChatScreen({ onBack, teamName = "Merion Bocce Club" }: TeamChatScreenProps) {
  const [messageText, setMessageText] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [otherTeamCaptains, setOtherTeamCaptains] = useState<TeamMember[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Get current conversation details
  const isTeamChat = activeConversationId === "team-chat" || activeConversationId === null;
  const currentMember = activeConversationId && activeConversationId !== "team-chat" 
    ? teamMembers.find(m => m.id === activeConversationId) || otherTeamCaptains.find(c => c.id === activeConversationId)
    : null;
  
  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: `m${messages.length + 1}`,
      sender: "You",
      senderInitials: "AR",
      content: messageText,
      timestamp: "Just now",
      isMe: true,
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
    toast.success("Message sent!");
  };

  const handleReaction = (_messageId: string, emoji: string) => {
    toast.success(`Reacted with ${emoji}`);
  };

  const handleStartDM = (member: TeamMember) => {
    setActiveConversationId(member.id);
  };

  const handleBackToList = () => {
    setActiveConversationId(null);
  };

  const regularMessages = messages.filter(m => !m.isPinned);

  // CHAT LIST VIEW
  if (activeConversationId === null) {
    return (
      <div className="h-full flex flex-col bg-[var(--color-bg)]">
        {/* Header */}
        <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack} className="text-[var(--color-text-secondary)]">
              ← Back
            </button>
          </div>
          <h1 className="text-lg font-semibold">Messages</h1>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {/* Team Chat - Always at top */}
          <button
            onClick={() => setActiveConversationId("team-chat")}
            className="w-full px-4 py-4 flex items-center gap-3 border-b border-[var(--color-border)] hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{teamName}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">12 members • 8 online</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--color-text-tertiary)] flex-shrink-0" />
          </button>

          {/* Divider */}
          <div className="px-4 py-2">
            <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase">Direct Messages</p>
          </div>

          {/* Team Members */}
          {teamMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => handleStartDM(member)}
              className="w-full px-4 py-3 flex items-center gap-3 border-b border-[var(--color-border)] hover:bg-gray-50 transition-colors text-left"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  {member.initials}
                </div>
                {member.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{member.name}</p>
                  {member.role === "captain" && (
                    <Badge className="bg-amber-100 text-amber-700 text-xs">Captain</Badge>
                  )}
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {member.isOnline ? "Online" : "Offline"}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--color-text-tertiary)] flex-shrink-0" />
            </button>
          ))}

          {/* Team Captains Divider */}
          <div className="px-4 py-2 mt-2">
            <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase">Team Captains</p>
          </div>

          {/* Other Team Captains */}
          {otherTeamCaptains.map((captain) => (
            <button
              key={captain.id}
              onClick={() => handleStartDM(captain)}
              className="w-full px-4 py-3 flex items-center gap-3 border-b border-[var(--color-border)] hover:bg-gray-50 transition-colors text-left"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  {captain.initials}
                </div>
                {captain.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{captain.name}</p>
                  <Badge className="bg-emerald-100 text-emerald-700 text-xs">Other Team</Badge>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {captain.isOnline ? "Online" : "Offline"}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--color-text-tertiary)] flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // CHAT CONVERSATION VIEW
  return (
    <div className="h-full flex flex-col bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={handleBackToList} className="text-[var(--color-text-secondary)]">
            ← Back to Messages
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
              {isTeamChat ? (
                <Users className="w-6 h-6 text-white" />
              ) : (
                <span className="text-sm font-medium text-white">{currentMember?.initials}</span>
              )}
            </div>
            <div>
              <h2 className="font-medium">{isTeamChat ? teamName : currentMember?.name}</h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {isTeamChat ? "12 members • 8 online" : currentMember?.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <button
            onClick={() => toast.info("Info coming soon!")}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center flex-shrink-0"
          >
            <Info className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {regularMessages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`flex gap-3 ${message.isMe ? "flex-row-reverse" : ""}`}
            >
              {!message.isMe && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  {message.senderInitials}
                </div>
              )}

              <div className={`flex flex-col ${message.isMe ? "items-end" : ""}`}>
                {!message.isMe && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{message.sender}</span>
                    {message.isCaptain && (
                      <Badge className="bg-amber-100 text-amber-700 text-xs">Captain</Badge>
                    )}
                  </div>
                )}
                <div
                  className={`rounded-2xl p-3 max-w-xs ${
                    message.isMe
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-bg-elevated)] text-[var(--color-text)]"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-[var(--color-text-tertiary)]">{message.timestamp}</span>
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex gap-1">
                      {message.reactions.map((reaction, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleReaction(message.id, reaction.emoji)}
                          className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 transition-colors ${
                            reaction.hasReacted
                              ? "bg-blue-100 border border-blue-300"
                              : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          <span>{reaction.emoji}</span>
                          <span>{reaction.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="bg-[var(--color-bg-elevated)] border-t border-[var(--color-border)] p-4 flex-shrink-0">
        <div className="flex items-end gap-2">
          <button
            onClick={() => toast.info("Image upload coming soon!")}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center flex-shrink-0"
          >
            <Image className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
          <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 flex items-center gap-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0"
            />
            <button
              onClick={() => toast.info("Emoji picker coming soon!")}
              className="flex-shrink-0"
            >
              <Smile className="w-5 h-5 text-[var(--color-text-tertiary)]" />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
              messageText.trim()
                ? "bg-[var(--color-primary)] text-white hover:opacity-90"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
