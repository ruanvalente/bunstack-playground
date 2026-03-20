import type { TaskAttachmentDTO } from '@bunstack-playground/shared/http';

import type { IFileRepository } from '@/api/domain/repositories';
import { db } from '@/api/infrastructure/database/config';

export class FileSqliteRepository implements IFileRepository {
  async findById(
    id: string,
    userId: string
  ): Promise<TaskAttachmentDTO | null> {
    const row = db
      .prepare(
        `
        SELECT id, task_id, user_id, file_name, file_path, file_size, mime_type, created_at
        FROM task_attachments
        WHERE id = ? AND user_id = ?
      `
      )
      .get(id, userId) as TaskAttachmentRow | undefined;

    return row ? mapRowToAttachment(row) : null;
  }

  async findByTaskId(
    taskId: string,
    userId: string
  ): Promise<TaskAttachmentDTO[]> {
    const rows = db
      .prepare(
        `
        SELECT id, task_id, user_id, file_name, file_path, file_size, mime_type, created_at
        FROM task_attachments
        WHERE task_id = ? AND user_id = ?
        ORDER BY created_at DESC
      `
      )
      .all(taskId, userId) as TaskAttachmentRow[];

    return rows.map(mapRowToAttachment);
  }

  async create(data: {
    taskId: string;
    userId: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
  }): Promise<TaskAttachmentDTO> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(
      `
      INSERT INTO task_attachments (id, task_id, user_id, file_name, file_path, file_size, mime_type, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    ).run(
      id,
      data.taskId,
      data.userId,
      data.fileName,
      data.filePath,
      data.fileSize,
      data.mimeType,
      now
    );

    return {
      id,
      taskId: data.taskId,
      userId: data.userId,
      fileName: data.fileName,
      filePath: data.filePath,
      fileSize: data.fileSize,
      mimeType: data.mimeType,
      createdAt: now,
    };
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = db
      .prepare(
        `
        DELETE FROM task_attachments
        WHERE id = ? AND user_id = ?
      `
      )
      .run(id, userId);

    return result.changes > 0;
  }
}

type TaskAttachmentRow = {
  id: string;
  task_id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
};

function mapRowToAttachment(row: TaskAttachmentRow): TaskAttachmentDTO {
  return {
    id: row.id,
    taskId: row.task_id,
    userId: row.user_id,
    fileName: row.file_name,
    filePath: row.file_path,
    fileSize: row.file_size,
    mimeType: row.mime_type,
    createdAt: new Date(row.created_at).toISOString(),
  };
}
