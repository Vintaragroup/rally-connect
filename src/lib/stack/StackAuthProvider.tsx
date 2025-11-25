import { createContext, ReactNode, useContext, useMemo } from 'react';
import { StackClientApp } from '@stackframe/js';
import { getStackClientApp, isStackEnvReady, stackEnvSummary } from './client';

const StackClientContext = createContext<StackClientApp | null>(null);

interface StackAuthProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

function DefaultStackEnvFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        background: '#0f172a',
        color: 'white',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Stack Auth is not configured</h1>
      <p style={{ maxWidth: '480px', marginBottom: '1rem', lineHeight: 1.5 }}>
        Define <code>VITE_STACK_PROJECT_ID</code> and <code>VITE_STACK_PUBLISHABLE_CLIENT_KEY</code> in your
        Vite environment (for example in <code>.env.local</code>) so the authentication SDK can initialize.
      </p>
      {stackEnvSummary.missingEnvVars.length > 0 && (
        <p style={{ opacity: 0.85 }}>
          Missing: <strong>{stackEnvSummary.missingEnvVars.join(', ')}</strong>
        </p>
      )}
    </div>
  );
}

export function StackAuthProvider({ children, fallback }: StackAuthProviderProps) {
  const stackApp = useMemo(() => {
    if (!isStackEnvReady) {
      return null;
    }
    try {
      return getStackClientApp();
    } catch (error) {
      console.error('Unable to initialize Stack Auth client.', error);
      return null;
    }
  }, []);

  if (!isStackEnvReady || !stackApp) {
    return <>{fallback ?? <DefaultStackEnvFallback />}</>;
  }

  return <StackClientContext.Provider value={stackApp}>{children}</StackClientContext.Provider>;
}

export function useStackApp() {
  const ctx = useContext(StackClientContext);
  if (!ctx) {
    throw new Error(
      'useStackApp must be used inside StackAuthProvider and after configuring the Stack Auth env vars.',
    );
  }
  return ctx;
}
