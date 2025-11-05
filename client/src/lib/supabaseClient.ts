// Safe Supabase client initializer. If environment variables are not set
// the module will not throw at import time — instead `supabase` will be null.
// This keeps the dev server running when credentials are intentionally absent.

import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let _supabase: any = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("Failed to create Supabase client:", err);
    _supabase = null;
  }
} else {
  // eslint-disable-next-line no-console
  console.warn("Supabase environment variables are missing; continuing without a client.");
}

export const supabase = _supabase;
