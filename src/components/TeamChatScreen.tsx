import { Send, Image, Smile, MoreVertical, Pin, Users, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

interface TeamChatScreenProps {
  onBack: () => void;
  teamName?: string;
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      sender: "Jordan Chen",
      senderInitials: "JC",
      content: "Great win last night team! Everyone played amazing 🏆",
      timestamp: "2 hours ago",
      isMe: false,
      isCaptain: true,
      isPinned: true,
      reactions: [
        { emoji: "🔥", count: 5, hasReacted: true },
        { emoji: "👏", count: 3, hasReacted: false },
      ],
    },
    {
      id: "m2",
      sender: "Sam Martinez",
      senderInitials: "SM",
      content: "Thanks! That last point was intense",
      timestamp: "2 hours ago",
      isMe: false,
    },
    {
      id: "m3",
      sender: "You",
      senderInitials: "AR",
      content: "Team effort all the way! Can't wait for next week",
      timestamp: "1 hour ago",
      isMe: true,
    },
    {
      id: "m4",
      sender: "Taylor Kim",
      senderInitials: "TK",
      content: "Quick reminder: Practice on Thursday at 6pm!",
      timestamp: "30 min ago",
      isMe: false,
      isCaptain: true,
    },
    {
      id: "m5",
      sender: "Morgan Lee",
      senderInitials: "ML",
      content: "I'll be there 👍",
      timestamp: "25 min ago",
      isMe: false,
    },
    {
      id: "m6",
      sender: "Casey Johnson",
      senderInitials: "CJ",
      content: "Should we bring our own equipment or is it provided?",
      timestamp: "20 min ago",
      isMe: false,
    },
    {
      id: "m7",
      sender: "Jordan Chen",
      senderInitials: "JC",
      content: "Equipment is provided! Just bring water and your A-game 💪",
      timestamp: "15 min ago",
      isMe: false,
      isCaptain: true,
      reactions: [{ emoji: "👍", count: 4, hasReacted: false }],
    },
  ]);

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

  const handleReaction = (messageId: string, emoji: string) => {
    toast.success(`Reacted with ${emoji}`);
  };

  const pinnedMessages = messages.filter(m => m.isPinned);
  const regularMessages = messages.filter(m => !m.isPinned);

  return (
    <div className="flex flex-col h-screen bg-[var(--color-bg)] w-full">
      <div className="app-container mx-auto flex flex-col h-screen max-h-screen">
        {/* Header */}
        <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-3 sm:p-4">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack} className="text-[var(--color-text-secondary)]">
              ← Back
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="font-medium">{teamName}</h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  12 members • 8 online
                </p>
              </div>
            </div>
            <button
              onClick={() => toast.info("Team info coming soon!")}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <Info className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </button>
          </div>
        </div>

        {/* Pinned Messages */}
        {pinnedMessages.length > 0 && (
          <div className="bg-amber-50 border-b border-amber-200 p-3">
            <div className="flex items-start gap-2">
              <Pin className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-amber-900 mb-1">Pinned Message</p>
                <p className="text-sm text-amber-800 truncate">
                  {pinnedMessages[0].content}
                </p>
              </div>
            </div>
          </div>
        )}

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
                {/* Avatar */}
                {!message.isMe && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {message.senderInitials}
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`flex-1 max-w-[75%] ${message.isMe ? "items-end" : ""}`}>
                  {!message.isMe && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{message.sender}</span>
                      {message.isCaptain && (
                        <Badge className="bg-amber-100 text-amber-700 text-xs">
                          Captain
                        </Badge>
                      )}
                    </div>
                  )}
                  <div
                    className={`rounded-2xl p-3 ${
                      message.isMe
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-bg-elevated)] text-[var(--color-text)]"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[var(--color-text-tertiary)]">
                      {message.timestamp}
                    </span>
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex gap-1">
                        {message.reactions.map((reaction, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleReaction(message.id, reaction.emoji)}
                            className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${
                              reaction.hasReacted
                                ? "bg-blue-100 border border-blue-300"
                                : "bg-gray-100 border border-gray-300"
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

          {/* Typing Indicator (optional) */}
          <div className="flex gap-3 items-center opacity-50">
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            <div className="bg-gray-200 rounded-2xl px-4 py-2">
              <div className="flex gap-1">
                <motion.div
                  className="w-2 h-2 rounded-full bg-gray-400"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-gray-400"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-gray-400"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-[var(--color-bg-elevated)] border-t border-[var(--color-border)] p-4">
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
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                messageText.trim()
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}