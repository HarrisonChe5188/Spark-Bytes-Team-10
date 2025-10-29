/**
 * Placeholder Supabase client module.
 *
 * This file intentionally does not initialize or connect to Supabase.
 * It exposes the env constants and a helper `createSupabaseClient` which
 * currently returns null. When ready to connect, install `@supabase/supabase-js`
 * and uncomment the example shown here.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function createSupabaseClient() {
  // Placeholder: do not connect yet.
  // Example (when ready):
  // import { createClient } from '@supabase/supabase-js'
  // return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Explicitly return null to indicate no client is available yet.
    return null;
  }

  // Still return null until developer opts in and installs the dependency.
  return null;
}
