import type { TaskAttachmentDTO } from '@bunstack-playground/shared/http';

export interface IFileRepository {
  findById(id: string, userId: string): Promise<TaskAttachmentDTO | null>;
  findByTaskId(taskId: string, userId: string): Promise<TaskAttachmentDTO[]>;
  create(data: {
    taskId: string;
    userId: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
  }): Promise<TaskAttachmentDTO>;
  delete(id: string, userId: string): Promise<boolean>;
}
