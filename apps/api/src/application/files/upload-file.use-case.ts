import type { TaskAttachmentDTO } from '@bunstack-playground/shared/http';

import { uploadFile as uploadFileToStorage } from '@/api/infrastructure/storage/supabase.storage.client';
import { supabaseAdmin } from '@/api/infrastructure/supabase';

export type UploadFileInput = {
  userId: string;
  taskId: string;
  fileName: string;
  fileBuffer: Buffer;
  mimeType: string;
  fileSize: number;
};

export async function uploadFile(
  input: UploadFileInput
): Promise<TaskAttachmentDTO> {
  const { userId, taskId, fileName, fileBuffer, mimeType, fileSize } = input;

  const { path, url } = await uploadFileToStorage(
    userId,
    fileName,
    fileBuffer,
    mimeType
  );

  const { data, error } = await supabaseAdmin
    .from('task_attachments')
    .insert({
      task_id: taskId,
      user_id: userId,
      file_name: fileName,
      file_path: path,
      file_size: fileSize,
      mime_type: mimeType,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create attachment record: ${error.message}`);
  }

  return {
    id: data.id,
    taskId: data.task_id,
    userId: data.user_id,
    fileName: data.file_name,
    filePath: data.file_path,
    fileSize: data.file_size,
    mimeType: data.mime_type,
    createdAt: data.created_at,
    publicUrl: url,
  };
}
