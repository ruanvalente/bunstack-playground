import type { LoaderFunctionArgs } from 'react-router-dom';
import { getTasks } from '../queries/task.querie';
import type { QueryClient } from '@tanstack/react-query';

export const tasksLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10');

    const defaultFilters = {
      statusFilter: undefined,
      sortBy: 'created_at' as const,
      sortOrder: 'DESC' as const,
    };

    return queryClient.ensureQueryData({
      queryKey: ['tasks', page, pageSize, 'all', 'created_at', 'DESC'],
      queryFn: () => getTasks(page, pageSize, defaultFilters),
    });
  };
