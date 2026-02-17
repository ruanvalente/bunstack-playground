import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
);

export const API_URL = import.meta.env.VITE_API_URL;
export const API_VERSION = import.meta.env.VITE_API_VERSION || "v1";
export const AUTH_API_URL = `${API_URL}/api/${API_VERSION}/auth`;
