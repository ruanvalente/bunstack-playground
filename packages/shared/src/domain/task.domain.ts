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

export type TaskAttachment = {
  id: string;
  taskId: string;
  userId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
};
