import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Don't throw immediately - wait until client is actually used
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function initializeClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    const missing = [];
    if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
    if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY');
    throw new Error(
      `Missing Supabase environment variables: ${missing.join(', ')}. Please set these in your .env.local and restart the dev server.`
    );
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'implicit',
    },
  });

  return supabaseInstance;
}

export function getSupabase() {
  return initializeClient();
}

// Lazy export for backward compatibility
export const supabase = new Proxy(
  {},
  {
    get: (target: any, prop: string | symbol) => {
      const client = initializeClient();
      return (client as any)[prop];
    },
  }
) as ReturnType<typeof createClient>;

export async function getAuthUser() {
  const client = initializeClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  return user;
}

export async function getAuthSession() {
  const client = initializeClient();
  const {
    data: { session },
  } = await client.auth.getSession();
  return session;
}

export async function signOutUser() {
  const client = initializeClient();
  await client.auth.signOut();
  
  // Also clear localStorage to ensure complete session cleanup
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('sb-') || key.includes('supabase')) {
      localStorage.removeItem(key);
    }
  });
}
