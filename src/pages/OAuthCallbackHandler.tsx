import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

/**
 * OAuth Callback Handler for Supabase
 * 
 * Supabase redirects here after user authenticates with Google/Apple.
 * This component processes the OAuth callback and establishes the session.
 * 
 * Expected URL: /auth/callback#access_token=...&type=...
 */
export function OAuthCallbackHandler() {
  const [statusMessage, setStatusMessage] = useState('✓ Processing OAuth callback...');
  const [isError, setIsError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<any>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      console.log('🚀 OAuthCallbackHandler.tsx loaded');
      try {
        console.log('📋 Callback URL:', window.location.href);
        
        // Supabase automatically handles the OAuth callback from the URL
        // The session is set via the hash fragment
        
        // Wait a moment for Supabase to process the callback
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('Checking authentication status...');
        
        // Check if user is now authenticated
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Error getting session:', sessionError);
          const errorLog = {
            type: 'SESSION_ERROR',
            message: sessionError.message,
            timestamp: new Date().toISOString(),
          };
          
          localStorage.setItem('oauth_error_log', JSON.stringify(errorLog));
          
          setIsError(true);
          setErrorDetails(errorLog);
          setStatusMessage('❌ Failed to establish session');
          
          console.error('⏱️  Redirecting in 5 seconds...');
          setTimeout(() => {
            window.location.href = '/';
          }, 5000);
          return;
        }
        
        if (session && session.user) {
          console.log('✓ OAuth authentication successful');
          console.log('✓ User email:', session.user.email);
          console.log('✓ User ID:', session.user.id);
          
          // Clear any previous error logs
          localStorage.removeItem('oauth_error_log');
          
          setStatusMessage(`✓ Welcome ${session.user.email}!`);
          
          // Sync user to backend database
          try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4800";
            const syncResponse = await fetch(`${apiUrl}/auth/sync-user`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                stackUserId: session.user.id,
                email: session.user.email,
                displayName: session.user.user_metadata?.full_name || session.user.email,
              }),
            });
            
            if (syncResponse.ok) {
              console.log('✓ User synced to backend database');
            } else {
              console.warn('⚠️ Failed to sync user to backend:', syncResponse.status);
            }
          } catch (syncError) {
            console.warn('⚠️ Error syncing user:', syncError);
          }
          
          // Redirect to home/onboarding after a brief delay
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        } else {
          console.warn('⚠️ No session found after OAuth callback');
          
          // Try one more time after a longer wait
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const {
            data: { session: retrySession },
          } = await supabase.auth.getSession();
          
          if (retrySession && retrySession.user) {
            console.log('✓ OAuth authentication successful (retry)');
            console.log('✓ User email:', retrySession.user.email);
            
            localStorage.removeItem('oauth_error_log');
            setStatusMessage(`✓ Welcome ${retrySession.user.email}!`);
            
            // Sync user to backend database
            try {
              const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4800";
              const syncResponse = await fetch(`${apiUrl}/auth/sync-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  stackUserId: retrySession.user.id,
                  email: retrySession.user.email,
                  displayName: retrySession.user.user_metadata?.full_name || retrySession.user.email,
                }),
              });
              
              if (syncResponse.ok) {
                console.log('✓ User synced to backend database');
              } else {
                console.warn('⚠️ Failed to sync user to backend:', syncResponse.status);
              }
            } catch (syncError) {
              console.warn('⚠️ Error syncing user:', syncError);
            }
            
            setTimeout(() => {
              window.location.href = '/';
            }, 1500);
          } else {
            const errorLog = {
              type: 'USER_NOT_AUTHENTICATED',
              message: 'No session established after OAuth callback',
              timestamp: new Date().toISOString(),
            };
            
            localStorage.setItem('oauth_error_log', JSON.stringify(errorLog));
            
            setIsError(true);
            setErrorDetails(errorLog);
            setStatusMessage('❌ Authentication incomplete');
            
            console.error('❌ No session after OAuth callback');
            console.error('⏱️  Redirecting in 5 seconds...');
            
            setTimeout(() => {
              window.location.href = '/';
            }, 5000);
          }
        }
      } catch (error) {
        console.error('❌ OAuth callback error:', error);
        
        const errorLog = {
          type: 'CALLBACK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
          stack: error instanceof Error ? error.stack : undefined,
        };
        
        localStorage.setItem('oauth_error_log', JSON.stringify(errorLog));
        
        setIsError(true);
        setErrorDetails(errorLog);
        setStatusMessage('❌ OAuth callback failed');
        
        console.error('⏱️  Redirecting in 5 seconds...');
        setTimeout(() => {
          window.location.href = '/';
        }, 5000);
      }
    };
    
    handleOAuthCallback();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] p-4">
      <div className="text-center max-w-2xl">
        {isError && errorDetails ? (
          // ERROR STATE
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-red-500 mb-4">OAuth Error</h1>
            
            <div className="text-left space-y-3 font-mono text-sm mb-6">
              {errorDetails.type && (
                <div>
                  <span className="text-[var(--color-text-secondary)]">Type:</span>
                  <span className="ml-2 text-red-400 font-bold">{errorDetails.type}</span>
                </div>
              )}
              
              {errorDetails.message && (
                <div>
                  <span className="text-[var(--color-text-secondary)]">Message:</span>
                  <span className="ml-2 text-red-300">{errorDetails.message}</span>
                </div>
              )}
              
              {errorDetails.timestamp && (
                <div>
                  <span className="text-[var(--color-text-secondary)]">Timestamp:</span>
                  <span className="ml-2 text-red-300">{errorDetails.timestamp}</span>
                </div>
              )}
            </div>
            
            <div className="bg-black/20 p-3 rounded text-left text-xs text-[var(--color-text-secondary)] mb-6 max-h-32 overflow-auto">
              <p className="font-semibold mb-2">Debug Info:</p>
              <p>✓ Error details saved to localStorage</p>
              <p>✓ Check DevTools Console for full logs</p>
              <p>✓ Visit /debug page to see persistent error log</p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.href = '/debug'}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
              >
                View /debug Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 bg-[var(--color-primary)] hover:bg-opacity-80 text-white rounded font-semibold"
              >
                Back to App
              </button>
            </div>
          </div>
        ) : (
          // LOADING STATE
          <>
            <div className="w-16 h-16 rounded-full border-4 border-[var(--color-bg-elevated)] border-t-[var(--color-primary)] animate-spin mx-auto mb-4" />
            <p className="text-[var(--color-text-secondary)]">{statusMessage}</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-4">Check browser console for details</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-2">Redirecting in a moment...</p>
          </>
        )}
      </div>
    </div>
  );
}
