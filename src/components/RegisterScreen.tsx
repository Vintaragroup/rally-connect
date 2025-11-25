import { useState, useEffect } from "react";
import { Mail, Chrome, Apple, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface RegisterScreenProps {
  isSignIn?: boolean;
  onComplete: (isReturningUser: boolean) => void;
  onBack?: () => void;
}

export function RegisterScreen({ isSignIn: initialIsSignIn = false, onComplete, onBack }: RegisterScreenProps) {
  const { user } = useAuth();
  const [isSignIn, setIsSignIn] = useState(initialIsSignIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already authenticated and redirect if needed
  useEffect(() => {
    if (user) {
      // User is already authenticated, go to onboarding
      onComplete(false);
    }
  }, [user, onComplete]);

  const handleOAuthLogin = async (provider: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🔐 Initiating ${provider} OAuth login...`);
      
      // Supabase OAuth with proper redirect configuration
      // The redirect URI must match what's configured in Supabase dashboard
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as 'google' | 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false,
        },
      });
      
      if (error) {
        console.error('❌ OAuth Error:', error.message);
        setError(error.message);
        setIsLoading(false);
      }
      // Note: Browser will redirect to provider for authentication
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "OAuth login failed";
      console.error('❌ OAuth Error:', errorMsg);
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      if (isSignIn) {
        // Sign in with email and password
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message || "Invalid email or password");
          setIsLoading(false);
          return;
        }

        // Pass true to indicate returning user
        onComplete(true);
      } else {
        // Sign up with email and password
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            setError("An account with this email already exists");
          } else {
            setError(error.message || "Registration failed");
          }
          setIsLoading(false);
          return;
        }

        if (data.user) {
          // Pass false to indicate new user
          onComplete(false);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `${isSignIn ? "Sign in" : "Registration"} failed`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] max-w-[390px] mx-auto">
      {/* Back Button */}
      {onBack && (
        <div className="p-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="p-6 pt-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white text-2xl mb-6">
          🎾
        </div>
        <h1 className="mb-2">
          {isSignIn ? "Welcome back" : "Join RallyOS"}
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          {isSignIn 
            ? "Sign in to manage your teams and matches" 
            : "Create your account to get started"}
        </p>
      </div>

      <div className="flex-1 px-6 pb-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* OAuth Options */}
        <div className="space-y-3 mb-6">
          <Button
            variant="outline"
            className="w-full h-12 border-[var(--color-border)]"
            onClick={() => handleOAuthLogin("google")}
            disabled={isLoading}
          >
            <Chrome className="w-5 h-5 mr-3" />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 border-[var(--color-border)]"
            onClick={() => handleOAuthLogin("apple")}
            disabled={isLoading}
          >
            <Apple className="w-5 h-5 mr-3" />
            Continue with Apple
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <span className="text-sm text-[var(--color-text-secondary)]">or</span>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {!isSignIn && (
            <div>
              <label className="block text-sm mb-2">Full Name</label>
              <Input
                type="text"
                placeholder="Alex Rodriguez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isSignIn}
                disabled={isLoading}
                className="h-12"
              />
            </div>
          )}
          <div>
            <label className="block text-sm mb-2">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-12"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="h-12"
              minLength={8}
            />
          </div>

          {isSignIn && (
            <button
              type="button"
              className="text-sm text-[var(--color-primary)] hover:underline"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 mt-6"
            disabled={isLoading}
          >
            <Mail className="w-5 h-5 mr-2" />
            {isLoading ? "Loading..." : isSignIn ? "Sign In" : "Create Account"}
          </Button>
        </form>

        {/* Toggle Sign In/Register */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsSignIn(!isSignIn);
              setError(null);
            }}
            className="text-sm text-[var(--color-text-secondary)]"
            disabled={isLoading}
          >
            {isSignIn ? "Don't have an account? " : "Already have an account? "}
            <span className="text-[var(--color-primary)]">
              {isSignIn ? "Sign up" : "Sign in"}
            </span>
          </button>
        </div>

        {/* Terms */}
        {!isSignIn && (
          <p className="text-xs text-center text-[var(--color-text-secondary)] mt-8">
            By continuing, you agree to RallyOS's{" "}
            <button className="text-[var(--color-primary)]">Terms of Service</button>
            {" "}and{" "}
            <button className="text-[var(--color-primary)]">Privacy Policy</button>
          </p>
        )}
      </div>
    </div>
  );
}