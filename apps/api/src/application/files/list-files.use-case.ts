import type { TaskAttachmentDTO } from '@bunstack-playground/shared/http';
import { getFileUrl } from '@/api/infrastructure/storage/supabase.storage.client';
import { supabaseAdmin } from '@/api/infrastructure/supabase';

export interface ListFilesInput {
  taskId: string;
  userId: string;
}

export interface ListFilesOutput extends TaskAttachmentDTO {
  publicUrl: string;
}

export async function listFiles(
  input: ListFilesInput
): Promise<ListFilesOutput[]> {
  const { taskId, userId } = input;

  const { data, error } = await supabaseAdmin
    .from('task_attachments')
    .select('*')
    .eq('task_id', taskId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch attachments: ${error.message}`);
  }

  const attachments = await Promise.all(
    (data || []).map(async (attachment) => {
      const publicUrl = await getFileUrl(attachment.file_path);
      return {
        id: attachment.id,
        taskId: attachment.task_id,
        userId: attachment.user_id,
        fileName: attachment.file_name,
        filePath: attachment.file_path,
        fileSize: attachment.file_size,
        mimeType: attachment.mime_type,
        createdAt: attachment.created_at,
        publicUrl,
      };
    })
  );

  return attachments;
}
