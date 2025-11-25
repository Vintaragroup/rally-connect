import { useState } from "react";
import { ChevronRight, Copy, Mail, MessageSquare, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface InvitePlayersScreenProps {
  teamName: string;
  onComplete: () => void;
  onSkip: () => void;
}

export function InvitePlayersScreen({ teamName, onComplete, onSkip }: InvitePlayersScreenProps) {
  const [emails, setEmails] = useState<string[]>([""]);
  const [copied, setCopied] = useState(false);
  
  // Mock invite code
  const inviteCode = "MBC2024";

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(`Join ${teamName} on RallyOS! Use code: ${inviteCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvites = () => {
    const validEmails = emails.filter((e) => e.trim() !== "");
    console.log("Sending invites to:", validEmails);
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] max-w-[390px] mx-auto">
      {/* Progress */}
      <div className="p-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= 4 ? "bg-[var(--color-primary)]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="mb-2">Invite players</h1>
          <p className="text-[var(--color-text-secondary)]">
            Build your team by inviting players to join {teamName}
          </p>
        </div>

        {/* Invite Code */}
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-2xl p-5 mb-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-base">Team Invite Code</h3>
          </div>
          <div className="bg-white/20 rounded-xl p-4 mb-3 text-center">
            <div className="text-3xl tracking-wider mb-1">{inviteCode}</div>
            <div className="text-sm opacity-90">Share this code with your players</div>
          </div>
          <Button
            variant="secondary"
            className="w-full bg-white text-[var(--color-primary)] hover:bg-white/90"
            onClick={copyInviteCode}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Invite Link
              </>
            )}
          </Button>
        </div>

        {/* Email Invites */}
        <div className="flex-1">
          <h3 className="text-base mb-3 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Or send email invites
          </h3>
          <div className="space-y-3 mb-4">
            {emails.map((email, index) => (
              <Input
                key={index}
                type="email"
                placeholder="player@example.com"
                value={email}
                onChange={(e) => updateEmail(index, e.target.value)}
                className="h-12"
              />
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full border-[var(--color-border)] mb-6"
            onClick={addEmailField}
          >
            + Add another email
          </Button>
        </div>

        <div className="space-y-3 pt-4 border-t border-[var(--color-border)]">
          <Button
            onClick={handleSendInvites}
            className="w-full"
            size="lg"
          >
            {emails.filter((e) => e.trim()).length > 0 ? "Send Invites & Continue" : "Continue"}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
          <Button onClick={onSkip} variant="ghost" className="w-full">
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
}
