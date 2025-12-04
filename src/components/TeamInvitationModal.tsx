import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Copy, Plus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TeamInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
  userId: string;
}

interface GeneratedCode {
  code: string;
  generatedAt: Date;
  expiresAt: Date;
}

const TeamInvitationModal: React.FC<TeamInvitationModalProps> = ({
  isOpen,
  onClose,
  teamId,
  teamName,
  userId,
}) => {
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateCode = async () => {
    try {
      setGenerating(true);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      
      const response = await fetch(`${apiUrl}/teams/${teamId}/generate-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          createdBy: userId,
          expiresAt,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate code');

      const data = await response.json();
      setGeneratedCode({
        code: data.code,
        generatedAt: new Date(),
        expiresAt,
      });

      toast.success('Team invitation code generated!');
    } catch (err) {
      console.error('Error generating code:', err);
      toast.error('Failed to generate invitation code');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode.code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setGeneratedCode(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Invite Players to {teamName}</CardTitle>
          <CardDescription>
            Generate a shareable code for players to join your team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!generatedCode ? (
            <Button
              onClick={handleGenerateCode}
              disabled={generating}
              className="w-full gap-2"
            >
              <Plus className="w-4 h-4" />
              {generating ? 'Generating...' : 'Generate Invitation Code'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <p className="text-xs text-slate-600 mb-2">Your invitation code</p>
                <code className="text-3xl font-bold font-mono tracking-widest">
                  {generatedCode.code}
                </code>
                <p className="text-xs text-slate-500 mt-2">
                  Expires on {generatedCode.expiresAt.toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={copyToClipboard}
                  variant={copied ? 'default' : 'outline'}
                  className="flex-1 gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>

              <p className="text-sm text-slate-600">
                Share this code with players. They can enter it in the "Join Team" screen to join {teamName}.
              </p>

              <Button
                onClick={() => setGeneratedCode(null)}
                variant="outline"
                className="w-full"
              >
                Generate New Code
              </Button>
            </div>
          )}

          <Button
            onClick={handleClose}
            variant="ghost"
            className="w-full"
          >
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamInvitationModal;
