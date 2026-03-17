import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { getEnvVar } from '@/api/shared/utils/env';

const supabaseUrl = getEnvVar('SUPABASE_URL');
const supabaseKey =
  getEnvVar('SUPABASE_PUBLISHABLE_DEFAULT_KEY') ||
  getEnvVar('SUPABASE_ANON_KEY');
const supabaseServiceKey =
  getEnvVar('SUPABASE_SERVICE_ROLE_KEY') || supabaseKey;

const supabaseOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'x-client-info': 'bunstack-playground-api',
    },
  },
};

const createSupabaseClient = (url: string, key: string): SupabaseClient => {
  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_KEY are required');
  }
  return createClient(url, key, supabaseOptions);
};

export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
export const supabaseAdmin = createSupabaseClient(
  supabaseUrl,
  supabaseServiceKey
);
