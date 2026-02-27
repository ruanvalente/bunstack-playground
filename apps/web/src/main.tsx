import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { App } from './App.tsx';
import { useAuthStore } from './features/auth/store/auth.store';
import { setAuthTokenGetter } from './shared/http/axios-client';
import { Toaster } from './shared/ui/toaster';

setAuthTokenGetter(() => useAuthStore.getState().session?.access_token ?? null);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
      networkMode: 'offlineFirst',
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 2,
      networkMode: 'offlineFirst',
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <App queryClient={queryClient} />
    </QueryClientProvider>
  </StrictMode>
);
