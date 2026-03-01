import type { QueryClient } from '@tanstack/react-query';

import { AppRouter } from './app/router';

export function App({ queryClient }: { queryClient: QueryClient }) {
  return <AppRouter queryClient={queryClient} />;
}
