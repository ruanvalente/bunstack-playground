import { API_URL } from '@shared/config/supabase';
import { axiosInstance } from '@shared/http/axios-client';

export type TaskAttachment = {
  id: string;
  taskId: string;
  userId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  publicUrl: string;
};

export async function listTaskFiles(taskId: string): Promise<TaskAttachment[]> {
  const response = await axiosInstance.get<TaskAttachment[]>(
    `${API_URL}/api/v1/files/task/${taskId}`
  );
  return response.data;
}

export async function uploadTaskFile(
  taskId: string,
  file: File
): Promise<TaskAttachment> {
  const formData = new FormData();
  formData.append('taskId', taskId);
  formData.append('file', file);

  const response = await axiosInstance.post<TaskAttachment>(
    `${API_URL}/api/v1/files/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}

export async function deleteTaskFile(fileId: string): Promise<void> {
  await axiosInstance.delete(`${API_URL}/api/v1/files/${fileId}`);
}
