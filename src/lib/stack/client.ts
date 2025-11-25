import { StackClientApp } from '@stackframe/js';

const STACK_DEFAULT_API_URL = 'https://api.stack-auth.com';

const baseUrl = import.meta.env.VITE_STACK_API_URL || STACK_DEFAULT_API_URL;
const projectId = import.meta.env.VITE_STACK_PROJECT_ID;
const publishableClientKey = import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY;

const missingEnvVars: string[] = [];
if (!projectId) missingEnvVars.push('VITE_STACK_PROJECT_ID');
if (!publishableClientKey) missingEnvVars.push('VITE_STACK_PUBLISHABLE_CLIENT_KEY');

export const stackEnvSummary = {
  baseUrl,
  projectId,
  publishableClientKey,
  missingEnvVars,
};

export const isStackEnvReady = missingEnvVars.length === 0;

let stackClientAppInstance: StackClientApp | null = null;

const canInstantiateClient =
  typeof window !== 'undefined' && typeof document !== 'undefined' && isStackEnvReady;

if (canInstantiateClient) {
  stackClientAppInstance = new StackClientApp({
    baseUrl,
    projectId: projectId!,
    publishableClientKey: publishableClientKey!,
    tokenStore: 'cookie',
    // Add credentials to ensure cookies are sent/received across domains
    fetchOptions: {
      credentials: 'include',
    },
  });
}

export const stackClientApp = stackClientAppInstance;

export function getStackClientApp(): StackClientApp {
  if (!stackClientAppInstance) {
    const reason = isStackEnvReady
      ? 'Stack Auth client is only available in the browser context.'
      : `Missing required Stack Auth env vars: ${missingEnvVars.join(', ')}`;
    throw new Error(reason);
  }
  return stackClientAppInstance;
}
