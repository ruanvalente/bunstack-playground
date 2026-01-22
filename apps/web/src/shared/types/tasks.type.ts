export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

export type TaskAPIResponse = {
  data: Array<Task>;
  pagination: Pagination;
  meta: Meta;
};

type Pagination = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type Meta = {
  sortBy: string;
  sortOrder: string;
  timestamp: string;
};
