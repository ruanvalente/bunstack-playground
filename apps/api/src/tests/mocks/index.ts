export {
  UserRepositoryMock,
  createMockPaginatedUsersResponse,
  createMockUser,
} from './users/user.repository.mock';

export {
  TaskRepositoryMock,
  createMockPaginatedTasksResponse,
  createMockTask,
} from './tasks/task.repository.mock';

export {
  CategoryRepositoryMock,
  createMockCategory,
} from './categories/category.repository.mock';

export {
  StorageClientMock,
  createMockAttachment,
  createMockAttachments,
  createMockCsvPreview,
  createMockCsvImportResult,
} from './files/file.repository.mock';

export {
  DashboardRepositoryMock,
  createDashboardDataWithIncrease,
  createEmptyDashboardData,
  createMockChartDataPoint,
  createMockCharts,
  createMockDashboardData,
  createMockKPIs,
  createMockTotals,
} from './dashboard/dashboard.repository.mock';

export {
  createMockAuthSuccess,
  createMockAuthError,
  createMockOAuthSuccess,
  createMockOAuthError,
  createMockUserResponse,
  createMockUserError,
  createMockSignOutSuccess,
  createMockSignOutError,
  createMockSupabaseAuth,
  createMockSupabaseAdmin,
  createMockSupabaseAdminWithError,
  type MockUser,
  type MockSession,
} from './auth/auth.repository.mock';
