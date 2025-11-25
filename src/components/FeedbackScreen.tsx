import { MessageSquare, Send, AlertCircle, CheckCircle, Star, MapPin, Users, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

interface FeedbackScreenProps {
  onBack: () => void;
}

interface FeedbackItem {
  id: string;
  type: "suggestion" | "complaint" | "compliment";
  category: "venue" | "scheduling" | "equipment" | "organization" | "other";
  subject: string;
  message: string;
  date: string;
  status: "submitted" | "reviewing" | "resolved";
}

export function FeedbackScreen({ onBack }: FeedbackScreenProps) {
  const [selectedTab, setSelectedTab] = useState<"new" | "history">("new");
  const [feedbackType, setFeedbackType] = useState<"suggestion" | "complaint" | "compliment">("suggestion");
  const [category, setCategory] = useState<string>("venue");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);

  const feedbackHistory: FeedbackItem[] = [
    {
      id: "f1",
      type: "suggestion",
      category: "venue",
      subject: "Add more water fountains at Merion facility",
      message: "The current facility only has one water fountain and it gets very crowded...",
      date: "Dec 15, 2024",
      status: "reviewing",
    },
    {
      id: "f2",
      type: "compliment",
      category: "organization",
      subject: "Great job on the new scheduling system!",
      message: "Really appreciate the improvements to the schedule visibility...",
      date: "Dec 10, 2024",
      status: "resolved",
    },
    {
      id: "f3",
      type: "complaint",
      category: "equipment",
      subject: "Court 3 net needs repair",
      message: "The net on court 3 at Wayne Sports Complex is torn and needs replacement...",
      date: "Dec 5, 2024",
      status: "resolved",
    },
  ];

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.success("Feedback submitted successfully!");
    setSubject("");
    setMessage("");
    setRating(0);
    setSelectedTab("history");
  };

  const getTypeColor = (type: FeedbackItem["type"]) => {
    switch (type) {
      case "suggestion": return "bg-blue-100 text-blue-700";
      case "complaint": return "bg-red-100 text-red-700";
      case "compliment": return "bg-green-100 text-green-700";
    }
  };

  const getStatusColor = (status: FeedbackItem["status"]) => {
    switch (status) {
      case "submitted": return "bg-gray-100 text-gray-700";
      case "reviewing": return "bg-amber-100 text-amber-700";
      case "resolved": return "bg-green-100 text-green-700";
    }
  };

  const getStatusIcon = (status: FeedbackItem["status"]) => {
    switch (status) {
      case "submitted": return <AlertCircle className="w-3 h-3" />;
      case "reviewing": return <AlertCircle className="w-3 h-3" />;
      case "resolved": return <CheckCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="text-white/90">
            ← Back
          </button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white mb-1">Feedback & Suggestions</h1>
            <p className="text-sm text-white/80">Help us improve your experience</p>
          </div>
          <MessageSquare className="w-8 h-8 text-white" />
        </div>

        {/* Info Banner */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
          <p className="text-sm text-white/90">
            Your feedback goes directly to the league administrators and helps improve the experience for everyone.
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 bg-[var(--color-bg-elevated)] rounded-xl p-1">
          <button
            onClick={() => setSelectedTab("new")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedTab === "new"
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            Submit Feedback
          </button>
          <button
            onClick={() => setSelectedTab("history")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedTab === "history"
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            My Feedback ({feedbackHistory.length})
          </button>
        </div>

        {selectedTab === "new" ? (
          /* New Feedback Form */
          <div className="space-y-4">
            {/* Feedback Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">Feedback Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "suggestion", label: "Suggestion", icon: "💡" },
                  { value: "complaint", label: "Issue", icon: "⚠️" },
                  { value: "compliment", label: "Praise", icon: "👏" },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFeedbackType(type.value as any)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      feedbackType === type.value
                        ? "border-[var(--color-primary)] bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-xs font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                  { value: "venue", label: "Venue", icon: MapPin },
                  { value: "scheduling", label: "Schedule", icon: Calendar },
                  { value: "equipment", label: "Equipment", icon: Star },
                  { value: "organization", label: "Organization", icon: Users },
                  { value: "other", label: "Other", icon: MessageSquare },
                ].map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`px-4 py-2 rounded-xl border-2 whitespace-nowrap transition-all flex items-center gap-2 ${
                        category === cat.value
                          ? "border-[var(--color-primary)] bg-blue-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating (for venue feedback) */}
            {category === "venue" && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Venue Rating (optional)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Subject */}
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Input
                type="text"
                placeholder="Brief summary of your feedback"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <Textarea
                placeholder="Provide details about your feedback..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                {message.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <Button onClick={handleSubmit} className="w-full" size="lg">
              <Send className="w-4 h-4 mr-2" />
              Submit Feedback
            </Button>

            {/* Privacy Note */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3">
              <p className="text-xs text-[var(--color-text-secondary)]">
                Your feedback is sent directly to your league administrator. We may contact you for follow-up if needed.
              </p>
            </div>
          </div>
        ) : (
          /* Feedback History */
          <div className="space-y-3">
            {feedbackHistory.length === 0 ? (
              <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-8 text-center">
                <MessageSquare className="w-12 h-12 text-[var(--color-text-tertiary)] mx-auto mb-3" />
                <p className="text-[var(--color-text-secondary)]">No feedback submitted yet</p>
              </div>
            ) : (
              feedbackHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${getTypeColor(item.type)} text-xs capitalize`}>
                          {item.type}
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-700 text-xs capitalize">
                          {item.category}
                        </Badge>
                      </div>
                      <h3 className="font-medium mb-1">{item.subject}</h3>
                      <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-2">
                        {item.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
                    <span className="text-xs text-[var(--color-text-tertiary)]">
                      {item.date}
                    </span>
                    <Badge className={`${getStatusColor(item.status)} text-xs capitalize`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1">{item.status}</span>
                    </Badge>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
