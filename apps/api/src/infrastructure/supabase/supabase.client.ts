import { createClient } from '@supabase/supabase-js';

const supabaseKey =
  process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey;

export const supabase = createClient(process.env.SUPABASE_URL!, supabaseKey);
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  supabaseServiceKey
);
