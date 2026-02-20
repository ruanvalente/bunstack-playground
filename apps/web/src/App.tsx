import { AppRouter } from './app/router';
import type { QueryClient } from '@tanstack/react-query';

export function App({ queryClient }: { queryClient: QueryClient }) {
  return <AppRouter queryClient={queryClient} />;
}
