import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey;

const createSupabaseClient = (url: string | undefined, key: string) => {
  if (!url) {
    return null;
  }
  return createClient(url, key);
};

export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
export const supabaseAdmin = createSupabaseClient(
  supabaseUrl,
  supabaseServiceKey
);
