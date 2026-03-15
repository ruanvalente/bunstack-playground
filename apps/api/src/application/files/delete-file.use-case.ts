import { deleteFile as deleteFileFromStorage } from '@/api/infrastructure/storage/supabase.storage.client';
import { supabaseAdmin } from '@/api/infrastructure/supabase';

export type DeleteFileInput = {
  id: string;
  userId: string;
};

export async function deleteFile(input: DeleteFileInput): Promise<boolean> {
  const { id, userId } = input;

  const { data: attachment, error: fetchError } = await supabaseAdmin
    .from('task_attachments')
    .select('file_path, user_id')
    .eq('id', id)
    .single();

  if (fetchError || !attachment) {
    throw new Error('Attachment not found');
  }

  if (attachment.user_id !== userId) {
    throw new Error('Unauthorized to delete this file');
  }

  await deleteFileFromStorage(attachment.file_path);

  const { error: deleteError } = await supabaseAdmin
    .from('task_attachments')
    .delete()
    .eq('id', id);

  if (deleteError) {
    throw new Error(
      `Failed to delete attachment record: ${deleteError.message}`
    );
  }

  return true;
}
