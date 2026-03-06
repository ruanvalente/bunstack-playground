import { useCallback, useState } from 'react';

import { toast } from '@shared/ui/toaster';
import { useLanguage } from '@/web/shared/hooks/use-language';
import { DataTableComponent } from '@/web/shared/ui/datatable';
import { Pagination } from '@/web/shared/ui/pagination/pagination';

import { useDeleteUser, useUsers } from '../hooks/use-users';

export function UsersListWidget() {
  const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data, isLoading, error } = useUsers({ page, pageSize });
  const deleteUserMutation = useDeleteUser();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDeleteUser = useCallback(
    (userId: string) => {
      toast.warning(t.users.deleteConfirm, {
        action: {
          label: t.users.delete,
          onClick: () => deleteUserMutation.mutate(userId),
        },
        cancel: {
          label: t.common.cancel,
          onClick: () => {},
        },
      });
    },
    [deleteUserMutation, t]
  );

  const handleEditUser = useCallback((userId: string) => {
    console.log('Editing user:', userId);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    toast.error(t.users.errorLoading);
    return null;
  }

  const users = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="flex flex-col">
      <DataTableComponent.Root>
        <DataTableComponent.Table>
          <DataTableComponent.Header>
            <DataTableComponent.Head>{t.users.name}</DataTableComponent.Head>
            <DataTableComponent.Head>{t.common.email}</DataTableComponent.Head>
            <DataTableComponent.Head>{t.users.role}</DataTableComponent.Head>
            <DataTableComponent.Head>{t.users.status}</DataTableComponent.Head>
            <DataTableComponent.Head>{t.users.actions}</DataTableComponent.Head>
          </DataTableComponent.Header>

          <DataTableComponent.Body>
            {users.map((user) => (
              <DataTableComponent.Row key={user.id}>
                <DataTableComponent.Cell>{user.name}</DataTableComponent.Cell>
                <DataTableComponent.Cell>{user.email}</DataTableComponent.Cell>
                <DataTableComponent.Cell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}
                  >
                    {user.role}
                  </span>
                </DataTableComponent.Cell>
                <DataTableComponent.Cell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {user.status}
                  </span>
                </DataTableComponent.Cell>
                <DataTableComponent.Cell>
                  <DataTableComponent.Actions
                    onEdit={() => handleEditUser(user.id)}
                    onDelete={() => handleDeleteUser(user.id)}
                  />
                </DataTableComponent.Cell>
              </DataTableComponent.Row>
            ))}
          </DataTableComponent.Body>
        </DataTableComponent.Table>
      </DataTableComponent.Root>

      {pagination && pagination.totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            position="center"
          />
        </div>
      )}
    </div>
  );
}
