/**
 * Debug Page
 * 
 * Navigate to http://localhost:4300/debug to see OAuth error logs
 * Displays errors stored in localStorage from OAuth callback failures
 */
export function DebugPage() {
  const oauthErrorLog = localStorage.getItem('oauth_error_log');
  const parsedLog = oauthErrorLog ? JSON.parse(oauthErrorLog) : null;

  const clearLog = () => {
    localStorage.removeItem('oauth_error_log');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-[var(--color-text)]">🐛 OAuth Debug Log</h1>

        {parsedLog ? (
          <div className="bg-[var(--color-bg-elevated)] rounded-lg p-6 border border-red-500">
            <h2 className="text-xl font-semibold text-red-500 mb-4">OAuth Error Found:</h2>
            
            <div className="space-y-3 font-mono text-sm">
              <div>
                <span className="text-[var(--color-text-secondary)]">Type:</span>
                <span className="ml-2 text-white font-bold">{parsedLog.type}</span>
              </div>
              
              {parsedLog.error && (
                <div>
                  <span className="text-[var(--color-text-secondary)]">Error Code:</span>
                  <span className="ml-2 text-white font-bold">{parsedLog.error}</span>
                </div>
              )}
              
              {parsedLog.error_description && (
                <div>
                  <span className="text-[var(--color-text-secondary)]">Description:</span>
                  <span className="ml-2 text-white">{parsedLog.error_description}</span>
                </div>
              )}
              
              {parsedLog.message && (
                <div>
                  <span className="text-[var(--color-text-secondary)]">Message:</span>
                  <span className="ml-2 text-white">{parsedLog.message}</span>
                </div>
              )}
              
              {parsedLog.error_uri && (
                <div>
                  <span className="text-[var(--color-text-secondary)]">Error URI:</span>
                  <span className="ml-2 text-white break-all">{parsedLog.error_uri}</span>
                </div>
              )}
              
              <div>
                <span className="text-[var(--color-text-secondary)]">Timestamp:</span>
                <span className="ml-2 text-white">{new Date(parsedLog.timestamp).toLocaleString()}</span>
              </div>
              
              {parsedLog.stack && (
                <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                  <span className="text-[var(--color-text-secondary)] block mb-2">Stack Trace:</span>
                  <pre className="text-xs text-white bg-black p-3 rounded overflow-auto max-h-40">
                    {parsedLog.stack}
                  </pre>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={clearLog}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold"
              >
                Clear Error Log
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="px-4 py-2 bg-[var(--color-primary)] hover:bg-opacity-80 text-white rounded font-semibold"
              >
                Back to App
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[var(--color-bg-elevated)] rounded-lg p-6 border border-green-500">
            <h2 className="text-xl font-semibold text-green-500 mb-2">✓ No Errors Found</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">
              No OAuth errors are currently stored in localStorage.
            </p>
            <button
              onClick={() => (window.location.href = '/')}
              className="px-4 py-2 bg-[var(--color-primary)] hover:bg-opacity-80 text-white rounded font-semibold"
            >
              Back to App
            </button>
          </div>
        )}

        <div className="mt-8 p-4 bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border)]">
          <h3 className="font-semibold text-[var(--color-text)] mb-2">How to use this page:</h3>
          <ol className="text-sm text-[var(--color-text-secondary)] space-y-1 list-decimal list-inside">
            <li>Try Google OAuth signin</li>
            <li>When it fails and redirects back to get started</li>
            <li>Navigate to <code className="bg-black px-2 py-1 rounded">http://localhost:4300/debug</code></li>
            <li>Copy the error details and share them</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
