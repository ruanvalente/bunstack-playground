import type { ReactNode } from 'react';

export function createErrorThrowingComponent(errorMessage: string) {
  return function ErrorThrowingComponent({ data }: { data?: unknown }) {
    if (!data) {
      throw new Error(errorMessage);
    }
    return <div data-testid="success">Component rendered successfully</div>;
  };
}

export const MOCK_ERRORS = {
  TASK_WITH_NULL_TITLE: {
    id: '1',
    title: null,
    completed: false,
  },
  TASK_WITH_UNDEFINED_PROPERTIES: {
    id: '2',
    title: undefined,
    completed: undefined,
    categoryId: undefined,
  },
  TASK_WITH_MISSING_FIELDS: {
    id: '3',
  },
  DASHBOARD_WITH_NULL_KPIS: {
    kpis: null,
    charts: { tasksByDay: [], completedByDay: [] },
    totals: { tasks: 0, completed: 0, pending: 0 },
  },
  DASHBOARD_WITH_UNDEFINED_DATA: undefined,
  EMPTY_TASK_LIST: [],
};

export function createMockDataWithError(type: keyof typeof MOCK_ERRORS) {
  return MOCK_ERRORS[type];
}

export const ErrorTestWrapper = ({
  children,
  shouldError,
  errorMessage = 'Test error',
}: {
  children: ReactNode;
  shouldError?: boolean;
  errorMessage?: string;
}) => {
  if (shouldError) {
    throw new Error(errorMessage);
  }
  return <>{children}</>;
};

export const ForceErrorComponent = ({
  forceError,
  errorMessage,
}: {
  forceError: boolean;
  errorMessage?: string;
}) => {
  if (forceError) {
    throw new Error(errorMessage || 'Forced error for testing');
  }
  return <div data-testid="no-error">Normal render</div>;
};
