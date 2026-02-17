import { createClient } from "@supabase/supabase-js";

export const supabaseAuth = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
);
