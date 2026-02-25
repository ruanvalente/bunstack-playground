export type Category = {
  id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: string;
};

export type Task = {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
};
