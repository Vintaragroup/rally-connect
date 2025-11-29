import { useState, useEffect } from "react";
import { Mail, Chrome, Apple, ArrowLeft, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { validateEmail, validatePassword, ValidationError } from "@/lib/validation/forms";

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
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');

  // Check if user is already authenticated and redirect if needed
  useEffect(() => {
    if (user) {
      // User is already authenticated, go to onboarding
      onComplete(false);
    }
  }, [user, onComplete]);

  // Update password strength indicator
  useEffect(() => {
    if (password) {
      const result = validatePassword(password);
      setPasswordStrength(result.strength);
    }
  }, [password]);

  const handleOAuthLogin = async (provider: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🔐 Initiating ${provider} OAuth login...`);
      console.log(`📍 Current URL: ${window.location.href}`);
      console.log(`📍 Origin: ${window.location.origin}`);
      
      // Get the Supabase redirect URL from environment or window location
      // For mobile: use current origin (e.g., http://10.0.0.2:4300)
      // For localhost: use localhost:3000
      let redirectTo = window.location.origin;
      
      console.log(`🔗 Redirect URL being sent to OAuth: ${redirectTo}`);
      
      // Supabase OAuth with proper redirect configuration
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as 'google' | 'apple',
        options: {
          redirectTo: redirectTo,
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
      setValidationErrors([]);
      setError(null);

      // Validate email
      if (!validateEmail(email)) {
        setValidationErrors([{ field: 'email', message: 'Please enter a valid email address' }]);
        return;
      }

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setValidationErrors(passwordValidation.errors);
        return;
      }

      setIsLoading(true);

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
        // Validate name for signup
        if (!name.trim()) {
          setValidationErrors([{ field: 'name', message: 'Please enter your name' }]);
          setIsLoading(false);
          return;
        }

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
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm flex gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            {validationErrors.map((err, idx) => (
              <div key={idx} className="flex gap-2 text-red-700 text-sm mb-1 last:mb-0">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{err.message}</span>
              </div>
            ))}
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
                className={`h-12 ${validationErrors.some(e => e.field === 'name') ? 'border-red-500 focus:ring-red-500' : ''}`}
                aria-invalid={validationErrors.some(e => e.field === 'name')}
              />
              {validationErrors.find(e => e.field === 'name') && (
                <p className="text-xs text-red-600 mt-1 flex gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  {validationErrors.find(e => e.field === 'name')?.message}
                </p>
              )}
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
              className={`h-12 ${validationErrors.some(e => e.field === 'email') ? 'border-red-500 focus:ring-red-500' : ''}`}
              aria-invalid={validationErrors.some(e => e.field === 'email')}
            />
            {validationErrors.find(e => e.field === 'email') && (
              <p className="text-xs text-red-600 mt-1 flex gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                {validationErrors.find(e => e.field === 'email')?.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm mb-2">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className={`h-12 pr-10 ${validationErrors.some(e => e.field === 'password') ? 'border-red-500 focus:ring-red-500' : ''}`}
                minLength={8}
                aria-invalid={validationErrors.some(e => e.field === 'password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password Strength Indicator */}
            {password && !isSignIn && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {['weak', 'medium', 'strong'].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full ${
                        passwordStrength === level || 
                        (level === 'weak') ||
                        (level === 'medium' && (passwordStrength === 'medium' || passwordStrength === 'strong')) ||
                        (level === 'strong' && passwordStrength === 'strong')
                          ? 'bg-' + (level === 'weak' ? 'red' : level === 'medium' ? 'yellow' : 'green') + '-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs ${
                  passwordStrength === 'weak' ? 'text-red-600' :
                  passwordStrength === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  Password strength: {passwordStrength}
                </p>
              </div>
            )}
            {validationErrors.find(e => e.field === 'password') && (
              <p className="text-xs text-red-600 mt-1 flex gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                {validationErrors.find(e => e.field === 'password')?.message}
              </p>
            )}
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