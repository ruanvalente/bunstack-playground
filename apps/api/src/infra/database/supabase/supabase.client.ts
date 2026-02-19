import { createClient } from "@supabase/supabase-js";

const supabaseKey = process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.SUPABASE_ANON_KEY || "";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  supabaseKey,
);
