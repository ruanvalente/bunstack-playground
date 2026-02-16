import { usePaginate } from "@/web/shared/hooks/use-paginate";
import { DataTableComponent } from "@/web/shared/ui/datatable";
import { Pagination } from "@/web/shared/ui/pagination/pagination";
import { usersMock } from "@/web/shared/utils/mocks/user.mock";

const PER_PAGE = 5;

export function UsersListWidget() {
  const { result: users, onPageChange } = usePaginate({
    items: usersMock,
    perPage: PER_PAGE,
  });

  const editUser = (userId: string) => {
    console.log("Editando o user de ID: ", userId);
  };

  const deleteUser = (userId: string) => {
    console.log("Excluindo o user de ID: ", userId);
  };

  return (
    <div className="flex flex-col">
      <DataTableComponent.Root>
        <DataTableComponent.Table>
          <DataTableComponent.Header>
            <DataTableComponent.Head>Nome</DataTableComponent.Head>
            <DataTableComponent.Head>Email</DataTableComponent.Head>
            <DataTableComponent.Head>Ações</DataTableComponent.Head>
          </DataTableComponent.Header>

          <DataTableComponent.Body>
            {users.data.map((user) => (
              <DataTableComponent.Row key={user.id}>
                <DataTableComponent.Cell>{user.name}</DataTableComponent.Cell>
                <DataTableComponent.Cell>{user.email}</DataTableComponent.Cell>
                <DataTableComponent.Cell>
                  <DataTableComponent.Actions
                    onEdit={() => editUser(user.id)}
                    onDelete={() => deleteUser(user.id)}
                  />
                </DataTableComponent.Cell>
              </DataTableComponent.Row>
            ))}
          </DataTableComponent.Body>
        </DataTableComponent.Table>
      </DataTableComponent.Root>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Pagination
          currentPage={users.pagination.page}
          totalPages={users.pagination.totalPages}
          onPageChange={onPageChange}
          position="center"
        />
      </div>
    </div>
  );
}
